/**
 * Text message delivery for quote notifications.
 *
 * Deliberately not the `twilio` package. This sends one shape of message and
 * the REST call is a single fetch, so a dependency would be all cost and no
 * benefit on a brochure site.
 *
 * Nothing in here throws. A text is a convenience layered on top of the email,
 * and the email is the thing that actually carries the lead. A misconfigured
 * or failing SMS provider must never be the reason a customer's quote request
 * comes back as an error.
 */

const TWILIO_SEND_URL = (sid: string) =>
  `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;

/**
 * Twilio wants E.164. The form stores US numbers as 843-555-0100, and
 * BUSINESS.phone is written the same way.
 */
export function toE164(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

type SmsResult = { sent: boolean; reason?: string };

/**
 * Sends one text. Resolves either way, so callers do not need a try/catch.
 *
 * Returns why it did not send rather than staying silent about it, because a
 * text that never goes out should be visible in the logs instead of being
 * indistinguishable from one that did.
 */
export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    return { sent: false, reason: 'Twilio is not configured' };
  }

  const target = toE164(to);
  if (!target) {
    return { sent: false, reason: `not a US number: ${to}` };
  }

  try {
    const res = await fetch(TWILIO_SEND_URL(sid), {
      method: 'POST',
      headers: {
        // Twilio uses HTTP basic auth with the account SID as the username.
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: target, From: from, Body: body }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { sent: false, reason: `Twilio ${res.status}: ${detail.slice(0, 200)}` };
    }

    return { sent: true };
  } catch (error) {
    return { sent: false, reason: `Twilio request failed: ${String(error)}` };
  }
}

/**
 * Whether customer-facing texts are allowed to go out.
 *
 * Separate from whether Twilio is configured, and off unless explicitly
 * enabled. Texting a customer needs their consent captured at the form and an
 * approved A2P 10DLC campaign; sending before both are in place carries real
 * TCPA exposure. Alerts to our own number have neither requirement, so they
 * are not gated on this.
 */
export function customerSmsEnabled(): boolean {
  return process.env.TWILIO_CUSTOMER_SMS === 'enabled';
}

/** One quote, flattened for the spreadsheet. */
export type QuoteRow = {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  service: string;
  description: string;
  photos: number;
  smsConsent: boolean;
  outOfArea: boolean;
  spamFlag: boolean;
};

/**
 * Appends a quote to the Google Sheet.
 *
 * Posts to an Apps Script web app bound to the sheet rather than going through
 * the Sheets API. That avoids a Google Cloud project, a service account, and a
 * private key living in an environment variable. The tradeoff is that the
 * endpoint is reachable by anyone holding the URL, which is what the shared
 * secret is for.
 *
 * Like the texts, this never throws. The sheet is a convenience for outreach
 * later; the email is what actually carries the lead, and a spreadsheet outage
 * must not cost a customer their submission.
 */
export async function appendQuoteRow(row: QuoteRow): Promise<SmsResult> {
  const url = process.env.QUOTE_SHEET_WEBHOOK_URL;
  const secret = process.env.QUOTE_SHEET_SECRET;

  if (!url || !secret) {
    return { sent: false, reason: 'Quote sheet is not configured' };
  }

  // A deployed Apps Script web app always ends in /exec, or /dev for the test
  // deployment. Anything else is a copy that lost its suffix or its full
  // deployment id, which Google answers with a login page or a 404. Catching
  // it here turns a confusing round trip into an obvious message.
  if (!url.endsWith('/exec') && !url.endsWith('/dev')) {
    return {
      sent: false,
      reason: 'QUOTE_SHEET_WEBHOOK_URL should end in /exec. Copy it from Deploy, Manage deployments.',
    };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Apps Script answers a deployed web app with a redirect to
      // script.googleusercontent.com, so redirects have to be followed.
      redirect: 'follow',
      body: JSON.stringify({
        secret,
        ...row,
        smsConsent: row.smsConsent ? 'yes' : 'no',
        outOfArea: row.outOfArea ? 'yes' : '',
        spamFlag: row.spamFlag ? 'flagged' : '',
      }),
    });

    if (!res.ok) {
      return { sent: false, reason: `Sheet webhook ${res.status}` };
    }

    const text = (await res.text().catch(() => '')).trim();
    if (text !== 'ok') {
      // A wrong secret comes back as a 200 carrying "forbidden", so the status
      // alone is not enough to call this a success.
      return { sent: false, reason: `Sheet webhook replied: ${text.slice(0, 80)}` };
    }

    return { sent: true };
  } catch (error) {
    return { sent: false, reason: `Sheet webhook failed: ${String(error)}` };
  }
}
