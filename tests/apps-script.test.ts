/**
 * Runs scripts/apps-script/Code.gs against an in-memory Drive and Sheet.
 *
 * The real thing is covered end to end by scripts/e2e-quote.mjs against the
 * TEST sheet. This covers the branches that are awkward to reach for real:
 * numbering around hand made folders, spam, a held lock, Drive failing, and
 * the guards on where photos may be written.
 */
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { appointmentText } from '@/lib/appointment';

const LIVE_JOBS = '1py4OwKoqrxhwDcBn7IPpIt6kH9UyRfxF';
const TEST_JOBS = '1zDzvf3chhgm_BJUKCvQYBiXBWqfAG12Y';
const SECRET = 'test-secret';
const SOURCE = readFileSync('scripts/apps-script/Code.gs', 'utf8');

type FakeFile = { name: string; mimeType: string; size: number };

const iterate = <T,>(items: T[]) => {
  let i = 0;
  return { hasNext: () => i < items.length, next: () => items[i++] };
};

class FakeFolder {
  children: FakeFolder[] = [];
  files: FakeFile[] = [];
  constructor(
    readonly drive: FakeDrive,
    readonly id: string,
    readonly name: string,
    readonly parent: FakeFolder | null = null,
  ) {
    drive.byId.set(id, this);
  }
  getId() { return this.id; }
  getName() { return this.name; }
  getUrl() { return `https://drive.google.com/drive/folders/${this.id}`; }
  getFolders() { return iterate(this.children); }
  getFiles() { return iterate(this.files.map((f) => ({ getName: () => f.name, getMimeType: () => f.mimeType, getSize: () => f.size }))); }
  getParents() { return iterate(this.parent ? [this.parent] : []); }
  createFolder(name: string) {
    if (this.drive.failCreate) throw new Error('Exception: Drive is down');
    const child = new FakeFolder(this.drive, `F${++this.drive.seq}`, name, this);
    this.children.push(child);
    return child;
  }
  createFile(blob: { bytes: Buffer; mimeType: string; name: string }) {
    this.files.push({ name: blob.name, mimeType: blob.mimeType, size: blob.bytes.length });
  }
}

class FakeDrive {
  byId = new Map<string, FakeFolder>();
  seq = 0;
  failCreate = false;
}

class FakeSheet {
  rows: unknown[][] = [
    ['Timestamp', 'Name', 'Email', 'Phone', 'Street', 'City', 'State', 'ZIP', 'Service', 'Description',
      'Photos', 'SMS Consent', 'Out of Area', 'Spam Flag', 'Status', 'Notes'],
  ];
  appendRow(values: unknown[]) { this.rows.push([...values]); }
  getLastRow() { return this.rows.length; }
  getRange(row: number, col: number, numRows = 1, numCols = 1) {
    return {
      getValue: () => this.rows[row - 1]?.[col - 1] ?? '',
      setValue: (v: unknown) => { this.rows[row - 1][col - 1] = v; },
      getValues: () =>
        Array.from({ length: numRows }, (_, r) =>
          Array.from({ length: numCols }, (_, c) => this.rows[row - 1 + r]?.[col - 1 + c] ?? ''),
        ),
    };
  }
  getIndex() { return 1; }
  getDataRange() {
    const width = Math.max(...this.rows.map((r) => r.length));
    return { getValues: () => this.rows.map((r) => Array.from({ length: width }, (_, i) => r[i] ?? '')) };
  }
}

/** What Utilities.formatDate gives for yyyy-MM-dd'T'HH:mm. */
const wallTime = (date: Date, zone: string) =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: zone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .format(date)
    .replace(' ', 'T');

