-- Job day: the coat timer and the on-site checklist.
-- job_coats: one row per finished coat (primer, topcoats), with the data-sheet hours and the site temp and humidity.
-- job_checklist_ticks: one row per ticked checklist item (gates and order of work), with an optional photo.
--   The item list itself is built in code from the job (src/lib/domain/jobday.ts); a tick stores the key and the
--   text as it read when ticked. Unticking deletes the row; the audit log keeps the record.
-- Both: owner-only RLS (forced), audit, PII check, and only on committed jobs (booked or later), which the jobs
-- gate trigger already guarantees have no open hard gate.

create or replace function private.require_committed_job()
returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists (
    select 1 from public.jobs j
    where j.id = new.job_id and j.status in ('booked', 'scheduled', 'done', 'paid', 'closed')
  ) then
    raise exception 'GATE: book the job (every gate clear) before logging job-day work.' using errcode = 'check_violation';
  end if;
  return new;
end $$;

create table public.job_coats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  coat text not null check (coat in ('primer', 'topcoat_1', 'topcoat_2', 'touch_up')),
  product text check (length(product) between 1 and 80),
  finished_at timestamptz not null default now(),
  touch_hours numeric(5, 2) check (touch_hours > 0 and touch_hours <= 72),
  handle_hours numeric(5, 2) check (handle_hours > 0 and handle_hours <= 168),
  recoat_hours numeric(5, 2) not null default 24 check (recoat_hours > 0 and recoat_hours <= 168),
  temp_f numeric(4, 1) check (temp_f between -20 and 130),
  rh_pct numeric(4, 1) check (rh_pct between 0 and 100),
  note text check (length(note) <= 300),
  constraint job_coats_no_pii check (not private.has_forbidden_pii(product) and not private.has_forbidden_pii(note))
);
create index job_coats_job_idx on public.job_coats (job_id, finished_at);

create table public.job_checklist_ticks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  item_key text not null check (item_key ~ '^(gate|work):[a-z0-9-]{1,80}$'),
  item_text text not null check (length(item_text) between 1 and 300),
  done_at timestamptz not null default now(),
  photo_id uuid references public.photos (id) on delete set null,
  note text check (length(note) <= 300),
  unique (job_id, item_key),
  constraint job_ticks_no_pii check (not private.has_forbidden_pii(item_text) and not private.has_forbidden_pii(note))
);

alter table public.job_coats enable row level security;
alter table public.job_coats force row level security;
alter table public.job_checklist_ticks enable row level security;
alter table public.job_checklist_ticks force row level security;
revoke all on public.job_coats from anon, authenticated, public;
revoke all on public.job_checklist_ticks from anon, authenticated, public;
grant select, insert, update, delete on public.job_coats to authenticated;
grant select, insert, update, delete on public.job_checklist_ticks to authenticated;
create policy owner_all on public.job_coats for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_all on public.job_checklist_ticks for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));

create trigger job_coats_committed before insert or update on public.job_coats for each row execute function private.require_committed_job();
create trigger job_ticks_committed before insert or update on public.job_checklist_ticks for each row execute function private.require_committed_job();
create trigger job_coats_updated_at before update on public.job_coats for each row execute function private.set_updated_at();
create trigger job_ticks_updated_at before update on public.job_checklist_ticks for each row execute function private.set_updated_at();
create trigger job_coats_audit after insert or update or delete on public.job_coats for each row execute function private.audit_row();
create trigger job_ticks_audit after insert or update or delete on public.job_checklist_ticks for each row execute function private.audit_row();
