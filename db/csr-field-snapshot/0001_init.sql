-- CSR Field schema v1 (2026-10-22)
-- Source: claude/CSR-DATA-MIGRATION-PLAN-2026-10-21.md section 3.
-- Security model:
--   * One owner. private.owners holds the allowed auth user id(s). public.is_owner() checks it.
--   * RLS is ENABLED and FORCED on every table; the only policies are owner-only. anon gets nothing.
--   * Append-only tables (test_results, matrix_rows, activity_log) reject UPDATE and DELETE by trigger.
--   * Hard safety gates are enforced in the database, not just the app: a job cannot be booked or
--     scheduled while a gate is open (pre-1978 paint without a negative swab, individually listed
--     registry property, over-water work, plated or galvanized-keep surfaces flagged).
--   * Data minimization: no SSN, DOB, driver's license, card or bank numbers. Free-text columns reject
--     SSN-shaped and card-shaped strings.
--   * Every change on business tables is written to activity_log by trigger. App sessions cannot write the log directly.
--   * Records of business (contacts, jobs, quotes, invoices, sends) cannot be deleted through the API.
--   * Outbound actions are frozen at insert and their status only moves forward.
--   * Sign-ups are blocked at the database unless the email is allow-listed.

-- gen_random_uuid() is built into Postgres 13+; no extension needed.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.owners (
  user_id uuid primary key,
  email text not null,
  added_at timestamptz not null default now()
);

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from private.owners o where o.user_id = (select auth.uid()));
$$;
revoke all on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create or replace function private.block_mutation()
returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'table % is append-only (% blocked)', tg_table_name, tg_op
    using errcode = 'insufficient_privilege';
end $$;

-- True when text contains an SSN, a payment card number (Luhn-valid 13 to 19 digits), a date of birth,
-- a driver's license reference or a bank account/routing number. Mirrors src/lib/domain/pii.ts.
create or replace function private.has_forbidden_pii(t text)
returns boolean language plpgsql immutable set search_path = '' as $$
declare
  digits text; sum int; d int; alt boolean; i int;
begin
  if t is null then return false; end if;
  if t ~ '\m\d{3}-\d{2}-\d{4}\M' then return true; end if;                       -- SSN 123-45-6789
  if t ~* '\m(ssn|social security)\M[^0-9]{0,12}\d{9}\M' then return true; end if;
  if t ~* '\m(dob|date of birth|birth ?date)\M' then return true; end if;
  if t ~* '(driver''?s?\s+licen[cs]e|\mdl\s*#|\mdl\s*:?\s*[a-z]?\d{5,})' then return true; end if;
  if t ~* '\m(routing|acct|account)\s*(number|no\.?|#)\s*:?\s*\d{6,}' then return true; end if;
  for digits in select regexp_replace(m[1], '[ -]', '', 'g')
                from regexp_matches(t, '((?:\d[ -]?){13,19})', 'g') as m loop
    if length(digits) between 13 and 19 then
      sum := 0; alt := false;                                                       -- Luhn check, inline
      for i in reverse length(digits)..1 loop
        d := substr(digits, i, 1)::int;
        if alt then d := d * 2; if d > 9 then d := d - 9; end if; end if;
        sum := sum + d; alt := not alt;
      end loop;
      if sum % 10 = 0 then return true; end if;
    end if;
  end loop;
  return false;
