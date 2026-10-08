import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  appendQuoteRow: vi.fn(),
  saveJobPhotos: vi.fn(),
  sendSms: vi.fn(),
  customerSms: false,
  afterCallbacks: [] as (() => Promise<void>)[],
}));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));

vi.mock('@/lib/notify', () => ({
  appendQuoteRow: mocks.appendQuoteRow,
  saveJobPhotos: mocks.saveJobPhotos,
  sendSms: mocks.sendSms,
  customerSmsEnabled: () => mocks.customerSms,
}));

// No real DNS in unit tests. The check itself is covered in email.test.ts.
vi.mock('@/lib/email-domain', () => ({
  domainAcceptsMail: (email: string) => Promise.resolve(!email.endsWith('@no-mail.invalid')),
}));

vi.mock('next/server', () => ({
  NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) },
  after: (callback: () => Promise<void>) => mocks.afterCallbacks.push(callback),
}));

/** Just the PNG signature, which is all the route sniffs for. */
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);

let ip = 0;

function quote(extra: Record<string, string> = {}, photos = 0) {
  const form = new FormData();
  const fields = {
    name: 'Jane Customer',
    email: 'jane@example.com',
    phone: '843-555-2345',
    street: '1 King St',
    city: 'Charleston',
    state: 'sc',
    zip: '29401',
    serviceType: 'Rust & Paint Removal',
    description: 'Railing',
    ...extra,
  };
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  for (let i = 0; i < photos; i++) form.append('photos', new Blob([PNG], { type: 'image/png' }), `p${i}.png`);
  // A fresh address per request so the per IP rate limit never interferes.
  ip += 1;
  return new Request('http://localhost/api/quote', {
    method: 'POST',
    body: form,
    headers: { 'x-forwarded-for': `10.0.0.${ip}` },
  });
}

async function loadRoute(vercelEnv = 'production') {
  vi.resetModules();
  vi.stubEnv('VERCEL_ENV', vercelEnv);
  vi.stubEnv('RESEND_API_KEY', 're_test');
  return import('@/app/api/quote/route');
}

beforeEach(() => {
  mocks.send.mockResolvedValue({ data: { id: 'email-1' }, error: null });
  mocks.sendSms.mockResolvedValue({ sent: true });
  mocks.saveJobPhotos.mockResolvedValue({ sent: true });
  mocks.appendQuoteRow.mockResolvedValue({
    sent: true,
    jobFolder: { created: true, url: 'https://drive/job', photosFolderId: 'PHOTOS' },
  });
  mocks.afterCallbacks.length = 0;
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
});

