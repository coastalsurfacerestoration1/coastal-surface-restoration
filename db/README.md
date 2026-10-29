# Database pieces the website owns

The schema belongs to the csr-field repo. This folder holds only what the
website needs to write its copy of each quote (Phase 3 dual-write), and a
snapshot of csr-field's migrations so the tests run the real schema.

- `migrations/0014_site_ingest.sql`: the write path. Adds the 0002 columns if
  missing (`sheet_timestamp`, `submission_id`), plus `sheet_job_no`, `source`,
  the roles `csr_site_ingest` and `csr_site_reconcile`, and one function each.
  Numbered after csr-field's last applied migration (0013). Copy it into
  csr-field's `supabase/migrations/` when that repo is next touched.
- `csr-field-snapshot/`: csr-field `origin/main` at `5e2153a` (0001, 0003 to
  0013, test stubs) and `0002_quote_request_keys.sql` from branch
  `backfill-v1` at `1293e84`. Test fixtures only; never applied from here.
  Refresh when csr-field adds a migration that touches `quote_requests` or
  `contacts`.

Tests: `tests/site-ingest.test.ts` runs every snapshot migration in PGlite,
then 0014, and checks the function and the role lockdown.

## Applying 0014

Run as `postgres` (Supabase SQL editor, or a direct connection). It is one
transaction and safe to run twice.

### Before

```sql
select
  (select count(*) from public.quote_requests)                                   as quote_requests,
  (select count(*) from public.contacts)                                         as contacts,
  (select count(*) from pg_tables where schemaname = 'public')                   as public_tables,
  (select count(*) from pg_policies where schemaname = 'public')                 as policies,
  (select string_agg(column_name, ', ' order by column_name) from information_schema.columns
     where table_schema = 'public' and table_name = 'quote_requests')            as quote_request_columns,
  (select coalesce(string_agg(rolname, ', '), 'none') from pg_roles where rolname like 'csr_site%') as site_roles,
  (select rolbypassrls or rolsuper from pg_roles where rolname = current_user)   as runner_bypasses_rls;
```

`runner_bypasses_rls` must be `true`, or 0014 refuses to install.

### Apply

Paste `migrations/0014_site_ingest.sql` and run it.

### After

The before query again: row counts, table and policy counts unchanged;
`quote_request_columns` gains `sheet_job_no` and `source` (and
`sheet_timestamp`, `submission_id` if 0002 had not run); `site_roles` lists
both roles. Then:

```sql
-- Each role can call exactly one function. Expect two rows.
select r.rolname, n.nspname || '.' || p.proname as can_execute
from pg_roles r cross join pg_proc p join pg_namespace n on n.oid = p.pronamespace
where r.rolname in ('csr_site_ingest', 'csr_site_reconcile')
  and n.nspname not in ('pg_catalog', 'information_schema')
  and has_schema_privilege(r.oid, n.oid, 'USAGE')
  and has_function_privilege(r.oid, p.oid, 'EXECUTE')
order by 1, 2;

-- No table access at all. Expect zero rows.
select r.rolname, n.nspname || '.' || c.relname as table_access
from pg_roles r cross join pg_class c join pg_namespace n on n.oid = c.relnamespace
where r.rolname in ('csr_site_ingest', 'csr_site_reconcile')
  and c.relkind in ('r', 'v', 'm', 'p', 'f')
  and n.nspname not in ('pg_catalog', 'information_schema')
  and has_schema_privilege(r.oid, n.oid, 'USAGE')
  and (has_table_privilege(r.oid, c.oid, 'SELECT') or has_table_privilege(r.oid, c.oid, 'INSERT')
    or has_table_privilege(r.oid, c.oid, 'UPDATE') or has_table_privilege(r.oid, c.oid, 'DELETE'));
```

### Passwords (by hand, after the migration)

The roles are created without a login. Run this once per role in the SQL
editor. The new password shows once in the output and is not in the query
text, so it is not in the editor's history.

```sql
do $$ declare p text := encode(extensions.gen_random_bytes(24), 'hex');
begin execute format('alter role csr_site_ingest login password %L', p); raise notice 'csr_site_ingest password: %', p; end $$;
```

Same with `csr_site_reconcile`. The site connects through the transaction
pooler (port 6543) with user `csr_site_ingest.<project ref>`:

```
postgresql://csr_site_ingest.<project ref>:<password>@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Copy the pooler host from Connect > Transaction pooler in the dashboard if it
differs.

## Environment variables (server only, never NEXT_PUBLIC_)

| Name | Production | Preview, Development |
|---|---|---|
| `SUPABASE_INGEST_URL` | csr-field, as `csr_site_ingest` | csr-test, as `csr_site_ingest` |
| `SUPABASE_RECONCILE_URL` | csr-field, as `csr_site_reconcile` | csr-test, as `csr_site_reconcile` |
| `CRON_SECRET` | random, 32+ characters | random (for the end-to-end test) |
| `QUOTE_SHEET_ID` | live Quote Requests Log id | TEST sheet id |
| `GOOGLE_SHEETS_READER_KEY` | service account JSON, base64 | same account |

Outside Production the site refuses a csr-field URL, so a pasted mistake
cannot send test quotes to the live table. Unset `SUPABASE_INGEST_URL` turns
the copy off without touching the sheet path.
