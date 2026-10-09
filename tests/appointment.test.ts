import { describe, expect, it } from 'vitest';
import { appointmentText } from '@/lib/appointment';

// Charleston wall time, as the sheet's script sends it.
const WHEN = '2026-10-15T09:00';
/** 6:00 PM EDT the evening before, so the reminder is due. */
const EVENING_BEFORE = new Date('2026-10-14T22:00:00Z');

const row = (extra: Record<string, unknown> = {}) => ({
  name: 'Jane Customer',
  phone: '843-555-2345',
  street: '1810 Mepkin Rd',
  city: 'West Ashley',
  smsConsent: 'yes',
  appointment: WHEN,
  ...extra,
});

/** Charleston local time on a 2026 date, EDT (UTC-4) through Nov 1. */
const at = (local: string) => new Date(`${local}:00-04:00`);

/** The GSM 03.38 basic set, which is what keeps a text at 160 characters a segment. */
const GSM7 = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà]*$/;

describe('appointmentText wording', () => {
  it('uses the approved wording with the date, time and address filled in', () => {
    expect(appointmentText(row(), EVENING_BEFORE)).toEqual({
      ok: true,
      to: '843-555-2345',
      body:
        'Coastal Surface Restoration here. Reminder: your appointment is scheduled for ' +
        'Thu, Oct 15 at 9:00 AM, 1810 Mepkin Rd, West Ashley. ' +
        'To change this appointment, call or text 854-222-7790. Reply STOP to opt out.',
    });
  });

  it('stays within two GSM-7 segments and keeps the city for a long address', () => {
    const result = appointmentText(
      row({ street: '1234 Rivers Avenue, Unit 12B', city: "Sullivan's Island" }),
      EVENING_BEFORE,
    );
    if (!result.ok) throw new Error(result.reason);
    expect(result.body).toMatch(GSM7);
    expect(result.body.length).toBeLessThanOrEqual(306);
    expect(result.body).toContain("1234 Rivers Avenue, Unit 12B, Sullivan's Island. To change");
  });

  it('drops the city only when it would push past two segments', () => {
    // Sized so the street fits in two segments but street plus city does not.
    const street = ('1234 Old Plantation Road Extension, Building 7, Suite 1200, Back Entrance by the Loading Dock ').padEnd(115, 'x');
    const result = appointmentText(row({ street, city: "Sullivan's Island" }), EVENING_BEFORE);
    if (!result.ok) throw new Error(result.reason);
    expect(result.body).toContain(`${street}. To change`);
    expect(result.body.length).toBeLessThanOrEqual(306);
  });

  it('reads the wall time as Charleston time, after daylight saving ends too', () => {
    // Nov 12 is EST (UTC-5), so 8 AM, when its reminder is due, is 13:00 UTC.
    const result = appointmentText(row({ appointment: '2026-11-12T14:30' }), new Date('2026-11-12T13:00:00Z'));
    expect(result.ok && result.body).toContain('Thu, Nov 12 at 2:30 PM');
  });
});

