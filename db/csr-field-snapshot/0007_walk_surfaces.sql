-- Walkthrough surfaces: what's there, how much, how it gets done, photos and dictated notes. They write the
-- job's scope and seed the quote. Owner-only RLS (forced), audit, updated_at and PII checks as in 0001.
-- Hard rule in the database: plated surfaces get no laser.

create table public.walk_surfaces (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  position integer not null default 0 check (position between 0 and 100000),
  label text not null check (length(label) between 1 and 120),
  material text check (material in ('iron', 'steel', 'cast_iron', 'brass', 'bronze', 'copper', 'aluminum', 'stainless',
                                    'plated', 'galvanized', 'wood', 'stone', 'other')),
  method text not null default 'laser' check (method in ('laser', 'hand_polish', 'strip_paint', 'hand', 'none')),
  qty numeric(10, 2) check (qty >= 0 and qty <= 100000),
  unit text check (unit in ('lf', 'sqft', 'ea', 'hr')),
  rate_cents integer check (rate_cents between 0 and 10000000),
  measurements text check (length(measurements) <= 1000),
  note text check (length(note) <= 4000),
  constraint walk_surfaces_no_pii check (not private.has_forbidden_pii(label) and not private.has_forbidden_pii(measurements)
                                         and not private.has_forbidden_pii(note)),
  constraint walk_surfaces_no_laser_on_plated check (not (material = 'plated' and method = 'laser'))
);
create index walk_surfaces_job_idx on public.walk_surfaces (job_id, position);

alter table public.walk_surfaces enable row level security;
alter table public.walk_surfaces force row level security;
revoke all on public.walk_surfaces from anon, authenticated, public;
grant select, insert, update, delete on public.walk_surfaces to authenticated;
create policy owner_all on public.walk_surfaces for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create trigger walk_surfaces_updated_at before update on public.walk_surfaces for each row execute function private.set_updated_at();
create trigger walk_surfaces_audit after insert or update or delete on public.walk_surfaces for each row execute function private.audit_row();

-- A photo can belong to a surface on the same job.
alter table public.photos
  add column surface_id uuid references public.walk_surfaces (id) on delete set null;
create index photos_surface_idx on public.photos (surface_id) where surface_id is not null;

create or replace function private.photo_surface_same_job()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.surface_id is not null and not exists (select 1 from public.walk_surfaces s where s.id = new.surface_id and s.job_id = new.job_id) then
    raise exception 'Surface must be on the same job as the photo.' using errcode = 'check_violation';
  end if;
  return new;
end $$;
create trigger photos_surface_same_job before insert or update of surface_id, job_id on public.photos
  for each row execute function private.photo_surface_same_job();
