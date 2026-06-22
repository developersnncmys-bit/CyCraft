import { NextRequest, NextResponse } from 'next/server';
import { enquirySchema } from '@/features/course-detail/schema';
import { getMailer, getMailFrom, getMailTo } from '@/lib/mail/transport';
import { enquiryTemplate } from '@/lib/mail/templates';
import { handleOptions, withCors } from '@/lib/cors';

export const runtime = 'nodejs';

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

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

    const { courseSlug, courseTitle, fullName, email, phone, message } = parsed.data;

    const tpl = enquiryTemplate({
      courseSlug,
      courseTitle,
      fullName,
      email,
      phone,
      message,
    });

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
    const webhookUrl = process.env.ENQUIRY_FORM_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      }).catch((err) => console.error('[enquiry] webhook failed', err));
    }

    return withCors(req, NextResponse.json({ ok: true }));
  } catch (err) {
    console.error('[enquiry]', err);
    return withCors(req, NextResponse.json({ error: 'Server error' }, { status: 500 }));
  }
}
