#!/usr/bin/env node
/**
 * End to end test of the quote pipeline against a preview deployment.
 *
 *   node scripts/e2e-quote.mjs https://<preview>.vercel.app
 *
 * Submits real quotes through the deployed /api/quote, then asks the TEST
 * sheet's Apps Script what actually landed in Drive and the sheet. Only ever
 * runs against the TEST sheet and 15 - Jobs (TEST): the verify action refuses
 * to answer on the live deployment, and this refuses a production URL.
 *
 * Reads .env.test.local (git ignored):
 *   VERCEL_AUTOMATION_BYPASS_SECRET   gets past preview deployment protection
 *   TEST_QUOTE_SHEET_WEBHOOK_URL      the TEST sheet's /exec URL
 *   TEST_QUOTE_SHEET_SECRET           its secret
 *
 * Three submissions, the most the per IP rate limit allows in 10 minutes, so
 * wait that long between runs. Side effects, all marked [TEST]: three
 * notification emails to quotes@, three acknowledgements to
 * delivered@resend.dev, three reminders 48 hours out, three rows in the TEST
 * sheet and two job folders (the spam case gets none).
 */
import { readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = Object.fromEntries(
  readFileSync(join(root, '.env.test.local'), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1).trim()]),
);

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!/^https:\/\/.+\.vercel\.app$/.test(base) || base.includes('coastalsurfacerestoration.com')) {
  console.error('Pass a preview URL, e.g. https://coastal-surface-restorat-git-xxxx.vercel.app');
  process.exit(1);
}
for (const key of ['VERCEL_AUTOMATION_BYPASS_SECRET', 'TEST_QUOTE_SHEET_WEBHOOK_URL', 'TEST_QUOTE_SHEET_SECRET']) {
  if (!env[key]) {
    console.error(`.env.test.local is missing ${key}`);
    process.exit(1);
  }
}

