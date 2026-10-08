import { recordSmsConsent } from '@/lib/notify';
import { validTwilioSignature } from '@/lib/twilio-signature';

/**
 * Twilio's incoming message webhook for the Messaging Service.
 *
 * Twilio's Advanced Opt-Out already answers STOP, START and HELP and blocks
 * texts to anyone who opted out. This keeps the Quote Requests Log in step:
 * STOP marks that number's SMS Consent "no", START marks it "yes" again, so
 * the sheet never claims consent Twilio would refuse.
 *
 * Answers an empty TwiML response, so nothing is sent on top of Twilio's own
 * opt-out replies.
 */
const EMPTY_TWIML = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

/** The keywords Twilio's default Advanced Opt-Out treats as each type. */
const STOP_WORDS = new Set(['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT', 'OPTOUT', 'REVOKE']);
const START_WORDS = new Set(['START', 'YES', 'UNSTOP', 'OPTIN']);

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return twiml(400);
  const params: Record<string, string> = {};
  form.forEach((value, key) => {
    if (typeof value === 'string') params[key] = value;
  });

  const token = process.env.TWILIO_AUTH_TOKEN ?? '';
  if (!validTwilioSignature(token, publicUrl(req), params, req.headers.get('x-twilio-signature'))) {
    console.warn('Inbound text refused: bad Twilio signature.');
    return twiml(403);
  }

  // Twilio says which keyword type it matched. Fall back to the body for an
  // account without Advanced Opt-Out.
  const type = (params.OptOutType || '').toUpperCase();
  const word = (params.Body || '').trim().toUpperCase();
  const consent =
    type === 'STOP' || (!type && STOP_WORDS.has(word))
      ? 'no'
      : type === 'START' || (!type && START_WORDS.has(word))
        ? 'yes'
        : null;

  if (consent && params.From) {
    const result = await recordSmsConsent(params.From, consent);
    if (result.sent) console.log(`SMS consent set to ${consent} on ${result.rows} row(s).`);
    else console.warn(`SMS consent not recorded in the sheet: ${result.reason}`);
  }

  return twiml(200);
}

function twiml(status: number) {
  return new Response(EMPTY_TWIML, { status, headers: { 'Content-Type': 'text/xml' } });
}

/**
 * The URL exactly as Twilio called it, which is what it signed. Vercel passes
 * the public host and protocol in forwarding headers.
 */
function publicUrl(req: Request): string {
  const url = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') ?? url.host;
  const proto = req.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '');
  return `${proto}://${host}${url.pathname}${url.search}`;
}
