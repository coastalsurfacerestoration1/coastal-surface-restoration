-- 0014: the website's write path into quote_requests (Phase 3 dual-write).
--
-- Safe to run whether or not 0002 (sheet_timestamp, submission_id) is already applied: every column, index and
-- type is created only if missing. One transaction; any failure leaves the database as it was.
--
-- What it adds:
--   quote_requests.sheet_job_no  text, J-YYYY-NNN, filled later (the Apps Script owns job numbering)
--   quote_requests.source        public.quote_source (form, phone, email, manual)
--   role csr_site_ingest         NOLOGIN here. Its password is set by hand afterwards, never in a file.
--                                Can EXECUTE public.ingest_quote_request(jsonb) and nothing else in the app schemas.
--                                Statements capped at 2 s, under the site's 2.5 s wait.
--   role csr_site_reconcile      Same idea, for the nightly reconcile. Can EXECUTE public.reconcile_quote_requests
--                                and nothing else. It returns timestamps and hashes, never names or numbers.
--
-- The functions run as their owner (postgres), which bypasses RLS on Supabase. A guard below refuses to install
-- them under a role that would not, so a misapplied migration fails here instead of failing every quote later.
-- No consent field is ever written: texting consent lives in the sheet until Phase 4.

begin;

do $$ begin
  if not exists (select 1 from pg_roles where rolname = current_user and (rolsuper or rolbypassrls)) then
    raise exception '0014 must be run as a role that bypasses RLS (postgres on Supabase), not %', current_user;
  end if;
end $$;

-- 0002, repeated so this file stands alone. No-ops where 0002 already ran.
alter table public.quote_requests
  add column if not exists sheet_timestamp text check (length(sheet_timestamp) between 1 and 64),
  add column if not exists submission_id uuid;
create unique index if not exists quote_requests_sheet_timestamp_uq on public.quote_requests (sheet_timestamp);
create unique index if not exists quote_requests_submission_id_uq on public.quote_requests (submission_id);

do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'public' and t.typname = 'quote_source') then
    create type public.quote_source as enum ('form', 'phone', 'email', 'manual');
  end if;
end $$;

alter table public.quote_requests
  add column if not exists sheet_job_no text check (sheet_job_no ~ '^J-[0-9]{4}-[0-9]{3}$'),
  add column if not exists source public.quote_source;

-- Roles. NOLOGIN until the owner sets a password by hand (see the apply notes).
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'csr_site_ingest') then
    create role csr_site_ingest nologin noinherit nocreatedb nocreaterole nobypassrls connection limit 10;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'csr_site_reconcile') then
    create role csr_site_reconcile nologin noinherit nocreatedb nocreaterole nobypassrls connection limit 2;
  end if;
end $$;
alter role csr_site_ingest set statement_timeout = '2s';
alter role csr_site_ingest set search_path = '';
alter role csr_site_reconcile set statement_timeout = '10s';
alter role csr_site_reconcile set search_path = '';

-- Free text the form sends can carry an ID or card number. The tables refuse those outright, so blank them here
-- rather than lose the whole row.
create or replace function private.ingest_scrub(t text, max_len int)
returns text language sql immutable set search_path = '' as $$
  select case
    when t is null or btrim(t) = '' then null
    when private.has_forbidden_pii(t) then '[removed: looked like an ID, card or bank number]'
    else left(btrim(t), max_len)
  end
$$;
revoke all on function private.ingest_scrub(text, int) from public;

/*
  ingest_quote_request(payload jsonb) returns jsonb

  payload keys (all strings unless noted; unknown keys are refused so drift shows up in tests):
    submission_id  uuid, made by the site per submit
    sheet_timestamp  exact column A text, ISO 8601 UTC with milliseconds
    name, email, phone, street, city, state, zip, service, description
    photos  integer 0..20
    area  in | near | out | unknown
    out_of_area  the sheet's column M text
    spam  boolean
    how_heard, referred_by
    sheet  'ok' or the reason the sheet write failed

  Returns {"ok": true, "id": uuid, "duplicate": bool}. Raises on invalid input (SQLSTATE 22023).
  A repeated submission_id returns the existing row and changes nothing.
*/
create or replace function public.ingest_quote_request(payload jsonb)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare
  allowed constant text[] := array['submission_id', 'sheet_timestamp', 'name', 'email', 'phone', 'street', 'city',
    'state', 'zip', 'service', 'description', 'photos', 'area', 'out_of_area', 'spam', 'how_heard', 'referred_by',
    'sheet'];
  k text;
  v_sub uuid;
  v_ts text;
  v_name text;
  v_email text;
  v_phone text;
  v_digits text;
  v_address text;
  v_area text;
  v_spam boolean;
  v_photos int;
  v_contact uuid;
  v_id uuid;
  v_first text;
  v_last text;
  v_store_ts text;
  attempt int;
