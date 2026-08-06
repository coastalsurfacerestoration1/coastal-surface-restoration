import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { BUSINESS, SITE_NAME } from '@/lib/seo';

const FROM = `${SITE_NAME} <quotes@coastalsurfacerestoration.com>`;

const FIELDS = ['name', 'email', 'phone', 'address', 'serviceType', 'description'] as const;
type Field = (typeof FIELDS)[number];

/** Longest a field can be before we assume it is not a real quote request. */
const MAX_LENGTH: Record<Field, number> = {
  name: 100,
  email: 254,
  phone: 30,
  address: 200,
  serviceType: 80,
  description: 5000,
};

const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };

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

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // Honeypot. A real person never sees this input, so anything in it is a bot.
  // Answer 200 rather than an error: a rejection tells the script what tripped
  // it, a success tells it nothing and it moves on.
  if (typeof raw.companyWebsite === 'string' && raw.companyWebsite.trim() !== '') {
    return NextResponse.json({ success: true });
  }

  const values = {} as Record<Field, string>;
  for (const field of FIELDS) {
    const value = raw[field];
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
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'Too many requests. Please call us instead.' },
      { status: 429 },
    );
  }

  const safe = Object.fromEntries(
    FIELDS.map((field) => [field, escapeHtml(values[field])]),
  ) as Record<Field, string>;

  // Escaped first, so this only ever inserts our own markup. Without it a
  // multi-paragraph description arrives as one run-on block.
  safe.description = safe.description.replace(/\r?\n/g, '<br />');

  /** tel: and mailto: targets, reduced to characters those schemes allow. */
  const telHref = values.phone.replace(/[^\d+]/g, '');

  // The Resend constructor throws on a missing key. Checking here turns a
  // misconfigured environment into a logged 500 the form can explain, rather
  // than an unhandled exception.
  if (!process.env.RESEND_API_KEY) {
    console.error('Quote form error: RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: FROM,
      to: BUSINESS.email,
      replyTo: values.email,
      subject: `New Quote Request -- ${singleLine(values.serviceType)} -- ${singleLine(values.name)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0a1628;">New Quote Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name</strong></td><td style="padding: 8px 0;">${safe.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Phone</strong></td><td style="padding: 8px 0;"><a href="tel:${telHref}">${safe.phone}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Address</strong></td><td style="padding: 8px 0;">${safe.address}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Service</strong></td><td style="padding: 8px 0;">${safe.serviceType}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Description</strong></td><td style="padding: 8px 0;">${safe.description}</td></tr>
          </table>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">Sent from coastalsurfacerestoration.com quote form</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Quote form error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }

  // The customer acknowledgement is best effort. Tyler already has the lead at
  // this point, so a failure here should not tell the customer their request
  // did not go through.
  try {
    await resend.emails.send({
      from: FROM,
      to: values.email,
      replyTo: BUSINESS.email,
      subject: `We got your request, ${singleLine(values.name)}`,
      text: acknowledgementText(values),
      html: acknowledgementHtml(safe),
    });
  } catch (error) {
    console.error('Quote acknowledgement error:', error);
  }

  return NextResponse.json({ success: true });
}

function acknowledgementText(values: Record<Field, string>): string {
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
    `Address: ${values.address}`,
    `Phone: ${values.phone}`,
    '',
    'Project description:',
    values.description,
    '',
    `If anything above is wrong, or you have photos of the piece, just reply to this email.`,
    '',
    'Tyler Scherzer',
    `${SITE_NAME}`,
    BUSINESS.phone,
  ].join('\n');
}

function acknowledgementHtml(safe: Record<Field, string>): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding: 6px 0; color: #666; width: 110px; vertical-align: top;"><strong>${label}</strong></td><td style="padding: 6px 0; color: #222;">${value}</td></tr>`;

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      <div style="background: #0a1628; padding: 20px 24px;">
        <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold; letter-spacing: 0.04em;">
          COASTAL <span style="color: #00d4d4;">SURFACE RESTORATION</span>
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
          ${row('Address', safe.address)}
          ${row('Phone', safe.phone)}
          ${row('Project', safe.description)}
        </table>
        <p style="margin: 24px 0 0; line-height: 1.6;">
          If anything above is wrong, or you have photos of the piece, just reply to this email.
        </p>
        <p style="margin: 24px 0 0; line-height: 1.6;">
          Tyler Scherzer<br />
          ${SITE_NAME}<br />
          <a href="tel:${BUSINESS.phone.replace(/\D/g, '')}" style="color: #0e7c7b;">${BUSINESS.phone}</a>
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
