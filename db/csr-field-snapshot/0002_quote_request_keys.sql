-- 0002: natural keys for quote requests, so imports and the website can upsert without duplicates.
--   sheet_timestamp: the exact column A text of the Quote Requests Log row (ISO for form rows, a hand-typed
--                    date for older rows). Text on purpose: it is matched byte for byte, never re-parsed.
--   submission_id:   the website form's own id for a submission (Phase 3), so a retried POST can't double-insert.
-- Grants are table-level and RLS policies cover whole rows, so both columns inherit owner-only access.

alter table public.quote_requests
  add column if not exists sheet_timestamp text check (length(sheet_timestamp) between 1 and 64),
  add column if not exists submission_id uuid;

-- Rows imported before this migration kept the column A text in raw_payload.
update public.quote_requests
  set sheet_timestamp = raw_payload->>'sheet_timestamp'
  where sheet_timestamp is null and raw_payload ? 'sheet_timestamp';

create unique index if not exists quote_requests_sheet_timestamp_uq on public.quote_requests (sheet_timestamp);
create unique index if not exists quote_requests_submission_id_uq on public.quote_requests (submission_id);