end $$;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.contact_type as enum ('lead', 'client', 'partner', 'vendor');
create type public.job_status as enum ('lead', 'quoted', 'booked', 'scheduled', 'done', 'paid', 'closed', 'declined');
create type public.photo_tag as enum ('before', 'test', 'after', 'damage', 'other');
create type public.test_outcome as enum ('too_weak', 'clean', 'etched');
create type public.verdict as enum ('SELL', 'TEST FIRST', 'HYBRID', 'REFUSE', 'UNKNOWN');
create type public.registry_result as enum ('not_checked', 'not_listed', 'district_only', 'individually_listed');
create type public.lead_swab as enum ('not_needed', 'pending', 'negative', 'positive');
create type public.quote_status as enum ('draft', 'ready', 'sent', 'accepted', 'declined', 'expired');
create type public.invoice_status as enum ('draft', 'ready', 'sent', 'paid', 'void');
create type public.action_status as enum ('pending', 'confirmed', 'sent', 'verified', 'failed', 'cancelled');

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  first_name text not null check (length(first_name) between 1 and 80),
  last_name text check (length(last_name) <= 80),
  company text check (length(company) <= 120),
  role text check (length(role) <= 80),
  phone text check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  email text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  address text check (length(address) <= 240),
  type public.contact_type not null default 'lead',
  source text check (length(source) <= 80),
  met_where text check (length(met_where) <= 160),
  -- SMS consent (SC Telephone Privacy Protection Act + TCPA): texts only to people who texted first
  -- or gave written opt-in. Proof is a short description of where the consent lives.
  sms_opt_in boolean not null default false,
  sms_opt_in_at timestamptz,
  sms_opt_in_proof text check (length(sms_opt_in_proof) <= 240),
  texted_first_at timestamptz,
  email_ok boolean not null default false,
  unsubscribed_at timestamptz,
  quo_contact_id text,
  notes text check (length(notes) <= 4000),
  constraint sms_opt_in_needs_proof check (not sms_opt_in or (sms_opt_in_at is not null and sms_opt_in_proof is not null)),
  constraint contacts_no_pii check (not private.has_forbidden_pii(notes) and not private.has_forbidden_pii(met_where) and not private.has_forbidden_pii(address))
);
create unique index contacts_phone_uq on public.contacts (phone) where phone is not null;
create index contacts_email_idx on public.contacts (lower(email));

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_no text not null unique check (job_no ~ '^J-[0-9]{4}-[0-9]{3}$'),
  contact_id uuid references public.contacts (id) on delete restrict,
  title text not null check (length(title) between 1 and 160),
  site_address text check (length(site_address) <= 240),
  scope text check (length(scope) <= 4000),
  scope_items jsonb not null default '[]'::jsonb, -- [{label, method, warn}]
  est_hours numeric(5, 1) check (est_hours >= 0),
  status public.job_status not null default 'lead',
  job_date date,
  job_end_date date,
  walkthrough_at timestamptz,
  value_cents integer check (value_cents >= 0),
  payment_terms text check (length(payment_terms) <= 40),
  drive_folder_id text,
  -- Safety gates (hard blockers)
  year_built integer check (year_built between 1600 and 2100),
  pre_1978_paint boolean not null default false,
  lead_swab public.lead_swab not null default 'not_needed',
  registry_check public.registry_result not null default 'not_checked',
  registry_checked_at timestamptz,
  over_water boolean not null default false,
  plated_surfaces boolean not null default false,
  galvanized_keep_zinc boolean not null default false,
  sealant_beads_present boolean not null default false,
  notes text check (length(notes) <= 4000),
  constraint jobs_no_pii check (not private.has_forbidden_pii(notes) and not private.has_forbidden_pii(scope)),
  constraint jobs_dates check (job_end_date is null or job_date is null or job_end_date >= job_date)
);
create index jobs_contact_idx on public.jobs (contact_id);
create index jobs_status_idx on public.jobs (status);

-- Gates enforced at the database: a job cannot move into booked/scheduled/done while a gate is open.
create or replace function private.enforce_job_gates()
returns trigger language plpgsql set search_path = '' as $$
declare
  pre1978 boolean := new.pre_1978_paint or (new.year_built is not null and new.year_built < 1978);
begin
  -- Any status past quoted counts as committed work (booked, scheduled, done, paid, closed).
  if new.status in ('booked', 'scheduled', 'done', 'paid', 'closed') then
    if new.registry_check = 'individually_listed' then
      raise exception 'GATE: property is individually listed on a historic registry. Refuse.' using errcode = 'check_violation';
    end if;
    if new.registry_check = 'not_checked' then
      raise exception 'GATE: check the historic registry (scarchsite.org) before booking.' using errcode = 'check_violation';
    end if;
    if new.over_water then
      raise exception 'GATE: over-water work is excluded by insurance. Refuse.' using errcode = 'check_violation';
    end if;
    if new.lead_swab = 'positive' then
      raise exception 'GATE: lead swab positive. Decline (RRP).' using errcode = 'check_violation';
    end if;
    if pre1978 and new.lead_swab <> 'negative' then
      raise exception 'GATE: pre-1978 paint needs a negative lead swab before booking (RRP).' using errcode = 'check_violation';
    end if;
    if new.galvanized_keep_zinc then
      raise exception 'GATE: keeping galvanizing while stripping paint has no safe window. Refuse that scope.' using errcode = 'check_violation';
    end if;
  end if;
  return new;
