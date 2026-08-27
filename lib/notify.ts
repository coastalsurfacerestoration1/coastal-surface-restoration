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
