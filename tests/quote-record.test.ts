import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { QuoteRow } from '@/lib/notify';

const mocks = vi.hoisted(() => ({
  appendQuoteRow: vi.fn(),
  ingestQuote: vi.fn(),
  afterCallbacks: [] as (() => Promise<void>)[],
  order: [] as string[],
}));

vi.mock('@/lib/notify', () => ({ appendQuoteRow: mocks.appendQuoteRow }));
vi.mock('next/server', () => ({
  after: (cb: () => Promise<void>) => mocks.afterCallbacks.push(cb),
}));
vi.mock('@/lib/supabase-ingest', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/supabase-ingest')>()),
  ingestQuote: mocks.ingestQuote,
}));

import { recordQuote } from '@/lib/quote-record';
import { buildIngestPayload, ingestTarget, CSR_FIELD_PROJECT_REF } from '@/lib/supabase-ingest';

const { ingestQuote: realIngest } = await vi.importActual<typeof import('@/lib/supabase-ingest')>('@/lib/supabase-ingest');

const ROW: QuoteRow = {
  timestamp: '2026-10-28T15:04:05.678Z',
  name: 'Jane Customer',
  email: 'jane@example.com',
  phone: '843-555-2345',
  street: '1 King St',
  city: 'Charleston',
  state: 'SC',
  zip: '29401',
  service: 'Rust removal on metal',
  description: 'Railing',
  photos: 1,
  smsConsent: true,
  outOfArea: false,
  spamFlag: false,
  howHeard: 'Google',
  referredBy: '',
};
const ID = '0b9d1d4e-5c1f-4a8e-9a55-0f7c9d2a1b3c';

beforeEach(() => {
  mocks.afterCallbacks.length = 0;
  mocks.order.length = 0;
  mocks.appendQuoteRow.mockImplementation(async () => {
    mocks.order.push('sheet');
    return { sent: true };
  });
  mocks.ingestQuote.mockImplementation(async () => {
    mocks.order.push('supabase');
    return { sent: true, id: 'x', duplicate: false };
  });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('recordQuote', () => {
  it('writes the sheet row first, unchanged and without the id, and copies to Supabase after the response', async () => {
    const result = await recordQuote({ ...ROW, submissionId: ID }, 'in');

    expect(result).toEqual({ sent: true });
    expect(mocks.appendQuoteRow).toHaveBeenCalledWith(ROW);
    // Nothing has gone to Supabase yet: it waits for after().
    expect(mocks.ingestQuote).not.toHaveBeenCalled();
    expect(mocks.afterCallbacks).toHaveLength(1);

    await mocks.afterCallbacks[0]();
    expect(mocks.order).toEqual(['sheet', 'supabase']);
    const sent = mocks.ingestQuote.mock.calls[0][0];
    expect(sent.submission_id).toBe(ID);
    expect(sent.sheet_timestamp).toBe(ROW.timestamp);
  });

  it('a Supabase failure changes nothing the route sees', async () => {
    mocks.ingestQuote.mockResolvedValue({ sent: false, reason: 'down' });
    const result = await recordQuote({ ...ROW, submissionId: ID }, 'in');
    await expect(mocks.afterCallbacks[0]()).resolves.toBeUndefined();
    expect(result).toEqual({ sent: true });
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(`Quote not copied to Supabase (${ID}): down`));
  });

  it('still copies when the sheet write failed, and says so in the copy', async () => {
    mocks.appendQuoteRow.mockResolvedValue({ sent: false, reason: 'Sheet webhook 500' });
    const result = await recordQuote({ ...ROW, submissionId: ID }, 'in');
    await mocks.afterCallbacks[0]();
    expect(result).toEqual({ sent: false, reason: 'Sheet webhook 500' });
    expect(mocks.ingestQuote.mock.calls[0][0].sheet).toBe('failed: Sheet webhook 500');
  });
});

describe('buildIngestPayload', () => {
  it('sends exactly the keys the database function accepts', () => {
    const sql = readFileSync(path.resolve(__dirname, '../db/migrations/0014_site_ingest.sql'), 'utf8');
    const list = /allowed constant text\[\] := array\[([^\]]+)\]/.exec(sql)![1];
    const allowed = [...list.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort();
    expect(Object.keys(buildIngestPayload(ROW, ID, 'in', { sent: true })).sort()).toEqual(allowed);
  });

  it('leaves texting consent out', () => {
    const p = buildIngestPayload(ROW, ID, 'in', { sent: true });
    expect(JSON.stringify(p)).not.toMatch(/consent/i);
  });

  it.each([
    ['in', 'in', false, ''],
    ['unknown', 'unknown', true, 'yes'],
    ['near', 'near', 'blocked, 22 mi from West Ashley', 'blocked, 22 mi from West Ashley'],
    ['far', 'out', 'dropped, 56 mi', 'dropped, 56 mi'],
  ] as const)('maps area %s and the out-of-area note', (verdict, area, outOfArea, note) => {
    const p = buildIngestPayload({ ...ROW, outOfArea }, ID, verdict, { sent: true });
    expect(p.area).toBe(area);
    expect(p.out_of_area).toBe(note);
  });
});

describe('ingestTarget', () => {
  const testUrl = 'postgresql://csr_site_ingest.abcdefghijklmnopqrst:pw@aws-0-us-east-1.pooler.supabase.com:6543/postgres';
  const liveUrl = `postgresql://csr_site_ingest.${CSR_FIELD_PROJECT_REF}:pw@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

  it('is off when the URL is not set', () => {
    expect(ingestTarget({ VERCEL_ENV: 'production' })).toEqual({ refused: 'SUPABASE_INGEST_URL is not set' });
  });

  it.each(['preview', 'development', undefined])('refuses csr-field outside Production (%s)', (env) => {
    expect(ingestTarget({ VERCEL_ENV: env, SUPABASE_INGEST_URL: liveUrl })).toHaveProperty('refused');
  });

  it('lets Production write to csr-field and previews to csr-test', () => {
    expect(ingestTarget({ VERCEL_ENV: 'production', SUPABASE_INGEST_URL: liveUrl })).toEqual({ url: liveUrl });
    expect(ingestTarget({ VERCEL_ENV: 'preview', SUPABASE_INGEST_URL: testUrl })).toEqual({ url: testUrl });
  });
});

describe('ingestQuote', () => {
  const payload = buildIngestPayload(ROW, ID, 'in', { sent: true });

  it('returns the row id on success', async () => {
    const r = await realIngest(payload, { run: async () => ({ id: 'row-1', duplicate: false }) });
    expect(r).toEqual({ sent: true, id: 'row-1', duplicate: false });
  });

  it('turns a database error into a result, never a throw, and keeps credentials out of the log line', async () => {
    const r = await realIngest(payload, {
      run: async () => {
        throw Object.assign(new Error('connect failed postgresql://u:secret@host/db'), { code: '28P01' });
      },
    });
    expect(r).toEqual({ sent: false, reason: '28P01 connect failed [url]' });
  });

  it('gives up at the timeout even if the database never answers', async () => {
    const started = Date.now();
    const r = await realIngest(payload, { run: () => new Promise(() => {}), timeoutMs: 200 });
    expect(r).toEqual({ sent: false, reason: 'timed out after 200 ms' });
    expect(Date.now() - started).toBeLessThan(1000);
  });

  it('does not connect at all without a URL', async () => {
    expect(await realIngest(payload, { env: {} })).toEqual({ sent: false, reason: 'SUPABASE_INGEST_URL is not set' });
  });
});
