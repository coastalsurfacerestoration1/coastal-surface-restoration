import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BUSINESS, SITE_NAME } from '@/lib/seo';
import { compare, hasProblems, readSheet, readSupabase, reportEmail } from '@/lib/reconcile';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const IS_PRODUCTION = process.env.VERCEL_ENV === 'production';
const TEST_TAG = IS_PRODUCTION ? '' : '[TEST] ';
const NOTIFY_TO = (!IS_PRODUCTION && process.env.QUOTE_NOTIFY_TO) || BUSINESS.email;
const FROM = `${SITE_NAME} <quotes@coastalsurfacerestoration.com>`;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const got = Buffer.from(req.headers.get('authorization') ?? '');
  const want = Buffer.from(`Bearer ${secret}`);
  return got.length === want.length && timingSafeEqual(got, want);
}

/**
 * Nightly quote log check (Vercel Cron, see vercel.json). Compares the sheet
 * with Supabase over the last 48 hours and emails Tyler only when a row is
 * missing or differs. Read only on both sides.
 *
 * ?hours=1..720 widens or narrows the window, and ?lag=0..60 sets how many
 * minutes before now it ends (default 5, so copies still in flight are not
 * flagged). Both exist for the end-to-end test.
 */
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const params = new URL(req.url).searchParams;
  const hours = clamp(Number(params.get('hours') ?? 48), 1, 720);
  const lag = clamp(Number(params.get('lag') ?? 5), 0, 60);
  const until = new Date(Date.now() - lag * 60_000);
  const since = new Date(until.getTime() - hours * 3_600_000);

  let report;
  try {
    // Supabase caps a single call at 31 days, so wider windows go in pieces.
    const db = [];
    for (let start = since; start < until; ) {
      const end = new Date(Math.min(until.getTime(), start.getTime() + 30 * 86_400_000));
      db.push(...(await readSupabase(start, end)));
      start = end;
    }
    report = compare(await readSheet(), db, since, until);
  } catch (error) {
    console.error(`Quote log check could not run: ${String(error).slice(0, 200)}`);
    return NextResponse.json({ error: 'check failed' }, { status: 500 });
  }

  let emailed = false;
  if (hasProblems(report)) {
    const { subject, text } = reportEmail(report, TEST_TAG);
    try {
      const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: FROM, to: NOTIFY_TO, subject, text });
      if (error) console.error('Quote log check email error:', error);
      else emailed = true;
    } catch (error) {
      console.error('Quote log check email error:', error);
    }
  }

  console.log(
    `Quote log check: ${report.sheetRows} sheet, ${report.supabaseRows} Supabase, ` +
      `${report.missingInSupabase.length} missing in Supabase, ${report.missingInSheet.length} missing in sheet, ` +
      `${report.mismatched.length} mismatched.`,
  );

  // Timestamps only: no names or contact details in the response.
  return NextResponse.json({
    ok: true,
    window: report.window,
    sheetRows: report.sheetRows,
    supabaseRows: report.supabaseRows,
    missingInSupabase: report.missingInSupabase.map((r) => r.timestamp),
    missingInSheet: report.missingInSheet.map((r) => r.sheet_timestamp),
    mismatched: report.mismatched.map((r) => r.timestamp),
    emailed,
  });
}

function clamp(n: number, lo: number, hi: number): number {
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : lo;
}