begin
  if payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'payload must be a JSON object' using errcode = '22023';
  end if;
  if octet_length(payload::text) > 64000 then
    raise exception 'payload too large' using errcode = '22023';
  end if;
  for k in select jsonb_object_keys(payload) loop
    if not (k = any (allowed)) then
      raise exception 'unknown key %', k using errcode = '22023';
    end if;
  end loop;

  -- Identity: both come from the same sheetRow() call on the site.
  if coalesce(payload->>'submission_id', '') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then
    raise exception 'submission_id must be a uuid' using errcode = '22023';
  end if;
  v_sub := (payload->>'submission_id')::uuid;
  v_ts := payload->>'sheet_timestamp';
  if coalesce(v_ts, '') !~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$' then
    raise exception 'sheet_timestamp must be an ISO UTC timestamp with milliseconds' using errcode = '22023';
  end if;

  -- Idempotent on submission_id: a retry returns the first row untouched.
  select id into v_id from public.quote_requests where submission_id = v_sub;
  if found then
    return jsonb_build_object('ok', true, 'id', v_id, 'duplicate', true);
  end if;

  v_name := btrim(coalesce(payload->>'name', ''));
  if length(v_name) not between 1 and 120 then
    raise exception 'name is required, up to 120 characters' using errcode = '22023';
  end if;

  v_email := lower(btrim(coalesce(payload->>'email', '')));
  if v_email = '' then
    v_email := null;
  elsif length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'email is not valid' using errcode = '22023';
  end if;

  v_digits := regexp_replace(coalesce(payload->>'phone', ''), '\D', '', 'g');
  if v_digits = '' then
    v_phone := null;
  elsif length(v_digits) = 10 then
    v_phone := '+1' || v_digits;
  elsif length(v_digits) = 11 and left(v_digits, 1) = '1' then
    v_phone := '+' || v_digits;
  else
    raise exception 'phone must be a US number' using errcode = '22023';
  end if;

  if v_email is null and v_phone is null then
    raise exception 'email or phone is required' using errcode = '22023';
  end if;

  v_area := coalesce(payload->>'area', '');
  if v_area not in ('in', 'near', 'out', 'unknown') then
    raise exception 'area must be in, near, out or unknown' using errcode = '22023';
  end if;

  if payload ? 'spam' and jsonb_typeof(payload->'spam') <> 'boolean' then
    raise exception 'spam must be a boolean' using errcode = '22023';
  end if;
  v_spam := coalesce((payload->>'spam')::boolean, false);

  if payload ? 'photos' then
    if jsonb_typeof(payload->'photos') <> 'number' or (payload->>'photos') !~ '^\d{1,2}$' then
      raise exception 'photos must be a whole number' using errcode = '22023';
    end if;
    v_photos := (payload->>'photos')::int;
    if v_photos > 20 then
      raise exception 'photos out of range' using errcode = '22023';
    end if;
  end if;

  for k in select unnest(array['street', 'city', 'state', 'zip', 'service', 'description', 'out_of_area',
                               'how_heard', 'referred_by', 'sheet']) loop
    if payload ? k and jsonb_typeof(payload->k) <> 'string' then
      raise exception '% must be a string', k using errcode = '22023';
    end if;
  end loop;

  v_address := private.ingest_scrub(concat_ws(', ',
    nullif(btrim(coalesce(payload->>'street', '')), ''),
    nullif(btrim(coalesce(payload->>'city', '')), ''),
    nullif(btrim(concat_ws(' ', nullif(btrim(coalesce(payload->>'state', '')), ''),
                                nullif(btrim(coalesce(payload->>'zip', '')), ''))), '')), 240);

  -- Contact: not for spam, not for quotes past 50 miles (never served, only kept on the record), and not
  -- when the name had to be scrubbed. The form is public, so it never changes an existing contact:
  --   both phone and email match one contact  -> link to it
  --   neither matches anyone                  -> a new lead
  --   anything else (a partial match)         -> no link; Tyler merges by hand in the app
  if not v_spam and v_area <> 'out' and not private.has_forbidden_pii(v_name) then
    if v_phone is not null and v_email is not null then
      select id into v_contact from public.contacts where phone = v_phone and lower(email) = v_email;
    end if;
    if v_contact is null
       and not exists (select 1 from public.contacts where v_phone is not null and phone = v_phone)
       and not exists (select 1 from public.contacts where v_email is not null and lower(email) = v_email) then
      v_first := left(split_part(v_name, ' ', 1), 80);
      v_last := nullif(left(btrim(substr(v_name, length(split_part(v_name, ' ', 1)) + 1)), 80), '');
      -- A concurrent quote can take the phone first; then this one is simply left unlinked.
      insert into public.contacts (first_name, last_name, phone, email, address, type, source)
      values (v_first, v_last, v_phone, v_email, v_address, 'lead', 'website')
      on conflict do nothing
      returning id into v_contact;
    end if;
  end if;

  -- Two submissions in the same millisecond share a column A text, and sheet_timestamp is unique. The second
  -- is kept under a tagged copy (never dropped), and the reconcile flags the shared timestamp for a look.
  v_store_ts := v_ts;
  if exists (select 1 from public.quote_requests where sheet_timestamp = v_ts) then
    v_store_ts := v_ts || '#' || left(v_sub::text, 8);
  end if;

  for attempt in 1..2 loop
  begin
  insert into public.quote_requests (
    received_at, name, email, phone, address, service, description, service_area_result, raw_payload,
    status, contact_id, sheet_timestamp, submission_id, source)
  values (
    v_ts::timestamptz,
    private.ingest_scrub(v_name, 120),
    v_email,
    v_phone,
    v_address,
    private.ingest_scrub(payload->>'service', 120),
    private.ingest_scrub(payload->>'description', 4000),
    v_area,
    jsonb_strip_nulls(jsonb_build_object(
      'city', private.ingest_scrub(payload->>'city', 80),
      'state', private.ingest_scrub(payload->>'state', 2),
      'zip', private.ingest_scrub(payload->>'zip', 10),
      'photos', v_photos,
      'out_of_area', private.ingest_scrub(payload->>'out_of_area', 120),
      'spam', v_spam,
      'how_heard', private.ingest_scrub(payload->>'how_heard', 120),
      'referred_by', private.ingest_scrub(payload->>'referred_by', 120),
      'sheet', private.ingest_scrub(payload->>'sheet', 200))),
    case when v_spam then 'spam' else 'new' end,
    v_contact,
    v_store_ts,
    v_sub,
    'form')
  returning id into v_id;
  exit;
  exception when unique_violation then
    -- A concurrent retry of this submission won: return its row.
    select id into v_id from public.quote_requests where submission_id = v_sub;
    if v_id is not null then
      return jsonb_build_object('ok', true, 'id', v_id, 'duplicate', true);
    end if;
    -- Otherwise another submission took this timestamp a moment ago: tag and try once more.
    if attempt = 2 then raise; end if;
    v_store_ts := v_ts || '#' || left(v_sub::text, 8);
  end;
  end loop;
  return jsonb_build_object('ok', true, 'id', v_id, 'duplicate', false);
