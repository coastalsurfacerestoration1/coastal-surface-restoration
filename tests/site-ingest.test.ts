// Runs csr-field's real migrations (db/csr-field-snapshot) and then 0014 in PGlite, and proves the website's
// write path: the ingest function validates and stores, never writes consent, and its two roles can call one
// function each and touch nothing else.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { beforeAll, describe, expect, it } from 'vitest';
import { fingerprint } from '@/lib/reconcile';

const root = path.resolve(__dirname, '..');
const snapshot = path.join(root, 'db/csr-field-snapshot');
const MIGRATION = readFileSync(path.join(root, 'db/migrations/0014_site_ingest.sql'), 'utf8');

let db: PGlite;

async function as<T = Record<string, unknown>>(role: string, sql: string, params: unknown[] = []) {
  await db.exec('reset role');
  if (role !== 'postgres') await db.exec(`set role ${role}`);
  try {
    return (await db.query<T>(sql, params)).rows;
  } finally {
    await db.exec('reset role');
  }
}

let n = 0;
/** A valid payload, unique per call. */
function payload(over: Record<string, unknown> = {}) {
  n += 1;
  const ms = String(n).padStart(3, '0');
  return {
    submission_id: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
    sheet_timestamp: `2026-10-28T15:00:00.${ms}Z`,
    name: 'Dana Example',
    email: `dana${n}@example.com`,
    phone: `843-555-${String(1000 + n).slice(-4)}`,
    street: '12 Test St',
    city: 'Charleston',
    state: 'SC',
    zip: '29401',
    service: 'Rust removal on metal',
    description: 'Rusty gate.',
    photos: 2,
    area: 'in',
    out_of_area: '',
    spam: false,
    how_heard: 'Google',
    referred_by: '',
    sheet: 'ok',
    ...over,
  };
}

const ingest = (p: unknown, role = 'csr_site_ingest') =>
  as<{ r: { ok: boolean; id: string; duplicate: boolean } }>(role, 'select public.ingest_quote_request($1::jsonb) as r', [
    JSON.stringify(p),
  ]).then((rows) => rows[0].r);

beforeAll(async () => {
  db = new PGlite();
  await db.exec(readFileSync(path.join(snapshot, 'supabase-stubs.sql'), 'utf8'));
  // Every csr-field migration in order, 0002 included, then ours.
  for (const f of readdirSync(snapshot).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort()) {
    await db.exec(readFileSync(path.join(snapshot, f), 'utf8'));
  }
  await db.exec(MIGRATION);
}, 120_000);

describe('0014 migration', () => {
  it('runs a second time without error (idempotent)', async () => {
    await db.exec(MIGRATION);
  });

  it('also applies on a database where 0002 never ran', async () => {
    const fresh = new PGlite();
    await fresh.exec(readFileSync(path.join(snapshot, 'supabase-stubs.sql'), 'utf8'));
    for (const f of readdirSync(snapshot).filter((f) => /^\d{4}_.*\.sql$/.test(f) && !f.startsWith('0002')).sort()) {
      await fresh.exec(readFileSync(path.join(snapshot, f), 'utf8'));
    }
    await fresh.exec(MIGRATION);
    const cols = await fresh.query<{ column_name: string }>(
      `select column_name from information_schema.columns where table_name = 'quote_requests'
         and column_name in ('sheet_timestamp', 'submission_id', 'sheet_job_no', 'source') order by 1`,
    );
    expect(cols.rows.map((r) => r.column_name)).toEqual(['sheet_job_no', 'sheet_timestamp', 'source', 'submission_id']);
    await fresh.close();
  }, 120_000);
});