function load({ jobsId = TEST_JOBS, existing = [] as string[], lockFree = true } = {}) {
  const drive = new FakeDrive();
  const root = new FakeFolder(drive, 'ROOT', 'CSR');
  const jobs = new FakeFolder(drive, jobsId, '15 - Jobs', root);
  root.children.push(jobs);
  for (const name of existing) jobs.children.push(new FakeFolder(drive, `E${++drive.seq}`, name, jobs));
  const sheet = new FakeSheet();
  const fetches: { url: string; options: { payload: string; headers: Record<string, string> } }[] = [];
  // The site's answer, either fixed or worked out from what the script sent.
  const site = {
    reply: '{"sent":true}' as string | ((body: Record<string, unknown>) => string),
    code: 200,
    throws: false,
  };
  const triggers: string[] = [];

  const context = createContext({
    UrlFetchApp: {
      fetch: (url: string, options: { payload: string; headers: Record<string, string> }) => {
        if (site.throws) throw new Error('Exception: DNS error');
        fetches.push({ url, options });
        const reply = typeof site.reply === 'function' ? site.reply(JSON.parse(options.payload)) : site.reply;
        return { getContentText: () => reply, getResponseCode: () => site.code };
      },
    },
    ScriptApp: {
      getProjectTriggers: () => triggers.map((h) => ({ getHandlerFunction: () => h })),
      deleteTrigger: (t: { getHandlerFunction: () => string }) => triggers.splice(triggers.indexOf(t.getHandlerFunction()), 1),
      newTrigger: (handler: string) => ({
        forSpreadsheet: () => ({ onEdit: () => ({ create: () => triggers.push(handler) }) }),
        timeBased: () => ({ everyHours: () => ({ create: () => triggers.push(handler) }) }),
      }),
    },
    isNaN,
    console: { error: () => {}, log: () => {} },
    JSON,
    String,
    Math,
    RegExp,
    parseInt,
    Date,
    ContentService: { createTextOutput: (text: string) => ({ text }) },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheets: () => [sheet],
        getName: () => 'Log',
        // The TEST copy really is set to Pacific, which is what this guards.
        getSpreadsheetTimeZone: () => 'America/Los_Angeles',
      }),
    },
    DriveApp: {
      getFolderById: (id: string) => {
        const folder = drive.byId.get(id);
        if (!folder) throw new Error(`Exception: No item with the given ID: ${id}`);
        return folder;
      },
    },
    LockService: { getScriptLock: () => ({ tryLock: () => lockFree, releaseLock: () => {} }) },
    Utilities: {
      formatDate: (date: Date, zone: string, pattern: string) =>
        pattern.includes("'T'") ? wallTime(date, zone) : '2026',
      base64Decode: (s: string) => Buffer.from(s, 'base64'),
      newBlob: (bytes: Buffer, mimeType: string, name: string) => ({ bytes, mimeType, name }),
    },
  });

  const code = SOURCE.replace("'__SECRET__'", JSON.stringify(SECRET))
    .replace("'__JOBS_FOLDER_ID__'", JSON.stringify(jobsId))
    .replace("'__SITE_URL__'", JSON.stringify('https://preview.example'))
    .replace("'__VERCEL_BYPASS__'", JSON.stringify('bypass-token'));
  runInContext(code, context);

  const post = (body: unknown) => {
    const text: string = context.doPost({ postData: { contents: JSON.stringify(body) } }).text;
    const [verdict, ...rest] = text.split('\n');
    return { verdict, detail: rest.length ? JSON.parse(rest.join('\n')) : null, text };
  };
  // An edit to one date cell, the way Sheets reports it, and the two status
  // cells to its right afterwards.
  const editDate = (row: number, col: number, value: unknown) => {
    while (sheet.rows[row - 1].length < 25) sheet.rows[row - 1].push('');
    sheet.rows[row - 1][col - 1] = value;
    context.onSheetEdit({
      range: { getSheet: () => sheet, getColumn: () => col, getLastColumn: () => col, getRow: () => row, getLastRow: () => row },
    });
    return { confirmation: sheet.rows[row - 1][col], reminder: sheet.rows[row - 1][col + 1] };
  };
  // Column T, the job date, and column W, the walkthrough.
  const editAppointment = (row: number, value: unknown) => editDate(row, 20, value);
  const editWalkthrough = (row: number, value: unknown) => editDate(row, 23, value);
  return { drive, jobs, sheet, post, fetches, site, triggers, editAppointment, editWalkthrough, context };
}

