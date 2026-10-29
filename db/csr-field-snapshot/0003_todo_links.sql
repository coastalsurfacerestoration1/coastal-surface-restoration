-- Today v2: a task can point at the contact or job it's about. A task with a contact or job and a due
-- date is a follow-up. Both links are optional and clear themselves if the record ever goes away.
-- Owner-only RLS, the audit trigger and the PII check on todos are unchanged (set in 0001).

alter table public.todos
  add column contact_id uuid references public.contacts (id) on delete set null,
  add column job_id uuid references public.jobs (id) on delete set null;

create index todos_open_due_idx on public.todos (due) where not done;
create index todos_contact_idx on public.todos (contact_id) where contact_id is not null;
create index todos_job_idx on public.todos (job_id) where job_id is not null;
