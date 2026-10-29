import { generateKeyPairSync } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  readSheet: vi.fn(),
  readSupabase: vi.fn(),
}));

vi.mock('resend', () => ({ Resend: class { emails = { send: mocks.send }; } }));
vi.mock('@/lib/reconcile', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/reconcile')>()),
  readSheet: mocks.readSheet,
  readSupabase: mocks.readSupabase,
}));

const real = await vi.importActual<typeof import('@/lib/reconcile')>('@/lib/reconcile');
const { compare, fingerprint, hasProblems, reportEmail } = real;

const since = new Date('2026-10-27T00:00:00.000Z');
const until = new Date('2026-10-29T00:00:00.000Z');
const row = (ts: string, over: Partial<{ name: string; email: string; phone: string; service: string }> = {}) => ({
  timestamp: ts, name: 'Jane Customer', email: 'jane@example.com', phone: '843-555-2345', service: 'Rust removal on metal', ...over,
});
const db = (r: ReturnType<typeof row>, id = 'sub') => ({ sheet_timestamp: r.timestamp, submission_id: id, fingerprint: fingerprint(r) });

describe('compare', () => {
  it('matching stores report nothing', () => {
    const a = row('2026-10-28T10:00:00.000Z');
    const r = compare([a], [db(a)], since, until);
    expect(hasProblems(r)).toBe(false);
    expect(r).toMatchObject({ sheetRows: 1, supabaseRows: 1 });
  });

  it('finds rows missing on either side and rows that differ', () => {
    const a = row('2026-10-28T10:00:00.000Z');
    const b = row('2026-10-28T11:00:00.000Z');
    const c = row('2026-10-28T12:00:00.000Z');
    const r = compare([a, b], [db({ ...b, phone: '843-555-0000' }), db(c, 'c')], since, until);
    expect(r.missingInSupabase.map((x) => x.timestamp)).toEqual([a.timestamp]);
    expect(r.mismatched.map((x) => x.timestamp)).toEqual([b.timestamp]);
    expect(r.missingInSheet.map((x) => x.sheet_timestamp)).toEqual([c.timestamp]);
  });

  it('ignores hand-typed rows and rows outside the window', () => {
    const r = compare(
      [row(''), row('10/12/2026'), row('2026-10-20T10:00:00.000Z')],
      [db(row('2026-10-29T00:00:00.000Z'))],
      since,
      until,
    );
    expect(r).toMatchObject({ sheetRows: 0, supabaseRows: 0, missingInSupabase: [], missingInSheet: [] });
  });

  it('flags a timestamp shared by two sheet rows', () => {
    const a = row('2026-10-28T10:00:00.000Z');
    const r = compare([a, { ...a, name: 'Other Person' }], [db(a)], since, until);
    expect(r.duplicateTimestamps).toEqual([a.timestamp]);
    expect(hasProblems(r)).toBe(true);
    expect(reportEmail(r, '').text).toContain('share one timestamp');
  });

  it('a bad reader key fails without echoing it', async () => {
    await expect(real.readSheet({ QUOTE_SHEET_ID: 'S', GOOGLE_SHEETS_READER_KEY: Buffer.from('{"private_key":"-----BEGIN secret').toString('base64') }))
      .rejects.toThrow(/^GOOGLE_SHEETS_READER_KEY is not valid base64 JSON$/);
  });

  it('fingerprints ignore case, spacing and phone punctuation, but not the service', () => {
    const base = fingerprint(row('x'));
    expect(fingerprint(row('x', { name: ' JANE customer ', email: 'Jane@Example.com', phone: '+1 (843) 555-2345' }))).toBe(base);
    // Like Postgres btrim(): only spaces are trimmed.
    expect(fingerprint(row('x', { name: '\tJane Customer' }))).not.toBe(base);
    expect(fingerprint(row('x', { service: 'Graffiti on hard masonry (test first)' }))).not.toBe(base);
  });

  it('the alert names what to look at and says nothing was changed', () => {
    const a = row('2026-10-28T10:00:00.000Z');
    const { subject, text } = reportEmail(compare([a], [], since, until), '[TEST] ');
    expect(subject).toBe('[TEST] Quote log check: 1 row to look at');
    expect(text).toContain('2026-10-28T10:00:00.000Z  Jane Customer');
    expect(text).toContain('Nothing was changed');
    expect(text).not.toMatch(/[—!]/);
  });
});

