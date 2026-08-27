# Quote Pipeline: Context and Setup

Paste this into Claude Desktop and ask it to walk you through the setup steps.
Everything in "Already done" is live in code. Everything in "Your setup steps"
needs a human with account access, which is why the code cannot do it.

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

This is the high value, low friction half. It needs no consent and no customer
involvement.

1. Create a Twilio account and buy a local phone number.
2. Find the Account SID and Auth Token on the Twilio console dashboard.
3. In Vercel, go to the project, then Settings, then Environment Variables, and
   add:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER` (the Twilio number, in +18435550100 form)
   - `ALERT_SMS_TO` (Tyler's mobile, same format)
4. Redeploy. Alerts start on the next quote.

Until these exist the texts are skipped and logged. Email is unaffected either
way, so nothing breaks while this is pending.

**Expect a delay:** Twilio blocks unregistered application to person traffic to
US numbers. You will likely need the A2P 10DLC registration below before even
your own alerts deliver reliably. The sole proprietor path is the fast one.

### 2. A2P 10DLC registration

Required before texting anyone in the US from a business number.

1. In the Twilio console, go to Messaging, then Regulatory Compliance, then
   Brand and Campaign registration.
2. Register as a sole proprietor unless the LLC has an EIN you want to use.
3. Create a campaign describing the use case: customer service notifications
   about quote requests the customer initiated.
4. Wait for approval. Days, sometimes longer.

### 3. Customer texts, only after step 2

Two separate gates protect this, and both must pass:

- The customer checks the consent box on the quote form
- `TWILIO_CUSTOMER_SMS` is set to the word `enabled`

**Leave `TWILIO_CUSTOMER_SMS` unset in Vercel until 10DLC is approved.** To test
locally, set it in `.env.local` and check the box yourself.

Texting customers without both captured consent and an approved campaign is a
TCPA problem, at $500 to $1,500 per message. The consent checkbox only covers
half of that requirement.

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

## Appendix: the Apps Script

Already deployed. Kept here in case it needs to be recreated.

1. Open the Quote Requests Log sheet.
2. Extensions, then Apps Script.
3. Replace the contents with this, using a long random string as the secret:

```javascript
const SECRET = 'replace-with-a-long-random-string';

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput('bad request');
  }

  if (body.secret !== SECRET) {
    return ContentService.createTextOutput('forbidden');
  }

  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
    body.timestamp,
    body.name,
    body.email,
    body.phone,
    body.street,
    body.city,
    body.state,
    body.zip,
    body.service,
    body.description,
    body.photos,
    body.smsConsent,
    body.outOfArea,
    body.spamFlag,
    '',
    ''
  ]);

  return ContentService.createTextOutput('ok');
}
```

4. Save, then Deploy, then New deployment, and choose type Web app.
5. Set "Execute as" to Me, and "Who has access" to Anyone.
6. Authorize when prompted. Google will warn that the app is unverified because
   you wrote it yourself. Choose Advanced, then go to the project.
7. Copy the web app URL.
8. In Vercel add:
   - `QUOTE_SHEET_WEBHOOK_URL` (the URL from step 7)
   - `QUOTE_SHEET_SECRET` (the same random string from step 3)
9. Redeploy.

"Who has access: Anyone" means anyone with the URL can POST, which is why the
shared secret exists. Treat the URL as a credential and do not commit it.

The last two sheet columns, Status and Notes, are left blank on purpose. They
are yours to fill in by hand as you work a lead.