afterEach(() => {
  mocks.customerSms = false;
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('POST /api/quote', () => {
  it('passes the optional answers to the sheet', async () => {
    const { POST } = await loadRoute();
    const res = await POST(quote({ howHeard: 'Other: Chamber mixer', referredBy: '  Bob Smith ' }));

    expect(res.status).toBe(200);
    expect(mocks.appendQuoteRow).toHaveBeenCalledWith(
      expect.objectContaining({ howHeard: 'Other: Chamber mixer', referredBy: 'Bob Smith', state: 'SC' }),
    );
  });

  it('never requires the optional answers', async () => {
    const { POST } = await loadRoute();
    const res = await POST(quote());

    expect(res.status).toBe(200);
    expect(mocks.appendQuoteRow).toHaveBeenCalledWith(expect.objectContaining({ howHeard: '', referredBy: '' }));
  });

  it('trims an overlong optional answer instead of refusing the quote', async () => {
    const { POST } = await loadRoute();
    const res = await POST(quote({ referredBy: `line one\r\nline two ${'x'.repeat(500)}` }));

    expect(res.status).toBe(200);
    const sent = mocks.appendQuoteRow.mock.calls[0][0].referredBy as string;
    expect(sent).toHaveLength(120);
    expect(sent.startsWith('line one line two')).toBe(true);
  });

  it('still refuses a quote missing a required field', async () => {
    const { POST } = await loadRoute();
    const res = await POST(quote({ name: '' }));
    expect(res.status).toBe(400);
    expect(mocks.appendQuoteRow).not.toHaveBeenCalled();
  });

  it('copies photos into the job folder after the response', async () => {
    const { POST } = await loadRoute();
    const res = await POST(quote({}, 2));

    expect(res.status).toBe(200);
    expect(mocks.saveJobPhotos).not.toHaveBeenCalled();
    expect(mocks.afterCallbacks).toHaveLength(1);

    await mocks.afterCallbacks[0]();
    expect(mocks.saveJobPhotos).toHaveBeenCalledWith('PHOTOS', [
      expect.objectContaining({ filename: 'photo-1.png' }),
      expect.objectContaining({ filename: 'photo-2.png' }),
    ]);
  });

  it('schedules nothing when there are no photos', async () => {
    const { POST } = await loadRoute();
    await POST(quote());
    expect(mocks.afterCallbacks).toHaveLength(0);
  });

  it('still succeeds when the folder could not be made', async () => {
    mocks.appendQuoteRow.mockResolvedValue({
      sent: true,
      jobFolder: { created: false, reason: 'Exception: Drive is down' },
    });
    const { POST } = await loadRoute();
    const res = await POST(quote({}, 1));

    expect(res.status).toBe(200);
    expect(mocks.afterCallbacks).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Drive is down'));
  });

  it('still succeeds when the sheet is down entirely', async () => {
    mocks.appendQuoteRow.mockResolvedValue({ sent: false, reason: 'Sheet webhook 500' });
    const { POST } = await loadRoute();
    const res = await POST(quote({}, 1));

    expect(res.status).toBe(200);
    expect(mocks.send).toHaveBeenCalled();
  });

  it('a failed photo copy is only logged', async () => {
    mocks.saveJobPhotos.mockResolvedValue({ sent: false, reason: 'Photo upload 500' });
    const { POST } = await loadRoute();
    await POST(quote({}, 1));
    await mocks.afterCallbacks[0]();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Photo upload 500'));
  });

  it('tags every email [TEST] outside production', async () => {
    const { POST } = await loadRoute('preview');
    await POST(quote());

    const subjects = mocks.send.mock.calls.map(([email]) => email.subject as string);
    expect(subjects.length).toBeGreaterThanOrEqual(3);
    expect(subjects.every((subject) => subject.startsWith('[TEST] '))).toBe(true);
  });

  it('never tags production email', async () => {
    const { POST } = await loadRoute('production');
    await POST(quote());

    const subjects = mocks.send.mock.calls.map(([email]) => email.subject as string);
    expect(subjects.some((subject) => subject.includes('[TEST]'))).toBe(false);
  });

  it('sends test notifications to the test address outside production', async () => {
    vi.stubEnv('QUOTE_NOTIFY_TO', 'quotes+test@coastalsurfacerestoration.com');
    const { POST } = await loadRoute('preview');
    await POST(quote());

    const toTyler = mocks.send.mock.calls.map(([email]) => email.to).filter((to) => to !== 'jane@example.com');
    expect(toTyler).toEqual(['quotes+test@coastalsurfacerestoration.com', 'quotes+test@coastalsurfacerestoration.com']);
  });

  it('ignores the test address in production', async () => {
    vi.stubEnv('QUOTE_NOTIFY_TO', 'quotes+test@coastalsurfacerestoration.com');
    const { POST } = await loadRoute('production');
    await POST(quote());

    const recipients = mocks.send.mock.calls.map(([email]) => email.to);
    expect(recipients).not.toContain('quotes+test@coastalsurfacerestoration.com');
    expect(recipients).toContain('quotes@coastalsurfacerestoration.com');
  });

  it('normalizes messy contact details before storing them', async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      quote({
        name: '  Jane​   Customer ',
        email: ' Mailto:Jane.Customer @Example.COM. ',
        phone: '+1 (843) 555.2345',
        street: ' 12   King  St ',
        city: ' North   Charleston ',
        state: ' sc ',
        zip: '29401-1234',
        description: 'Line one   \r\n\r\n\r\n\r\nLine two­',
      }),
    );

    expect(res.status).toBe(200);
    expect(mocks.appendQuoteRow).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane Customer',
        email: 'jane.customer@example.com',
        phone: '843-555-2345',
        street: '12 King St',
        city: 'North Charleston',
        state: 'SC',
        zip: '29401',
        description: 'Line one\n\nLine two',
      }),
    );
  });

  it('still refuses details that are wrong rather than messy', async () => {
    const { POST } = await loadRoute();
    expect((await POST(quote({ phone: '555-2345' }))).status).toBe(400);
    expect((await POST(quote({ email: 'jane at example' }))).status).toBe(400);
    expect((await POST(quote({ zip: '2940' }))).status).toBe(400);
    expect((await POST(quote({ name: '​ ​' }))).status).toBe(400);
  });

  it('refuses an email domain that cannot receive mail, before sending anything', async () => {
    const { POST } = await loadRoute();
    const res = await POST(quote({ email: 'jane@no-mail.invalid' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/after the @/);
    expect(mocks.send).not.toHaveBeenCalled();
    expect(mocks.appendQuoteRow).not.toHaveBeenCalled();
  });

  it('adds the optional unit to the street everywhere', async () => {
    const { POST } = await loadRoute();
    await POST(quote({ street2: '  Apt   4B ' }));
    expect(mocks.appendQuoteRow).toHaveBeenCalledWith(expect.objectContaining({ street: '1 King St, Apt 4B' }));
  });

  it('checks the street itself before adding the unit', async () => {
    const { POST } = await loadRoute();
    const res = await POST(quote({ street: 'King St', street2: 'Apt 4' }));
    expect(res.status).toBe(400);
  });

  it('rate limits in production', async () => {
    const { POST } = await loadRoute('production');
    const sameIp = () => {
      const req = quote();
      req.headers.set('x-forwarded-for', '10.9.9.9');
      return req;
    };
    const statuses = [];
    for (let i = 0; i < 4; i++) statuses.push((await POST(sameIp())).status);
    expect(statuses).toEqual([200, 200, 200, 429]);
  });

  it('does not rate limit previews, so tests can be rerun', async () => {
    const { POST } = await loadRoute('preview');
    const statuses = [];
    for (let i = 0; i < 5; i++) {
      const req = quote();
      req.headers.set('x-forwarded-for', '10.8.8.8');
      statuses.push((await POST(req)).status);
    }
    expect(statuses.every((status) => status === 200)).toBe(true);
  });

  it('tells the customer late October', async () => {
    const { POST } = await loadRoute();
    await POST(quote());

    const ack = mocks.send.mock.calls.find(([email]) => email.to === 'jane@example.com')?.[0];
    expect(ack.text).toContain('late October 2026');
    expect(ack.html).toContain('late October 2026');
  });

  describe('customer confirmation text', () => {
    const CONFIRMATION = /received your quote request.*Reply STOP to opt out, HELP for help\./;
    const textsTo = (phone: string) =>
      mocks.sendSms.mock.calls.filter(([to]) => to === phone).map(([, body]) => body as string);

    it('goes out when the box is checked and customer texts are on', async () => {
      mocks.customerSms = true;
      const { POST } = await loadRoute();
      expect((await POST(quote({ smsConsent: 'yes' }))).status).toBe(200);
      expect(textsTo('843-555-2345')).toEqual([expect.stringMatching(CONFIRMATION)]);
    });

    it('does not go out when the box is unchecked', async () => {
      mocks.customerSms = true;
      const { POST } = await loadRoute();
      expect((await POST(quote())).status).toBe(200);
      expect(textsTo('843-555-2345')).toEqual([]);
    });

    it('does not go out when customer texts are off, even with consent', async () => {
      const { POST } = await loadRoute();
      await POST(quote({ smsConsent: 'yes' }));
      expect(textsTo('843-555-2345')).toEqual([]);
    });

    it('treats anything but "yes" as no consent', async () => {
      mocks.customerSms = true;
      const { POST } = await loadRoute();
      await POST(quote({ smsConsent: 'false' }));
      await POST(quote({ smsConsent: 'on' }));
      expect(textsTo('843-555-2345')).toEqual([]);
    });
  });
});
