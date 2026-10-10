# Quote Pipeline: Context and Setup

Paste this into Claude Desktop and ask it to walk you through the setup steps.
Everything in "Already done" is live and confirmed working. Everything in "Your
setup steps" needs a human with account access, which is why the code cannot do
it. Text alerts are part way through that list: wired up and configured, but not
delivering until the A2P Campaign clears.

---

## The business

Coastal Surface Restoration, Tyler's mobile laser cleaning business in
Charleston, SC. Pre-launch as of August 2026: no jobs completed, no reviews,
first work targeted around October 2026. Site is Next.js 16 App Router on
Vercel. Transactional email runs through Resend from
`quotes@coastalsurfacerestoration.com`.

Content rules for any copy: no em dashes, no claims of past jobs or clients, no
pricing, and the laser credential is always "trained to ANSI Z136.1 through the
Laser Institute of America", never "certified".

---

## What happens when someone submits a quote today

1. Browser validates name, email, 10 digit phone, street with a number, city
   from a dropdown, state, and a 5 digit ZIP.
2. Up to 4 photos are downscaled in the browser to 1600px on the long edge.
3. Posts as multipart to `/api/quote`.
4. Server revalidates everything, sniffs the photo bytes to confirm they are
   really images, and rate limits to 3 submissions per 10 minutes.
5. **Email to Tyler** at `quotes@` with the photos attached. The subject picks
   up `[Outside area]` if the ZIP is not a Charleston 294xx, and
   `[Possible spam]` if the hidden anti-bot field was filled.
6. **Reminder email to Tyler** scheduled 48 hours out through Resend.
7. **Acknowledgement email to the customer**, with logo and details.
8. **Row appended to the Quote Requests Log sheet**, including flagged and out
   of area submissions, so the sheet is a complete record of the form.
9. Redirects to `/thank-you`.

---

## Already done

- Photo upload with browser side downscaling
- Full validation on both client and server
- Structured address with a city dropdown and an out of area flag
- Resend errors surfaced instead of silently returning success
- Honeypot that flags rather than discards, after autofill was found silently
  destroying real submissions
- Text message sending, through Twilio, gated on environment variables
- SMS consent checkbox on the form, unchecked by default
- Google Sheet logging, live and confirmed working, see below

### Google Sheet logging (live)

Confirmed working on 2026-08-26. `QUOTE_SHEET_WEBHOOK_URL` and
`QUOTE_SHEET_SECRET` are set in Vercel, and the Apps Script web app is
deployed. Nothing to do here unless it breaks.

- Folder: `12 - Quote Requests`
  https://drive.google.com/drive/folders/1207gfjwNeIszYX02iLeI98L3c_xJK_IB
- Sheet: `Quote Requests Log`
  https://docs.google.com/spreadsheets/d/1FmD9uNtHD_FWNO4ij9VDHdeuFwFGN5Wzl0Qh95Iecyg/edit
- Photos subfolder, currently unused:
  https://drive.google.com/drive/folders/1eXOqTXcQyoxDwR6v_4FMCzap9vojim8x

Columns are Timestamp, Name, Email, Phone, Street, City, State, ZIP, Service,
Description, Photos, SMS Consent, Out of Area, Spam Flag, then Status and Notes
which are left blank for Tyler to fill in by hand.

It posts to an Apps Script web app bound to the sheet rather than using the
Sheets API, which avoids a Google Cloud project, a service account, and a
private key in an environment variable. The URL is reachable by anyone holding
it, so a shared secret authenticates the call. Treat the URL as a credential.

**If rows stop appearing**, the Vercel log line names which of three things it
is: `Quote sheet is not configured` (env vars missing), `should end in /exec`
(bad URL), or `replied: forbidden` (the secret in Vercel and the secret in the
script do not match). To check the endpoint without writing a row:

```bash
curl -s -X POST "<the /exec url>" -H "Content-Type: application/json" -d '{"probe":true}'
```

A healthy deployment answers with the plain text `forbidden`, because the probe
carries no secret. HTML back means the URL is wrong. The script itself is kept
in the appendix at the bottom of this file for redeployment.

---

## Your setup steps

### 1. Text alerts to Tyler

Status as of 2026-09-12. A2P 10DLC registration is complete and all four steps
show Complete.

