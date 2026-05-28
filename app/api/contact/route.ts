import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/features/contact/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    // Reject honeypot — bot filled the hidden field
    if (parsed.data.website) {
      return NextResponse.json({ ok: true }); // silent reject
    }

    const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;
    if (webhookUrl) {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!upstream.ok) throw new Error('Upstream webhook failed');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
