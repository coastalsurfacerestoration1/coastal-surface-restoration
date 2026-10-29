-- Pipeline board: who referred a contact, and when Tyler asked for a review.
-- Stages are derived from existing job fields (see src/lib/domain/pipeline.ts), so job_status and the gate
-- trigger are unchanged: booking still needs every gate clear.

alter table public.contacts
  add column referred_by uuid references public.contacts (id) on delete set null,
  add constraint contacts_referred_by_not_self check (referred_by is null or referred_by <> id);
create index contacts_referred_by_idx on public.contacts (referred_by) where referred_by is not null;

-- Review asked only after the job is paid (or closed after being paid).
alter table public.jobs
  add column review_asked_at timestamptz,
  add constraint jobs_review_after_paid check (review_asked_at is null or status in ('paid', 'closed'));