- Twilio account created
- Charleston number purchased: **+1 843 396 2257**, shows REGISTERED on the
  campaign
- A2P 10DLC **Brand approved**, `BNbbb2762090284dfe8395259f634a728d`
- A2P 10DLC **Campaign approved 2026-09-04**,
  `CMd1c94908673d14cd9dcee35e603fa872`, use case LOW_VOLUME
- Messaging Service `MGbbceeb960b48be860070c4732e554589`, created 2026-08-27,
  with opt-out management configured for STOP, START, UNSTOP and HELP
- Env vars set in Vercel: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
  `TWILIO_MESSAGING_SERVICE_SID`, `ALERT_SMS_TO`

`TWILIO_MESSAGING_SERVICE_SID` is the one that matters. Messages are sent with
`MessagingServiceSid`, never a raw `From`, because the number is registered to
the approved campaign through the service, and because Advanced Opt-Out, which
is what answers STOP, START and HELP, only applies to messages sent through it.
Sending from a bare number is what can still return error 30034, unregistered
number, after a campaign is approved.

There is no fallback. If that variable is missing, texts stop rather than going
out down the unregistered path, and the log line reads `Twilio is not
configured`. That is the failure worth having: the email still carries the lead.
`TWILIO_FROM_NUMBER` is no longer read by anything and can be deleted from
Vercel.

**Historical note.** Before the campaign cleared, a test quote sent its emails
and its sheet row but no text. Brand approved is not Campaign approved; they are
two separate reviews, and Twilio blocks messages until the second one clears.
That is resolved. The single Error 30034 in Messaging Insights predates campaign
approval and is closed.

Email and sheet logging are unaffected while this is pending. Every text failure
is logged and swallowed on purpose, so nothing else breaks.

### 2. Debugging the missing text

Do not change the quote route until a log line says what is wrong. The code
already reports the cause. Search the Vercel function logs for:

```
Quote alert text not sent:
```

