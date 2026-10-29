import { createHash } from 'node:crypto';
import { FORM_TIMESTAMP, cellText } from '@/lib/reconcile';
import type { IngestPayload } from '@/lib/supabase-ingest';

/**
 * G1b catch-up: form quotes that reached the sheet after the 10/22 backfill
 * snapshot but are not in Supabase, because dual-write was not live yet.
 *
 * Pure planning here; scripts/catch-up.ts does the reading and, only with
 * Tyler's go, the writing. Each missing row becomes the same payload the site
 * sends, through the same ingest function, so the database rules (contacts,
 * scrubbing, no consent) are identical. Hand-typed rows (a date, not the
 * form's ISO timestamp) are never touched; those were matched by hand.
 */

/** When the backfill snapshot was taken. Missing rows older than this are flagged, not inserted. */
export const SNAPSHOT_CUTOFF = '2026-10-23T04:00:00.000Z';

/**
 * A stable submission id per sheet row, so running the catch-up twice can
 * never add a row twice: the second run hits the same id and the database
 * returns the first. Shaped as a uuid, from a hash of the column A text.
 */
export function catchUpSubmissionId(sheetTimestamp: string): string {
  const h = createHash('sha256').update(`csr-catch-up:${sheetTimestamp}`).digest('hex');
  // Version 8 (custom) and the RFC 4122 variant, so it reads as a valid uuid.
  const variant = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-8${h.slice(13, 16)}-${variant}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/** Column M (Out of Area) back to the area the route decided. */
export function areaFromNote(note: string): IngestPayload['area'] {
  const n = note.trim().toLowerCase();
  if (n === '') return 'in';
  if (n.startsWith('blocked')) return 'near';
  if (n.startsWith('dropped')) return 'out';
  return 'unknown';
}

/**
 * One sheet row (A to S, by position) as the ingest payload. Column L,
 * texting consent, is skipped on purpose: it stays in the sheet until Phase 4.
 */
export function payloadFromSheetRow(r: unknown[]): IngestPayload {
  const c = (i: number) => cellText(r[i]).trim();
  const photos = Number(r[10]);
  return {
    submission_id: catchUpSubmissionId(c(0)),
    sheet_timestamp: c(0),
    name: c(1),
    email: c(2),
    phone: c(3),
    street: c(4),
    city: c(5),
    state: c(6),
    zip: c(7),
    service: c(8),
    description: c(9),
    photos: Number.isFinite(photos) ? Math.min(Math.max(Math.trunc(photos), 0), 20) : 0,
    area: areaFromNote(c(12)),
    out_of_area: c(12),
    spam: c(13).toLowerCase() === 'flagged',
    how_heard: c(17),
    referred_by: c(18),
    sheet: 'ok',
  };
}

export type PlannedRow = { payload: IngestPayload; problem?: string };

export type CatchUpPlan = {
  cutoff: string;
  sheetFormRows: number;
  alreadyInSupabase: number;
  /** After the snapshot and missing: what --apply would insert. */
  toInsert: PlannedRow[];
  /** Missing but older than the snapshot: the backfill should have them. Listed for a look, never inserted. */
  olderMissing: PlannedRow[];
  /** Rows the database would refuse (no email and no phone, no name). Listed, never sent. */
  wouldBeRefused: PlannedRow[];
  handTyped: number;
};

/** The database's own rule, checked up front so the report shows refusals before anything runs. */
function problemWith(p: IngestPayload): string | undefined {
  if (!p.name) return 'no name';
  if (!p.email && !p.phone) return 'no email and no phone';
  const digits = p.phone.replace(/\D/g, '');
  if (p.phone && !(digits.length === 10 || (digits.length === 11 && digits.startsWith('1')))) return 'phone is not a US number';
  return undefined;
}

export function planCatchUp(sheetValues: unknown[][], inSupabase: Set<string>, cutoff = SNAPSHOT_CUTOFF): CatchUpPlan {
  const plan: CatchUpPlan = {
    cutoff,
    sheetFormRows: 0,
    alreadyInSupabase: 0,
    toInsert: [],
    olderMissing: [],
    wouldBeRefused: [],
    handTyped: 0,
  };
  for (const r of sheetValues) {
    const ts = typeof r[0] === 'string' ? r[0].trim() : '';
    if (!FORM_TIMESTAMP.test(ts)) {
      if (cellText(r[1]).trim()) plan.handTyped += 1;
      continue;
    }
    plan.sheetFormRows += 1;
    if (inSupabase.has(ts)) {
      plan.alreadyInSupabase += 1;
      continue;
    }
    const payload = payloadFromSheetRow(r);
    const problem = problemWith(payload);
    if (problem) plan.wouldBeRefused.push({ payload, problem });
    else if (ts < cutoff) plan.olderMissing.push({ payload });
    else plan.toInsert.push({ payload });
  }
  return plan;
}

/**
 * The dry-run report, as Markdown for Tyler. It names people, so it is
 * written outside the repo and never logged.
 */
export function catchUpReport(plan: CatchUpPlan, target: string, generatedAt = new Date()): string {
  const row = ({ payload: p, problem }: PlannedRow) =>
    `| ${p.sheet_timestamp} | ${md(p.name)} | ${md(p.service)} | ${p.area} | ${p.spam ? 'yes' : ''} | ` +
    `${p.spam || p.area === 'out' ? 'no' : 'if no match'} |${problem === undefined ? '' : ` ${md(problem)} |`}`;
  const head = '| Column A | Name | Service | Area | Spam | New lead contact |\n|---|---|---|---|---|---|';
  const lines = [
    `# G1b catch-up, dry run`,
    '',
    `Generated ${generatedAt.toISOString()} against ${target}. Nothing was written.`,
    '',
    `- Form rows in the sheet: ${plan.sheetFormRows} (hand-typed rows skipped: ${plan.handTyped})`,
    `- Already in Supabase: ${plan.alreadyInSupabase}`,
    `- **Would insert: ${plan.toInsert.length}** (form rows after the snapshot, ${plan.cutoff})`,
    `- Missing but older than the snapshot: ${plan.olderMissing.length} (not inserted; check against the backfill)`,
    `- The database would refuse: ${plan.wouldBeRefused.length} (not sent)`,
    '',
    '## Would insert',
    '',
    plan.toInsert.length ? `${head}\n${plan.toInsert.map(row).join('\n')}` : 'None.',
    '',
    'Each goes through public.ingest_quote_request, the same path as the website. A contact is created only when',
    'neither the phone nor the email matches an existing contact, and linked only when both match one. Spam and',
    'quotes past 50 miles never get a contact. Texting consent (column L) is not copied.',
    '',
    '## Missing but older than the snapshot',
    '',
    plan.olderMissing.length ? `${head}\n${plan.olderMissing.map(row).join('\n')}` : 'None.',
    '',
    '## Would be refused',
    '',
    plan.wouldBeRefused.length
      ? `| Column A | Name | Service | Area | Spam | New lead contact | Why |\n|---|---|---|---|---|---|---|\n${plan.wouldBeRefused.map(row).join('\n')}`
      : 'None.',
    '',
    `To apply after Tyler's go: \`npm run catch-up -- --env <file> --apply --confirm ${plan.toInsert.length}\``,
    '',
  ];
  return lines.join('\n');
}

const md = (s: string) => s.replace(/\|/g, '/').replace(/\s+/g, ' ').slice(0, 60);
