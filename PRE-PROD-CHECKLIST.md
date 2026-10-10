# Pre-prod checklist

How a change gets from a branch to coastalsurfacerestoration.com. Real
customers submit quotes on the live site, so nothing skips this.

**Flow:** Tyler asks → Claude builds on a branch → Claude tests on the branch
preview → Tyler reviews the preview → merge to `main` (production).

---

## 1. On the branch, before asking for review

- [ ] Work is on a feature branch, never `main`
- [ ] `npm run check` passes (typecheck, lint, unit tests, production build)
- [ ] If `scripts/apps-script/` changed: `npm run deploy:script:test`, and
      `authorize` run in the TEST script editor if it asked for new access
- [ ] Branch pushed and the Vercel preview shows **Ready**
- [ ] If the quote flow changed: `npm run e2e -- <branch preview URL>` passes
      against the TEST sheet (wait 10 minutes between runs, rate limit)
- [ ] Pages touched by the change load on the preview and read right
- [ ] Copy follows the standing rules: no em dashes, no claims of past jobs
      or clients, no pricing, ANSI Z136.1 is "trained to", never "certified"
- [ ] Live untouched: no new folders in `15 - Jobs`, no test rows in the live
      sheet, Production env vars unchanged in Vercel

## 2. Tyler's review

- [ ] Open the preview while logged in to Vercel. The branch URL is
      `coastal-surface-restorat-git-<hash>-coastal-surface-restoration.vercel.app`
      (Vercel → Deployments, or ask Claude)
- [ ] For quote changes: submit one with `delivered@resend.dev` as the email,
      check the `[TEST]` email in quotes@ and the TEST sheet and
      `15 - Jobs (TEST)` in Drive folder `99 - Dev Testing (not live)`
- [ ] Say "approved", or what to change

## 3. Going live

- [ ] If `scripts/apps-script/` changed, update the **live** script first.
      The site works with either script version, so this order is safe:
  - [ ] Pull the live script and diff it against the repo, in case it was
        edited by hand
  - [ ] `node scripts/deploy-apps-script.mjs live --confirm-live --push-only`
        uploads the code without changing what the live web app serves
  - [ ] Tyler runs `authorize` in the live script editor and allows any new
        access. Skipping this and deploying first would make the live
        webhook answer a Google sign in page, and every quote's row would
        be lost until someone authorized it
  - [ ] `node scripts/deploy-apps-script.mjs live --confirm-live --deploy-only`
        switches the live deployment to it (same `/exec` URL, so nothing in
        Vercel changes)
  - [ ] Probe it: `curl -sL "<live /exec>" -H "Content-Type: application/json" -d '{"probe":true}'`
        answers `forbidden`
- [ ] Merge the branch into `main` and push
- [ ] Production deployment shows **Ready** in Vercel. Poll slowly; fast
      polling of production trips Vercel's bot checkpoint and returns 403
- [ ] Work through POST-PROD-CHECKLIST.md, starting with `npm run smoke`
- [ ] Watch the first real quote after release: email in quotes@, a row in
      the live sheet, and (once folders are live) a job folder in `15 - Jobs`
- [ ] Delete the branch

## If production breaks

- Vercel → Deployments → the previous Production deployment → Promote. That
  rolls the site back in seconds, without touching git.
- The live Apps Script keeps its old versions. Manage deployments → edit →
  pick the previous version → Deploy rolls it back with the same URL.
- Every side channel (sheet, Drive, texts) logs and swallows its own errors,
  so the quote email still arrives even when they fail. Check Vercel logs for
  `Quote not written to the sheet`, `Job folder not created` and
  `Quote photos not copied`.

---

## Release: walkthrough texts + service area (feature/walkthrough-texts, 2026-10-10)

Before anything goes live, record what we would roll back to:

- [ ] Current Production deployment: `coastal-surface-restoration-96x86i2dn.vercel.app`
      (main at 133d921). Confirm it is still the one marked Current in Vercel.
- [ ] Current live Apps Script version: **@4** ("quote webhook 2026-10-08"),
      deployment `AKfycbwD0t...3f7rOw`. Confirm with
      `clasp list-deployments <live script id>`.

Order (script first, as in section 3; the new script works with the old site,
but the new site with the old script would give out of area quotes job folders):

1. Pre-prod checks in section 1 done, both TEST reminders verified on Tyler's
   phone with "Sent" in Y20 and V20.
2. Live Apps Script: `--push-only`, then `--deploy-only` onto the existing
   deployment (same `/exec` URL). Not within 10 minutes of the top of the
   hour, never Mon 10/12 7:00 to 8:15 AM. Probe answers `forbidden`. No new
   Google permissions are expected; if the editor asks, Tyler authorizes.
3. Merge to `main`, wait for Production Ready.
4. Rename the live T header to "Job Date".
5. POST-PROD-CHECKLIST.md and `npm run smoke`. Service area in production:
   type 29438 and then 29492 into the live form's ZIP field and check the
   message shows, then clears, without submitting. Submit one test quote with
   ZIP 10001 only (it is dropped: a sheet row, no email, folder or text), then
   delete that row. No in-area test submissions in production.

### Rollback, if either feature misbehaves in production

1. **Site:** Vercel, Deployments, `coastal-surface-restoration-96x86i2dn`,
   Instant Rollback (or `vercel rollback coastal-surface-restoration-96x86i2dn.vercel.app`).
   Takes seconds, no git change. Quotes go back to flag-not-refuse; the job
   reminder goes back to the "here." wording.
2. **Apps Script:** live script, Deploy, Manage deployments, edit the web app
   deployment, pick version **4**, Deploy. Same URL, so nothing in Vercel
   changes. Old @4 ignores column W, so any walkthrough dates typed after the
   release stop texting; their X/Y cells keep whatever they last said.
3. Roll back both together. The old site with the new script is safe; the new
   site with the old script gives refused quotes job folders.
4. Then fix forward on a branch: revert the merge commit, or only the service
   area commits (4377e54, 5d7e11d and the follow up), and go through this
   checklist again.

---

## First release with job folders (this branch)

One-time steps, because the live sheet's script was pasted by hand in August
and is not under clasp yet:

- [ ] Find the live script id: live sheet → Extensions → Apps Script →
      Project Settings → Script ID
- [ ] Create `.env.apps-script.live.local` with `SCRIPT_ID`, the existing
      `DEPLOYMENT_ID` (`clasp list-deployments <SCRIPT_ID>`), the live
      `SECRET` (the one Vercel Production uses) and
      `JOBS_FOLDER_ID=1py4OwKoqrxhwDcBn7IPpIt6kH9UyRfxF`
- [ ] Then follow "Going live" above
