import { createHash, createSign } from 'node:crypto';
import postgres from 'postgres';
import { supabaseTls } from '@/lib/supabase-ingest';

/**
 * Nightly check that every quote the form wrote to the sheet also reached
 * Supabase, and the other way round (plan 5.7).
 *
 * Rows are matched on the exact column A text, which the site generates and
 * both stores keep byte for byte. Each side is reduced to a fingerprint of the
 * fields both keep (name, email, phone, service), so the database never sends
 * names or numbers back to the site. Hand-typed rows (a date, not the form's
 * ISO timestamp) are left out; those were matched once at backfill.
 */

export const FORM_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export type SheetRow = { timestamp: string; name: string; email: string; phone: string; service: string };
export type DbRow = { sheet_timestamp: string; submission_id: string | null; fingerprint: string };

/** Postgres btrim(): spaces only, unlike String.trim(). */
const btrim = (s: string) => s.replace(/^ +| +$/g, '');

/** Same formula as public.reconcile_quote_requests. */
export function fingerprint(r: { name: string; email: string; phone: string; service: string }): string {
  const parts = [
    btrim(r.name.toLowerCase()),
    btrim(r.email.toLowerCase()),
    r.phone.replace(/\D/g, '').slice(-10),
    btrim(r.service),
  ];
  return createHash('sha256').update(parts.join('|'), 'utf8').digest('hex');
}

export type Report = {
  window: { since: string; until: string };
  sheetRows: number;
  supabaseRows: number;
  /** In the sheet, not in Supabase: the copy failed. */
  missingInSupabase: SheetRow[];
  /** In Supabase, not in the sheet: the sheet write failed, or the row was removed by hand. */
  missingInSheet: DbRow[];
  /** In both, but the fields differ. */
  mismatched: { timestamp: string; name: string }[];
  /** Column A text used by more than one sheet row. Rare (same millisecond); checked by hand. */
  duplicateTimestamps: string[];
};

export function compare(sheet: SheetRow[], db: DbRow[], since: Date, until: Date): Report {
  const inWindow = (ts: string) => {
    const t = Date.parse(ts);
    return t >= since.getTime() && t < until.getTime();
  };
  const sheetRows = sheet.filter((r) => FORM_TIMESTAMP.test(r.timestamp) && inWindow(r.timestamp));
  const dbRows = db.filter((r) => inWindow(r.sheet_timestamp));
  const byTs = new Map(dbRows.map((r) => [r.sheet_timestamp, r]));
  const sheetTs = new Set(sheetRows.map((r) => r.timestamp));
  const seen = new Set<string>();
  const duplicateTimestamps = new Set<string>();
  for (const r of sheetRows) (seen.has(r.timestamp) ? duplicateTimestamps : seen).add(r.timestamp);

  const missingInSupabase: SheetRow[] = [];
  const mismatched: Report['mismatched'] = [];
  for (const r of sheetRows) {
    const match = byTs.get(r.timestamp);
    if (!match) missingInSupabase.push(r);
    else if (match.fingerprint !== fingerprint(r)) mismatched.push({ timestamp: r.timestamp, name: r.name });
  }
  return {
    window: { since: since.toISOString(), until: until.toISOString() },
    sheetRows: sheetRows.length,
    supabaseRows: dbRows.length,
    missingInSupabase,
    missingInSheet: dbRows.filter((r) => !sheetTs.has(r.sheet_timestamp)),
    mismatched,
    duplicateTimestamps: [...duplicateTimestamps],
  };
}

function problemCount(r: Report): number {
  return r.missingInSupabase.length + r.missingInSheet.length + r.mismatched.length + r.duplicateTimestamps.length;
}

export function hasProblems(r: Report): boolean {
  return problemCount(r) > 0;
}