describe('appointmentText timing', () => {
  it('reminds at 8 AM on the day for an appointment from 10 AM on', () => {
    const afternoon = row({ appointment: '2026-10-15T14:00' });
    expect(appointmentText(afternoon, at('2026-10-14T19:00'))).toEqual({
      ok: false,
      wait: true,
      reason: 'reminder goes out Thu, Oct 15 at 8:00 AM',
    });
    expect(appointmentText(afternoon, at('2026-10-15T07:59')).ok).toBe(false);
    expect(appointmentText(afternoon, at('2026-10-15T08:00')).ok).toBe(true);
    expect(appointmentText(row({ appointment: '2026-10-15T10:00' }), at('2026-10-15T08:00')).ok).toBe(true);
  });

  it('reminds an early appointment at 5 PM the evening before instead, and says when', () => {
    expect(appointmentText(row(), at('2026-10-14T16:59'))).toEqual({
      ok: false,
      wait: true,
      reason: 'reminder goes out Wed, Oct 14 at 5:00 PM',
    });
    expect(appointmentText(row(), at('2026-10-10T09:00')).ok).toBe(false);
    expect(appointmentText(row(), at('2026-10-14T17:00')).ok).toBe(true);
  });

  it('sends straight away when booked after 5 PM for tomorrow, or for later today', () => {
    expect(appointmentText(row(), at('2026-10-14T19:30')).ok).toBe(true);
    expect(appointmentText(row({ appointment: '2026-10-14T15:00' }), at('2026-10-14T10:00')).ok).toBe(true);
  });

  it('holds overnight texts until 8 AM', () => {
    expect(appointmentText(row(), at('2026-10-14T21:00'))).toEqual({
      ok: false,
      wait: true,
      reason: 'outside texting hours, goes out after 8 AM',
    });
    expect(appointmentText(row({ appointment: '2026-10-15T11:00' }), at('2026-10-15T07:59')).ok).toBe(false);
    expect(appointmentText(row({ appointment: '2026-10-15T11:00' }), at('2026-10-15T08:00')).ok).toBe(true);
  });

  it('skips a reminder less than an hour out, for good', () => {
    expect(appointmentText(row(), at('2026-10-15T08:30'))).toEqual({
      ok: false,
      reason: 'too close to the appointment to send a reminder',
    });
    expect(appointmentText(row(), at('2026-10-15T08:00')).ok).toBe(true);
  });

  it('refuses a past appointment', () => {
    expect(appointmentText(row(), at('2026-10-15T09:01'))).toEqual({
      ok: false,
      reason: 'appointment is in the past',
    });
  });
});

describe('appointmentText rules', () => {
  it('refuses without consent, the same rule as the confirmation text', () => {
    expect(appointmentText(row({ smsConsent: 'no' }), EVENING_BEFORE)).toEqual({
      ok: false,
      reason: 'customer did not agree to texts on the quote form',
    });
    expect(appointmentText(row({ smsConsent: 'no (replied STOP 10/7/2026)' }), EVENING_BEFORE).ok).toBe(false);
    expect(appointmentText(row({ smsConsent: '' }), EVENING_BEFORE).ok).toBe(false);
    expect(appointmentText(row({ smsConsent: true }), EVENING_BEFORE).ok).toBe(true);
  });

  it('refuses a missing phone or street and anything that is not a wall time', () => {
    expect(appointmentText(row({ phone: '' }), EVENING_BEFORE).ok).toBe(false);
    expect(appointmentText(row({ street: '  ' }), EVENING_BEFORE).ok).toBe(false);
    expect(appointmentText(row({ appointment: 'soon' }), EVENING_BEFORE).ok).toBe(false);
    expect(appointmentText(row({ appointment: '2026-10-15T13:00:00.000Z' }), EVENING_BEFORE).ok).toBe(false);
  });
});

describe('appointment confirmation', () => {
  const confirm = (extra: Record<string, unknown> = {}) => row({ kind: 'confirmation', ...extra });

  it('uses the registered Sample #2 wording with the date and time filled in', () => {
    expect(appointmentText(confirm(), at('2026-10-08T10:00'))).toEqual({
      ok: true,
      to: '843-555-2345',
      body:
        'Coastal Surface Restoration: Your service appointment is confirmed for 10/15/2026 at 9:00 AM. ' +
        'Questions? Call 854-222-7790 or visit coastalsurfacerestoration.com. ' +
        'To change this appointment, call or text 854-222-7790. Reply STOP to opt out.',
    });
  });

  it('is plain GSM-7, two segments at most', () => {
    const result = appointmentText(confirm(), at('2026-10-08T10:00'));
    if (!result.ok) throw new Error(result.reason);
    expect(result.body).toMatch(GSM7);
    expect(result.body.length).toBeLessThanOrEqual(306);
  });

  it('goes out straight away, days ahead, but waits out quiet hours', () => {
    expect(appointmentText(confirm(), at('2026-10-08T20:59')).ok).toBe(true);
    expect(appointmentText(confirm(), at('2026-10-08T21:00'))).toEqual({
      ok: false,
      wait: true,
      reason: 'outside texting hours, goes out after 8 AM',
    });
  });

  it('follows the same consent rule', () => {
    expect(appointmentText(confirm({ smsConsent: 'no' }), at('2026-10-08T10:00')).ok).toBe(false);
  });
});

