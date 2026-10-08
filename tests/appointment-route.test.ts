import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ sendSms: vi.fn(), customerSms: true }));

vi.mock('@/lib/notify', () => ({
  sendSms: mocks.sendSms,
  customerSmsEnabled: () => mocks.customerSms,
}));

vi.mock('next/server', () => ({
  NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) },
}));

const SECRET = 'sheet-secret';

const call = async (body: Record<string, unknown>) => {
  const { POST } = await import('@/app/api/appointment-text/route');
  const res = await POST(
    new Request('http://localhost/api/appointment-text', { method: 'POST', body: JSON.stringify(body) }),
  );
  return { status: res.status, json: await res.json() };
};

/** Charleston wall time two hours from now, which is always due unless it is night. */
const inTwoHours = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  })
    .format(new Date(Date.now() + 2 * 3600 * 1000))
    .replace(' ', 'T');

const row = (extra: Record<string, unknown> = {}) => ({
  secret: SECRET,
  name: 'Jane Customer',
  phone: '843-555-2345',
  street: '1810 Mepkin Rd',
  city: 'West Ashley',
  smsConsent: 'yes',
  // Inside today's reminder window whenever the test runs: two hours from now.
  appointment: inTwoHours(),
  ...extra,
});

beforeEach(() => {
  // Midday in Charleston, inside texting hours.
  vi.useFakeTimers({ now: new Date('2026-10-14T16:00:00Z'), toFake: ['Date'] });
  vi.stubEnv('QUOTE_SHEET_SECRET', SECRET);
  mocks.customerSms = true;
  mocks.sendSms.mockResolvedValue({ sent: true });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('POST /api/appointment-text', () => {
  it('texts the customer with the approved wording', async () => {
    const { status, json } = await call(row());
    expect(status).toBe(200);
    expect(json).toEqual({ sent: true });
    expect(mocks.sendSms).toHaveBeenCalledWith(
      '843-555-2345',
      expect.stringMatching(/^Coastal Surface Restoration here\. Reminder: .* 1810 Mepkin Rd, West Ashley\. Reply STOP to opt out\.$/),
    );
  });

  it('refuses a wrong or missing secret without sending', async () => {
    expect((await call(row({ secret: 'nope' }))).status).toBe(403);
    expect((await call(row({ secret: undefined }))).status).toBe(403);
    vi.stubEnv('QUOTE_SHEET_SECRET', '');
    expect((await call(row())).status).toBe(403);
    expect(mocks.sendSms).not.toHaveBeenCalled();
  });

  it('does not text without consent', async () => {
    const { json } = await call(row({ smsConsent: 'no' }));
    expect(json).toEqual({ sent: false, wait: false, reason: 'customer did not agree to texts on the quote form' });
    expect(mocks.sendSms).not.toHaveBeenCalled();
  });

  it('does not text when customer texts are off', async () => {
    mocks.customerSms = false;
    const { json } = await call(row());
    expect(json.sent).toBe(false);
    expect(mocks.sendSms).not.toHaveBeenCalled();
  });

  it('tells the sheet to wait when the reminder is not due yet', async () => {
    const { json } = await call(row({ appointment: '2026-10-20T09:00' }));
    expect(json).toEqual({ sent: false, wait: true, reason: 'reminder goes out Mon, Oct 19 at 5:00 PM' });
    expect(mocks.sendSms).not.toHaveBeenCalled();
  });

  it('says plainly when the customer has replied STOP', async () => {
    mocks.sendSms.mockResolvedValue({ sent: false, reason: 'Twilio 400: {"code":21610}' });
    expect((await call(row())).json).toEqual({ sent: false, reason: 'customer replied STOP to our texts' });
  });
});