/** The alert to Tyler. Only sent when hasProblems(). */
export function reportEmail(r: Report, testTag: string): { subject: string; text: string } {
  const count = problemCount(r);
  const lines = [
    `The nightly check compared the Quote Requests Log with Supabase for ${r.window.since} to ${r.window.until} (UTC).`,
    `Sheet rows from the form: ${r.sheetRows}. Supabase rows: ${r.supabaseRows}.`,
    '',
  ];
  if (r.missingInSupabase.length) {
    lines.push('In the sheet but not in Supabase (the copy failed; the sheet row is fine):');
    for (const m of r.missingInSupabase) lines.push(`  ${m.timestamp}  ${m.name}`);
    lines.push('');
  }
  if (r.missingInSheet.length) {
    lines.push('In Supabase but not in the sheet (check column A for this timestamp):');
    for (const m of r.missingInSheet) lines.push(`  ${m.sheet_timestamp}  submission ${m.submission_id ?? 'none'}`);
    lines.push('');
  }
  if (r.mismatched.length) {
    lines.push('In both, but name, email, phone or service differ:');
    for (const m of r.mismatched) lines.push(`  ${m.timestamp}  ${m.name}`);
    lines.push('');
  }
  if (r.duplicateTimestamps.length) {
    lines.push('Two sheet rows share one timestamp (sent in the same millisecond); Supabase keeps the second under a tagged copy:');
    for (const ts of r.duplicateTimestamps) lines.push(`  ${ts}`);
    lines.push('');
  }
  lines.push('Nothing was changed. The sheet is still the record of truth until cutover.');
  return { subject: `${testTag}Quote log check: ${count} row${count === 1 ? '' : 's'} to look at`, text: lines.join('\n') };
}

/* ------------------------------------------------------------------------ */
/* Readers                                                                   */
/* ------------------------------------------------------------------------ */

/** A sheet cell as text; empty for blanks. */
export const cellText = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

/** Reads columns A to I of the sheet's first tab: what the reconcile compares. */
export async function readSheet(env: Record<string, string | undefined> = process.env): Promise<SheetRow[]> {
  const values = await readSheetValues('A2:I', env);
  // A Timestamp, B Name, C Email, D Phone, I Service. A hand-typed date comes
  // back as a number and is left blank, so it never counts as a form row.
  return values.map((r) => ({
    timestamp: typeof r[0] === 'string' ? r[0] : '',
    name: cellText(r[1]),
    email: cellText(r[2]),
    phone: cellText(r[3]),
    service: cellText(r[8]),
  }));
}

/**
 * Reads a range of the sheet's first tab with the Sheets API, as a service
 * account that has view-only access to that one sheet. Read only: the scope
 * is spreadsheets.readonly, and nothing here can write.
 */
export async function readSheetValues(
  range: string,
  env: Record<string, string | undefined> = process.env,
): Promise<unknown[][]> {
  const sheetId = env.QUOTE_SHEET_ID;
  const keyB64 = env.GOOGLE_SHEETS_READER_KEY;
  if (!sheetId || !keyB64) throw new Error('QUOTE_SHEET_ID or GOOGLE_SHEETS_READER_KEY is not set');
  let key: { client_email: string; private_key: string };
  try {
    key = JSON.parse(Buffer.from(keyB64, 'base64').toString('utf8'));
  } catch {
    // Never echo any part of the key into a log.
    throw new Error('GOOGLE_SHEETS_READER_KEY is not valid base64 JSON');
  }

  const now = Math.floor(Date.now() / 1000);
  const b64url = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${b64url({ alg: 'RS256', typ: 'JWT' })}.${b64url({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 600,
  })}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!tokenRes.ok) throw new Error(`Google token ${tokenRes.status}`);
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  // No tab name, so this is the first tab, the same one the Apps Script writes.
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${range}?valueRenderOption=UNFORMATTED_VALUE`,
    { headers: { Authorization: `Bearer ${access_token}` }, signal: AbortSignal.timeout(15_000) },
  );
  if (!res.ok) throw new Error(`Sheets API ${res.status}`);
  const { values = [] } = (await res.json()) as { values?: unknown[][] };
  return values;
}

/** Supabase side, as csr_site_reconcile: timestamps and fingerprints only. */
export async function readSupabase(
  since: Date,
  until: Date,
  env: Record<string, string | undefined> = process.env,
): Promise<DbRow[]> {
  const url = env.SUPABASE_RECONCILE_URL;
  if (!url) throw new Error('SUPABASE_RECONCILE_URL is not set');
  const sql = postgres(url, { max: 1, prepare: false, ssl: supabaseTls(), connect_timeout: 10, onnotice: () => {} });
  try {
    return await sql<DbRow[]>`
      select sheet_timestamp, submission_id::text as submission_id, fingerprint
      from public.reconcile_quote_requests(${since.toISOString()}::timestamptz, ${until.toISOString()}::timestamptz)`;
  } finally {
    await sql.end({ timeout: 2 }).catch(() => {});
  }
}
