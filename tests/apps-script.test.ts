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

function load({ jobsId = TEST_JOBS, existing = [] as string[], lockFree = true } = {}) {
  const drive = new FakeDrive();
  const root = new FakeFolder(drive, 'ROOT', 'CSR');
  const jobs = new FakeFolder(drive, jobsId, '15 - Jobs', root);
  root.children.push(jobs);
  for (const name of existing) jobs.children.push(new FakeFolder(drive, `E${++drive.seq}`, name, jobs));
  const sheet = new FakeSheet();
  const fetches: { url: string; options: { payload: string; headers: Record<string, string> } }[] = [];
  const site = { reply: '{"sent":true}' as string, code: 200, throws: false };
  const triggers: string[] = [];

  const context = createContext({
    UrlFetchApp: {
      fetch: (url: string, options: { payload: string; headers: Record<string, string> }) => {
        if (site.throws) throw new Error('Exception: DNS error');
        fetches.push({ url, options });
        return { getContentText: () => site.reply, getResponseCode: () => site.code };
      },
    },
    ScriptApp: {
      getProjectTriggers: () => triggers.map((h) => ({ getHandlerFunction: () => h })),
      deleteTrigger: (t: { getHandlerFunction: () => string }) => triggers.splice(triggers.indexOf(t.getHandlerFunction()), 1),
      newTrigger: (handler: string) => ({
        forSpreadsheet: () => ({ onEdit: () => ({ create: () => triggers.push(handler) }) }),
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
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheets: () => [sheet], getName: () => 'Log' }) },
    DriveApp: {
      getFolderById: (id: string) => {
        const folder = drive.byId.get(id);
        if (!folder) throw new Error(`Exception: No item with the given ID: ${id}`);
        return folder;
      },
    },
    LockService: { getScriptLock: () => ({ tryLock: () => lockFree, releaseLock: () => {} }) },
    Utilities: {
      formatDate: () => '2026',
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
  // An edit to column T of one row, the way Sheets reports it.
  const editAppointment = (row: number, value: unknown) => {
    while (sheet.rows[row - 1].length < 20) sheet.rows[row - 1].push('');
    sheet.rows[row - 1][19] = value;
    context.onSheetEdit({
      range: { getSheet: () => sheet, getColumn: () => 20, getLastColumn: () => 20, getRow: () => row, getLastRow: () => row },
    });
    return sheet.rows[row - 1][20];
  };
  return { drive, jobs, sheet, post, fetches, site, triggers, editAppointment, context };
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

describe('appointment text', () => {
  // 9:00 AM local. The sandbox runs in whatever zone the machine is in, and
  // the script only looks at local hours, so build it in local time too.
  const nineAm = () => new Date(2026, 9, 15, 9, 0);

  it('sends the row to the site once, with the bypass header, and records it in U', () => {
    const { post, fetches, editAppointment } = load();
    post(quote());

    expect(editAppointment(2, nineAm())).toBe('Sent 2026');
    expect(fetches).toHaveLength(1);
    expect(fetches[0].url).toBe('https://preview.example/api/appointment-text');
    expect(fetches[0].options.headers).toEqual({ 'x-vercel-protection-bypass': 'bypass-token' });
    expect(JSON.parse(fetches[0].options.payload)).toEqual({
      secret: SECRET,
      name: 'Jane Customer',
      phone: '843-555-2345',
      street: '1 King St',
      city: 'Charleston',
      smsConsent: 'yes',
      appointment: nineAm().toISOString(),
    });

    // Changing the time later does not text the customer again.
    editAppointment(2, new Date(2026, 9, 16, 10, 0));
    expect(fetches).toHaveLength(1);
  });

  it('passes the row consent through for the site to enforce', () => {
    const { post, fetches, site, editAppointment } = load();
    post(quote({ smsConsent: 'no' }));
    site.reply = '{"sent":false,"reason":"customer did not agree to texts on the quote form"}';
    expect(editAppointment(2, nineAm())).toBe('Not sent: customer did not agree to texts on the quote form');
    expect(JSON.parse(fetches[0].options.payload).smsConsent).toBe('no');
  });

  it('asks for a time instead of texting midnight, and retries once fixed', () => {
    const { post, fetches, editAppointment } = load();
    post(quote());
    expect(editAppointment(2, new Date(2026, 9, 15))).toMatch(/^Not sent: add a time/);
    expect(fetches).toHaveLength(0);
    expect(editAppointment(2, nineAm())).toBe('Sent 2026');
  });

  it('flags text that is not a date and ignores a cleared cell', () => {
    const { post, fetches, editAppointment } = load();
    post(quote());
    expect(editAppointment(2, 'next Tuesday')).toMatch(/^Not sent: not a date and time/);
    expect(editAppointment(2, '')).toMatch(/^Not sent/);
    expect(fetches).toHaveLength(0);
  });

  it('records a site failure on the row rather than throwing', () => {
    const { post, site, editAppointment } = load();
    post(quote());
    site.throws = true;
    expect(editAppointment(2, nineAm())).toBe('Not sent: Error: Exception: DNS error');
    site.throws = false;
    site.reply = '<html>sign in</html>';
    site.code = 401;
    expect(editAppointment(2, nineAm())).toBe('Not sent: site answered 401');
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

  it('installs exactly one edit trigger however often it runs', () => {
    const { triggers, context } = load();
    context.installTriggers();
    context.installTriggers();
    expect(triggers).toEqual(['onSheetEdit']);
  });
});