const quote = (extra: Record<string, unknown> = {}) => ({
  secret: SECRET,
  timestamp: '2026-10-07T00:00:00Z',
  name: 'Jane Customer',
  email: 'jane@example.com',
  phone: '843-555-2345',
  street: '1 King St',
  city: 'Charleston',
  state: 'SC',
  zip: '29401',
  service: 'Rust & Paint Removal',
  description: 'Railing',
  photos: 1,
  smsConsent: 'yes',
  outOfArea: '',
  spamFlag: '',
  howHeard: 'Google',
  referredBy: 'Bob',
  ...extra,
});

describe('doPost', () => {
  it('rejects a wrong secret', () => {
    const { post, sheet } = load();
    expect(post(quote({ secret: 'nope' })).text).toBe('forbidden');
    expect(sheet.rows).toHaveLength(1);
  });
});

describe('logQuote', () => {
  it('writes the row, makes the numbered folder and links it in column Q', () => {
    const { post, sheet, jobs } = load({ existing: ['J-2026-001 Old, 1 A St', 'J-2026-004 Old, 4 A St'] });
    const { verdict, detail } = post(quote());

    expect(verdict).toBe('ok');
    const created = jobs.children.at(-1)!;
    expect(created.name).toBe('J-2026-005 Jane Customer, 1 King St');
    expect(created.children.map((c) => c.name)).toEqual([
      'Photos (Before & After)',
      'Quotes & Invoices',
      'Signed Forms',
    ]);
    expect(detail).toEqual({ jobFolderUrl: created.getUrl(), photosFolderId: created.children[0].id });

    const written = sheet.rows[1];
    expect(written).toHaveLength(19);
    expect(written[16]).toBe(created.getUrl());
    expect(written[17]).toBe('Google');
    expect(written[18]).toBe('Bob');
  });

  it('adds the Q to S headers once and leaves existing ones alone', () => {
    const { post, sheet } = load();
    sheet.rows[0][17] = 'Lead Source';
    post(quote());
    expect(sheet.rows[0].slice(16, 19)).toEqual(['Job Folder', 'Lead Source', 'Referred By']);
  });

  it('starts at 001, and ignores other years and unnumbered folders', () => {
    const { post, jobs } = load({ existing: ['J-2025-050 Last Year, 1 A St', 'Misc paperwork'] });
    post(quote());
    expect(jobs.children.at(-1)!.name.startsWith('J-2026-001 ')).toBe(true);
  });

  it('numbers past 999 without breaking the prefix', () => {
    const { post, jobs } = load({ existing: ['J-2026-999 Busy, 1 A St'] });
    post(quote());
    expect(jobs.children.at(-1)!.name.startsWith('J-2026-1000 ')).toBe(true);
  });

  it('keeps counting once numbers have four digits', () => {
    const { post, jobs } = load({ existing: ['J-2026-1000 Busier, 1 A St', 'J-2026-999 Busy, 1 A St'] });
    post(quote());
    expect(jobs.children.at(-1)!.name.startsWith('J-2026-1001 ')).toBe(true);
  });

  it('keeps form text from breaking the folder name', () => {
    const { post, jobs } = load();
    post(quote({ name: 'Jane\nCustomer / Co', street: '  12   Main\\St ' }));
    expect(jobs.children.at(-1)!.name).toBe('J-2026-001 Jane Customer Co, 12 Main St');
  });

  it('numbers consecutive quotes in order', () => {
    const { post, jobs } = load();
    post(quote({ name: 'First' }));
    post(quote({ name: 'Second' }));
    expect(jobs.children.map((c) => c.name.slice(0, 10))).toEqual(['J-2026-001', 'J-2026-002']);
  });

  it('skips the folder for a spam flagged quote but keeps the row', () => {
    const { post, sheet, jobs } = load();
    const { verdict, detail } = post(quote({ spamFlag: 'flagged' }));
    expect(verdict).toBe('ok');
    expect(detail.folderError).toContain('spam');
    expect(jobs.children).toHaveLength(0);
    expect(sheet.rows).toHaveLength(2);
  });

  it('keeps the row when the lock is busy', () => {
    const { post, sheet, jobs } = load({ lockFree: false });
    const { verdict, detail } = post(quote());
    expect(verdict).toBe('ok');
    expect(detail.folderError).toContain('lock');
    expect(jobs.children).toHaveLength(0);
    expect(sheet.rows).toHaveLength(2);
  });

  it('keeps the row and still answers ok when Drive fails', () => {
    const { post, sheet, drive } = load();
    drive.failCreate = true;
    const { verdict, detail } = post(quote());
    expect(verdict).toBe('ok');
    expect(detail.folderError).toContain('Drive is down');
    expect(sheet.rows).toHaveLength(2);
    expect(sheet.rows[1][16]).toBe('');
  });

  it('writes blanks when the optional answers are missing', () => {
    const { post, sheet } = load();
    post(quote({ howHeard: undefined, referredBy: undefined }));
    expect(sheet.rows[1].slice(17, 19)).toEqual(['', '']);
  });
});

