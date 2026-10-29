-- Job card: presets picked for the job, pack-list ticks, and before/after photo pairs.
-- Owner-only RLS, the gate trigger, the audit trigger and the PII checks on jobs and photos are unchanged.

alter table public.jobs
  add column preset_slots text[] not null default '{}',
  add column pack_done text[] not null default '{}',
  add constraint jobs_preset_slots_shape check (
    cardinality(preset_slots) <= 12 and array_to_string(preset_slots, ',') ~ '^(File[0-9]{1,2}(,File[0-9]{1,2})*)?$'),
  add constraint jobs_pack_done_shape check (
    cardinality(pack_done) <= 80 and array_to_string(pack_done, ',') ~ '^([a-z0-9-]{1,40}(,[a-z0-9-]{1,40})*)?$');

-- Presets are laser settings: none may be added while a gate refuses or blocks the job (same rules as
-- private.enforce_job_gates). Removing presets is always allowed. If a gate reopens later, the presets
-- stay on record and the job card shows them stopped; booking is still refused by jobs_gates.
create or replace function private.enforce_job_presets()
returns trigger language plpgsql set search_path = '' as $$
begin
  if cardinality(new.preset_slots) > 0 and (tg_op = 'INSERT' or not (new.preset_slots <@ old.preset_slots)) and (
       new.registry_check in ('not_checked', 'individually_listed')
       or new.over_water
       or new.lead_swab = 'positive'
       or ((new.pre_1978_paint or coalesce(new.year_built, 9999) < 1978) and new.lead_swab <> 'negative')
       or new.galvanized_keep_zinc) then
    raise exception 'GATE: Clear the gates before picking laser presets.' using errcode = 'check_violation';
  end if;
  return new;
end $$;
create trigger jobs_presets_gate before insert or update of preset_slots on public.jobs
  for each row execute function private.enforce_job_presets();

-- An "after" photo points at the "before" it pairs with. Both must be on the same job.
alter table public.photos
  add column pair_id uuid references public.photos (id) on delete set null,
  add constraint photos_pair_not_self check (pair_id is null or pair_id <> id);
create index photos_pair_idx on public.photos (pair_id) where pair_id is not null;

create or replace function private.photo_pair_same_job()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.pair_id is not null and not exists (select 1 from public.photos p where p.id = new.pair_id and p.job_id = new.job_id) then
    raise exception 'Paired photo must be on the same job.' using errcode = 'check_violation';
  end if;
  return new;
end $$;
create trigger photos_pair_same_job before insert or update of pair_id, job_id on public.photos
  for each row execute function private.photo_pair_same_job();
