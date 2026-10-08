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
  /**
   * The Messaging Service, not a bare phone number.
   *
   * The number is registered to the approved A2P 10DLC campaign through this
   * service, and sending with a raw From is what leaves a message liable to
   * come back as error 30034, unregistered number, even after the campaign is
   * approved. Advanced Opt-Out, which is what actually answers STOP, START and
   * HELP, is also a Messaging Service feature and does not apply to a message
   * sent outside it.
   *
   * There is deliberately no fallback to TWILIO_FROM_NUMBER. A missing value
   * here stops texts rather than quietly sending them down the unregistered
   * path, which is the failure worth having: the email still carries the lead,
   * and the log line says exactly what is wrong.
   */
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!sid || !token || !messagingServiceSid) {
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
      body: new URLSearchParams({
        To: target,
        MessagingServiceSid: messagingServiceSid,
        Body: body,
      }),
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

/**
 * Whether the "we received your quote request" text may go out, on top of
 * customerSmsEnabled.
 *
 * Its own switch because, unlike the appointment texts, it is not in the
 * approved A2P campaign's description or sample messages. It stays off in
 * Production until the campaign is amended to cover it (Tyler, 2026-10-07).
 */
export function quoteConfirmationSmsEnabled(): boolean {
  return customerSmsEnabled() && process.env.TWILIO_QUOTE_CONFIRMATION_SMS === 'enabled';
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
  /** Optional on the form. Empty string when not answered. */
  howHeard: string;
  referredBy: string;
};

/**
 * What the sheet webhook reports back about the job folder it tried to make.
 *
 * Folder creation runs inside the Apps Script after the row is written, and a
 * failure there still answers "ok" because the row is what matters. This is
 * how the route finds out, so a missing folder shows up in the logs instead of
 * only as an empty cell in column Q.
 */
export type JobFolder =
  | { created: true; url: string; photosFolderId: string }
  | { created: false; reason: string };

type SheetResult = { sent: boolean; reason?: string; jobFolder?: JobFolder };

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
export async function appendQuoteRow(row: QuoteRow): Promise<SheetResult> {
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
    // The first line is the verdict on the row. Anything after it is the job
    // folder report, which an older deployment of the script does not send,
    // so a bare "ok" still counts as success.
    const [verdict, ...detail] = text.split('\n');
    if (verdict.trim() !== 'ok') {
      // A wrong secret comes back as a 200 carrying "forbidden", so the status
      // alone is not enough to call this a success.
      return { sent: false, reason: `Sheet webhook replied: ${text.slice(0, 80)}` };
    }

    return { sent: true, jobFolder: parseJobFolder(detail.join('\n')) };
  } catch (error) {
    return { sent: false, reason: `Sheet webhook failed: ${String(error)}` };
  }
}

function parseJobFolder(detail: string): JobFolder {
  if (!detail.trim()) {
    return { created: false, reason: 'Sheet script sent no folder report. Is it the current version?' };
  }
  try {
    const parsed = JSON.parse(detail);
    if (typeof parsed?.jobFolderUrl === 'string' && typeof parsed?.photosFolderId === 'string') {
      return { created: true, url: parsed.jobFolderUrl, photosFolderId: parsed.photosFolderId };
    }
    return { created: false, reason: String(parsed?.folderError ?? 'no folder in reply') };
  } catch {
    return { created: false, reason: `unreadable folder report: ${detail.slice(0, 80)}` };
  }
}

const PHOTO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/**
 * Copies the quote photos into the new job's "Photos (Before & After)" folder.
 *
 * A second call to the same script rather than riding along with the row.
 * Several megabytes of base64 make the request slower and more likely to fail,
 * and the row write must never be the thing that pays for that. The photos are
 * also already attached to the notification email, so this is a filing
 * convenience and, like everything else here, never throws.
 */
export async function saveJobPhotos(
  photosFolderId: string,
  photos: { filename: string; content: string }[],
): Promise<SmsResult> {
  const url = process.env.QUOTE_SHEET_WEBHOOK_URL;
  const secret = process.env.QUOTE_SHEET_SECRET;
  if (!url || !secret) return { sent: false, reason: 'Quote sheet is not configured' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      body: JSON.stringify({
        secret,
        action: 'photos',
        folderId: photosFolderId,
        photos: photos.map((photo) => ({
          filename: `quote-${photo.filename}`,
          mimeType: PHOTO_MIME[photo.filename.split('.').pop() ?? ''] ?? 'image/jpeg',
          content: photo.content,
        })),
      }),
    });
    if (!res.ok) return { sent: false, reason: `Photo upload ${res.status}` };

    const text = (await res.text().catch(() => '')).trim();
    if (text.split('\n')[0].trim() !== 'ok') {
      return { sent: false, reason: `Photo upload replied: ${text.slice(0, 120)}` };
    }
    return { sent: true };
  } catch (error) {
    return { sent: false, reason: `Photo upload failed: ${String(error)}` };
  }
}

/**
 * Records a STOP or START against every row with this phone number, in the
 * SMS Consent column, so the sheet agrees with what Twilio will now allow.
 *
 * Twilio enforces the opt-out on its own either way. This only keeps the
 * sheet honest, so it never throws and a failure is only logged.
 */
export async function recordSmsConsent(phone: string, consent: 'yes' | 'no'): Promise<SmsResult & { rows?: number }> {
  const url = process.env.QUOTE_SHEET_WEBHOOK_URL;
  const secret = process.env.QUOTE_SHEET_SECRET;
  if (!url || !secret) return { sent: false, reason: 'Quote sheet is not configured' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      body: JSON.stringify({ secret, action: 'consent', phone, consent }),
    });
    if (!res.ok) return { sent: false, reason: `Consent update ${res.status}` };

    const [verdict, detail] = (await res.text().catch(() => '')).trim().split('\n');
    if (verdict.trim() !== 'ok') return { sent: false, reason: `Consent update replied: ${verdict.slice(0, 120)}` };
    const rows = Number(JSON.parse(detail || '{}').rows ?? 0);
    return { sent: true, rows };
  } catch (error) {
    return { sent: false, reason: `Consent update failed: ${String(error)}` };
  }
}
