import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { BUSINESS, SITE_NAME } from '@/lib/seo';

const FROM = `${SITE_NAME} <quotes@coastalsurfacerestoration.com>`;

const FIELDS = [
  'name',
  'email',
  'phone',
  'street',
  'city',
  'state',
  'zip',
  'serviceType',
  'description',
] as const;
type Field = (typeof FIELDS)[number];

/** Longest a field can be before we assume it is not a real quote request. */
const MAX_LENGTH: Record<Field, number> = {
  name: 100,
  email: 254,
  phone: 30,
  street: 200,
  city: 80,
  // Not 2. The length guard runs before the format check, so a tight ceiling
  // here would answer "Field too long" where "two letter state" is the useful
  // message. STATE_PATTERN is what actually enforces the format.
  state: 20,
  zip: 10,
  serviceType: 80,
  description: 5000,
};

const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };

const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
/**
 * Ceiling for the photos in one submission. Serverless platforms cap the
 * request body well below Resend's 40MB attachment allowance, so this is sized
 * to stay inside the smaller of the two. The browser downscales before upload,
 * which puts a normal four photo submission an order of magnitude under it.
 */
const MAX_TOTAL_PHOTO_BYTES = 9 * 1024 * 1024;

type PhotoKind = 'jpg' | 'png' | 'webp';

/**
 * Identifies an image from its leading bytes.
 *
 * The client-declared MIME type and the filename are both attacker-controlled,
 * so neither decides what gets attached to an email. The signature does.
 */
function sniffImage(bytes: Uint8Array): PhotoKind | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpg';
  }
  const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && PNG.every((b, i) => bytes[i] === b)) {
    return 'png';
  }
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.subarray(start, end));
  if (bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    return 'webp';
  }
  return null;
}

type PhotoAttachment = { filename: string; content: string };

/**
 * Turns the uploaded photos into Resend attachments, or returns the message to
 * show the customer if something is wrong with them.
 *
 * Filenames are generated rather than echoed back from the upload, so a
 * hostile name cannot decide what appears in the inbox.
 */
async function readPhotos(
  form: FormData,
): Promise<{ photos: PhotoAttachment[] } | { error: string }> {
  const files = form
    .getAll('photos')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) return { photos: [] };
  if (files.length > MAX_PHOTOS) {
    return { error: `Please attach at most ${MAX_PHOTOS} photos.` };
  }

  const photos: PhotoAttachment[] = [];
  let total = 0;

  for (const file of files) {
    total += file.size;
    if (file.size > MAX_PHOTO_BYTES || total > MAX_TOTAL_PHOTO_BYTES) {
      return { error: 'Those photos are too large. Please send fewer or smaller ones.' };
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const kind = sniffImage(bytes);
    if (!kind) {
      return { error: 'Photos need to be JPEG, PNG, or WebP images.' };
    }

    // Base64, not a raw Buffer: the SDK hands the payload to JSON.stringify,
    // which would turn a Buffer into { type: 'Buffer', data: [...] } instead of
    // file content.
    photos.push({
      filename: `photo-${photos.length + 1}.${kind}`,
      content: Buffer.from(bytes).toString('base64'),
    });
  }

  return { photos };
}

/**
 * Per-instance submission log, keyed by client IP.
 *
 * This is deliberately in memory. The site is a handful of static pages with
 * one form, so the realistic threat is a script hammering the endpoint and
 * burning through the Resend quota, not a distributed attack. A serverless
 * platform may run several instances and will discard this on a cold start,
 * which means the effective limit is per instance rather than global. That is
 * enough to blunt a single naive script without adding a Redis dependency to a
 * brochure site. Revisit if the form ever gets abused for real.
 */
const submissions = new Map<string, number[]>();

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  // x-forwarded-for is a comma-separated chain; the first entry is the client.
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT.windowMs;

  // Drop expired entries on the way through so the map cannot grow unbounded
  // across the life of the instance.
  for (const [key, times] of submissions) {
    const live = times.filter((t) => t > cutoff);
    if (live.length === 0) submissions.delete(key);
    else submissions.set(key, live);
  }

  const recent = submissions.get(ip) ?? [];
  if (recent.length >= RATE_LIMIT.max) return true;

  submissions.set(ip, [...recent, now]);
  return false;
}

/**
 * Every field is attacker-controlled and lands inside an HTML email. Without
 * this, a description containing markup renders as markup in the inbox.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Keeps submitted values from breaking the subject line onto a second header. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * North American numbering plan: ten digits, with the area code and the
 * exchange both starting 2-9. Rejects the placeholder-looking numbers that a
 * plain length check lets through, 000-000-0000 among them.
 */
const PHONE_PATTERN = /^[2-9]\d{2}[2-9]\d{6}$/;
const STATE_PATTERN = /^[A-Za-z]{2}$/;
const ZIP_PATTERN = /^\d{5}$/;
/**
 * Every ZIP in the Charleston tri-county area begins 294. A submission outside
 * it is flagged in the notification rather than refused: an out of area job may
 * still be worth taking, and that is Tyler's call to make, not the form's.
 */