describe('savePhotos', () => {
  const photo = (n: number) => ({
    filename: `quote-photo-${n}.jpg`,
    mimeType: 'image/jpeg',
    content: Buffer.from(`image ${n}`).toString('base64'),
  });

  it('saves into the job photos folder, at most four', () => {
    const { post } = load();
    const { detail } = post(quote());
    const result = post({
      secret: SECRET,
      action: 'photos',
      folderId: detail.photosFolderId,
      photos: [1, 2, 3, 4, 5].map(photo),
    });
    expect(result.verdict).toBe('ok');
    expect(result.detail).toEqual({ saved: 4 });
  });

  it('refuses any other folder in the job', () => {
    const { post, jobs } = load();
    post(quote());
    const quotesFolder = jobs.children[0].children[1];
    const result = post({ secret: SECRET, action: 'photos', folderId: quotesFolder.id, photos: [photo(1)] });
    expect(result.text).toBe('forbidden folder');
  });

  it('refuses a photos folder outside the Jobs folder', () => {
    const { post, drive } = load();
    const elsewhere = new FakeFolder(drive, 'X', 'Somewhere else');
    const stray = elsewhere.createFolder('Photos (Before & After)');
    const result = post({ secret: SECRET, action: 'photos', folderId: stray.id, photos: [photo(1)] });
    expect(result.text).toBe('forbidden folder');
    expect(stray.files).toHaveLength(0);
  });

  it('answers with an error for an unknown folder', () => {
    const { post } = load();
    const result = post({ secret: SECRET, action: 'photos', folderId: 'missing', photos: [photo(1)] });
    expect(result.text.startsWith('error:')).toBe(true);
  });
});

describe('verify', () => {
  it('reports folders and rows on the TEST deployment', () => {
    const { post } = load();
    post(quote());
    const { verdict, detail } = post({ secret: SECRET, action: 'verify', name: 'Jane Customer' });
    expect(verdict).toBe('ok');
    expect(detail.folders).toHaveLength(1);
    expect(detail.rows[0]['How They Heard']).toBe('Google');
    expect(detail.highestJobNumber).toBe(1);
  });

  it('refuses to run on the live deployment', () => {
    const { post } = load({ jobsId: LIVE_JOBS });
    expect(post({ secret: SECRET, action: 'verify', name: 'Jane Customer' }).text).toBe('forbidden');
  });
});

