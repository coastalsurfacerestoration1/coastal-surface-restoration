import { BUSINESS, SITE_NAME } from './seo';

const ZONE = 'America/New_York';
/** Characters in one GSM-7 text segment. */
const SEGMENT = 160;
/**
 * When the reminder goes out, Charleston time: 8 AM on the day, unless the
 * appointment is before 10 AM, in which case 5 PM the evening before, so an
 * early job never gets its reminder only minutes ahead. Tyler, 2026-10-07.
 */
const MORNING_REMINDER_HOUR = 8;
const EARLY_APPOINTMENT_BEFORE = 10;
const EVENING_REMINDER_HOUR = 17;
/** No texts before 8 AM or from 9 PM on, Charleston time. */
const QUIET_BEFORE = 8;
const QUIET_FROM = 21;
/** Closer than this to the appointment, a reminder is more noise than help. */
const MIN_LEAD_MS = 60 * 60 * 1000;

/** What the sheet's script sends when an Appointment cell is filled in. */
export type AppointmentRequest = {
  name?: unknown;
  phone?: unknown;
  street?: unknown;
  city?: unknown;
  smsConsent?: unknown;
  /** Charleston wall time as typed in the sheet, e.g. 2026-10-15T09:00. */
  appointment?: unknown;
  /** Which text: the confirmation when it is booked, or the reminder before. */
  kind?: unknown;
  /** The confirmation for this appointment went out in this same pass. */
  confirmedJustNow?: unknown;
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
):
  | { ok: true; to: string; body: string }
  | { ok: false; reason: string; wait?: boolean } {
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

  const hour = charlestonHour(now);
  const quiet = hour < QUIET_BEFORE || hour >= QUIET_FROM;

  // The confirmation is due as soon as the appointment is entered, apart from
  // quiet hours. Worded as Sample #2 on the registered A2P campaign.
  if (request.kind === 'confirmation') {
    if (quiet) return { ok: false, wait: true, reason: 'waiting for texting hours, 8 AM to 9 PM' };
    const [date, clock] = shortDateAndTime(when);
    return {
      ok: true,
      to: phone,
      body:
        `${SITE_NAME}: Your service appointment is confirmed for ${date} at ${clock}. ` +
        `Questions? Call ${BUSINESS.phone} or visit coastalsurfacerestoration.com. Reply STOP to opt out.`,
    };
  }

  // Before the reminder is due it waits, and the sheet's hourly check asks
  // again.
  const due = reminderDue(when);
  if (now.getTime() < due.getTime()) {
    return { ok: false, wait: true, reason: `reminder goes out ${dayAndTime(due)}` };
  }
  // Booked once the reminder was already due, say this morning for this
  // afternoon: the confirmation that just went out already says when, so a
  // reminder a minute later is noise.
  if (request.confirmedJustNow === true) {
    return { ok: false, reason: 'not needed, the confirmation went out within a day of the appointment' };
  }
  if (when.getTime() - now.getTime() < MIN_LEAD_MS) {
    return { ok: false, reason: 'too close to the appointment to send a reminder' };
  }
  if (quiet) return { ok: false, wait: true, reason: 'waiting for texting hours, 8 AM to 9 PM' };

  const [day, time] = dayAndTime(when).split(' at ');
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

/** 8 AM on the appointment day, or 5 PM the evening before for an early job. */
function reminderDue(when: Date): Date {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(when)
    .split('-')
    .map(Number);
  const early = charlestonHour(when) < EARLY_APPOINTMENT_BEFORE;
  const day = new Date(Date.UTC(y, m - 1, early ? d - 1 : d));
  const hour = early ? EVENING_REMINDER_HOUR : MORNING_REMINDER_HOUR;
  const pad = (n: number) => String(n).padStart(2, '0');
  const wall =
    `${day.getUTCFullYear()}-${pad(day.getUTCMonth() + 1)}-${pad(day.getUTCDate())}` +
    `T${pad(hour)}:00`;
  return charlestonTime(wall)!;
}

function charlestonHour(date: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-US', { timeZone: ZONE, hour: 'numeric', hourCycle: 'h23' }).format(date),
  );
}

/** "Thu, Oct 15 at 9:00 AM" in Charleston time, in plain GSM-7 characters. */
function dayAndTime(date: Date): string {
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
  const time = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, hour: 'numeric', minute: '2-digit' })
    .format(date)
    // Intl puts a narrow no-break space before AM/PM. It is not in the GSM-7
    // character set, so one of it turns the whole text into UCS-2 and a single
    // 160 character segment into three 67 character ones.
    .replace(new RegExp(String.fromCharCode(0x202f, 0xa0).split('').join('|'), 'g'), ' ');
  return `${day} at ${time}`;
}

/** ["10/15/2026", "9:00 AM"], the MM/DD/YYYY shape the campaign sample uses. */
function shortDateAndTime(date: Date): [string, string] {
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
  return [day, dayAndTime(date).split(' at ')[1]];
}
