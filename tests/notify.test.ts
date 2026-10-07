import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appendQuoteRow, saveJobPhotos, toE164, type QuoteRow } from '@/lib/notify';

const WEBHOOK = 'https://script.google.com/macros/s/abc/exec';

const row: QuoteRow = {
  timestamp: '2026-10-07T00:00:00.000Z',
  name: 'Jane Customer',
  email: 'jane@example.com',
  phone: '843-555-2345',
  street: '1 King St',
  city: 'Charleston',
  state: 'SC',
  zip: '29401',
  service: 'Rust & Paint Removal',
  description: 'Railing',
  photos: 2,
  smsConsent: true,
  outOfArea: false,
  spamFlag: false,
  howHeard: 'Referral',
  referredBy: 'Bob',
};

const fetchMock = vi.fn();

function replyWith(text: string, status = 200) {
  fetchMock.mockResolvedValueOnce(new Response(text, { status }));
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('QUOTE_SHEET_WEBHOOK_URL', WEBHOOK);
  vi.stubEnv('QUOTE_SHEET_SECRET', 's3cret');
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('appendQuoteRow', () => {
  it('sends the new optional fields and the flags in sheet form', async () => {
    replyWith('ok');
    await appendQuoteRow({ ...row, spamFlag: true, outOfArea: true });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({
      secret: 's3cret',
      howHeard: 'Referral',
      referredBy: 'Bob',
      smsConsent: 'yes',
      outOfArea: 'yes',
      spamFlag: 'flagged',
    });
  });

  it('accepts a bare ok from an older script and says the folder report is missing', async () => {
    replyWith('ok');
    const result = await appendQuoteRow(row);
    expect(result.sent).toBe(true);
    expect(result.jobFolder).toEqual({ created: false, reason: expect.stringContaining('no folder report') });
  });

  it('reads the job folder from the second line', async () => {
    replyWith('ok\n{"jobFolderUrl":"https://drive/x","photosFolderId":"P1"}');
    const result = await appendQuoteRow(row);
    expect(result).toEqual({
      sent: true,
      jobFolder: { created: true, url: 'https://drive/x', photosFolderId: 'P1' },
    });
  });

  it('still counts the row as written when the folder failed', async () => {
    replyWith('ok\n{"folderError":"Exception: Drive is down"}');
    const result = await appendQuoteRow(row);
    expect(result.sent).toBe(true);
    expect(result.jobFolder).toEqual({ created: false, reason: 'Exception: Drive is down' });
  });

  it('survives a garbled folder report', async () => {
    replyWith('ok\nnot json');
    const result = await appendQuoteRow(row);
    expect(result.sent).toBe(true);
    expect(result.jobFolder?.created).toBe(false);
  });

  it('treats forbidden as a failure even with a 200', async () => {
    replyWith('forbidden');
    expect((await appendQuoteRow(row)).sent).toBe(false);
  });

  it('reports a non 200', async () => {
    replyWith('nope', 500);
    expect(await appendQuoteRow(row)).toEqual({ sent: false, reason: 'Sheet webhook 500' });
  });

  it('never throws on a network error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('ECONNRESET'));
    const result = await appendQuoteRow(row);
    expect(result.sent).toBe(false);
    expect(result.reason).toContain('ECONNRESET');
  });

  it('refuses a URL that is not a deployed web app', async () => {
    vi.stubEnv('QUOTE_SHEET_WEBHOOK_URL', 'https://script.google.com/macros/s/abc');
    expect((await appendQuoteRow(row)).sent).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('says so when it is not configured', async () => {
    vi.stubEnv('QUOTE_SHEET_SECRET', '');
    expect(await appendQuoteRow(row)).toEqual({ sent: false, reason: 'Quote sheet is not configured' });
  });
});

describe('saveJobPhotos', () => {
  const photos = [
    { filename: 'photo-1.jpg', content: 'AAAA' },
    { filename: 'photo-2.png', content: 'BBBB' },
    { filename: 'photo-3.webp', content: 'CCCC' },
  ];

  it('posts the photos action with prefixed names and the right types', async () => {
    replyWith('ok\n{"saved":3}');
    expect(await saveJobPhotos('P1', photos)).toEqual({ sent: true });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.action).toBe('photos');
    expect(body.folderId).toBe('P1');
    expect(body.photos).toEqual([
      { filename: 'quote-photo-1.jpg', mimeType: 'image/jpeg', content: 'AAAA' },
      { filename: 'quote-photo-2.png', mimeType: 'image/png', content: 'BBBB' },
      { filename: 'quote-photo-3.webp', mimeType: 'image/webp', content: 'CCCC' },
    ]);
  });

  it('reports a script error', async () => {
    replyWith('error: Exception: no such folder');
    const result = await saveJobPhotos('P1', photos);
    expect(result.sent).toBe(false);
    expect(result.reason).toContain('no such folder');
  });

  it('never throws on a network error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('timeout'));
    expect((await saveJobPhotos('P1', photos)).sent).toBe(false);
  });
});

describe('toE164', () => {
  it('formats US numbers', () => {
    expect(toE164('843-555-2345')).toBe('+18435552345');
    expect(toE164('1 (843) 555-2345')).toBe('+18435552345');
    expect(toE164('555-2345')).toBeNull();
  });
});