describe('reminder after a fresh confirmation', () => {
  it('is skipped when the confirmation just went out the evening before', () => {
    expect(appointmentText(row({ confirmedJustNow: true }), at('2026-10-14T19:00'))).toEqual({
      ok: false,
      reason: 'not needed, the confirmation went out within a day of the appointment',
    });
  });

  it('still waits for its own time when booked days ahead', () => {
    expect(appointmentText(row({ confirmedJustNow: true }), at('2026-10-08T10:00'))).toMatchObject({ wait: true });
  });
});

describe('walkthrough texts', () => {
  const walk = (extra: Record<string, unknown> = {}) => row({ type: 'walkthrough', ...extra });

  it('confirms a walkthrough as a site visit to look at and measure, with the change line', () => {
    expect(appointmentText(walk({ kind: 'confirmation' }), at('2026-10-08T10:00'))).toEqual({
      ok: true,
      to: '843-555-2345',
      body:
        'Coastal Surface Restoration: Your site visit is confirmed for 10/15/2026 at 9:00 AM. ' +
        'We will come by to look at and measure the project. ' +
        'Questions? Call 854-222-7790 or visit coastalsurfacerestoration.com. ' +
        'To change this appointment, call or text 854-222-7790. Reply STOP to opt out.',
    });
  });

  it('reminds about the site visit, not a job or service appointment', () => {
    const result = appointmentText(walk(), EVENING_BEFORE);
    expect(result).toEqual({
      ok: true,
      to: '843-555-2345',
      body:
        'Coastal Surface Restoration here. Reminder: your site visit is scheduled for ' +
        'Thu, Oct 15 at 9:00 AM, 1810 Mepkin Rd, West Ashley. We will look at and measure the project. ' +
        'To change this appointment, call or text 854-222-7790. Reply STOP to opt out.',
    });
  });

  it('never says job or service appointment, and stays GSM-7 within two segments', () => {
    const long = { street: '1234 Rivers Avenue, Unit 12B', city: "Sullivan's Island" };
    for (const result of [
      appointmentText(walk({ kind: 'confirmation', ...long }), at('2026-10-08T10:00')),
      appointmentText(walk(long), EVENING_BEFORE),
    ]) {
      if (!result.ok) throw new Error(result.reason);
      expect(result.body).not.toMatch(/\bjob\b|service appointment/i);
      expect(result.body).toMatch(GSM7);
      expect(result.body.length).toBeLessThanOrEqual(306);
    }
  });

  it('keeps the job wording for a job and for a request with no type', () => {
    const job = appointmentText(row({ type: 'job', kind: 'confirmation' }), at('2026-10-08T10:00'));
    const old = appointmentText(row({ kind: 'confirmation' }), at('2026-10-08T10:00'));
    expect(job).toEqual(old);
    expect(job.ok && job.body).toContain('Your service appointment is confirmed');
  });

  it('follows the same consent, quiet hours, past and timing rules as a job', () => {
    expect(appointmentText(walk({ smsConsent: 'no', kind: 'confirmation' }), at('2026-10-08T10:00')).ok).toBe(false);
    expect(appointmentText(walk({ kind: 'confirmation' }), at('2026-10-08T21:00'))).toMatchObject({ wait: true });
    expect(appointmentText(walk({ kind: 'confirmation' }), at('2026-10-16T10:00'))).toEqual({
      ok: false,
      reason: 'appointment is in the past',
    });
    // 9 AM is before 10 AM, so 5 PM the evening before; 11 AM is 8 AM the same day.
    expect(appointmentText(walk(), at('2026-10-14T16:59'))).toMatchObject({
      wait: true,
      reason: 'reminder goes out Wed, Oct 14 at 5:00 PM',
    });
    expect(appointmentText(walk({ appointment: '2026-10-12T11:00' }), at('2026-10-12T07:59'))).toMatchObject({
      wait: true,
      reason: 'reminder goes out Mon, Oct 12 at 8:00 AM',
    });
    expect(appointmentText(walk({ appointment: '2026-10-12T11:00' }), at('2026-10-12T08:00')).ok).toBe(true);
  });
});
