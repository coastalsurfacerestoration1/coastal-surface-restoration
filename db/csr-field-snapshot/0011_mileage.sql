-- Mileage: one row per trip, in the same shape as the tax log (Drive "CSR Mileage Log 2026":
-- date, from, to, purpose, round_trip_miles_est, miles_note, source). Rate stored per trip (72.5 cents for 2026).
-- Owner-only RLS (forced), audit, PII check. Trips can be fixed or removed (mis-taps); the audit log keeps a record.

create table public.mileage_trips (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  trip_date date not null,
  kind text not null check (kind in ('job', 'store', 'other')),
  from_place text not null default 'Home' check (length(from_place) between 1 and 160),
  to_place text not null check (length(to_place) between 1 and 160),
  purpose text not null check (length(purpose) between 1 and 200),
  round_trip boolean not null default true,
  miles numeric(7, 1) not null check (miles > 0 and miles <= 2000), -- the tax log's round_trip_miles_est (total for the trip)
  miles_note text not null default 'est.' check (miles_note in ('est.', 'odometer', 'map')),
  rate_cents numeric(5, 1) not null default 72.5 check (rate_cents > 0 and rate_cents < 1000),
  source text not null default 'CSR Field' check (length(source) <= 80),
  job_id uuid references public.jobs (id) on delete set null,
  constraint mileage_no_pii check (not private.has_forbidden_pii(to_place) and not private.has_forbidden_pii(purpose) and not private.has_forbidden_pii(from_place))
);
create index mileage_trips_date_idx on public.mileage_trips (trip_date desc);

alter table public.mileage_trips enable row level security;
alter table public.mileage_trips force row level security;
revoke all on public.mileage_trips from anon, authenticated, public;
grant select, insert, update, delete on public.mileage_trips to authenticated;
create policy owner_all on public.mileage_trips for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create trigger mileage_trips_updated_at before update on public.mileage_trips for each row execute function private.set_updated_at();
create trigger mileage_trips_audit after insert or update or delete on public.mileage_trips for each row execute function private.audit_row();
