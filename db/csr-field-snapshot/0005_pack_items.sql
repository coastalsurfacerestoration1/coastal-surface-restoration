-- Editable pack list. Every laser job gets the "every" kit; a job's pack_kinds add theirs.
-- Items are never deleted (switch active off), so ticks saved in jobs.pack_done always resolve.
-- Owner-only RLS (forced), audit trigger, updated_at trigger, PII check: same pattern as 0001.

create table public.pack_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  key text not null unique check (key ~ '^[a-z0-9-]{1,40}$'),
  kind text not null check (kind in ('every', 'painted', 'strip_paint', 'brass', 'wood')),
  label text not null check (length(label) between 1 and 160),
  position integer not null default 0 check (position between 0 and 100000),
  active boolean not null default true,
  constraint pack_items_no_pii check (not private.has_forbidden_pii(label))
);

alter table public.pack_items enable row level security;
alter table public.pack_items force row level security;
revoke all on public.pack_items from anon, authenticated, public;
grant select, insert, update on public.pack_items to authenticated;
create policy owner_all on public.pack_items for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create trigger pack_items_updated_at before update on public.pack_items for each row execute function private.set_updated_at();
create trigger pack_items_audit after insert or update or delete on public.pack_items for each row execute function private.audit_row();

alter table public.jobs
  add column pack_kinds text[] not null default '{}',
  add constraint jobs_pack_kinds_shape check (pack_kinds <@ array['painted', 'strip_paint', 'brass', 'wood']::text[]);

-- Tyler's list, 2026-10-26 (mirrors DEFAULT_PACK in src/lib/domain/pack.ts).
insert into public.pack_items (key, kind, label, position) values
  ('laser', 'every', 'Laser, cleaning head and lens cap', 10),
  ('lenses', 'every', 'Spare protective lenses and lens wipes', 20),
  ('air', 'every', 'Compressor, 100 ft hose, water separator', 30),
  ('power', 'every', '100 ft 12/3 cord, 50 ft cord, outlet tester', 40),
  ('generator', 'every', 'Generator and fuel (backup)', 50),
  ('eyewear', 'every', 'Laser eyewear x2 (1064 nm rated)', 60),
  ('respirator', 'every', 'P100 respirator', 70),
  ('gloves', 'every', 'Gloves', 80),
  ('cones', 'every', 'Cones and laser-in-use sign', 90),
  ('fire', 'every', 'Fire extinguisher and spray bottle', 100),
  ('extractor', 'every', 'Fume extractor', 110),
  ('backstop', 'every', 'Welding blanket and cement board backstop', 120),
  ('binder', 'every', 'Job binder (NHZ, SDS, forms)', 130),
  ('measure', 'every', 'Tape measure, magnet, marker, timer', 140),
  ('first-aid', 'every', 'First aid kit', 150),
  ('camera', 'every', 'Tripod, phone charged, power bank', 160),
  ('cards', 'every', 'Review QR card and business cards', 170),
  ('lead-swabs', 'painted', 'Lead test swabs (gate)', 10),
  ('painters-tape', 'painted', 'Painter''s tape', 20),
  ('masking', 'painted', 'Masking paper or plastic', 30),
  ('wire-brush', 'strip_paint', 'Wire brush', 10),
  ('sawhorses', 'strip_paint', 'Sawhorses', 20),
  ('primer-paint', 'strip_paint', 'Primer and paint (confirm who supplies)', 30),
  ('brushes', 'strip_paint', 'Foam brushes, mini roller and tray, small brush', 40),
  ('sponges', 'strip_paint', '220 and 320 grit sponges', 50),
  ('tack', 'strip_paint', 'Tack cloths', 60),
  ('spirits', 'strip_paint', 'Mineral spirits', 70),
  ('drops', 'strip_paint', 'Drop cloths, rags, stir sticks, can opener', 80),
  ('polishes', 'brass', 'Simichrome, Mothers, Renaissance Wax', 10),
  ('drill-felt', 'brass', 'Drill and felt bits', 20),
  ('buff-kit', 'brass', 'Cotton buff kit', 30),
  ('orbit', 'brass', 'Random orbit polisher and EdgeGuard 3 in pads', 40),
  ('microfiber', 'brass', 'Microfiber and flannelette', 50),
  ('alcohol', 'brass', '91 to 99% alcohol', 60),
  ('nitrile', 'brass', 'Nitrile gloves', 70),
  ('plastic-razor', 'brass', 'Plastic razor blades', 80),
  ('glass-cleaner', 'brass', 'Ammonia-free glass cleaner', 90),
  ('acetone', 'brass', 'Acetone and swabs', 100),
  ('scrapers', 'wood', 'Putty knife and scrapers', 10),
  ('wood-grits', 'wood', '120, 150 and 220 grit', 20),
  ('alcohol-wipes', 'wood', 'Alcohol wipes', 30),
  ('fans', 'wood', 'Extra fans', 40);
