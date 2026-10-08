import { describe, expect, it } from 'vitest';
import { appointmentText } from '@/lib/appointment';

const NOW = new Date('2026-10-08T12:00:00Z');
// 9:00 AM in Charleston on Thursday, October 15, 2026 (EDT, UTC-4).
const WHEN = '2026-10-15T13:00:00.000Z';

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

  it('converts to Charleston time across daylight saving', () => {
    const result = appointmentText(row({ appointment: '2026-11-12T19:30:00.000Z' }), NOW);
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

  it('refuses a missing phone or street, a bad date and a past appointment', () => {
    expect(appointmentText(row({ phone: '' }), NOW).ok).toBe(false);
    expect(appointmentText(row({ street: '  ' }), NOW).ok).toBe(false);
    expect(appointmentText(row({ appointment: 'soon' }), NOW).ok).toBe(false);
    expect(appointmentText(row({ appointment: '2026-10-01T13:00:00.000Z' }), NOW)).toEqual({
      ok: false,
      reason: 'appointment is in the past',
    });
  });
});
