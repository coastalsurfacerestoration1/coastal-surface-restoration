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
  - [ ] `node scripts/deploy-apps-script.mjs live --confirm-live`
        (same `/exec` URL, so nothing in Vercel changes)
  - [ ] Tyler runs `authorize` in the live script editor if Google asks for
        new access
  - [ ] Probe it: `curl -sL "<live /exec>" -H "Content-Type: application/json" -d '{"probe":true}'`
        answers `forbidden`
- [ ] Merge the branch into `main` and push
- [ ] Production deployment shows **Ready** in Vercel. Poll slowly; fast
      polling of production trips Vercel's bot checkpoint and returns 403
- [ ] The changed pages load on coastalsurfacerestoration.com
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
