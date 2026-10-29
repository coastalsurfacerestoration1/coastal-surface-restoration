import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { describe, expect, it } from 'vitest';
import { SNAPSHOT_CUTOFF, areaFromNote, catchUpReport, catchUpSubmissionId, payloadFromSheetRow, planCatchUp } from '@/lib/catch-up';

const root = path.resolve(__dirname, '..');

/** A sheet row A to S, by position, the way the Sheets API returns it. */
function sheetRow(ts: unknown, over: Record<number, unknown> = {}): unknown[] {
  const r: unknown[] = [ts, 'Jane Customer', 'jane@example.com', '843-555-2345', '1 King St', 'Charleston', 'SC', 29401,
    'Rust removal on metal', 'Railing', 2, 'yes', '', '', '', '', '', 'Google', ''];
  for (const [i, v] of Object.entries(over)) r[Number(i)] = v;
  return r;
}

describe('catchUpSubmissionId', () => {
  it('is a stable uuid per timestamp that the database accepts', () => {
    const a = catchUpSubmissionId('2026-10-24T12:00:00.000Z');
    expect(a).toBe(catchUpSubmissionId('2026-10-24T12:00:00.000Z'));
    expect(a).not.toBe(catchUpSubmissionId('2026-10-24T12:00:00.001Z'));
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});

describe('payloadFromSheetRow', () => {
  it('sends exactly the keys the database accepts, and never column L consent', () => {
    const sql = readFileSync(path.join(root, 'db/migrations/0014_site_ingest.sql'), 'utf8');
    const list = /allowed constant text\[\] := array\[([^\]]+)\]/.exec(sql)![1];
    const allowed = [...list.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort();
    const p = payloadFromSheetRow(sheetRow('2026-10-24T12:00:00.000Z'));
    expect(Object.keys(p).sort()).toEqual(allowed);
    expect(JSON.stringify(p)).not.toMatch(/consent/i);
    expect(p).toMatchObject({ zip: '29401', photos: 2, area: 'in', spam: false, how_heard: 'Google' });
  });

  it.each([
    ['', 'in'],
    ['yes', 'unknown'],
    ['blocked, 22 mi from West Ashley', 'near'],
    ['dropped, 56 mi', 'out'],
  ])('reads area from column M %j', (note, area) => {
    expect(areaFromNote(note)).toBe(area);
  });

  it('reads the spam flag and clamps the photo count', () => {
    const p = payloadFromSheetRow(sheetRow('2026-10-24T12:00:00.000Z', { 10: 40, 13: 'flagged' }));
    expect(p).toMatchObject({ photos: 20, spam: true });
  });
});

describe('planCatchUp', () => {
  const after = '2026-10-24T12:00:00.000Z';
  const before = '2026-10-20T12:00:00.000Z';

  it('sorts rows into insert, already there, older, refused and hand-typed', () => {
    const plan = planCatchUp(
      [
        sheetRow(after),
        sheetRow('2026-10-25T09:30:00.123Z'),
        sheetRow(before),
        sheetRow('2026-10-26T10:00:00.000Z', { 2: '', 3: '' }),
        sheetRow(46000.5, { 1: 'Hand typed lead' }),
        sheetRow('2026-10-27T10:00:00.000Z'),
      ],
      new Set(['2026-10-27T10:00:00.000Z']),
    );
    expect(plan.sheetFormRows).toBe(5);
    expect(plan.alreadyInSupabase).toBe(1);
    expect(plan.toInsert.map((r) => r.payload.sheet_timestamp)).toEqual([after, '2026-10-25T09:30:00.123Z']);
    expect(plan.olderMissing.map((r) => r.payload.sheet_timestamp)).toEqual([before]);
    expect(plan.wouldBeRefused).toEqual([expect.objectContaining({ problem: 'no email and no phone' })]);
    expect(plan.handTyped).toBe(1);
    expect(plan.cutoff).toBe(SNAPSHOT_CUTOFF);
  });

  it('the report says nothing was written and gives the confirm count', () => {
    const plan = planCatchUp([sheetRow(after)], new Set());
    const md = catchUpReport(plan, 'csr-field', new Date('2026-10-29T08:00:00Z'));
    expect(md).toContain('against csr-field. Nothing was written.');
    expect(md).toContain('**Would insert: 1**');
    expect(md).toContain('--apply --confirm 1');
    expect(md).toContain(`| ${after} | Jane Customer | Rust removal on metal | in |  | if no match |`);
    expect(md).not.toMatch(/—/);
  });
});

describe('planned rows through the real ingest function', () => {
  it('are accepted, and a second run inserts nothing new', async () => {
    const db = new PGlite();
    const snap = path.join(root, 'db/csr-field-snapshot');
    await db.exec(readFileSync(path.join(snap, 'supabase-stubs.sql'), 'utf8'));
    for (const f of readdirSync(snap).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort()) {
      await db.exec(readFileSync(path.join(snap, f), 'utf8'));
    }
    await db.exec(readFileSync(path.join(root, 'db/migrations/0014_site_ingest.sql'), 'utf8'));

    const plan = planCatchUp(
      [
        sheetRow('2026-10-24T12:00:00.000Z'),
        sheetRow('2026-10-25T12:00:00.000Z', { 1: 'Far Away', 3: '843-555-0101', 12: 'dropped, 56 mi' }),
        sheetRow('2026-10-26T12:00:00.000Z', { 1: 'Bot', 2: 'bot@example.com', 3: '843-555-0102', 13: 'flagged' }),
      ],
      new Set(),
    );
    const run = async () => {
      const out = [];
      for (const { payload } of plan.toInsert) {
        await db.exec('set role csr_site_ingest');
        const r = await db.query<{ r: { duplicate: boolean } }>('select public.ingest_quote_request($1::jsonb) as r', [JSON.stringify(payload)]);
        await db.exec('reset role');
        out.push(r.rows[0].r.duplicate);
      }
      return out;
    };
    expect(await run()).toEqual([false, false, false]);
    expect(await run()).toEqual([true, true, true]);
    const rows = await db.query<{ n: number; contacts: number }>(
      `select count(*)::int as n, count(contact_id)::int as contacts from public.quote_requests`);
    // Only the normal quote gets a contact; far and spam do not.
    expect(rows.rows[0]).toEqual({ n: 3, contacts: 1 });
    await db.close();
  }, 120_000);
});
