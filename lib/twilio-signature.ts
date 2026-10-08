import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Whether a webhook really came from Twilio.
 *
 * Twilio signs the full URL it called followed by every POST parameter,
 * sorted by name, each name immediately followed by its value, with the
 * account's auth token as the HMAC-SHA1 key. See
 * https://www.twilio.com/docs/usage/security#validating-requests
 */
export function validTwilioSignature(
  authToken: string,
  url: string,
  params: Record<string, string>,
  signature: string | null,
): boolean {
  if (!authToken || !signature) return false;
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((key) => key + params[key])
      .join('');
  const expected = createHmac('sha1', authToken).update(data, 'utf8').digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