const LOCAL_ZIP_PREFIX = '294';

export async function POST(req: Request) {
  // The form posts multipart/form-data so photos can ride along with the text
  // fields. A body that is not multipart fails to parse here and gets the same
  // 400 as any other malformed request.
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Honeypot. A real person never sees this input, so anything in it is a bot.
  // Answer 200 rather than an error: a rejection tells the script what tripped
  // it, a success tells it nothing and it moves on.
  const honeypot = form.get('companyWebsite');
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    // Still answered with success, for the reason above. Logged because a
    // false positive here is otherwise invisible: an autofill extension or a
    // password manager that fills the hidden field turns a real customer's
    // request into a silent discard that looks identical to a delivered one.
    console.warn(
      `Quote discarded by honeypot. value=${JSON.stringify(honeypot.slice(0, 80))} ` +
        `name=${JSON.stringify(String(form.get('name') ?? '').slice(0, 60))} ` +
        `email=${JSON.stringify(String(form.get('email') ?? '').slice(0, 60))}`,
    );
    return NextResponse.json({ success: true });
  }

  const values = {} as Record<Field, string>;
  for (const field of FIELDS) {
    const value = form.get(field);
    if (typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const trimmed = value.trim();
    if (trimmed.length > MAX_LENGTH[field]) {
      return NextResponse.json({ error: 'Field too long' }, { status: 400 });
    }
    values[field] = trimmed;
  }

  if (!EMAIL_PATTERN.test(values.email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!PHONE_PATTERN.test(values.phone.replace(/\D/g, ''))) {
    return NextResponse.json(
      { error: 'Please enter a valid 10 digit US phone number.' },
      { status: 400 },
    );
  }

  // A street line with no digit is a city or a landmark, not somewhere a truck
  // can be sent.
  if (!/\d/.test(values.street) || !/[A-Za-z]/.test(values.street)) {
    return NextResponse.json(
      { error: 'Please include a street number and street name.' },
      { status: 400 },
    );
  }

  if (!STATE_PATTERN.test(values.state)) {
    return NextResponse.json({ error: 'Please enter a two letter state.' }, { status: 400 });
  }

  if (!ZIP_PATTERN.test(values.zip)) {
    return NextResponse.json({ error: 'Please enter a five digit ZIP code.' }, { status: 400 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'Too many requests. Please call us instead.' },
      { status: 429 },
    );
  }

  // Deliberately after the rate limit check: reading file bytes is the
  // expensive part of this handler and a blocked caller should never reach it.
  const result = await readPhotos(form);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { photos } = result;

  const safe = Object.fromEntries(
    FIELDS.map((field) => [field, escapeHtml(values[field])]),
  ) as Record<Field, string>;

  // Escaped first, so this only ever inserts our own markup. Without it a
  // multi-paragraph description arrives as one run-on block.
  safe.description = safe.description.replace(/\r?\n/g, '<br />');

  /** tel: and mailto: targets, reduced to characters those schemes allow. */
  const telHref = values.phone.replace(/[^\d+]/g, '');

  const addressLine = `${values.street}, ${values.city}, ${values.state.toUpperCase()} ${values.zip}`;
  const safeAddressLine = escapeHtml(addressLine);
  const outOfArea = !values.zip.startsWith(LOCAL_ZIP_PREFIX);

  const outOfAreaRow = outOfArea
    ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Heads up</strong></td><td style="padding: 8px 0; color: #b45309;">ZIP ${escapeHtml(values.zip)} is outside the usual Charleston service area.</td></tr>`
    : '';

  const photoRow =
    photos.length > 0
      ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Photos</strong></td><td style="padding: 8px 0;">${photos.length} attached to this email</td></tr>`
      : '';

  // The Resend constructor throws on a missing key. Checking here turns a
  // misconfigured environment into a logged 500 the form can explain, rather
  // than an unhandled exception.
  if (!process.env.RESEND_API_KEY) {
    console.error('Quote form error: RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // The SDK resolves with { data, error } rather than throwing when the API
    // rejects a send, so the error has to be read off the result. Without this
    // a rejected email still returns 200 and the customer lands on the thank
    // you page while nothing reaches the inbox.
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: BUSINESS.email,
      replyTo: values.email,
      attachments: photos.length > 0 ? photos : undefined,
      subject: `${outOfArea ? '[Outside area] ' : ''}New Quote Request -- ${singleLine(values.serviceType)} -- ${singleLine(values.name)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0e273e;">New Quote Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name</strong></td><td style="padding: 8px 0;">${safe.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Phone</strong></td><td style="padding: 8px 0;"><a href="tel:${telHref}">${safe.phone}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Address</strong></td><td style="padding: 8px 0;">${safeAddressLine}</td></tr>
            ${outOfAreaRow}
            <tr><td style="padding: 8px 0; color: #666;"><strong>Service</strong></td><td style="padding: 8px 0;">${safe.serviceType}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Description</strong></td><td style="padding: 8px 0;">${safe.description}</td></tr>
            ${photoRow}
          </table>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">Sent from coastalsurfacerestoration.com quote form</p>
        </div>
      `,
    });

    if (error) {
      console.error('Quote form error, Resend rejected the send:', error);
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }

    // Accepted by Resend. Logging the id makes an accepted-but-missing email
    // traceable: the id either appears in the Resend dashboard or it does not,
    // which distinguishes a delivery problem from looking at the wrong account.
    console.log(
      `Quote accepted by Resend. id=${data?.id ?? 'none'} to=${BUSINESS.email} from=${FROM} photos=${photos.length}`,
    );
  } catch (error) {
    console.error('Quote form error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }

  // The customer acknowledgement is best effort. Tyler already has the lead at
  // this point, so a failure here should not tell the customer their request
  // did not go through.
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: values.email,
      replyTo: BUSINESS.email,
      subject: `We got your request, ${singleLine(values.name)}`,
      text: acknowledgementText(values, addressLine, photos.length),
      html: acknowledgementHtml(safe, safeAddressLine, photos.length),
    });

    if (error) console.error('Quote acknowledgement error:', error);
  } catch (error) {
    console.error('Quote acknowledgement error:', error);
  }

  return NextResponse.json({ success: true });
}