describe('appointment texts', () => {
  // What Sheets hands the script for "10/15/2026 9:00 AM" typed into a sheet
  // set to Pacific: 9:00 AM PDT.
  const nineAm = () => new Date('2026-10-15T16:00:00Z');
  const sent = (local: string) => `Sent 2026 for ${local}`;
  /** The site as it behaves days ahead: confirm now, reminder later. */
  const daysAhead = (body: Record<string, unknown>) =>
    body.kind === 'confirmation'
      ? '{"sent":true}'
      : '{"sent":false,"wait":true,"reason":"reminder goes out Wed, Oct 14 at 5:00 PM"}';
  const payloads = (fetches: { options: { payload: string } }[]) =>
    fetches.map((f) => JSON.parse(f.options.payload));

  it('confirms straight away and leaves the reminder waiting', () => {
    const { post, fetches, site, editAppointment } = load();
    post(quote());
    site.reply = daysAhead;

    expect(editAppointment(2, nineAm())).toEqual({
      confirmation: sent('2026-10-15T09:00'),
      reminder: 'Waiting: reminder goes out Wed, Oct 14 at 5:00 PM',
    });
    expect(fetches[0].url).toBe('https://preview.example/api/appointment-text');
    expect(fetches[0].options.headers).toEqual({ 'x-vercel-protection-bypass': 'bypass-token' });
    expect(payloads(fetches)).toEqual([
      {
        secret: SECRET,
        kind: 'confirmation',
        confirmedJustNow: false,
        name: 'Jane Customer',
        phone: '843-555-2345',
        street: '1 King St',
        city: 'Charleston',
        smsConsent: 'yes',
        // As typed, not shifted to 12:00 by the sheet being on Pacific time.
        appointment: '2026-10-15T09:00',
        type: 'job',
      },
      expect.objectContaining({ kind: 'reminder', confirmedJustNow: true }),
    ]);
  });

  it('sends the reminder from the hourly run once it is due, and only once', () => {
    const { post, fetches, site, sheet, editAppointment, context } = load();
    post(quote());
    post(quote({ name: 'No Appointment' }));
    site.reply = daysAhead;
    editAppointment(2, nineAm());

    site.reply = '{"sent":true}';
    context.sendDueReminders();
    expect(sheet.rows[1][21]).toBe(sent('2026-10-15T09:00'));
    // One call, the reminder: the confirmation was already sent and the other
    // row has no appointment.
    expect(payloads(fetches).slice(2)).toEqual([expect.objectContaining({ kind: 'reminder', confirmedJustNow: false })]);

    context.sendDueReminders();
    expect(fetches).toHaveLength(3);
  });

  it('sends nothing new when the same time is entered again', () => {
    const { post, fetches, site, editAppointment } = load();
    post(quote());
    site.reply = '{"sent":true}';
    editAppointment(2, nineAm());
    editAppointment(2, nineAm());
    expect(fetches).toHaveLength(2);
  });

  it('confirms and reminds again when the appointment moves to a new time', () => {
    const { post, fetches, site, editAppointment } = load();
    post(quote());
    site.reply = '{"sent":true}';
    editAppointment(2, nineAm());
    expect(editAppointment(2, new Date('2026-10-16T17:00:00Z'))).toEqual({
      confirmation: sent('2026-10-16T10:00'),
      reminder: sent('2026-10-16T10:00'),
    });
    expect(fetches).toHaveLength(4);
  });

  it('records the site refusing, and leaves final refusals out of the hourly run', () => {
    const { post, fetches, site, editAppointment, context } = load();
    post(quote({ smsConsent: 'no' }));
    site.reply = '{"sent":false,"reason":"customer did not agree to texts on the quote form"}';
    expect(editAppointment(2, nineAm())).toEqual({
      confirmation: 'Not sent: customer did not agree to texts on the quote form',
      reminder: 'Not sent: customer did not agree to texts on the quote form',
    });
    expect(payloads(fetches)[0].smsConsent).toBe('no');
    context.sendDueReminders();
    expect(fetches).toHaveLength(2);
  });

  it('asks for a time instead of texting midnight, and carries on once fixed', () => {
    const { post, fetches, site, editAppointment } = load();
    post(quote());
    expect(editAppointment(2, new Date('2026-10-15T07:00:00Z')).confirmation).toMatch(/^Not sent: add a time/);
    expect(fetches).toHaveLength(0);
    site.reply = daysAhead;
    expect(editAppointment(2, nineAm()).confirmation).toBe(sent('2026-10-15T09:00'));
  });

  it('flags text that is not a date and sends nothing for a cleared cell', () => {
    const { post, fetches, editAppointment } = load();
    post(quote());
    expect(editAppointment(2, 'next Tuesday').confirmation).toMatch(/^Not sent: not a date and time/);
    editAppointment(2, '');
    expect(fetches).toHaveLength(0);
  });

  it('cancels a waiting reminder when the date is cleared, keeps what was sent, and stops asking', () => {
    const { post, fetches, site, editAppointment, context } = load();
    post(quote());
    site.reply = daysAhead;
    editAppointment(2, nineAm());
    expect(editAppointment(2, '')).toEqual({
      confirmation: sent('2026-10-15T09:00'),
      reminder: 'Cancelled: job date cleared, nothing sent',
    });
    site.reply = '{"sent":true}';
    context.sendDueReminders();
    expect(fetches).toHaveLength(2);
  });

  it('keeps a row waiting when the site cannot be reached, rather than throwing', () => {
    const { post, site, editAppointment, context, fetches } = load();
    post(quote());
    site.throws = true;
    expect(editAppointment(2, nineAm()).confirmation).toBe(
      'Waiting: could not reach the site, will retry (Error: Exception: DNS error)',
    );
    site.throws = false;
    context.sendDueReminders();
    expect(fetches.length).toBeGreaterThan(0);
  });

  it('records a site answer that is not JSON', () => {
    const { post, site, editAppointment } = load();
    post(quote());
    site.reply = '<html>sign in</html>';
    site.code = 401;
    expect(editAppointment(2, nineAm()).confirmation).toBe('Not sent: site answered 401');
  });

  it('ignores edits outside column T and on the header row', () => {
    const { post, fetches, sheet, context } = load();
    post(quote());
    context.onSheetEdit({
      range: { getSheet: () => sheet, getColumn: () => 15, getLastColumn: () => 16, getRow: () => 2, getLastRow: () => 2 },
    });
    context.onSheetEdit({
      range: { getSheet: () => sheet, getColumn: () => 20, getLastColumn: () => 20, getRow: () => 1, getLastRow: () => 1 },
    });
    expect(fetches).toHaveLength(0);
  });

  it('ignores edits to the status columns between and after the two dates', () => {
    const { post, fetches, sheet, context } = load();
    post(quote());
    for (const col of [21, 22, 24, 25]) {
      context.onSheetEdit({
        range: { getSheet: () => sheet, getColumn: () => col, getLastColumn: () => col, getRow: () => 2, getLastRow: () => 2 },
      });
    }
    expect(fetches).toHaveLength(0);
  });

  it('installs exactly one edit and one hourly trigger however often it runs', () => {
    const { triggers, context } = load();
    context.installTriggers();
    context.installTriggers();
    expect(triggers.sort()).toEqual(['onSheetEdit', 'sendDueReminders']);
  });
});

