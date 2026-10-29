-- Advisor log: allow the "info" kind (answers that need no laser setting, e.g. PwrRamp, eyewear, pricing).
alter table public.advisor_log drop constraint advisor_log_kind_check;
alter table public.advisor_log add constraint advisor_log_kind_check
  check (kind in ('stop', 'no_laser', 'setting', 'untested', 'info', 'error'));