| Log reason | What it means |
|---|---|
| `Twilio is not configured` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` or `TWILIO_MESSAGING_SERVICE_SID` is not reaching the runtime |
| `not a US number: ...` | `ALERT_SMS_TO` is not a 10 or 11 digit US number |
| `Twilio 400: ...` or `Twilio 401: ...` | Twilio rejected it. A pending Campaign shows up here |
| no such line at all | The send never ran, so the notification email failed first |

An easy one to miss: check **which environments** the Twilio variables are enabled
for in Vercel. If they are Production only and the test hit a preview
deployment, the log says `Twilio is not configured` while the dashboard looks
correct.

**Faster than reading Vercel logs.** Local dev is working, so paste the Twilio
values into `.env.local` and submit a quote at `localhost:3000/quote`.
The reason prints straight to the terminal with Twilio's own error code in it,
with no deploy cycle. Note that the alert runs after the notification email
succeeds, so a local `RESEND_API_KEY` has to be valid or the route returns 500
before it ever reaches the text.

### 3. A2P 10DLC registration

Required before texting anyone in the US from a business number. Brand is done;
the Campaign is the remaining step.

1. In the Twilio console, go to Messaging, then Regulatory Compliance, then
   Brand and Campaign registration.
2. Register as a sole proprietor unless the LLC has an EIN you want to use.
3. Create a campaign describing the use case: customer service notifications
   about quote requests the customer initiated.
4. Wait for approval. Days, sometimes longer.

### 4. Customer texts, only after the Campaign is approved

Two separate gates protect this, and both must pass:

- The customer checks the consent box on the quote form
- `TWILIO_CUSTOMER_SMS` is set to the word `enabled`

**Leave `TWILIO_CUSTOMER_SMS` unset in Vercel until the Campaign is approved.**
It is unset as of 2026-08-26 and should stay that way. To test locally, set it
in `.env.local` and check the box yourself.

Texting customers without both captured consent and an approved campaign is a
TCPA problem, at $500 to $1,500 per message. The consent checkbox only covers
half of that requirement.

---

## Deferred: lead source attribution

**Decided on 2026-09-11: not building this yet.** The site captures no
attribution of any kind. No `utm_source`, `utm_medium`, `utm_campaign`, no
`gclid`, no referrer, no landing page. Every lead that reaches the sheet is
source blind, and that is a known and accepted gap rather than an oversight.

The reason is that there is nothing to measure. With no leads and no ad spend,
attribution infrastructure reports on an empty set, and the work would touch
the quote form, the API route, the sheet schema, and the Apps Script.

**Build trigger, whichever comes first:**

- 20 leads in a single month, or
- the first dollar of paid ad spend

**When it does get built, these were already decided:**

- **First touch, not last touch.** Write the parameters to `sessionStorage` on
  the first page of the visit and do not overwrite them on later navigations.
  Last touch would attribute a lead to whatever internal page preceded the
  form, which is the one answer guaranteed to be useless.
- Capture `gclid`, `document.referrer`, and the landing path in the same pass,
  not just the three UTM parameters. The referrer is what covers organic and
  the untagged links that no campaign parameter ever reaches.
- Hidden form inputs need the autofill opt-outs (`data-1p-ignore`,
  `data-lpignore`, `data-bwignore`, `data-form-type="other"`), for the same
  reason the honeypot carries them. A password manager filling a hidden field
  on this form has already cost real submissions once.
- The new fields go in as optional on the server. They must sit outside the
  required `FIELDS` loop in `app/api/quote/route.ts`, or a visitor who arrives
  with no parameters, which is most of them, gets a 400.
- Four new columns go before Status and Notes in the sheet, and **the Apps
  Script has to be redeployed to match**. It lives in Google, not in this repo.
  Adding fields to the payload without updating the script means the values
  silently never land.

Note that the short path aliases in `next.config.ts` already pass query strings
through to their destinations, so `/rust?utm_source=truck` arrives at the
service page with the parameters intact. Printed material can be tagged now and
the tags will simply be ignored until the above is built.

Short paths are no longer print only. `/ig` redirects to
`/?utm_source=instagram` for the Instagram profile bio link, so that tag is live
on every visitor who arrives that way. It runs ahead of this build on purpose.
GA4 and Vercel Analytics record session source for every visit, and untagged
Instagram traffic lands in (direct) or a bare domain bucket indistinguishable
from someone typing the URL off a business card. That distinction cannot be
reconstructed after the fact, so tagging from the start is what makes it
possible to look back, when the trigger above fires, and see whether Instagram
was producing traffic before any further investment in it. Otherwise the same
rule as the printed tags: the parameter reaches analytics, never the sheet,
until the work above is done.

---

## Notes for later

**Outreach.** Emailing people who requested a quote is fine under CAN-SPAM,
since they contacted you first, as long as there is an unsubscribe path.
Texting them is only legal for the ones who checked the consent box, which is
why that flag is a column in the sheet. Filter on it before any text campaign.

**When to leave the spreadsheet behind.** Once volume justifies it, Jobber or
Housecall Pro are the standard tools for a mobile service business, roughly $30
to $100 a month, and they cover quote to schedule to invoice. Do not hand build
a CRM.

**Resend is not a database.** Its list endpoint returns metadata only, with no
message body, and no documented retention guarantee. It is an audit trail, not
a source of truth.

**Privacy.** The sheet holds customer names, addresses, and phone numbers.
Keep sharing restricted, and make sure the site privacy policy reflects what is
retained.

---

## Job folders and lead source (added 2026-10-06)

After the row is written, the same Apps Script creates the job folder in
`15 - Jobs` (https://drive.google.com/drive/folders/1py4OwKoqrxhwDcBn7IPpIt6kH9UyRfxF):

- Named `J-YYYY-NNN Name, Street`. NNN is the highest existing `J-YYYY-NNN`
  in the Jobs folder plus one, so folders made by hand count too. Numbering
  restarts at 001 each January.
- Three subfolders: `Photos (Before & After)`, `Quotes & Invoices`, `Signed Forms`.
- The folder URL goes into column Q, `Job Folder`, on the new row.
- Quote photos are copied into `Photos (Before & After)` by a second call, after
  the customer already has their response.

The script runs as the sheet owner, tyler@coastalsurfacerestoration.com, who
also owns the Jobs folder. No service account and no sharing are involved.
A folder failure never fails the quote: the row is written first, the script
still answers `ok`, and Vercel logs `Job folder not created: <reason>`.

The form also asks two optional questions. They land in R, `How They Heard`
(`Other: <text>` when Other is picked), and S, `Referred By`. This is
self-reported source, which is not the same as the deferred UTM attribution
above. That is still deferred.

Columns are now A to N form fields, O Status, P Notes, Q Job Folder,
R How They Heard, S Referred By. The script adds the Q to S headers itself if
they are blank.

---

## Address autocomplete (added 2026-10-07)

When someone types in the Street field, it suggests addresses from Google Places.
Picking one fills Street, Apt, City, State and ZIP in the browser, so the
server, the sheet columns and the job folder naming see exactly the same
fields as before. An "Enter address manually" checkbox turns suggestions off.
With no key, or if Google's script fails, the field is a plain input.

- Google Cloud project `CSR Website` (`csr-website-511000`) under the
  coastalsurfacerestoration.com organization, owned by
  tyler@coastalsurfacerestoration.com. Billing account `01C5F6-23EBA5-E34CF3`
  (started on the $300 / 90 day free trial; upgrade before it ends or the key
  stops working).
- APIs: Maps JavaScript API and Places API (New).
- Two browser keys, each limited to those two APIs:
  `CSR Website Production (browser)` for `coastalsurfacerestoration.com` and
  `www.`, and `CSR Website Preview + localhost (browser)` for `*.vercel.app`
  and `localhost:3000`. Google only allows a leading wildcard, so the preview
  key cannot be narrowed to this project's previews.
- Vercel: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, the production key in Production,
  the preview key in Preview and Development. It is inlined at build time, so
  a change needs a redeploy.
- Cost: one lookup is one session, billed once when an address is picked.
  The monthly free usage covers far more than our volume, so expect $0.
- Budget `CSR Website $5 alert` emails the billing admin at $2.50, $4.50 and
  $5, measured before credits so the trial credit cannot hide spend. Quota
  caps were not editable on the trial account; revisit after upgrading.

---

## Service area check (added 2026-10-09)

Every quote's ZIP is placed at its US Census centroid (`lib/zip-centroids.ts`,
generated from the 2020 ZCTA Gazetteer, public domain) and measured to the
nearest of the eight service towns (`lib/service-area.ts`). No API key, no
cost, and the address goes nowhere.

| Distance | What happens |
|---|---|
| Within 20 miles | Normal quote. |
| 20 to 50 miles | Customer refused with the message below. Tyler still gets the email, subject `[Blocked: out of area]`, and a sheet row with Out of Area (M) = `blocked, 22 mi from West Ashley`. No job folder, alert text, 2 day reminder, or anything to the customer. |
| Past 50 miles | Refused and dropped: no email, no row. |
| ZIP not in the Census table (PO box ZIPs like 29402) | Let through, flagged `[Outside area]` the old way if not 294xx. |

Customer message, both refusals: "That address is outside our service area,
which covers about 20 miles around Charleston. Call or text 854-222-7790 and
we can talk about it." The form shows it as soon as a 5 digit ZIP is typed;
the server is what enforces it. Examples: Edisto 29438 is 22 mi (blocked,
logged), Beaufort 29902 is 49 mi (blocked, logged), Hilton Head 29910 is
dropped. To change the radii, edit `SERVICE_RADIUS_MILES` and
`DROP_BEYOND_MILES`.

## Customer texts (added 2026-10-07)

All customer texts go out only when the row's SMS Consent (L) starts with
`yes` and `TWILIO_CUSTOMER_SMS=enabled`, through the Messaging Service on the
approved A2P campaign, so Twilio's Advanced Opt-Out answers STOP, START and
HELP for all of them. Nothing goes out before 8 AM or from 9 PM, Charleston
time; a text due then waits for the next hourly run after 8 AM.

The sequence:

1. **Quote comes in.** Alert to `ALERT_SMS_TO` (the Quo line, 854-222-7790,
   in Production). Customer gets "received your quote request" if they
   consented. *That confirmation is not in the campaign's description or
   samples; whether to amend the campaign before enabling it in Production is
   still open.*
2. **Tyler types an appointment date** (e.g. `10/15/2026 9:00 AM`) into one
   of two columns (added 2026-10-09):
   - **W, Walkthrough**: the site visit to look at and measure for a quote.
     Statuses in **X** (confirmation) and **Y** (reminder).
   - **T, Job Date** (header was "Appointment"): the job itself. Statuses in
     **U** (confirmation) and **V** (reminder).
   A row can have both. Each type has its own status cells and never touches
   the other's.
3. **Confirmation** goes out as soon as the date is entered.
4. **Reminder.** 8 AM on the appointment day, or 5 PM the evening before for an
   appointment before 10 AM. Skipped when booked so late that the
   confirmation just went out, or less than an hour ahead.

The four texts (Tyler's wording, 2026-10-09). The job confirmation is the
campaign's Sample #2; the rest are covered by the campaign description
("appointment confirmations/reminders to customers who request service") and
kept close to it. No campaign amendment, by decision.

- Walkthrough confirmation: "Coastal Surface Restoration: Your site visit
  appointment is confirmed for 10/15/2026 at 9:00 AM. We will look at and
  measure the project for your quote. To change this appointment, call or text
  854-222-7790. Reply STOP to opt out."
- Walkthrough reminder: "Coastal Surface Restoration: Reminder, your site
  visit appointment is Thu, Oct 15 at 9:00 AM at 1810 Mepkin Rd, West Ashley.
  We will look at and measure the project for your quote. To change this
  appointment, call or text 854-222-7790. Reply STOP to opt out."
- Job confirmation: "Coastal Surface Restoration: Your service appointment is
  confirmed for 10/15/2026 at 9:00 AM. Questions? Call 854-222-7790 or visit
  coastalsurfacerestoration.com. To change this appointment, call or text
  854-222-7790. Reply STOP to opt out."
- Job reminder: "Coastal Surface Restoration: Reminder, your appointment is
  Thu, Oct 15 at 9:00 AM at 1810 Mepkin Rd, West Ashley. To change
  this appointment, call or text 854-222-7790. Reply STOP to opt out."

All four end with the change line (the Quo line; nobody reads replies to the
Twilio number) and stay within two GSM-7 segments. A reminder drops the city
only past 306 characters.

How it runs:

- The sheet's script has two installable triggers, created by `authorize` /
  `installTriggers`: on edit (checks a row when T or W changes) and hourly
  (`sendDueReminders`, checks every row whose U, V, X or Y says Waiting). Both
  call `POST /api/appointment-text` with `type` `job` or `walkthrough`,
  authenticated with `QUOTE_SHEET_SECRET`, and the site decides what is due
  and how it is worded. A request with no type is a job.
- Status cells read `Waiting: ...`, `Sent <time> for <appointment>`,
  `Not sent: <reason>`, or `Cancelled: <type> cleared, nothing sent` when the
  date is cleared before a text went (what was sent stays on record).
  Re-entering the same time sends nothing. Moving it to a new time confirms
  and reminds again. To force a resend, clear the status cell and re-enter
  the date.
- Columns are only ever added on the right. Agents and other scripts read the
  sheet by position; agent-owned columns start at Z.
- The time is the wall time as typed, whatever the spreadsheet's own zone
  (both sheets are on Pacific).
- `SITE_URL` (and `VERCEL_BYPASS` for TEST) in `.env.apps-script.<env>.local`
  tell the script where the site is. For TEST it points at a branch preview.

STOP and START:

- Twilio's incoming webhook on the Messaging Service points at
  `/api/sms-inbound`, which checks Twilio's signature with
  `TWILIO_AUTH_TOKEN` and asks the sheet's script (action `consent`) to set L
  on every row with that number to `no (replied STOP <date>)` or
  `yes (replied START <date>)`. Twilio enforces the opt-out by itself either
  way. Ordinary replies are not forwarded anywhere, by decision.
- Production webhook: `https://coastalsurfacerestoration.com/api/sms-inbound`
  (HTTP POST), with "use the number's webhook" turned off.

