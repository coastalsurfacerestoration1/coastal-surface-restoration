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
  /** Charleston wall time as typed in the sheet, e.g. 2026-10-15T09:00. */
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

  const when = charlestonTime(text(request.appointment));
  if (!when) return { ok: false, reason: 'appointment is not a date and time' };
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

/** Minutes Charleston is ahead of UTC at that instant, e.g. -240 in summer. */
function zoneOffset(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(date);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'));
  return Math.round((asUtc - Math.floor(date.getTime() / 60000) * 60000) / 60000);
}

const WALL_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/**
 * The instant a Charleston wall time names, such as 2026-10-15T09:00.
 *
 * The offset is looked up at the guessed instant and then once more at the
 * corrected one, which settles the daylight saving changeover days.
 */
function charlestonTime(value: string): Date | null {
  const match = WALL_TIME.exec(value);
  if (!match) return null;
  const [, y, mo, d, h, mi] = match.map(Number);
  const naive = Date.UTC(y, mo - 1, d, h, mi);
  let instant = naive - zoneOffset(new Date(naive)) * 60000;
  instant = naive - zoneOffset(new Date(instant)) * 60000;
  const when = new Date(instant);
  return Number.isNaN(when.getTime()) ? null : when;
}
