#!/usr/bin/env node
/**
 * Read only sanity check of production after a merge to main.
 *
 *   node scripts/prod-smoke.mjs
 *
 * Writes nothing anywhere. No quote is submitted, so no email, row, folder or
 * text is created. It loads pages, sends /api/quote a request the route
 * refuses before doing any work, and probes the live sheet webhook without a
 * secret, which the script answers with "forbidden" before touching the sheet.
 *
 * Requests are spaced out on purpose. Hitting production quickly trips
 * Vercel's bot checkpoint, which answers 403 and looks like a broken deploy.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://coastalsurfacerestoration.com';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
const check = (label, ok, detail = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok || !detail ? '' : `\n      ${detail}`}`);
};

async function page(path, mustContain = []) {
  const res = await fetch(`${SITE}${path}`, { redirect: 'follow' });
  const html = await res.text();
  const missing = mustContain.filter((text) => !html.includes(text));
  check(`${path} loads${mustContain.length ? ' with expected text' : ''}`, res.status === 200 && missing.length === 0,
    `status ${res.status}${missing.length ? `, missing: ${missing.join(' | ')}` : ''}`);
  await sleep(1500);
  return html;
}

await page('/', ['late October 2026']);
await page('/quote', ['How did you hear about us?', 'Referred by', 'Drove by/saw the truck']);
await page('/gallery', ['late October 2026']);
await page('/how-laser-cleaning-works', ['late October 2026']);
await page('/thank-you');

// A JSON body is not multipart, so the route answers 400 before validation,
// the rate limiter, or any email or sheet call.
const api = await fetch(`${SITE}/api/quote`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
});
check('/api/quote is up and refuses a malformed request (400)', api.status === 400, `status ${api.status}`);
await sleep(1500);

// The live webhook URL is not in the repo. It comes from the live clasp config
// when that exists on this machine; otherwise this check is skipped.
const liveConfig = join(root, '.env.apps-script.live.local');
const deploymentId = existsSync(liveConfig)
  ? /^DEPLOYMENT_ID=(.+)$/m.exec(readFileSync(liveConfig, 'utf8'))?.[1]?.trim()
  : '';
if (deploymentId) {
  const probe = await fetch(`https://script.google.com/macros/s/${deploymentId}/exec`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
    body: JSON.stringify({ probe: true }),
  });
  const text = (await probe.text()).trim();
  check('live sheet webhook answers "forbidden" to a probe (deployed and authorized)', text === 'forbidden',
    text.startsWith('<') ? 'got an HTML page: wrong URL, or the script needs authorizing' : text.slice(0, 120));
} else {
  console.log('SKIP  live webhook probe (no .env.apps-script.live.local on this machine)');
}

const failed = results.filter((ok) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
