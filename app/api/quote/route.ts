import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, phone, address, serviceType, description } = await req.json();

    await resend.emails.send({
      from: 'Coastal Surface Restoration <quotes@coastalsurfacerestoration.com>',
      to: 'tyler@coastalsurfacerestoration.com',
      replyTo: email,
      subject: `New Quote Request -- ${serviceType} -- ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0a1628;">New Quote Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name</strong></td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Phone</strong></td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Address</strong></td><td style="padding: 8px 0;">${address}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Service</strong></td><td style="padding: 8px 0;">${serviceType}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Description</strong></td><td style="padding: 8px 0;">${description}</td></tr>
          </table>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">Sent from coastalsurfacerestoration.com quote form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quote form error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}