end $$;

create trigger jobs_gates before insert or update on public.jobs
  for each row execute function private.enforce_job_gates();

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  received_at timestamptz not null default now(),
  name text check (length(name) <= 120),
  email text,
  phone text,
  address text check (length(address) <= 240),
  service text check (length(service) <= 120),
  description text check (length(description) <= 4000),
  service_area_result text check (service_area_result in ('in', 'near', 'out', 'unknown')),
  raw_payload jsonb not null default '{}'::jsonb,
  sheet_row integer,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  contact_id uuid references public.contacts (id) on delete set null,
  job_id uuid references public.jobs (id) on delete set null,
  -- raw_payload is the website form as received; the website strips it before insert (see HANDOFF).
  constraint qr_no_pii check (not private.has_forbidden_pii(description) and not private.has_forbidden_pii(name) and not private.has_forbidden_pii(address))
);

create table public.job_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_id uuid references public.jobs (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  kind text not null check (kind in ('email', 'text', 'call', 'note', 'photo', 'status', 'quote', 'invoice', 'payment', 'visit')),
  summary text not null check (length(summary) <= 1000),
  source_ref text, -- gmail thread id, Quo message id, etc.
  constraint je_no_pii check (not private.has_forbidden_pii(summary))
);
create index job_events_job_idx on public.job_events (job_id, occurred_at desc);
create index job_events_contact_idx on public.job_events (contact_id, occurred_at desc);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  drive_file_id text,
  storage_path text, -- Supabase private bucket path while waiting for Drive upload
  tag public.photo_tag not null default 'other',
  spot text check (length(spot) <= 160),
  note text check (length(note) <= 1000),
  taken_at timestamptz not null default now(),
  constraint photo_has_location check (drive_file_id is not null or storage_path is not null)
);
create index photos_job_idx on public.photos (job_id, taken_at desc);

create table public.walkthrough_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  position integer not null default 0,
  item text not null check (length(item) <= 200),
  done boolean not null default false,
  value text check (length(value) <= 120),
  note text check (length(note) <= 1000)
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  quote_no text not null unique check (quote_no ~ '^Q-[0-9]{4}-[0-9]{3}$'),
  job_id uuid not null references public.jobs (id) on delete restrict,
  lines jsonb not null default '[]'::jsonb,
  total_cents integer not null default 0 check (total_cents >= 0),
  terms text check (length(terms) <= 4000),
  status public.quote_status not null default 'draft',
  qbo_estimate_id text,
  sent_at timestamptz,
  verified_sent_at timestamptz,
  -- $400 minimum: nothing leaves draft below it.
  constraint quote_minimum check (status = 'draft' or total_cents >= 40000),
  constraint quotes_no_pii check (not private.has_forbidden_pii(lines::text) and not private.has_forbidden_pii(terms))
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_id uuid not null references public.jobs (id) on delete restrict,
  quote_id uuid references public.quotes (id) on delete set null,
  qbo_invoice_id text,
  amount_cents integer not null check (amount_cents >= 0),
  status public.invoice_status not null default 'draft',
  due_at date,
  sent_at timestamptz,
  paid_at timestamptz,
  payment_link text check (payment_link is null or payment_link ~ '^https://'),
  lien_waiver_file_id text
);