function acknowledgementText(
  values: Record<Field, string>,
  addressLine: string,
  photoCount: number,
): string {
  return [
    `Hi ${values.name},`,
    '',
    `Thanks for reaching out to ${SITE_NAME}. We have your request and will follow up within 24 hours.`,
    '',
    'One thing to know up front: we are not operational yet. Equipment arrives in the fall and we expect to take our first Charleston jobs in October 2026. We will get you a price now and put you on the schedule for launch.',
    '',
    'Here is what you sent us:',
    '',
    `Service: ${values.serviceType}`,
    `Address: ${addressLine}`,
    `Phone: ${values.phone}`,
    ...(photoCount > 0 ? [`Photos: ${photoCount} received`] : []),
    '',
    'Project description:',
    values.description,
    '',
    photoCount === 1
      ? 'Thanks for the photo. If anything above is wrong, just reply to this email.'
      : photoCount > 1
        ? `Thanks for the ${photoCount} photos. If anything above is wrong, just reply to this email.`
        : 'If anything above is wrong, or you have photos of the piece, just reply to this email.',
    '',
    'Tyler Scherzer',
    `${SITE_NAME}`,
    BUSINESS.phone,
  ].join('\n');
}

function acknowledgementHtml(
  safe: Record<Field, string>,
  safeAddressLine: string,
  photoCount: number,
): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding: 6px 0; color: #666; width: 110px; vertical-align: top;"><strong>${label}</strong></td><td style="padding: 6px 0; color: #222;">${value}</td></tr>`;

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      <div style="background: #0e273e; padding: 20px 24px;">
        <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold; letter-spacing: 0.04em;">
          COASTAL <span style="color: #397774;">SURFACE RESTORATION</span>
        </p>
      </div>
      <div style="padding: 24px;">
        <p style="margin: 0 0 16px;">Hi ${safe.name},</p>
        <p style="margin: 0 0 16px; line-height: 1.6;">
          Thanks for reaching out. We have your request and will follow up within 24 hours.
        </p>
        <p style="margin: 0 0 16px; line-height: 1.6;">
          One thing to know up front: we are not operational yet. Equipment arrives in the fall
          and we expect to take our first Charleston jobs in October 2026. We will get you a
          price now and put you on the schedule for launch.
        </p>
        <p style="margin: 24px 0 8px; font-weight: bold;">What you sent us</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${row('Service', safe.serviceType)}
          ${row('Address', safeAddressLine)}
          ${row('Phone', safe.phone)}
          ${row('Project', safe.description)}
          ${photoCount > 0 ? row('Photos', `${photoCount} received`) : ''}
        </table>
        <p style="margin: 24px 0 0; line-height: 1.6;">
          ${
            photoCount > 0
              ? 'Thanks for the photos. If anything above is wrong, just reply to this email.'
              : 'If anything above is wrong, or you have photos of the piece, just reply to this email.'
          }
        </p>
        <p style="margin: 24px 0 0; line-height: 1.6;">
          Tyler Scherzer<br />
          ${SITE_NAME}<br />
          <a href="tel:${BUSINESS.phone.replace(/\D/g, '')}" style="color: #397774;">${BUSINESS.phone}</a>
        </p>
      </div>
      <div style="border-top: 1px solid #eee; padding: 16px 24px;">
        <p style="margin: 0; color: #999; font-size: 12px;">
          You are getting this because you requested a quote at coastalsurfacerestoration.com.
        </p>
      </div>
    </div>
  `;
}
