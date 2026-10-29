// Failure injection: the real route, the real recordQuote and the real database client, pointed at a
// Supabase that is down, one that never answers, and one that refuses the connection. Every case must
// still write the sheet row, send both emails and tell the customer it worked.
import net from 'node:net';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  appendQuoteRow: vi.fn(),
  afterCallbacks: [] as (() => Promise<void>)[],
}));

vi.mock('resend', () => ({ Resend: class { emails = { send: mocks.send }; } }));
vi.mock('@/lib/notify', () => ({
  appendQuoteRow: mocks.appendQuoteRow,
  saveJobPhotos: vi.fn().mockResolvedValue({ sent: true }),
  sendSms: vi.fn().mockResolvedValue({ sent: true }),
  quoteConfirmationSmsEnabled: () => false,
}));
vi.mock('@/lib/email-domain', () => ({ domainAcceptsMail: () => Promise.resolve(true) }));
vi.mock('next/server', () => ({
  NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) },
  after: (cb: () => Promise<void>) => mocks.afterCallbacks.push(cb),
}));

// A port that accepts and then says nothing (slow), and one that answers the TLS request with "no".
const servers: net.Server[] = [];
let silentPort = 0;
let refusingPort = 0;
let closedPort = 0;

function listen(onConn: (s: net.Socket) => void): Promise<number> {
  return new Promise((resolve) => {
    const srv = net.createServer(onConn);
    servers.push(srv);
    srv.listen(0, '127.0.0.1', () => resolve((srv.address() as net.AddressInfo).port));
  });
}

beforeAll(async () => {
  silentPort = await listen(() => {});
  refusingPort = await listen((s) => s.once('data', () => s.end(Buffer.from('N'))));
  // Bind, note the port, close: nothing listens there now.
  closedPort = await listen(() => {});
  await new Promise<void>((r) => servers.pop()!.close(() => r()));
});

afterAll(() => {
  for (const s of servers) s.close();
});

let ip = 0;
function quote(extra: Record<string, string> = {}) {
  const form = new FormData();
  const fields = {
    name: 'Jane Customer', email: 'jane@example.com', phone: '843-555-2345', street: '1 King St',
    city: 'Charleston', state: 'SC', zip: '29401', serviceType: 'Rust removal on metal', description: 'Railing',
    ...extra,
  };
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  ip += 1;
  return new Request('http://localhost/api/quote', { method: 'POST', body: form, headers: { 'x-forwarded-for': `10.1.0.${ip}` } });
}

beforeEach(() => {
  mocks.afterCallbacks.length = 0;
  mocks.send.mockResolvedValue({ data: { id: 'e' }, error: null });
  mocks.appendQuoteRow.mockResolvedValue({ sent: true, jobFolder: { created: false, reason: 'test' } });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const url = (port: number) => `postgresql://csr_site_ingest.testref:wrong@127.0.0.1:${port}/postgres`;

describe.each([
  ['down (connection refused)', () => url(closedPort), /ECONNREFUSED/],
  ['slow (never answers)', () => url(silentPort), /CONNECT_TIMEOUT|timed out after 2500 ms/],
  ['refusing TLS (never falls back to plain text)', () => url(refusingPort), /TLS|SSL/],
])('Supabase %s', (_label, target, reason) => {
  it.each([
    ['normal', {}, 200, 2],
    ['20 to 50 miles', { zip: '29438', city: 'Edisto Island' }, 400, 1],
    ['over 50 miles', { zip: '29118' }, 400, 0],
  ])('%s quote: sheet row and emails as usual, same answer to the customer', async (_p, extra, status, emails) => {
    vi.resetModules();
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('SUPABASE_INGEST_URL', target());
    const { POST } = await import('@/app/api/quote/route');

    const started = Date.now();
    const res = await POST(quote(extra));
    // The customer's answer never waits on Supabase.
    expect(Date.now() - started).toBeLessThan(1500);
    expect(res.status).toBe(status);
    if (status === 200) expect(await res.json()).toEqual({ success: true });
    expect(mocks.appendQuoteRow).toHaveBeenCalledTimes(1);
    // Normal: notify, 48 h reminder and acknowledgement. Near: notify only. Far: none.
    const sends = mocks.send.mock.calls.length;
    expect(sends).toBeGreaterThanOrEqual(emails);

    // The background copy fails, inside the timeout, without throwing.
    const copies = Date.now();
    for (const cb of mocks.afterCallbacks) await expect(cb()).resolves.toBeUndefined();
    expect(Date.now() - copies).toBeLessThan(3500);
    expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/^Quote copy to Supabase not confirmed/));
    const line = vi.mocked(console.warn).mock.calls.map((c) => String(c[0])).find((l) => l.startsWith('Quote copy to Supabase not confirmed'))!;
    expect(line).toMatch(reason);
  }, 15_000);
});