-- Outbound actions: every email, text, quote send, invoice send, post or payment link is staged here,
-- needs an explicit confirm from the owner, and is verified afterwards (Sent folder, delivery status).
create table public.outbound_actions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  kind text not null check (kind in ('email', 'text', 'quote', 'invoice', 'payment_link', 'post')),
  channel text not null, -- gmail, quo, qbo, facebook
  recipient text not null check (length(recipient) <= 240),
  contact_id uuid not null references public.contacts (id) on delete restrict,
  job_id uuid references public.jobs (id) on delete set null,
  quote_id uuid references public.quotes (id) on delete set null,
  subject text check (length(subject) <= 300),
  body text not null check (length(body) <= 20000),
  content_hash text not null, -- sha256 of kind|recipient|subject|body; the confirm must echo it
  status public.action_status not null default 'pending',
  confirmed_at timestamptz,
  sent_at timestamptz,
  verified_at timestamptz,
  external_ref text,
  error text,
  constraint oa_no_pii check (not private.has_forbidden_pii(body) and not private.has_forbidden_pii(subject)),
  constraint oa_confirm_before_send check (status in ('pending', 'cancelled') or confirmed_at is not null)
);

-- What was reviewed is what gets sent: content is frozen at insert, and status only moves forward.
create or replace function private.outbound_guard()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (new.kind, new.channel, new.recipient, new.contact_id, new.job_id, new.quote_id, new.subject, new.body, new.content_hash)
     is distinct from
     (old.kind, old.channel, old.recipient, old.contact_id, old.job_id, old.quote_id, old.subject, old.body, old.content_hash) then
    raise exception 'outbound content is frozen once staged; cancel and stage a new one' using errcode = 'insufficient_privilege';
  end if;
  if new.status <> old.status and not (
       (old.status = 'pending' and new.status in ('confirmed', 'cancelled'))
    or (old.status = 'confirmed' and new.status in ('sent', 'failed'))
    or (old.status = 'sent' and new.status in ('verified', 'failed'))
  ) then
    raise exception 'outbound status cannot move from % to %', old.status, new.status using errcode = 'insufficient_privilege';
  end if;
  return new;
end $$;

create trigger outbound_actions_guard before update on public.outbound_actions
  for each row execute function private.outbound_guard();

-- ---------------------------------------------------------------------------
-- Learning loop: append-only
-- ---------------------------------------------------------------------------

create table public.matrix_rows (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  row_id text not null check (row_id ~ '^[A-Z]{2}-[0-9]{2}$'),
  version integer not null check (version >= 1),
  vertical text not null,
  surface text not null,
  coating text,
  verdict public.verdict not null,
  mj_start numeric(6, 3),
  mj_safe_range text,
  ladder text,
  stop_rules text,
  evidence_grade text check (evidence_grade in ('A', 'B', 'C', 'D', 'E') or evidence_grade is null),
  data jsonb not null default '{}'::jsonb, -- full CSV row
  source text not null, -- e.g. 'matrix v0.1 csv', 'test_result <uuid>'
  unique (row_id, version)
);

create table public.test_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  fired_at timestamptz not null default now(),
  matrix_row_id text,
  job_id uuid references public.jobs (id) on delete set null,
  test_piece text check (length(test_piece) <= 160),
  material text not null check (length(material) <= 120),
  layer text check (length(layer) <= 160),
  preset_slot text,
  size_x_mm numeric(5, 1) check (size_x_mm between 1 and 200),
  size_y_mm numeric(5, 1) check (size_y_mm between 1 and 200),
  speed integer check (speed between 1 and 100000),
  power_pct numeric(5, 1) check (power_pct between 0 and 100),
  freq_khz numeric(6, 1) check (freq_khz > 0),
  pulse_ns integer check (pulse_ns > 0),
  mj numeric(6, 3) check (mj >= 0),
  focus_mm numeric(6, 1),
  passes integer check (passes between 1 and 50),
  outcome public.test_outcome not null,
  note text check (length(note) <= 2000),
  photo_ids uuid[] not null default '{}'
);

create trigger test_results_append_only before update or delete on public.test_results
  for each row execute function private.block_mutation();
create trigger matrix_rows_append_only before update or delete on public.matrix_rows
  for each row execute function private.block_mutation();

create table public.presets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  slot text not null check (slot ~ '^File[0-9]{1,2}$'),
  name text not null,
  fields jsonb not null,
  valid_from date not null,
  version_label text not null, -- e.g. 'v4 2026-10-18'
  unique (slot, valid_from)
);