describe('walkthrough and job on one row', () => {
  const nineAm = () => new Date('2026-10-15T16:00:00Z');
  const elevenAm = () => new Date('2026-10-15T18:00:00Z');
  const sent = (local: string) => `Sent 2026 for ${local}`;
  const payloads = (fetches: { options: { payload: string } }[]) =>
    fetches.map((f) => JSON.parse(f.options.payload));
  /** Confirm now, remind later, whichever type. */
  const daysAhead = (body: Record<string, unknown>) =>
    body.kind === 'confirmation'
      ? '{"sent":true}'
      : `{"sent":false,"wait":true,"reason":"reminder for ${body.type} later"}`;

  it('texts a walkthrough from column W and reports in X and Y, leaving T to V alone', () => {
    const { post, fetches, site, sheet, editWalkthrough } = load();
    post(quote());
    site.reply = daysAhead;
    expect(editWalkthrough(2, nineAm())).toEqual({
      confirmation: sent('2026-10-15T09:00'),
      reminder: 'Waiting: reminder for walkthrough later',
    });
    expect(payloads(fetches).map((p) => [p.type, p.kind])).toEqual([
      ['walkthrough', 'confirmation'],
      ['walkthrough', 'reminder'],
    ]);
    expect(sheet.rows[1].slice(19, 22)).toEqual(['', '', '']);
  });

  it('keeps each type to its own status, both on the same day', () => {
    const { post, fetches, site, sheet, editAppointment, editWalkthrough, context } = load();
    post(quote());
    site.reply = daysAhead;
    editWalkthrough(2, nineAm());
    editAppointment(2, elevenAm());
    expect(sheet.rows[1].slice(20, 25)).toEqual([
      sent('2026-10-15T11:00'),
      'Waiting: reminder for job later',
      nineAm(),
      sent('2026-10-15T09:00'),
      'Waiting: reminder for walkthrough later',
    ]);
    expect(fetches).toHaveLength(4);

    // Both reminders come due: one text each, and never twice.
    site.reply = '{"sent":true}';
    context.sendDueReminders();
    expect(payloads(fetches).slice(4).map((p) => [p.type, p.kind, p.appointment])).toEqual([
      ['job', 'reminder', '2026-10-15T11:00'],
      ['walkthrough', 'reminder', '2026-10-15T09:00'],
    ]);
    context.sendDueReminders();
    expect(fetches).toHaveLength(6);
  });

  it('does not let sending or clearing one type touch the other', () => {
    const { post, fetches, site, sheet, editAppointment, editWalkthrough } = load();
    post(quote());
    site.reply = daysAhead;
    editWalkthrough(2, nineAm());
    editAppointment(2, elevenAm());
    expect(editWalkthrough(2, '')).toEqual({
      confirmation: sent('2026-10-15T09:00'),
      reminder: 'Cancelled: walkthrough cleared, nothing sent',
    });
    expect(sheet.rows[1].slice(20, 22)).toEqual([sent('2026-10-15T11:00'), 'Waiting: reminder for job later']);
    // Re-entering the job time only asks again about the job reminder still
    // waiting; no second confirmation, and the walkthrough stays cancelled.
    editAppointment(2, elevenAm());
    expect(payloads(fetches).slice(4).map((p) => `${p.type} ${p.kind}`)).toEqual(['job reminder']);
    expect(sheet.rows[1][24]).toBe('Cancelled: walkthrough cleared, nothing sent');
  });

  it('carries a migrated confirmation over: no second confirmation, reminder still scheduled', () => {
    const { post, fetches, site, sheet, editWalkthrough } = load();
    post(quote());
    while (sheet.rows[1].length < 25) sheet.rows[1].push('');
    // What the migration writes into X and Y before the date goes into W.
    sheet.rows[1][23] = 'Sent 10/9/2026 8:00 AM for 2026-10-15T09:00';
    sheet.rows[1][24] = 'Waiting: reminder goes out Wed, Oct 14 at 5:00 PM';
    site.reply = daysAhead;
    editWalkthrough(2, nineAm());
    expect(payloads(fetches).map((p) => p.kind)).toEqual(['reminder']);
    expect(sheet.rows[1][23]).toBe('Sent 10/9/2026 8:00 AM for 2026-10-15T09:00');
  });

  it('flags a walkthrough typed as words, without touching the job columns', () => {
    const { post, fetches, sheet, editWalkthrough } = load();
    post(quote());
    expect(editWalkthrough(2, 'Monday morning').confirmation).toMatch(/^Not sent: not a date and time/);
    expect(fetches).toHaveLength(0);
    expect(sheet.rows[1].slice(19, 22)).toEqual(['', '', '']);
  });

  it('handles a paste across both date columns as both types', () => {
    const { post, fetches, site, sheet, context } = load();
    post(quote());
    while (sheet.rows[1].length < 25) sheet.rows[1].push('');
    sheet.rows[1][19] = elevenAm();
    sheet.rows[1][22] = nineAm();
    site.reply = daysAhead;
    context.onSheetEdit({
      range: { getSheet: () => sheet, getColumn: () => 20, getLastColumn: () => 25, getRow: () => 2, getLastRow: () => 2 },
    });
    expect(payloads(fetches).map((p) => `${p.type} ${p.kind}`)).toEqual([
      'job confirmation',
      'job reminder',
      'walkthrough confirmation',
      'walkthrough reminder',
    ]);
  });

  it("sends Stephanie Mount's job reminder exactly once, Mon 10/12 at 8 AM, from her live U and V", () => {
    // Her row as it stands in production on 10/9, left on T/U/V by decision.
    // The site here is the real lib/appointment.ts, run at each hourly check.
    const { post, fetches, site, sheet, context } = load();
    post(quote({ name: 'Stephanie Mount', phone: '843-817-2667', street: '4401 Belle Oaks Drive', city: 'North Charleston' }));
    while (sheet.rows[1].length < 25) sheet.rows[1].push('');
    sheet.rows[1][19] = new Date('2026-10-12T18:00:00Z'); // 10/12/2026 11:00 AM in the Pacific sheet
    sheet.rows[1][20] = 'Sent 10/9/2026 8:29 AM for 2026-10-12T11:00';
    sheet.rows[1][21] = 'Waiting: reminder goes out Mon, Oct 12 at 8:00 AM';

    let now = new Date();
    const texts: { at: string; body: string }[] = [];
    site.reply = (body) => {
      const result = appointmentText(body, now);
      if (result.ok) texts.push({ at: now.toISOString(), body: result.body });
      return JSON.stringify(result.ok ? { sent: true } : { sent: false, wait: result.wait === true, reason: result.reason });
    };
    // Every hour from Friday 9:05 PM through Monday 12:05 PM, Charleston time.
    for (let t = Date.parse('2026-10-09T21:05:00-04:00'); t <= Date.parse('2026-10-12T12:05:00-04:00'); t += 3600_000) {
      now = new Date(t);
      context.sendDueReminders();
    }

    expect(texts).toEqual([
      {
        at: new Date('2026-10-12T08:05:00-04:00').toISOString(),
        body:
          'Coastal Surface Restoration: Reminder, your appointment is Mon, Oct 12 at 11:00 AM at ' +
          '4401 Belle Oaks Drive, North Charleston. To change this appointment, call or text 854-222-7790. ' +
          'Reply STOP to opt out.',
      },
    ]);
    // Only the job reminder was ever asked about, and nothing after it went.
    expect(payloads(fetches).every((p) => p.type === 'job' && p.kind === 'reminder')).toBe(true);
    expect(payloads(fetches).at(-1)).toMatchObject({ appointment: '2026-10-12T11:00' });
    expect(sheet.rows[1][20]).toBe('Sent 10/9/2026 8:29 AM for 2026-10-12T11:00');
    expect(sheet.rows[1][21]).toBe(sent('2026-10-12T11:00'));
    expect(sheet.rows[1].slice(22, 25)).toEqual(['', '', '']);
  });

  it('adds the Job Date and walkthrough headers on a fresh sheet without renaming existing ones', () => {
    const { sheet, context } = load();
    sheet.rows[0][19] = 'Appointment';
    context.installTriggers();
    expect(sheet.rows[0].slice(19, 25)).toEqual([
      'Appointment',
      'Confirmation Text',
      'Reminder Text',
      'Walkthrough',
      'Walkthrough Confirmation Text',
      'Walkthrough Reminder Text',
    ]);
  });
});