Going live:

1. Add `SITE_URL=https://coastalsurfacerestoration.com` to
   `.env.apps-script.live.local`.
2. `node scripts/deploy-apps-script.mjs live --confirm-live --push-only`.
3. Tyler runs `authorize` in the live script editor and allows the two new
   permissions. This also installs both triggers.
4. `... live --confirm-live --deploy-only`, then the `forbidden` probe.
5. Merge. Point the Twilio incoming webhook at Production.
6. Remove the four `feature/customer-sms` preview-only Twilio variables in
   Vercel.

---

## Dev environment

Production is `main`. Every change goes on a branch, gets checked on its
Vercel preview deployment, and is merged to `main` only after that.

Previews and local dev must never write to the live sheet or the live Jobs
folder. They point at a separate test setup in
`99 - Dev Testing (not live)` (https://drive.google.com/drive/folders/117Ff2XJRxk3FT6-WsilnEYyispbxw6Za):

- `Quote Requests Log (TEST)`
  https://docs.google.com/spreadsheets/d/1k6rsNVgCQ8bYKi4VqKbpXrN3-cWgv3-_pjs6tRzfmkQ/edit
- `15 - Jobs (TEST)` https://drive.google.com/drive/folders/1zDzvf3chhgm_BJUKCvQYBiXBWqfAG12Y

The TEST sheet has its own Apps Script deployment with its own secret. In
Vercel, `QUOTE_SHEET_WEBHOOK_URL` and `QUOTE_SHEET_SECRET` hold the TEST values
for Preview and Development, and the live values for Production only. Twilio
variables stay Production only, so previews never text anyone.

Every email sent from a non-production deployment carries `[TEST]` in its
subject. The notification still goes to quotes@, because that is where you
check it arrived. Use `delivered@resend.dev` as the customer email when
testing, and remember each test also schedules a `[TEST] Reminder` 48 hours
out.

---

## Appendix: the Apps Script

The source of truth is `scripts/apps-script/` in this repo. It is deployed with
clasp, logged in as tyler@coastalsurfacerestoration.com, never pasted by hand:

```bash
node scripts/deploy-apps-script.mjs test                 # TEST sheet
node scripts/deploy-apps-script.mjs live --confirm-live  # live sheet
```

The deploy fills in `SECRET` and `JOBS_FOLDER_ID` from
`.env.apps-script.<env>.local` (git ignored), refuses a Jobs folder that does
not match the environment, and updates the existing web app deployment so the
`/exec` URL never changes.

| | TEST | LIVE |
|---|---|---|
| Sheet | `Quote Requests Log (TEST)` | `Quote Requests Log` |
| Script id | `1AHXi731LkWXMYVkQmwRP2o8moa_l9Hyl3JvP-YJEpa0zK84zvbn4YI1C` | not yet under clasp |
| Jobs folder | `15 - Jobs (TEST)` | `15 - Jobs` |
| Vercel env | Preview, Development | Production |

A brand new script, or one that gains a new permission, has to be authorized
once by hand: open it in the editor, pick `authorize` in the function
dropdown, Run, and Allow. Until then the `/exec` URL answers with a Google
sign in page instead of `forbidden`.

**The live sheet is not under clasp yet.** Its bound script was pasted by hand
in August. Bringing it under clasp means finding its script id (Extensions,
Apps Script, Project Settings), putting it with the live secret and
deployment id in `.env.apps-script.live.local`, and running the live deploy.
Do that as the last step before merging a branch that needs the new script.

To check a deployment without writing a row (note: no `-X POST`, which breaks
on Google's redirect with a 411):

```bash
curl -sL "<the /exec url>" -H "Content-Type: application/json" -d '{"probe":true}'
```

A healthy deployment answers `forbidden`. HTML back means the URL is wrong or
the script is not authorized yet.

---

## End to end test

```bash
node scripts/e2e-quote.mjs https://<branch preview>.vercel.app
```

Submits two quotes through the preview, one with two photos and both optional
answers, one with neither, then reads back the TEST sheet and
`15 - Jobs (TEST)` through the script's test only `verify` action. It checks
the folder name and sequential number, the three subfolders, the photos in
`Photos (Before & After)`, and columns Q, R and S. It refuses production URLs,
and `verify` refuses to run on the live deployment.

Needs `.env.test.local` (git ignored) with `VERCEL_AUTOMATION_BYPASS_SECRET`,
`TEST_QUOTE_SHEET_WEBHOOK_URL` and `TEST_QUOTE_SHEET_SECRET`. Each run sends two
`[TEST]` notifications to quotes@ and schedules two `[TEST]` reminders.
