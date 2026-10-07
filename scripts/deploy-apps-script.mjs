#!/usr/bin/env node
/**
 * Pushes scripts/apps-script to the quote sheet's Apps Script and redeploys
 * the existing web app, so its /exec URL never changes.
 *
 *   node scripts/deploy-apps-script.mjs test
 *   node scripts/deploy-apps-script.mjs live --confirm-live
 *
 * When the new code needs a permission the old one did not, split it so the
 * live web app never serves code nobody has authorized yet:
 *
 *   ... live --confirm-live --push-only     upload, deployment unchanged
 *   (owner runs `authorize` in the script editor)
 *   ... live --confirm-live --deploy-only   point the deployment at it
 *
 * Per environment settings live in .env.apps-script.<env>.local, which is git
 * ignored because it holds the webhook secret:
 *
 *   SCRIPT_ID=...        the bound script's id
 *   DEPLOYMENT_ID=...    the web app deployment to update (blank on first run)
 *   SECRET=...           same value as QUOTE_SHEET_SECRET in Vercel
 *   JOBS_FOLDER_ID=...   the 15 - Jobs folder this sheet files into
 *
 * Needs clasp logged in as the sheet owner (`clasp login`).
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const LIVE_JOBS_FOLDER_ID = '1py4OwKoqrxhwDcBn7IPpIt6kH9UyRfxF';
const TEST_JOBS_FOLDER_ID = '1zDzvf3chhgm_BJUKCvQYBiXBWqfAG12Y';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = process.argv[2];
if (env !== 'test' && env !== 'live') {
  console.error('Usage: node scripts/deploy-apps-script.mjs test|live [--confirm-live]');
  process.exit(1);
}
if (env === 'live' && !process.argv.includes('--confirm-live')) {
  console.error('Refusing to touch the live sheet without --confirm-live.');
  process.exit(1);
}

const configPath = join(root, `.env.apps-script.${env}.local`);
const config = Object.fromEntries(
  readFileSync(configPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('=') && !line.startsWith('#'))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]),
);

for (const key of ['SCRIPT_ID', 'SECRET', 'JOBS_FOLDER_ID']) {
  if (!config[key]) {
    console.error(`${configPath} is missing ${key}`);
    process.exit(1);
  }
}

// The two folder ids are the guard against filing test quotes into real jobs,
// or real quotes into the test folder.
const expectedFolder = env === 'live' ? LIVE_JOBS_FOLDER_ID : TEST_JOBS_FOLDER_ID;
if (config.JOBS_FOLDER_ID !== expectedFolder) {
  console.error(`JOBS_FOLDER_ID for ${env} should be ${expectedFolder}.`);
  process.exit(1);
}

const build = mkdtempSync(join(tmpdir(), `quote-script-${env}-`));
try {
  const code = readFileSync(join(root, 'scripts/apps-script/Code.gs'), 'utf8')
    .replace("'__SECRET__'", JSON.stringify(config.SECRET))
    .replace("'__JOBS_FOLDER_ID__'", JSON.stringify(config.JOBS_FOLDER_ID));
  if (code.includes('__SECRET__') || code.includes('__JOBS_FOLDER_ID__')) {
    throw new Error('A placeholder was not replaced in Code.gs');
  }
  writeFileSync(join(build, 'Code.gs'), code);
  writeFileSync(
    join(build, 'appsscript.json'),
    readFileSync(join(root, 'scripts/apps-script/appsscript.json'), 'utf8'),
  );
  writeFileSync(join(build, '.clasp.json'), JSON.stringify({ scriptId: config.SCRIPT_ID, rootDir: '.' }));

  // shell: true so Windows resolves clasp.cmd from the global npm folder.
  const clasp = (args) =>
    execFileSync('clasp', args, { cwd: build, encoding: 'utf8', shell: process.platform === 'win32' });

  const pushOnly = process.argv.includes('--push-only');
  const deployOnly = process.argv.includes('--deploy-only');

  if (!deployOnly) console.log(clasp(['push', '--force']).trim());

  if (pushOnly) {
    // No process.exit here: the finally below has to delete the build folder,
    // which holds the secret.
    console.log('Pushed only. The web app still serves the previous version.');
  } else {
    // Deploys whatever was last pushed, so --deploy-only ships the code that
    // --push-only uploaded and the owner has since authorized.
    const description = `quote webhook ${new Date().toISOString()}`;
    const args = ['create-deployment', '--description', JSON.stringify(description)];
    if (config.DEPLOYMENT_ID) args.push('--deploymentId', config.DEPLOYMENT_ID);
    const out = clasp(args).trim();
    console.log(out);

    const id = config.DEPLOYMENT_ID || /(AKfy[\w-]+)/.exec(out)?.[1];
    if (!id) throw new Error('Could not read the deployment id from clasp output');
    if (!config.DEPLOYMENT_ID) {
      console.log(`\nNew deployment. Add DEPLOYMENT_ID=${id} to ${configPath}.`);
    }
    console.log(`Web app URL: https://script.google.com/macros/s/${id}/exec`);
  }
} finally {
  rmSync(build, { recursive: true, force: true });
}
