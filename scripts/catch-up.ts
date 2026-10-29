/**
 * G1b catch-up: copy form quotes that reached the sheet after the 10/22
 * backfill snapshot into Supabase, through the same ingest function the site
 * uses. Dry run unless --apply.
 *
 *   npm run catch-up -- --env <file> [--out <report.md>]
 *   npm run catch-up -- --env <file> --apply --confirm <n>   (only on Tyler's go)
 *
 * The env file (outside git, never printed) holds:
 *   QUOTE_SHEET_ID, GOOGLE_SHEETS_READER_KEY   the sheet, read only
 *   SUPABASE_RECONCILE_URL                     which rows Supabase already has
 *   SUPABASE_INGEST_URL                        --apply only
 *
 * The report names people, so it is written outside the repo (default
 * C:\Code\csr-import-out) and the console shows counts only. --apply must be
 * given the number of rows the dry run said it would insert, so a plan that
 * changed since Tyler read the report is refused.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { catchUpReport, planCatchUp } from '@/lib/catch-up';
import { readSheetValues, readSupabase } from '@/lib/reconcile';
import { CSR_FIELD_PROJECT_REF, supabaseTls } from '@/lib/supabase-ingest';

const root = path.resolve(__dirname, '..');

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

function loadEnv(file: string): Record<string, string> {
  return Object.fromEntries(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((l) => /^[A-Z_]+=/.test(l))
      .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
  );
}

/** Which project a URL points at, from the pooler user name, for the report. */
function projectOf(url: string): string {
  const ref = /\/\/[^.:/]+\.([a-z0-9]{20})[:@]/i.exec(url)?.[1]?.toLowerCase() ?? 'unknown project';
  return ref === CSR_FIELD_PROJECT_REF ? 'csr-field' : `project ${ref}`;
}

async function main() {
  const envFile = arg('env');
  if (!envFile) throw new Error('--env <file> is required');
  const env = loadEnv(envFile);
  if (!env.SUPABASE_RECONCILE_URL) throw new Error('SUPABASE_RECONCILE_URL missing from the env file');
  const target = projectOf(env.SUPABASE_RECONCILE_URL);

  const out = path.resolve(
    arg('out') ?? `C:/Code/csr-import-out/catch-up-${new Date().toISOString().slice(0, 10)}.md`,
  );
  if (out.toLowerCase().startsWith(root.toLowerCase() + path.sep)) {
    throw new Error('The report names customers; write it outside the repo');
  }

  const values = await readSheetValues('A2:S', env);
  const stamps = values.map((r) => r[0]).filter((v): v is string => typeof v === 'string' && /^\d{4}-/.test(v)).sort();
  const inSupabase = new Set<string>();
  if (stamps.length) {
    const until = new Date(Date.now() + 86_400_000);
    for (let start = new Date(Date.parse(stamps[0]) - 60_000); start < until; ) {
      const end = new Date(Math.min(until.getTime(), start.getTime() + 30 * 86_400_000));
      for (const r of await readSupabase(start, end, env)) inSupabase.add(r.sheet_timestamp);
      start = end;
    }
  }

  const plan = planCatchUp(values, inSupabase);
  let report = catchUpReport(plan, target);

  if (process.argv.includes('--apply')) {
    const confirm = Number(arg('confirm'));
    if (confirm !== plan.toInsert.length) {
      throw new Error(`--confirm ${arg('confirm')} does not match the ${plan.toInsert.length} rows planned now. Re-run the dry run.`);
    }
    if (!env.SUPABASE_INGEST_URL) throw new Error('SUPABASE_INGEST_URL missing from the env file');
    if (projectOf(env.SUPABASE_INGEST_URL) !== target) throw new Error('Ingest and reconcile URLs point at different projects');

    const sql = postgres(env.SUPABASE_INGEST_URL, { max: 1, prepare: false, ssl: supabaseTls(), connect_timeout: 10, onnotice: () => {} });
    const results: string[] = [];
    let ok = 0;
    try {
      for (const { payload } of plan.toInsert) {
        try {
          const [{ r }] = await sql<{ r: { id: string; duplicate: boolean } }[]>`
            select public.ingest_quote_request(${sql.json(payload)}) as r`;
          ok += 1;
          results.push(`| ${payload.sheet_timestamp} | ${r.duplicate ? 'already there' : 'inserted'} |`);
        } catch (error) {
          results.push(`| ${payload.sheet_timestamp} | refused: ${String((error as Error).message).slice(0, 100)} |`);
        }
      }
    } finally {
      await sql.end({ timeout: 2 });
    }
    report = report.replace('Nothing was written.', `Applied: ${ok} of ${plan.toInsert.length} written.`);
    report += `\n## Applied\n\n| Column A | Result |\n|---|---|\n${results.join('\n')}\n`;
  }

  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, report);
  console.log(
    `${process.argv.includes('--apply') ? 'APPLIED' : 'DRY RUN'} against ${target}: ` +
      `${plan.sheetFormRows} form rows, ${plan.alreadyInSupabase} already in Supabase, ` +
      `${plan.toInsert.length} to insert, ${plan.olderMissing.length} older missing, ` +
      `${plan.wouldBeRefused.length} would be refused. Report: ${out}`,
  );
}

main().catch((error) => {
  console.error(`catch-up stopped: ${String(error?.message ?? error).replace(/postgres(ql)?:\/\/\S+/gi, '[url]')}`);
  process.exit(1);
});