describe('recordConsent', () => {
  it('marks SMS Consent on every row with that number, matching on the last ten digits', () => {
    const { post, sheet } = load();
    post(quote());
    post(quote({ name: 'Same Person Again' }));
    post(quote({ name: 'Someone Else', phone: '843-555-9999' }));

    const { verdict, detail } = post({ secret: SECRET, action: 'consent', phone: '+18435552345', consent: 'no' });
    expect(verdict).toBe('ok');
    expect(detail).toEqual({ rows: 2 });
    expect(sheet.rows.slice(1).map((r) => r[11])).toEqual([
      'no (replied STOP 2026)',
      'no (replied STOP 2026)',
      'yes',
    ]);

    post({ secret: SECRET, action: 'consent', phone: '+18435552345', consent: 'yes' });
    expect(sheet.rows[1][11]).toBe('yes (replied START 2026)');
  });

  it('refuses a bad number or value, and a wrong secret', () => {
    const { post } = load();
    expect(post({ secret: SECRET, action: 'consent', phone: '555', consent: 'no' }).text).toBe('bad request');
    expect(post({ secret: SECRET, action: 'consent', phone: '+18435552345', consent: 'maybe' }).text).toBe('bad request');
    expect(post({ secret: 'nope', action: 'consent', phone: '+18435552345', consent: 'no' }).text).toBe('forbidden');
  });
});