describe('ingest_quote_request', () => {
  it('stores a valid quote with both ids exactly as sent, and makes a lead contact', async () => {
    const p = payload();
    const r = await ingest(p);
    expect(r).toMatchObject({ ok: true, duplicate: false });
    const [row] = await as<Record<string, unknown>>(
      'postgres',
      `select q.*, c.first_name, c.last_name, c.phone as c_phone, c.type, c.source as c_source,
              c.sms_opt_in, c.email_ok
         from public.quote_requests q left join public.contacts c on c.id = q.contact_id where q.id = $1`,
      [r.id],
    );
    expect(row.submission_id).toBe(p.submission_id);
    expect(row.sheet_timestamp).toBe(p.sheet_timestamp);
    expect(new Date(row.received_at as string).toISOString()).toBe(p.sheet_timestamp);
    expect(row.source).toBe('form');
    expect(row.phone).toBe(`+1${p.phone.replace(/\D/g, '')}`);
    expect(row.address).toBe('12 Test St, Charleston, SC 29401');
    expect(row.service_area_result).toBe('in');
    expect(row.status).toBe('new');
    expect(row.first_name).toBe('Dana');
    expect(row.last_name).toBe('Example');
    expect(row.type).toBe('lead');
    expect(row.c_source).toBe('website');
    expect(row.sms_opt_in).toBe(false);
    expect(row.email_ok).toBe(false);
    expect(row.raw_payload).toEqual({
      city: 'Charleston', state: 'SC', zip: '29401', photos: 2, spam: false, how_heard: 'Google', sheet: 'ok',
    });
  });

  it('a duplicate submission_id returns the first row and changes nothing', async () => {
    const p = payload();
    const first = await ingest(p);
    const again = await ingest({ ...p, description: 'changed', sheet_timestamp: '2026-10-28T16:00:00.000Z' });
    expect(again).toEqual({ ok: true, id: first.id, duplicate: true });
    const rows = await as<{ description: string; c: number }>(
      'postgres',
      'select description, count(*) over ()::int as c from public.quote_requests where submission_id = $1',
      [p.submission_id],
    );
    expect(rows).toEqual([{ description: 'Rusty gate.', c: 1 }]);
  });

  it('refuses a payload with neither email nor phone', async () => {
    await expect(ingest(payload({ email: '', phone: '' }))).rejects.toThrow(/email or phone is required/);
  });

  it('accepts email only or phone only', async () => {
    await expect(ingest(payload({ phone: '' }))).resolves.toMatchObject({ ok: true });
    await expect(ingest(payload({ email: '' }))).resolves.toMatchObject({ ok: true });
  });

  it.each([
    ['not an object', [1, 2]],
    ['null', null],
    ['unknown key', { extra: 1 }],
    ['bad uuid', { submission_id: 'nope' }],
    ['missing uuid', { submission_id: undefined }],
    ['timestamp without ms', { sheet_timestamp: '2026-10-28T15:00:00Z' }],
    ['timestamp as a date', { sheet_timestamp: '10/28/2026' }],
    ['empty name', { name: '  ' }],
    ['long name', { name: 'x'.repeat(121) }],
    ['bad email', { email: 'dana@' }],
    ['non-US phone', { phone: '+44 20 7946 0958' }],
    ['bad area', { area: 'far' }],
    ['spam as text', { spam: 'yes' }],
    ['photos as text', { photos: '2' }],
    ['photos too many', { photos: 99 }],
    ['description as number', { description: 5 }],
    ['oversized', { description: 'x'.repeat(70000) }],
  ])('refuses malformed input: %s', async (_label, over) => {
    const p = Array.isArray(over) || over === null ? over : payload(over as Record<string, unknown>);
    await expect(ingest(p)).rejects.toThrow();
  });

  it('a refused payload writes nothing', async () => {
    const before = await as<{ c: number }>('postgres', 'select count(*)::int as c from public.quote_requests');
    await expect(ingest(payload({ email: '', phone: '' }))).rejects.toThrow();
    const after = await as<{ c: number }>('postgres', 'select count(*)::int as c from public.quote_requests');
    expect(after[0].c).toBe(before[0].c);
  });

  it('blanks free text that looks like an ID or card number instead of losing the row', async () => {
    const r = await ingest(payload({ description: 'My card is 4111 1111 1111 1111', referred_by: 'DOB 1/1/80' }));
    const [row] = await as<{ description: string; raw_payload: { referred_by: string } }>(
      'postgres', 'select description, raw_payload from public.quote_requests where id = $1', [r.id]);
    expect(row.description).toMatch(/^\[removed/);
    expect(row.raw_payload.referred_by).toMatch(/^\[removed/);
  });

  it('spam is stored as spam, with no contact', async () => {
    const r = await ingest(payload({ spam: true }));
    const [row] = await as<{ status: string; contact_id: string | null }>(
      'postgres', 'select status, contact_id from public.quote_requests where id = $1', [r.id]);
    expect(row).toEqual({ status: 'spam', contact_id: null });
  });

  it('past 50 miles is stored, with no contact', async () => {
    const r = await ingest(payload({ area: 'out', out_of_area: 'dropped, 80 mi' }));
    const [row] = await as<{ service_area_result: string; contact_id: string | null }>(
      'postgres', 'select service_area_result, contact_id from public.quote_requests where id = $1', [r.id]);
    expect(row).toEqual({ service_area_result: 'out', contact_id: null });
  });

  const contactOf = (id: string) =>
    as<{ contact_id: string | null }>('postgres', 'select contact_id from public.quote_requests where id = $1', [id])
      .then((r) => r[0].contact_id);

  it('links to an existing contact only when phone and email both match, and changes nothing on it', async () => {
    await as('postgres', `insert into public.contacts (first_name, phone, email, type, sms_opt_in, sms_opt_in_at,
        sms_opt_in_proof, email_ok, notes, address)
      values ('Known', '+18435559000', 'known@example.com', 'client', true, now(), 'texted first', true, 'keep me', null)`);
    const before = await as<Record<string, unknown>>('postgres', `select * from public.contacts where phone = '+18435559000'`);
    const r = await ingest(payload({ phone: '(843) 555-9000', email: 'KNOWN@example.com' }));
    const after = await as<Record<string, unknown>>('postgres', `select * from public.contacts where phone = '+18435559000'`);
    expect(await contactOf(r.id)).toBe(before[0].id);
    // Not even the blank address is filled in.
    expect(after[0]).toEqual(before[0]);
  });

  it('a stranger cannot attach their email to a customer found by phone', async () => {
    await as('postgres', `insert into public.contacts (first_name, phone) values ('Customer', '+18435558100')`);
    const r = await ingest(payload({ phone: '843-555-8100', email: 'attacker@example.com' }));
    const [c] = await as<{ email: string | null }>('postgres', `select email from public.contacts where phone = '+18435558100'`);
    expect(c.email).toBeNull();
    expect(await contactOf(r.id)).toBeNull();
    // And no second contact was made for the attacker either.
    const [n] = await as<{ n: number }>('postgres', `select count(*)::int as n from public.contacts where email = 'attacker@example.com'`);
    expect(n.n).toBe(0);
  });

  it('a stranger cannot attach their phone to a customer found by email', async () => {
    await as('postgres', `insert into public.contacts (first_name, email, type) values ('Vendor', 'vendor@example.com', 'vendor')`);
    const r = await ingest(payload({ phone: '843-555-8200', email: 'vendor@example.com' }));
    const [c] = await as<{ phone: string | null; type: string }>('postgres', `select phone, type from public.contacts where email = 'vendor@example.com'`);
    expect(c).toEqual({ phone: null, type: 'vendor' });
    expect(await contactOf(r.id)).toBeNull();
  });

  it('a quote with only a known phone, or only a known email, is stored but not linked', async () => {
    await as('postgres', `insert into public.contacts (first_name, phone, email) values ('Both', '+18435558300', 'both@example.com')`);
    const phoneOnly = await ingest(payload({ phone: '843-555-8300', email: '' }));
    const emailOnly = await ingest(payload({ phone: '', email: 'both@example.com' }));
    expect(await contactOf(phoneOnly.id)).toBeNull();
    expect(await contactOf(emailOnly.id)).toBeNull();
  });

  it('a name that looks like an ID number never reaches contacts', async () => {
    const r = await ingest(payload({ name: '123-45-6789', email: 'idname@example.com', phone: '843-555-8400' }));
    expect(await contactOf(r.id)).toBeNull();
    const [q] = await as<{ name: string }>('postgres', 'select name from public.quote_requests where id = $1', [r.id]);
    expect(q.name).toMatch(/^\[removed/);
    const [n] = await as<{ n: number }>('postgres', `select count(*)::int as n from public.contacts where email = 'idname@example.com'`);
    expect(n.n).toBe(0);
  });

  it('two quotes in the same millisecond are both kept; the second under a tagged copy', async () => {
    const a = payload();
    const b = payload({ sheet_timestamp: a.sheet_timestamp });
    const ra = await ingest(a);
    const rb = await ingest(b);
    expect(rb).toMatchObject({ ok: true, duplicate: false });
    const rows = await as<{ id: string; sheet_timestamp: string }>(
      'postgres', 'select id, sheet_timestamp from public.quote_requests where id = any($1::uuid[]) order by sheet_timestamp', [[ra.id, rb.id]]);
    expect(rows.map((r) => r.sheet_timestamp)).toEqual([a.sheet_timestamp, `${a.sheet_timestamp}#${b.submission_id.slice(0, 8)}`]);
  });

  it('accepts a full-length description in a multi-byte script', async () => {
    await expect(ingest(payload({ description: '\u{1F527}'.repeat(4000) }))).resolves.toMatchObject({ ok: true });
  });


  it('no consent column is ever set by an ingest', async () => {
    const [c] = await as<{ n: number }>('postgres', `select count(*)::int as n from public.contacts
      where source = 'website' and (sms_opt_in or email_ok or sms_opt_in_at is not null or texted_first_at is not null)`);
    expect(c.n).toBe(0);
  });
});

describe('reconcile_quote_requests', () => {
  it('returns timestamps and fingerprints only, for website rows in the window', async () => {
    const p = payload({ name: ' Fin Print ', email: 'FP@Example.com', phone: '843-555-7777', service: 'Rust removal on metal' });
    await ingest(p);
    const rows = await as<{ sheet_timestamp: string; submission_id: string; fingerprint: string }>(
      'csr_site_reconcile',
      `select * from public.reconcile_quote_requests('2026-10-28T00:00:00Z', '2026-10-29T00:00:00Z')`,
    );
    const mine = rows.find((r) => r.submission_id === p.submission_id)!;
    expect(Object.keys(mine).sort()).toEqual(['fingerprint', 'sheet_timestamp', 'submission_id']);
    expect(mine.sheet_timestamp).toBe(p.sheet_timestamp);
    // The site computes the same fingerprint from the sheet row.
    expect(mine.fingerprint).toBe(fingerprint(p));
  });

  it('includes backfilled rows by their column A text, and leaves hand-typed dates out', async () => {
    await as('postgres', `insert into public.quote_requests (name, email, sheet_timestamp, received_at)
      values ('Backfilled', 'b@example.com', '2026-10-28T09:00:00.123Z', now()),
             ('Hand typed', 'h@example.com', '10/28/2026', '2026-10-28T12:00:00Z')`);
    const rows = await as<{ sheet_timestamp: string }>('csr_site_reconcile',
      `select sheet_timestamp from public.reconcile_quote_requests('2026-10-28T00:00:00Z', '2026-10-29T00:00:00Z')`);
    const ts = rows.map((r) => r.sheet_timestamp);
    expect(ts).toContain('2026-10-28T09:00:00.123Z');
    expect(ts).not.toContain('10/28/2026');
  });

  it('refuses a window over 31 days', async () => {
    await expect(as('csr_site_reconcile',
      `select * from public.reconcile_quote_requests('2026-01-01T00:00:00Z', '2026-03-01T00:00:00Z')`)).rejects.toThrow(/31 days/);
  });
});

describe('roles', () => {
  const SYSTEM = `('pg_catalog', 'information_schema', 'pg_toast')`;

  it.each(['csr_site_ingest', 'csr_site_reconcile'])('%s cannot read or write any table directly', async (role) => {
    const rows = await as<{ t: string }>('postgres', `
      select n.nspname || '.' || c.relname as t from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where c.relkind in ('r', 'v', 'm', 'p', 'f') and n.nspname not in ${SYSTEM}
        and has_schema_privilege('${role}', n.oid, 'USAGE')
        and (has_table_privilege('${role}', c.oid, 'SELECT') or has_table_privilege('${role}', c.oid, 'INSERT')
          or has_table_privilege('${role}', c.oid, 'UPDATE') or has_table_privilege('${role}', c.oid, 'DELETE'))`);
    expect(rows).toEqual([]);
    await expect(as(role, 'select * from public.quote_requests')).rejects.toThrow(/permission denied/);
    await expect(as(role, 'select * from public.contacts')).rejects.toThrow(/permission denied/);
    await expect(as(role, `insert into public.quote_requests (name) values ('x')`)).rejects.toThrow(/permission denied/);
    await expect(as(role, `update public.contacts set notes = 'x'`)).rejects.toThrow(/permission denied/);
    await expect(as(role, 'delete from public.quote_requests')).rejects.toThrow(/permission denied/);
  });

  it.each([
    ['csr_site_ingest', 'ingest_quote_request'],
    ['csr_site_reconcile', 'reconcile_quote_requests'],
  ])('%s can call %s and no other app function', async (role, fn) => {
    const rows = await as<{ f: string }>('postgres', `
      select n.nspname || '.' || p.proname as f from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname not in ${SYSTEM}
        and has_schema_privilege('${role}', n.oid, 'USAGE')
        and has_function_privilege('${role}', p.oid, 'EXECUTE')`);
    expect(rows.map((r) => r.f)).toEqual([`public.${fn}`]);
  });

  it('the ingest role cannot call the reconcile function, and the reverse', async () => {
    await expect(as('csr_site_ingest',
      `select * from public.reconcile_quote_requests(now() - interval '1 day', now())`)).rejects.toThrow(/permission denied/);
    await expect(ingest(payload(), 'csr_site_reconcile')).rejects.toThrow(/permission denied/);
  });

  it('anon and authenticated cannot call either function, and anon sees nothing', async () => {
    await expect(ingest(payload(), 'anon')).rejects.toThrow(/permission denied/);
    await expect(ingest(payload(), 'authenticated')).rejects.toThrow(/permission denied/);
    await expect(as('anon', `select * from public.reconcile_quote_requests(now() - interval '1 day', now())`))
      .rejects.toThrow(/permission denied/);
    await expect(as('anon', 'select * from public.quote_requests')).rejects.toThrow(/permission denied/);
    await expect(as('anon', 'select * from public.contacts')).rejects.toThrow(/permission denied/);
  });

  it('the roles cannot log in until a password is set by hand, and do not bypass RLS', async () => {
    const rows = await as<{ rolname: string; rolcanlogin: boolean; rolbypassrls: boolean; rolsuper: boolean }>(
      'postgres', `select rolname, rolcanlogin, rolbypassrls, rolsuper from pg_roles
                   where rolname in ('csr_site_ingest', 'csr_site_reconcile') order by 1`);
    expect(rows).toEqual([
      { rolname: 'csr_site_ingest', rolcanlogin: false, rolbypassrls: false, rolsuper: false },
      { rolname: 'csr_site_reconcile', rolcanlogin: false, rolbypassrls: false, rolsuper: false },
    ]);
  });
});
