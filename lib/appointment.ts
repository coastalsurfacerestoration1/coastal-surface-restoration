import { SITE_NAME } from './seo';

const ZONE = 'America/New_York';
/** Characters in one GSM-7 text segment. */
const SEGMENT = 160;

/** What the sheet's script sends when an Appointment cell is filled in. */
export type AppointmentRequest = {
  name?: unknown;
  phone?: unknown;
  street?: unknown;
  city?: unknown;
  smsConsent?: unknown;
  /** ISO 8601, from the sheet's date cell. */
  appointment?: unknown;
};

const text = (value: unknown) =>
  typeof value === 'string' ? value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() : '';

/**
 * The appointment text, or why it must not go out.
 *
 * Consent is read from the row, the same answer the confirmation text was
 * gated on when the quote came in. Nothing here sends anything, so the rules
 * can be tested without Twilio.
 */
export function appointmentText(
  request: AppointmentRequest,
  now: Date = new Date(),
): { ok: true; to: string; body: string } | { ok: false; reason: string } {
  // The sheet stores "yes" or "no". A checkbox column would read true.
  const consent = request.smsConsent === 'yes' || request.smsConsent === true;
  if (!consent) return { ok: false, reason: 'customer did not agree to texts on the quote form' };

  const phone = text(request.phone);
  if (!phone) return { ok: false, reason: 'no phone number on the row' };

  const street = text(request.street);
  if (!street) return { ok: false, reason: 'no street on the row' };

  const when = new Date(text(request.appointment));
  if (Number.isNaN(when.getTime())) return { ok: false, reason: 'appointment is not a date and time' };
  if (when.getTime() < now.getTime()) return { ok: false, reason: 'appointment is in the past' };

  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(when);
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    hour: 'numeric',
    minute: '2-digit',
  })
    .format(when)
    // Intl puts a narrow no-break space before AM/PM. It is not in the GSM-7
    // character set, so one of it turns the whole text into UCS-2 and a single
    // 160 character segment into three 67 character ones.
    .replace(new RegExp(String.fromCharCode(0x202f, 0xa0).split('').join('|'), 'g'), ' ');
  const city = text(request.city);
  const compose = (place: string) =>
    `${SITE_NAME} here. Reminder: your appointment is scheduled for ${day} at ${time}, ` +
    `${place}. Reply STOP to opt out.`;

  // Tyler's exact wording, 2026-10-07. It still has to be checked against the
  // sample messages on the approved A2P campaign before it goes live.
  //
  // The fixed words take about 124 of a segment's 160 characters, so the city
  // is included only when it fits. The street alone still says where, and a
  // second segment would double the cost of every one of these.
  const withCity = city ? compose(`${street}, ${city}`) : '';
  return {
    ok: true,
    to: phone,
    body: withCity && withCity.length <= SEGMENT ? withCity : compose(street),
  };
}
