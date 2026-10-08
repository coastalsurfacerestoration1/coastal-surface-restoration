import { describe, expect, it } from 'vitest';
import { appointmentText } from '@/lib/appointment';

const NOW = new Date('2026-10-08T12:00:00Z');
// Charleston wall time, as the sheet's script sends it.
const WHEN = '2026-10-15T09:00';

const row = (extra: Record<string, unknown> = {}) => ({
  name: 'Jane Customer',
  phone: '843-555-2345',
  street: '1810 Mepkin Rd',
  city: 'West Ashley',
  smsConsent: 'yes',
  appointment: WHEN,
  ...extra,
});

/** The GSM 03.38 basic set, which is what keeps a text at 160 characters a segment. */
const GSM7 = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà]*$/;

describe('appointmentText', () => {
  it('uses the approved wording with the date, time and address filled in', () => {
    const result = appointmentText(row(), NOW);
    expect(result).toEqual({
      ok: true,
      to: '843-555-2345',
      body:
        'Coastal Surface Restoration here. Reminder: your appointment is scheduled for ' +
        'Thu, Oct 15 at 9:00 AM, 1810 Mepkin Rd, West Ashley. Reply STOP to opt out.',
    });
  });

  it('stays one GSM-7 segment even with a long address', () => {
    const result = appointmentText(
      row({ street: '1234 Rivers Avenue, Unit 12B', city: "Sullivan's Island" }),
      NOW,
    );
    if (!result.ok) throw new Error(result.reason);
    expect(result.body).toMatch(GSM7);
    expect(result.body.length).toBeLessThanOrEqual(160);
    expect(result.body).toContain('1234 Rivers Avenue, Unit 12B. Reply STOP');
  });

  it('reads the wall time as Charleston time, on both sides of daylight saving', () => {
    const result = appointmentText(row({ appointment: '2026-11-12T14:30' }), NOW);
    expect(result.ok && result.body).toContain('Thu, Nov 12 at 2:30 PM');
  });

  it('refuses without consent, the same rule as the confirmation text', () => {
    expect(appointmentText(row({ smsConsent: 'no' }), NOW)).toEqual({
      ok: false,
      reason: 'customer did not agree to texts on the quote form',
    });
    expect(appointmentText(row({ smsConsent: '' }), NOW).ok).toBe(false);
    expect(appointmentText(row({ smsConsent: true }), NOW).ok).toBe(true);
  });

  it('treats an appointment later today as upcoming, judged in Charleston time', () => {
    // 8:00 AM Charleston is 12:00 UTC, so 9:00 AM the same morning is still ahead.
    expect(appointmentText(row({ appointment: '2026-10-08T09:00' }), NOW).ok).toBe(true);
    expect(appointmentText(row({ appointment: '2026-10-08T07:30' }), NOW).ok).toBe(false);
  });

  it('refuses a missing phone or street, a bad date and a past appointment', () => {
    expect(appointmentText(row({ phone: '' }), NOW).ok).toBe(false);
    expect(appointmentText(row({ street: '  ' }), NOW).ok).toBe(false);
    expect(appointmentText(row({ appointment: 'soon' }), NOW).ok).toBe(false);
    expect(appointmentText(row({ appointment: '2026-10-15T13:00:00.000Z' }), NOW).ok).toBe(false);
    expect(appointmentText(row({ appointment: '2026-10-01T09:00' }), NOW)).toEqual({
      ok: false,
      reason: 'appointment is in the past',
    });
  });
});
