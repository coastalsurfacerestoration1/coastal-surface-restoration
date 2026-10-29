import postgres from 'postgres';
import type { JobFolder, QuoteRow } from '@/lib/notify';
import { SUPABASE_ROOT_CA } from '@/lib/supabase-root-ca';

/**
 * The website's copy of each quote in Supabase (Phase 3 dual-write).
 *
 * The sheet stays the record of truth. This is a second, background copy, so
 * like everything in lib/notify.ts it never throws and gives up after a short
 * timeout: a database outage must never cost a customer their submission or
 * slow the form down.
 *
 * It connects as csr_site_ingest, a Postgres role that can do one thing:
 * call public.ingest_quote_request(jsonb). It cannot read or write a table
 * directly, so the credential is worth very little to anyone who takes it.
 * The service_role key never lives on the site.
 */

/** csr-field, the live database. Previews and local dev must never write here. */
export const CSR_FIELD_PROJECT_REF = 'sdrlozunwhblnchbdngu';

export const INGEST_TIMEOUT_MS = 2500;

/** How the route classified the address. Matches quote_requests.service_area_result. */
export type AreaVerdict = 'in' | 'near' | 'far' | 'unknown';

const AREA: Record<AreaVerdict, 'in' | 'near' | 'out' | 'unknown'> = {
  in: 'in',
  near: 'near',
  far: 'out',
  unknown: 'unknown',
};

export type IngestPayload = {
  submission_id: string;
  sheet_timestamp: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  service: string;
  description: string;
  photos: number;
  area: 'in' | 'near' | 'out' | 'unknown';
  out_of_area: string;
  spam: boolean;
  how_heard: string;
  referred_by: string;
  sheet: string;
};

/**
 * The payload for one quote. The sheet row and the ids come from the same
 * sheetRow() result, so sheet_timestamp is byte for byte the column A text.
 * Texting consent is left out on purpose: it changes in the sheet after STOP
 * replies, so a copy here would go stale (Phase 4 moves it).
 */
export function buildIngestPayload(
  row: QuoteRow,
  submissionId: string,
  area: AreaVerdict,
  sheet: { sent: boolean; reason?: string; jobFolder?: JobFolder },
): IngestPayload {
  return {
    submission_id: submissionId,
    sheet_timestamp: row.timestamp,
    name: row.name,
    email: row.email,
    phone: row.phone,
    street: row.street,
    city: row.city,
    state: row.state,
    zip: row.zip,
    service: row.service,
    description: row.description,
    // The far path counts files before the 4 photo cap; the count is all that is kept.
    photos: Math.min(Math.max(row.photos, 0), 20),
    area: AREA[area],
    out_of_area: typeof row.outOfArea === 'string' ? row.outOfArea : row.outOfArea ? 'yes' : '',
    spam: row.spamFlag,
    how_heard: row.howHeard,
    referred_by: row.referredBy,
    sheet: sheet.sent ? 'ok' : `failed: ${sheet.reason ?? 'unknown'}`.slice(0, 200),
  };
}

export type IngestResult = { sent: true; id: string; duplicate: boolean } | { sent: false; reason: string };

type Runner = (payload: IngestPayload) => Promise<{ id: string; duplicate: boolean }>;

/**
 * Where a write may go, or why it may not.
 *
 * Production writes to csr-field. Everything else writes to csr-test, and a
 * csr-field URL outside Production is refused even if someone pastes one into
 * the wrong environment, so test quotes cannot reach the live table.
 */
export function ingestTarget(
  env: Record<string, string | undefined> = process.env,
): { url: string } | { refused: string } {
  const url = env.SUPABASE_INGEST_URL;
  if (!url) return { refused: 'SUPABASE_INGEST_URL is not set' };
  if (env.VERCEL_ENV !== 'production' && url.toLowerCase().includes(CSR_FIELD_PROJECT_REF)) {
    return { refused: 'csr-field is Production only; previews and dev write to csr-test' };
  }
  return { url };
}

/**
 * TLS for a Supabase pooler or database URL: always encrypted, and the
 * certificate must chain to the Supabase root, so a stolen DNS answer cannot
 * read the quote on its way.
 */
export function supabaseTls() {
  return { ca: SUPABASE_ROOT_CA, rejectUnauthorized: true };
}

/**
 * One short-lived connection per copy, closed when the copy is done or given
 * up. Quotes are a few a day, so the extra handshake costs nothing, and a
 * slow or failed copy can never break another request's connection on the
 * same function instance.
 */
const defaultRunner =
  (url: string): Runner =>
  async (payload) => {
    // Transaction pooler, so no prepared statements. The role caps any
    // statement at 2 s on the database side, under the 2.5 s wait here.
    const sql = postgres(url, {
      max: 1,
      prepare: false,
      ssl: supabaseTls(),
      connect_timeout: 2,
      idle_timeout: 1,
      onnotice: () => {},
      connection: { application_name: 'csr-site-ingest' },
    });
    try {
      const rows = await sql<{ r: { id: string; duplicate: boolean } }[]>`
        select public.ingest_quote_request(${sql.json(payload)}) as r`;
      return rows[0].r;
    } finally {
      sql.end({ timeout: 1 }).catch(() => {});
    }
  };

/** Never throws. Resolves within timeoutMs whatever the database does. */
export async function ingestQuote(
  payload: IngestPayload,
  opts: { run?: Runner; timeoutMs?: number; env?: Record<string, string | undefined> } = {},
): Promise<IngestResult> {
  let run = opts.run;
  if (!run) {
    const target = ingestTarget(opts.env);
    if ('refused' in target) return { sent: false, reason: target.refused };
    run = defaultRunner(target.url);
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<IngestResult>((resolve) => {
    timer = setTimeout(
      () => resolve({ sent: false, reason: `timed out after ${opts.timeoutMs ?? INGEST_TIMEOUT_MS} ms` }),
      opts.timeoutMs ?? INGEST_TIMEOUT_MS,
    );
  });

  const attempt = (async (): Promise<IngestResult> => {
    try {
      const r = await run(payload);
      return { sent: true, id: r.id, duplicate: r.duplicate };
    } catch (error) {
      return { sent: false, reason: describe(error) };
    }
  })();

  try {
    return await Promise.race([attempt, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

/** One line for the log, with no connection string or payload in it. */
function describe(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as { code?: string; message?: string };
    const msg = (e.message ?? String(error)).replace(/postgres(ql)?:\/\/\S+/gi, '[url]');
    return `${e.code ? `${e.code} ` : ''}${msg}`.slice(0, 200);
  }
  return String(error).slice(0, 200);
}
