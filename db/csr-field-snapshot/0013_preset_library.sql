-- Laser preset library (src/lib/domain/library.ts, swing.ts).
-- preset_library: one row per preset (name, material, purpose, status, machine slot, archive).
-- preset_versions: the settings, append-only. Edit = a new version; no version is ever updated, and one used on a
--   job can't be deleted. Versions go away only with their preset, and only if the preset was never used on a job.
-- preset_photos: photos of a preset's results (private job-photos bucket, under presets/).
-- job_files: the files to load for a job, each pinned to the version it was picked at.
-- Plated surfaces get no laser: no preset can be tagged plated. Picking files needs the job's gates clear (same rule
-- as jobs.preset_slots, private.enforce_job_presets). Owner-only RLS (forced), no anon access, audit on every table.
-- Over a red warning (brass above 0.15 mJ, bare wood at 2.0 mJ; Tyler 10/27): only as testing or do not use, with a
-- reason on the version, never in a machine slot (private.preset_red_check; the app's redRefusal is the same rule).
-- Seed: supabase/seed/0003_preset_library_v5.sql loads presets v5 as the current machine layout.

create table public.preset_library (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  name text not null check (length(name) between 1 and 60),
  material text not null check (material in ('iron', 'brass', 'stainless', 'aluminum', 'wood', 'clear_coat', 'masonry', 'other')),
  purpose text not null check (purpose in ('paint_strip', 'rust', 'oxide', 'clear_coat', 'cleanup', 'test', 'other')),
  status text not null default 'testing' check (status in ('proven', 'testing', 'do_not_use', 'retired')),
  slot smallint check (slot between 1 and 9),
  layout text check (length(layout) <= 80),
  archived_at timestamptz,
  constraint preset_never_plated check (material <> 'plated'),
  constraint preset_library_no_pii check (not private.has_forbidden_pii(name) and not private.has_forbidden_pii(layout))
);
-- One live preset per machine file. Slot roles (core 1 to 6, job 7 to 9) are not enforced yet.
create unique index preset_library_slot_idx on public.preset_library (slot) where slot is not null and archived_at is null;

create table public.preset_versions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  preset_id uuid not null references public.preset_library (id) on delete cascade,
  version integer not null check (version >= 1),
  swing_type text not null check (swing_type in ('sine', 'line', 'spiral', 'arrows', 'ring', 'ellipse', 'rectangle', 'grid', 'petal', 'concentric', 'fan', 'char8')),
  swing jsonb not null check (jsonb_typeof(swing) = 'object'),
  power_pct numeric(5, 2) not null check (power_pct between 1 and 100),
  freq_khz numeric(7, 2) not null check (freq_khz between 1 and 3000),
  pulse_ns integer not null check (pulse_ns in (13, 20, 30, 45, 60, 80, 100, 150, 200, 250, 350, 500)),
  air_on_ms integer not null default 200 check (air_on_ms between 0 and 10000),
  air_off_ms integer not null default 200 check (air_off_ms between 0 and 10000),
  ramp jsonb not null check (jsonb_typeof(ramp) = 'object'),
  dyn_par jsonb not null check (jsonb_typeof(dyn_par) = 'object'),
  source text check (length(source) <= 240),
  notes text check (length(notes) <= 1000),
  warning_reason text check (length(warning_reason) between 1 and 300),
  unique (preset_id, version),
  constraint preset_versions_no_pii check (not private.has_forbidden_pii(source) and not private.has_forbidden_pii(notes) and not private.has_forbidden_pii(warning_reason))
);

-- Numbering: always the next version for that preset, whatever the caller sent.
create or replace function private.preset_version_next()
returns trigger language plpgsql set search_path = '' as $$
begin
  perform 1 from public.preset_library where id = new.preset_id for update;
  select coalesce(max(v.version), 0) + 1 into new.version from public.preset_versions v where v.preset_id = new.preset_id;
  return new;
end $$;

-- Versions never change. A delete is allowed only as part of deleting its preset (the parent row is already gone
-- when the cascade runs); job_files' foreign key keeps any version used on a job.
create or replace function private.preset_version_guard()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    raise exception 'VERSION: preset versions are never changed. Save a new version.' using errcode = 'check_violation';
  end if;
  if exists (select 1 from public.preset_library p where p.id = old.preset_id) then
    raise exception 'VERSION: a version is kept for history. Archive the preset or delete the whole preset.' using errcode = 'check_violation';
  end if;
  return old;
end $$;

create or replace function private.preset_delete_guard()
returns trigger language plpgsql set search_path = '' as $$
begin
  if exists (select 1 from public.job_files f where f.preset_id = old.id) then
    raise exception 'IN USE: this preset is on a job. Archive it instead; its history stays.' using errcode = 'check_violation';
  end if;
  return old;
end $$;

-- Over a red warning: brass above 0.15 mJ or bare wood at 2.0 mJ, with pulse energy computed as presetEnergy() does:
-- MIN(300 W / kHz, verified cap) x Power%, rounded to 0.001 mJ. No verified cap at that pulse width = can't be checked
-- (as in the app). A new version is checked against its preset; a change to a preset against its newest version.
-- Self-contained: the owner's role has no usage on schema private, so this calls no other private function.
create or replace function private.preset_red_check()
returns trigger language plpgsql set search_path = '' as $$
declare
  material text; status text; slot smallint; archived timestamptz;
  freq numeric; pulse integer; power numeric; reason text;
  cap numeric; mj numeric;