describe('readSheet', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('asks for read-only access and maps A, B, C, D and I', async () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const key = Buffer.from(JSON.stringify({
      client_email: 'reader@test.iam.gserviceaccount.com',
      private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    })).toString('base64');
    const calls: { url: string; body?: string }[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, body: init?.body?.toString() });
      if (url.includes('oauth2')) return Response.json({ access_token: 'tok' });
      return Response.json({ values: [
        ['2026-10-28T10:00:00.000Z', 'Jane', 'j@e.com', '843-555-2345', 'x', 'y', 'SC', '29401', 'Rust'],
        [46000.5, 'Hand typed'],
      ] });
    }));
    const rows = await real.readSheet({ QUOTE_SHEET_ID: 'SHEET', GOOGLE_SHEETS_READER_KEY: key });
    expect(rows).toEqual([
      { timestamp: '2026-10-28T10:00:00.000Z', name: 'Jane', email: 'j@e.com', phone: '843-555-2345', service: 'Rust' },
      { timestamp: '', name: 'Hand typed', email: '', phone: '', service: '' },
    ]);
    const assertion = new URLSearchParams(calls[0].body).get('assertion')!;
    const claims = JSON.parse(Buffer.from(assertion.split('.')[1], 'base64url').toString());
    expect(claims.scope).toBe('https://www.googleapis.com/auth/spreadsheets.readonly');
    expect(calls[1].url).toContain('/spreadsheets/SHEET/values/A2:I?');
  });
});

describe('GET /api/cron/reconcile', () => {
  const a = row('2026-10-28T10:00:00.000Z');

  async function load(env: Record<string, string> = {}) {
    vi.resetModules();
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('QUOTE_NOTIFY_TO', 'quotes+test@coastalsurfacerestoration.com');
    vi.stubEnv('CRON_SECRET', 'cron-secret-for-tests');
    for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
    return (await import('@/app/api/cron/reconcile/route')).GET;
  }
  const call = (GET: (r: Request) => Promise<Response>, auth?: string, q = '?hours=720&lag=0') =>
    GET(new Request(`http://localhost/api/cron/reconcile${q}`, auth ? { headers: { authorization: auth } } : {}));

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-29T00:00:00.000Z'));
    mocks.send.mockResolvedValue({ data: { id: 'e' }, error: null });
    mocks.readSheet.mockResolvedValue([a]);
    mocks.readSupabase.mockResolvedValue([]);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it.each([undefined, 'Bearer wrong', 'cron-secret-for-tests'])('refuses a missing or wrong secret (%s)', async (auth) => {
    const GET = await load();
    expect((await call(GET, auth)).status).toBe(401);
    expect(mocks.readSheet).not.toHaveBeenCalled();
  });

  it('refuses everyone when CRON_SECRET is not set', async () => {
    const GET = await load({ CRON_SECRET: '' });
    expect((await call(GET, 'Bearer ')).status).toBe(401);
  });

  it('flags a missing row, emails once, and returns timestamps only', async () => {
    const GET = await load();
    const res = await call(GET, 'Bearer cron-secret-for-tests');
    const body = await res.json();
    expect(body).toMatchObject({ ok: true, sheetRows: 1, supabaseRows: 0, missingInSupabase: [a.timestamp], emailed: true });
    expect(JSON.stringify(body)).not.toMatch(/Jane|example\.com|555/);
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.send.mock.calls[0][0]).toMatchObject({
      to: 'quotes+test@coastalsurfacerestoration.com',
      subject: '[TEST] Quote log check: 1 row to look at',
    });
  });

  it('sends nothing when the stores agree', async () => {
    mocks.readSupabase.mockResolvedValue([db(a)]);
    const GET = await load();
    const body = await (await call(GET, 'Bearer cron-secret-for-tests')).json();
    expect(body).toMatchObject({ ok: true, missingInSupabase: [], missingInSheet: [], mismatched: [], emailed: false });
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it('splits a long window into calls of at most 31 days', async () => {
    const GET = await load();
    await call(GET, 'Bearer cron-secret-for-tests', '?hours=720&lag=0');
    for (const [s, e] of mocks.readSupabase.mock.calls) {
      expect((e as Date).getTime() - (s as Date).getTime()).toBeLessThanOrEqual(31 * 86_400_000);
    }
  });

  it('answers 500 without detail when a store cannot be read', async () => {
    mocks.readSheet.mockRejectedValue(new Error('Sheets API 403'));
    const GET = await load();
    const res = await call(GET, 'Bearer cron-secret-for-tests');
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'check failed' });
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
