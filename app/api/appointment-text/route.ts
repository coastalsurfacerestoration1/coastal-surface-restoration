import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { appointmentText } from '@/lib/appointment';
import { customerSmsEnabled, sendSms } from '@/lib/notify';

/**
 * Sends the appointment reminder for one row of the Quote Requests Log.
 *
 * Called only by the sheet's Apps Script: when an Appointment cell is filled
 * in, and then hourly for every row still waiting. This decides whether the
 * reminder is due, so the timing rules live in one place, in Charleston time.
 * It authenticates with the same QUOTE_SHEET_SECRET the site already uses to
 * call that script, so there is no new secret to manage, and each
 * environment's sheet can only reach its own deployment.
 *
 * Always answers JSON `{ sent, wait?, reason? }`. `wait` means not yet, ask
 * again later; without it a refusal is final for that appointment. The script
 * writes the reason into the row, so a text that did not go out says why right
 * where Tyler is looking.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ sent: false, reason: 'bad request' }, { status: 400 });
  }

  if (!secretMatches(body?.secret)) {
    return NextResponse.json({ sent: false, reason: 'forbidden' }, { status: 403 });
  }

  // Same two gates as the quote confirmation text: the customer's consent,
  // checked inside appointmentText, and the switch for customer texts at all.
  if (!customerSmsEnabled()) {
    return NextResponse.json({ sent: false, reason: 'customer texts are turned off on the site' });
  }

  const message = appointmentText(body);
  if (!message.ok) {
    return NextResponse.json({ sent: false, wait: message.wait === true, reason: message.reason });
  }

  const result = await sendSms(message.to, message.body);
  if (!result.sent) {
    console.warn(`Appointment text not sent: ${result.reason}`);
    // 21610 is Twilio refusing a number that replied STOP. Worth saying plainly.
    const reason = result.reason?.includes('21610')
      ? 'customer replied STOP to our texts'
      : (result.reason ?? 'unknown');
    return NextResponse.json({ sent: false, reason });
  }

  console.log('Appointment text sent.');
  return NextResponse.json({ sent: true });
}

function secretMatches(given: unknown): boolean {
  const expected = process.env.QUOTE_SHEET_SECRET;
  if (!expected || typeof given !== 'string') return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
