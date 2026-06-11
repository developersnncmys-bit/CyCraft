import { NextRequest, NextResponse } from 'next/server';
import { applySchema } from '@/features/22-apply-modal/schema';
import { getMailer, getMailFrom, getMailTo } from '@/lib/mail/transport';
import { applyTemplate } from '@/lib/mail/templates';

// Force the dynamic runtime — nodemailer is a Node.js module and won't
// run on the Edge runtime.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = applySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    // Honeypot — bot filled the hidden field. Silent OK.
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const { fullName, email, phone, experienceLevel, educationalBackground } = parsed.data;

    const { subject, html, text } = applyTemplate({
      fullName,
      email,
      phone,
      experienceLevel,
      educationalBackground,
    });

    const mailer = getMailer();
    await mailer.sendMail({
      from: getMailFrom(),
      to: getMailTo(),
      replyTo: email,
      subject,
      html,
      text,
    });

    // Optional webhook fan-out for downstream automation (Zapier, CRM, etc.)
    const webhookUrl = process.env.APPLY_FORM_WEBHOOK_URL;
    if (webhookUrl) {
      // Fire-and-forget — don't block the response on a slow webhook.
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      }).catch((err) => console.error('[apply] webhook failed', err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[apply]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