const SUBFOLDERS = ['Photos (Before & After)', 'Quotes & Invoices', 'Signed Forms'];
const results = [];
const check = (label, ok, detail = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok || !detail ? '' : `\n      ${detail}`}`);
};

/** A real, decodable solid colour PNG, so Drive stores an actual image. */
function png(r, g, b, size = 16) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE(crc(body));
    return Buffer.concat([len, body, sum]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // truecolour
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array(size).fill([r, g, b]).flat())]);
  const pixels = Buffer.concat(Array(size).fill(row));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(pixels)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

async function verify(name) {
  const res = await fetch(env.TEST_QUOTE_SHEET_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
    body: JSON.stringify({ secret: env.TEST_QUOTE_SHEET_SECRET, action: 'verify', name }),
  });
  const text = (await res.text()).trim();
  const [verdict, ...rest] = text.split('\n');
  if (verdict !== 'ok') throw new Error(`verify replied: ${text.slice(0, 200)}`);
  return JSON.parse(rest.join('\n'));
}

async function submit(fields, photos) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  photos.forEach((bytes, i) => form.append('photos', new Blob([bytes], { type: 'image/png' }), `p${i}.png`));
  const res = await fetch(`${base}/api/quote`, {
    method: 'POST',
    body: form,
    headers: { 'x-vercel-protection-bypass': env.VERCEL_AUTOMATION_BYPASS_SECRET },
  });
  return { status: res.status, body: await res.text() };
}

/** Polls until `done` says so, since photos are copied after the response. */
async function waitFor(name, done, timeoutMs = 90000) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await verify(name);
    if (done(last)) return last;
    await new Promise((r) => setTimeout(r, 4000));
  }
  return last;
}

const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
const year = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric' }).format(new Date());
const pad = (n) => String(n).padStart(3, '0');
const common = {
  email: 'delivered@resend.dev',
  phone: '843-555-2345',
  city: 'Charleston',
  state: 'SC',
  zip: '29401',
  serviceType: 'Other / Not Sure',
};

const before = await verify('nobody');
console.log(`Highest TEST job number before: ${before.highestJobNumber}\n`);

// Case 1: both optional answers and two photos.
const name1 = `E2E Test ${stamp}`;
const street1 = '100 Test Lane';
const sent1 = await submit(
  {
    ...common,
    name: name1,
    street: street1,
    description: 'Automated end to end test. Ignore.',
    howHeard: 'Other: e2e test',
    referredBy: 'E2E Referrer',
  },
  [png(200, 60, 40), png(40, 120, 200)],
);
check('quote with photos accepted (200)', sent1.status === 200, `${sent1.status} ${sent1.body}`);

const got1 = await waitFor(name1, (v) => v.folders[0]?.subfolders?.[SUBFOLDERS[0]]?.length >= 2);
const folder1 = got1.folders[0];
const expected1 = `J-${year}-${pad(before.highestJobNumber + 1)} ${name1}, ${street1}`;
check('exactly one job folder created', got1.folders.length === 1, `found ${got1.folders.length}`);
check(`folder named "${expected1}"`, folder1?.name === expected1, `got "${folder1?.name}"`);
check(
  'has exactly the three subfolders',
  JSON.stringify(Object.keys(folder1?.subfolders ?? {}).sort()) === JSON.stringify([...SUBFOLDERS].sort()),
  JSON.stringify(Object.keys(folder1?.subfolders ?? {})),
);
const photos1 = folder1?.subfolders?.[SUBFOLDERS[0]] ?? [];
check('both photos are in Photos (Before & After)', photos1.length === 2, JSON.stringify(photos1));
check(
  'photos are PNG images with content',
  photos1.every((f) => f.mimeType === 'image/png' && f.size > 50),
  JSON.stringify(photos1),
);
check(
  'Quotes & Invoices and Signed Forms are empty',
  (folder1?.subfolders?.[SUBFOLDERS[1]] ?? [1]).length === 0 &&
    (folder1?.subfolders?.[SUBFOLDERS[2]] ?? [1]).length === 0,
);
const row1 = got1.rows[0] ?? {};
check('exactly one sheet row', got1.rows.length === 1, `found ${got1.rows.length}`);
check('row Job Folder (Q) links to the folder', row1['Job Folder'] === folder1?.url, `${row1['Job Folder']} vs ${folder1?.url}`);
check('row How They Heard (R)', row1['How They Heard'] === 'Other: e2e test', JSON.stringify(row1['How They Heard']));
check('row Referred By (S)', row1['Referred By'] === 'E2E Referrer', JSON.stringify(row1['Referred By']));
check('row core fields', row1.Street === street1 && Number(row1.Photos) === 2 && row1.ZIP == 29401, JSON.stringify(row1));

// Case 2: no optional answers, no photos. Must still work, numbered next.
const name2 = `E2E Plain ${stamp}`;
const street2 = '200 Test Lane';
const sent2 = await submit(
  { ...common, name: name2, street: street2, description: 'Automated end to end test, no extras. Ignore.' },
  [],
);
check('quote without extras accepted (200)', sent2.status === 200, `${sent2.status} ${sent2.body}`);

const got2 = await waitFor(name2, (v) => v.folders.length > 0, 60000);
const folder2 = got2.folders[0];
const expected2 = `J-${year}-${pad(before.highestJobNumber + 2)} ${name2}, ${street2}`;
check(`next folder numbered "${expected2}"`, folder2?.name === expected2, `got "${folder2?.name}"`);
check('Photos folder empty when no photos sent', (folder2?.subfolders?.[SUBFOLDERS[0]] ?? [1]).length === 0);
const row2 = got2.rows[0] ?? {};
check('blank How They Heard and Referred By', row2['How They Heard'] === '' && row2['Referred By'] === '', JSON.stringify(row2));
check('row 2 Job Folder links to its folder', row2['Job Folder'] === folder2?.url);

// Case 3: the honeypot is filled. The quote still goes through and gets a
// row, but no job folder, so bots cannot fill 15 - Jobs.
const name3 = `E2E Spam ${stamp}`;
const sent3 = await submit(
  { ...common, name: name3, street: '300 Test Lane', description: 'Automated spam case. Ignore.', extraField: 'bot' },
  [],
);
check('spam flagged quote still accepted (200)', sent3.status === 200, `${sent3.status} ${sent3.body}`);
const got3 = await waitFor(name3, (v) => v.rows.length > 0, 60000);
check('spam flagged quote has a sheet row', got3.rows.length === 1 && got3.rows[0]['Spam Flag'] === 'flagged', JSON.stringify(got3.rows));
check('spam flagged quote gets no job folder', got3.folders.length === 0, JSON.stringify(got3.folders));

const failed = results.filter((ok) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
