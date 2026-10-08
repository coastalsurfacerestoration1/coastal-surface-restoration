import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validTwilioSignature } from '@/lib/twilio-signature';

const mocks = vi.hoisted(() => ({ recordSmsConsent: vi.fn() }));

vi.mock('@/lib/notify', () => ({ recordSmsConsent: mocks.recordSmsConsent }));

const TOKEN = 'twilio-auth-token';
const URL_CALLED = 'https://coastalsurfacerestoration.com/api/sms-inbound';

/** Signed the way Twilio documents it, independently of the code under test. */
const sign = (url: string, params: Record<string, string>) =>
  createHmac('sha1', TOKEN)
    .update(url + Object.keys(params).sort().map((k) => k + params[k]).join(''))
    .digest('base64');

const inbound = (params: Record<string, string>, signature = sign(URL_CALLED, params)) =>
  new Request(URL_CALLED, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'x-twilio-signature': signature },
    body: new URLSearchParams(params),
  });

const post = async (req: Request) => {
  const { POST } = await import('@/app/api/sms-inbound/route');
  return POST(req);
};

beforeEach(() => {
  vi.stubEnv('TWILIO_AUTH_TOKEN', TOKEN);
  mocks.recordSmsConsent.mockResolvedValue({ sent: true, rows: 1 });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('validTwilioSignature', () => {
  const params = { From: '+18435552345', Body: 'STOP' };

  it('accepts a correct signature and nothing else', () => {
    expect(validTwilioSignature(TOKEN, URL_CALLED, params, sign(URL_CALLED, params))).toBe(true);
    expect(validTwilioSignature(TOKEN, URL_CALLED, { ...params, Body: 'START' }, sign(URL_CALLED, params))).toBe(false);
    expect(validTwilioSignature(TOKEN, `${URL_CALLED}?x=1`, params, sign(URL_CALLED, params))).toBe(false);
    expect(validTwilioSignature('', URL_CALLED, params, sign(URL_CALLED, params))).toBe(false);
    expect(validTwilioSignature(TOKEN, URL_CALLED, params, null)).toBe(false);
  });
});

describe('POST /api/sms-inbound', () => {
  it('marks the sheet "no" when Twilio reports a STOP', async () => {
    const res = await post(inbound({ From: '+18435552345', Body: 'Stop', OptOutType: 'STOP' }));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('<Response></Response>');
    expect(mocks.recordSmsConsent).toHaveBeenCalledWith('+18435552345', 'no');
  });

  it('marks the sheet "yes" again on START', async () => {
    await post(inbound({ From: '+18435552345', Body: 'START', OptOutType: 'START' }));
    expect(mocks.recordSmsConsent).toHaveBeenCalledWith('+18435552345', 'yes');
  });

  it('falls back to the keyword when Twilio sends no opt-out type', async () => {
    await post(inbound({ From: '+18435552345', Body: ' unsubscribe ' }));
    expect(mocks.recordSmsConsent).toHaveBeenCalledWith('+18435552345', 'no');
  });

  it('leaves the sheet alone for HELP and ordinary replies', async () => {
    await post(inbound({ From: '+18435552345', Body: 'HELP', OptOutType: 'HELP' }));
    await post(inbound({ From: '+18435552345', Body: 'Sounds good, see you then' }));
    expect(mocks.recordSmsConsent).not.toHaveBeenCalled();
  });

  it('refuses a request Twilio did not sign', async () => {
    const res = await post(inbound({ From: '+18435552345', Body: 'STOP' }, 'forged'));
    expect(res.status).toBe(403);
    expect(mocks.recordSmsConsent).not.toHaveBeenCalled();
  });

  it('still answers Twilio when the sheet update fails', async () => {
    mocks.recordSmsConsent.mockResolvedValue({ sent: false, reason: 'down' });
    expect((await post(inbound({ From: '+18435552345', Body: 'STOP', OptOutType: 'STOP' }))).status).toBe(200);
  });
});