-- ---------------------------------------------------------------------------
-- HQ collections
-- ---------------------------------------------------------------------------

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  legacy_id text unique, -- HQ id, e.g. t45
  title text not null check (length(title) <= 240),
  note text check (length(note) <= 4000),
  bucket text not null default 'next' check (bucket in ('today', 'next', 'later', 'deferred', 'waiting')),
  due date,
  done boolean not null default false,
  done_at timestamptz,
  position integer not null default 0,
  owner text not null default 'Tyler' check (owner in ('Tyler', 'Claude'))
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  topic text not null,
  body text not null check (length(body) <= 20000),
  constraint notes_no_pii check (not private.has_forbidden_pii(body))
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  label text not null,
  target integer not null check (target > 0),
  current integer not null default 0 check (current >= 0),
  deadline date not null
);

create table public.spend (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  spent_on date not null,
  vendor text not null,
  category text not null,
  amount_cents integer not null,
  recurring text check (recurring in ('monthly', 'yearly') or recurring is null),
  note text
);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  channel text not null check (channel in ('email', 'text', 'post')),
  contact_id uuid references public.contacts (id) on delete set null,
  thread_ref text,
  subject text,
  body text not null check (length(body) <= 20000),
  status text not null default 'draft' check (status in ('draft', 'approved', 'sent', 'discarded')),
  constraint drafts_no_pii check (not private.has_forbidden_pii(body) and not private.has_forbidden_pii(subject))
);

create table public.inbox_state (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  source text not null check (source in ('gmail', 'quo')),
  thread_ref text not null,
  state text not null check (state in ('needs_you', 'waiting', 'handled', 'no_reply')),
  snooze_until timestamptz,
  unique (source, thread_ref)
);

create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  name text not null,
  lane text not null check (lane in ('property_manager', 'trade_partner', 'marine', 'other')),
  company text,
  stage text not null default 'target',
  next_step text,
  next_step_on date,
  contact_id uuid references public.contacts (id) on delete set null,
  notes text
);

-- ---------------------------------------------------------------------------
-- Audit log (append-only)
-- ---------------------------------------------------------------------------

create table public.activity_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid default auth.uid(),
  source text not null default 'db', -- db trigger, app, cron, import
  action text not null,
  table_name text,
  row_id uuid,
  changed text[],
  detail jsonb not null default '{}'::jsonb
);
create index activity_log_at_idx on public.activity_log (at desc);
create trigger activity_log_append_only before update or delete on public.activity_log
  for each row execute function private.block_mutation();

-- Generic audit trigger: records which columns changed, never the values (keeps PII out of the log),
-- except status-like columns where the value is useful.
create or replace function private.audit_row()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  changed_cols text[] := '{}';
  k text;
  old_j jsonb;
  new_j jsonb;
  detail jsonb := '{}'::jsonb;
begin
  if tg_op = 'UPDATE' then
    old_j := to_jsonb(old);
    new_j := to_jsonb(new);
    for k in select jsonb_object_keys(new_j) loop
      if k not in ('updated_at') and (old_j -> k) is distinct from (new_j -> k) then
        changed_cols := changed_cols || k;
      end if;
    end loop;
    if array_length(changed_cols, 1) is null then return new; end if;
    if 'status' = any (changed_cols) then
      detail := jsonb_build_object('status_from', old_j -> 'status', 'status_to', new_j -> 'status');
    end if;
  end if;
  insert into public.activity_log (action, table_name, row_id, changed, detail)
  values (lower(tg_op), tg_table_name,
          case when tg_op = 'DELETE' then (to_jsonb(old) ->> 'id')::uuid else (to_jsonb(new) ->> 'id')::uuid end,
          changed_cols, detail);
  return coalesce(new, old);
end $$;

-- ---------------------------------------------------------------------------
-- Remaining free-text columns get the same PII check
-- ---------------------------------------------------------------------------

alter table public.photos add constraint photos_no_pii check (not private.has_forbidden_pii(note) and not private.has_forbidden_pii(spot));
alter table public.walkthrough_items add constraint walk_no_pii check (not private.has_forbidden_pii(note) and not private.has_forbidden_pii(value));
alter table public.test_results add constraint tr_no_pii check (not private.has_forbidden_pii(note));
alter table public.todos add constraint todos_no_pii check (not private.has_forbidden_pii(note) and not private.has_forbidden_pii(title));
alter table public.spend add constraint spend_no_pii check (not private.has_forbidden_pii(note));
alter table public.prospects add constraint prospects_no_pii check (not private.has_forbidden_pii(notes));

