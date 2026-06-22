import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/features/contact/schema';
import { getMailer, getMailFrom, getMailTo } from '@/lib/mail/transport';
import { contactTemplate } from '@/lib/mail/templates';
import { handleOptions, withCors } from '@/lib/cors';

export const runtime = 'nodejs';

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return withCors(
        req,
        NextResponse.json(
          { error: 'Validation failed', issues: parsed.error.issues },
          { status: 400 },
        ),
      );
    }

    // Honeypot — silent OK.
    if (parsed.data.website) {
      return withCors(req, NextResponse.json({ ok: true }));
    }

    const { fullName, email, phone, subject, message } = parsed.data;

    const tpl = contactTemplate({ fullName, email, phone, subject, message });

    const mailer = getMailer();
    await mailer.sendMail({
      from: getMailFrom(),
      to: getMailTo(),
      replyTo: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });

    // Optional downstream webhook
    const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      }).catch((err) => console.error('[contact] webhook failed', err));
    }

    return withCors(req, NextResponse.json({ ok: true }));
  } catch (err) {
    console.error('[contact]', err);
    return withCors(req, NextResponse.json({ error: 'Server error' }, { status: 500 }));
  }
}
