# Post-prod checklist

Run right after a branch merges to `main`. Everything here is read only:
nothing submits a quote, writes to the live sheet, creates a Drive folder,
sends an email or a text. Real customer data is never touched.

## Automated

- [ ] `npm run smoke` passes. It checks the key pages load with the new
      content, `/api/quote` is up (refuses a malformed request with 400), and
      the live sheet webhook answers `forbidden` to a probe, meaning it is
      deployed and authorized

## In Vercel

- [ ] Newest Production deployment is **Ready** and built from the merge
      commit on `main`
- [ ] Production env vars are unchanged (`vercel env ls`): the `QUOTE_SHEET_*`
      and `TWILIO_*` Production entries have their old ages, nothing new
      landed in Production by accident
- [ ] Runtime logs since the deploy show no new errors on `/api/quote`
      (`vercel logs`, or Vercel → Logs)

## In Google

- [ ] The live sheet's Apps Script: Manage deployments shows the new version
      on the same deployment, so the `/exec` URL is unchanged
- [ ] `15 - Jobs` and the live sheet look exactly as before. Look only; do not
      add or edit anything to test

## Watch the first real quote

The first customer submission is the real end to end test. When it lands:

- [ ] Notification email in quotes@, with no `[TEST]` in the subject
- [ ] New row in the live sheet, with the job folder link in column Q and the
      optional answers in R and S
- [ ] New folder in `15 - Jobs`, numbered one past the highest existing job,
      with the three subfolders and the customer's photos in
      Photos (Before & After)
- [ ] If anything is missing, Vercel logs name the cause:
      `Quote not written to the sheet`, `Job folder not created`,
      `Quote photos not copied to the job folder`

## Clean up

- [ ] Delete the merged branch (`git push origin --delete <branch>`)
- [ ] If something is wrong, roll back per PRE-PROD-CHECKLIST.md, "If
      production breaks"