end
$$;

/*
  reconcile_quote_requests(since timestamptz, until timestamptz)

  For the nightly check against the sheet. Every row whose column A text is a form timestamp inside the window
  (website rows and backfilled ones alike), as that exact text plus a sha256 over the fields both stores keep:
  lower(name) | lower(email) | last 10 phone digits | service. No names, emails or numbers leave the database.
  Window capped at 31 days.
*/
create or replace function public.reconcile_quote_requests(since timestamptz, until timestamptz)
returns table (sheet_timestamp text, submission_id uuid, fingerprint text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if since is null or until is null or until < since or until - since > interval '31 days' then
    raise exception 'window must be 0 to 31 days' using errcode = '22023';
  end if;
  return query
    select q.sheet_timestamp, q.submission_id,
           encode(sha256(convert_to(concat_ws('|',
             lower(btrim(coalesce(q.name, ''))),
             lower(btrim(coalesce(q.email, ''))),
             right(regexp_replace(coalesce(q.phone, ''), '\D', '', 'g'), 10),
             btrim(coalesce(q.service, ''))), 'UTF8')), 'hex')
    from public.quote_requests q
    where q.sheet_timestamp ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$'
      and q.sheet_timestamp::timestamptz >= since and q.sheet_timestamp::timestamptz < until
    order by q.sheet_timestamp;
end
$$;

-- Lock both functions down to their one caller each.
revoke all on function public.ingest_quote_request(jsonb) from public, anon, authenticated;
revoke all on function public.reconcile_quote_requests(timestamptz, timestamptz) from public, anon, authenticated;
grant usage on schema public to csr_site_ingest, csr_site_reconcile;
grant execute on function public.ingest_quote_request(jsonb) to csr_site_ingest;
grant execute on function public.reconcile_quote_requests(timestamptz, timestamptz) to csr_site_reconcile;

commit;