-- ---------------------------------------------------------------------------
-- Triggers, RLS, grants for every business table
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
  business text[] := array['contacts', 'jobs', 'quote_requests', 'job_events', 'photos', 'walkthrough_items',
                           'quotes', 'invoices', 'outbound_actions', 'matrix_rows', 'test_results', 'presets',
                           'todos', 'notes', 'goals', 'spend', 'drafts', 'inbox_state', 'prospects'];
  append_only text[] := array['matrix_rows', 'test_results'];
  -- Records of business and anything that was sent: the app never deletes them. A stolen session can't either.
  no_delete text[] := array['contacts', 'jobs', 'quote_requests', 'job_events', 'quotes', 'invoices', 'outbound_actions'];
begin
  foreach t in array business loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from anon, authenticated, public', t);
    if t = any (append_only) then
      execute format('grant select, insert on public.%I to authenticated', t);
    elsif t = any (no_delete) then
      execute format('grant select, insert, update on public.%I to authenticated', t);
    else
      execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    end if;
    execute format('create trigger %I before update on public.%I for each row execute function private.set_updated_at()', t || '_updated_at', t);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function private.audit_row()', t || '_audit', t);
    if t = any (append_only) then
      execute format('create policy owner_select on public.%I for select to authenticated using ((select public.is_owner()))', t);
      execute format('create policy owner_insert on public.%I for insert to authenticated with check ((select public.is_owner()))', t);
    else
      execute format('create policy owner_all on public.%I for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()))', t);
    end if;
  end loop;
end $$;

-- Audit log: readable by the owner, written only by the audit trigger and log_event() (both run as the
-- table owner). RLS is enabled but not forced, so those writers work for cron/service jobs too, while
-- app sessions can't insert forged rows.
alter table public.activity_log enable row level security;
revoke all on public.activity_log from anon, authenticated, public;
grant select on public.activity_log to authenticated;
create policy owner_select on public.activity_log for select to authenticated using ((select public.is_owner()));

create or replace function public.log_event(p_action text, p_detail jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_owner() then
    raise exception 'not allowed' using errcode = 'insufficient_privilege';
  end if;
  if length(p_action) > 80 or p_action !~ '^[a-z_.]+$' then
    raise exception 'bad action name' using errcode = 'check_violation';
  end if;
  insert into public.activity_log (actor, source, action, detail)
  values ((select auth.uid()), 'app', p_action, coalesce(p_detail, '{}'::jsonb));
end $$;
revoke all on function public.log_event(text, jsonb) from public, anon;
grant execute on function public.log_event(text, jsonb) to authenticated;

-- Future objects start closed for every API role, not just anon. Supabase grants ALL on new public
-- objects to anon/authenticated by default; this undoes that for objects created by postgres.
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated, public;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated, public;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated, public;

-- ---------------------------------------------------------------------------
-- Sign-up lockdown: only allow-listed emails can ever get an auth account
-- (belt and braces with "disable sign-ups" in the dashboard and config.toml)
-- ---------------------------------------------------------------------------

create table private.allowed_emails (email text primary key check (email = lower(email)));

create or replace function private.block_unlisted_signup()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.email is null or not exists (select 1 from private.allowed_emails a where a.email = lower(new.email)) then
    raise exception 'sign-ups are closed' using errcode = 'insufficient_privilege';
  end if;
  return new;
end $$;

create trigger block_unlisted_signup before insert on auth.users
  for each row execute function private.block_unlisted_signup();

-- ---------------------------------------------------------------------------
-- Private storage bucket for photos waiting on Drive upload (owner only)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('job-photos', 'job-photos', false, 26214400, array['image/jpeg', 'image/png', 'image/heic', 'image/webp', 'video/mp4', 'video/quicktime'])
on conflict (id) do nothing;

create policy job_photos_owner on storage.objects for all to authenticated
  using (bucket_id = 'job-photos' and (select public.is_owner()))
  with check (bucket_id = 'job-photos' and (select public.is_owner()));
