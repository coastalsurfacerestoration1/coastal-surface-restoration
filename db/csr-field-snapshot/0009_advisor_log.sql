-- Settings advisor log: every question and answer, kept for the LLM training set.
-- Append-only (no update, no delete), owner-only RLS (forced), audit trigger, and the same PII check as the
-- rest of the app on the question and the answer.

create table public.advisor_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  question text not null check (length(question) between 1 and 2000),
  job_id uuid references public.jobs (id) on delete set null,
  kind text not null check (kind in ('stop', 'no_laser', 'setting', 'untested', 'error')),
  answer jsonb not null,            -- what Tyler saw (after the guard rails)
  model_output jsonb,               -- what the model returned, before the guard rails (null for rules-only answers)
  model text not null check (length(model) <= 80), -- e.g. claude-fable-5-1, or rules
  sources text[] not null default '{}',
  corrected text[] not null default '{}',
  preset_version text not null check (length(preset_version) <= 40),
  constraint advisor_log_no_pii check (not private.has_forbidden_pii(question) and not private.has_forbidden_pii(answer::text))
);
create index advisor_log_created_idx on public.advisor_log (created_at desc);

alter table public.advisor_log enable row level security;
alter table public.advisor_log force row level security;
revoke all on public.advisor_log from anon, authenticated, public;
grant select, insert on public.advisor_log to authenticated;
create policy owner_select on public.advisor_log for select to authenticated using ((select public.is_owner()));
create policy owner_insert on public.advisor_log for insert to authenticated with check ((select public.is_owner()));
create trigger advisor_log_append_only before update or delete on public.advisor_log
  for each row execute function private.block_mutation();
create trigger advisor_log_audit after insert on public.advisor_log for each row execute function private.audit_row();