begin
  if tg_table_name = 'preset_versions' then
    select p.material, p.status, p.slot, p.archived_at into material, status, slot, archived from public.preset_library p where p.id = new.preset_id;
    freq := new.freq_khz; pulse := new.pulse_ns; power := new.power_pct; reason := new.warning_reason;
  else
    material := new.material; status := new.status; slot := new.slot; archived := new.archived_at;
    select v.freq_khz, v.pulse_ns, v.power_pct, v.warning_reason into freq, pulse, power, reason
      from public.preset_versions v where v.preset_id = new.id order by v.version desc limit 1;
    if not found then return new; end if;
  end if;
  cap := case pulse when 30 then 0.31 when 100 then 0.77 when 200 then 1.33 when 500 then 2.0 end;
  if cap is null then return new; end if;
  mj := round(least(300.0 / freq, cap) * power / 100, 3);
  if not ((material = 'brass' and mj > 0.15) or (material = 'wood' and mj >= 2.0)) then return new; end if;
  if status not in ('testing', 'do_not_use') then
    raise exception 'RED: Over a red warning: save it as testing or do not use.' using errcode = 'check_violation';
  end if;
  if slot is not null and archived is null then
    raise exception 'RED: Over a red warning: it can''t sit in a machine slot. Set it to library only.' using errcode = 'check_violation';
  end if;
  if coalesce(btrim(reason), '') = '' then
    raise exception 'RED: Over a red warning: give the reason it is saved.' using errcode = 'check_violation';
  end if;
  return new;
end $$;

create table public.preset_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  preset_id uuid not null references public.preset_library (id) on delete cascade,
  storage_path text not null check (storage_path ~ '^presets/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp|heic)$'),
  note text check (length(note) <= 300),
  taken_at timestamptz not null default now(),
  constraint preset_photos_no_pii check (not private.has_forbidden_pii(note))
);
create index preset_photos_preset_idx on public.preset_photos (preset_id, taken_at desc);

create table public.job_files (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  preset_id uuid not null references public.preset_library (id) on delete restrict,
  version_id uuid not null references public.preset_versions (id) on delete restrict,
  position integer not null default 0 check (position between 0 and 99),
  unique (job_id, preset_id)
);
create index job_files_job_idx on public.job_files (job_id, position);
create index job_files_version_idx on public.job_files (version_id);

-- A job file is a version of its own preset, never an archived one, and only on a job whose gates are clear
-- (same conditions as private.enforce_job_presets). Removing a file is always allowed.
create or replace function private.job_file_guard()
returns trigger language plpgsql set search_path = '' as $$
declare
  j public.jobs%rowtype;
begin
  if not exists (select 1 from public.preset_versions v where v.id = new.version_id and v.preset_id = new.preset_id) then
    raise exception 'FILE: that version belongs to another preset.' using errcode = 'check_violation';
  end if;
  if tg_op = 'INSERT' or new.version_id <> old.version_id then
    if exists (select 1 from public.preset_library p where p.id = new.preset_id and p.archived_at is not null) then
      raise exception 'FILE: that preset is archived.' using errcode = 'check_violation';
    end if;
    select * into j from public.jobs where id = new.job_id;
    if j.registry_check in ('not_checked', 'individually_listed')
       or j.over_water
       or j.lead_swab = 'positive'
       or ((j.pre_1978_paint or coalesce(j.year_built, 9999) < 1978) and j.lead_swab <> 'negative')
       or j.galvanized_keep_zinc then
      raise exception 'GATE: Clear the gates before picking laser files.' using errcode = 'check_violation';
    end if;
  end if;
  return new;
end $$;

alter table public.preset_library enable row level security;
alter table public.preset_library force row level security;
alter table public.preset_versions enable row level security;
alter table public.preset_versions force row level security;
alter table public.preset_photos enable row level security;
alter table public.preset_photos force row level security;
alter table public.job_files enable row level security;
alter table public.job_files force row level security;
revoke all on public.preset_library from anon, authenticated, public;
revoke all on public.preset_versions from anon, authenticated, public;
revoke all on public.preset_photos from anon, authenticated, public;
revoke all on public.job_files from anon, authenticated, public;
grant select, insert, update, delete on public.preset_library to authenticated;
grant select, insert, delete on public.preset_versions to authenticated;
grant select, insert, update, delete on public.preset_photos to authenticated;
grant select, insert, update, delete on public.job_files to authenticated;
create policy owner_all on public.preset_library for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_all on public.preset_versions for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_all on public.preset_photos for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_all on public.job_files for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));

create trigger preset_versions_next before insert on public.preset_versions for each row execute function private.preset_version_next();
create trigger preset_versions_guard before update or delete on public.preset_versions for each row execute function private.preset_version_guard();
create trigger preset_versions_red before insert on public.preset_versions for each row execute function private.preset_red_check();
create trigger preset_library_red before update on public.preset_library for each row execute function private.preset_red_check();
create trigger preset_library_delete_guard before delete on public.preset_library for each row execute function private.preset_delete_guard();
create trigger job_files_guard before insert or update on public.job_files for each row execute function private.job_file_guard();

create trigger preset_library_updated_at before update on public.preset_library for each row execute function private.set_updated_at();
create trigger preset_photos_updated_at before update on public.preset_photos for each row execute function private.set_updated_at();
create trigger job_files_updated_at before update on public.job_files for each row execute function private.set_updated_at();
create trigger preset_library_audit after insert or update or delete on public.preset_library for each row execute function private.audit_row();
create trigger preset_versions_audit after insert or update or delete on public.preset_versions for each row execute function private.audit_row();
create trigger preset_photos_audit after insert or update or delete on public.preset_photos for each row execute function private.audit_row();
create trigger job_files_audit after insert or update or delete on public.job_files for each row execute function private.audit_row();
