/**
 * HTML + plain-text email templates for the three form types.
 *
 * Each template returns `{ subject, html, text }` so the route handler
 * can pass them straight to nodemailer.sendMail(). Plain-text fallback
 * is included for email clients that block HTML, and improves spam-
 * filter scoring.
 */

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

interface Field {
  label: string;
  value: string | undefined | null;
}

function renderHtmlShell(title: string, fields: Field[]): string {
  const rows = fields
    .filter((f) => f.value !== undefined && f.value !== null && f.value !== '')
    .map(
      (f) => `
      <tr>
        <td style="padding:10px 14px;background:#0f1318;color:#94a3b8;font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;border-bottom:1px solid #1a2128;width:34%;vertical-align:top;">${escapeHtml(f.label)}</td>
        <td style="padding:10px 14px;background:#0a0d11;color:#e2e8f0;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.55;border-bottom:1px solid #1a2128;white-space:pre-wrap;">${escapeHtml(f.value!)}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#050608;font-family:Inter,system-ui,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#0a0d11;border:1px solid #1a2128;">
      <div style="padding:18px 22px;border-bottom:1px solid #1a2128;background:#0f1318;">
        <div style="font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#7dd3fc;">// CYCRAFT · NEW FORM SUBMISSION</div>
        <div style="font-family:Inter,system-ui,sans-serif;font-size:18px;font-weight:700;color:#f1f5f9;margin-top:6px;">${escapeHtml(title)}</div>
      </div>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>
      <div style="padding:14px 22px;background:#0f1318;border-top:1px solid #1a2128;color:#64748b;font-family:Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;">
        sent at ${new Date().toISOString()}
      </div>
    </div>
  </body>
</html>`;
}

function renderPlainText(title: string, fields: Field[]): string {
  const lines = fields
    .filter((f) => f.value !== undefined && f.value !== null && f.value !== '')
    .map((f) => `${f.label}: ${f.value}`)
    .join('\n');
  return `${title}\n${'='.repeat(title.length)}\n\n${lines}\n\nSent at ${new Date().toISOString()}`;
}

// ────────────────────────────────────────────────────────────────────────
// Apply form template (B.Tech / cohort enrolment)
// ────────────────────────────────────────────────────────────────────────
export interface ApplyTemplateInput {
  fullName: string;
  email: string;
  phone: string;
  experienceLevel: string;
  educationalBackground?: string;
}

export function applyTemplate(d: ApplyTemplateInput) {
  const title = `New Application — ${d.fullName}`;
  const fields: Field[] = [
    { label: 'Full Name',        value: d.fullName },
    { label: 'Email',            value: d.email },
    { label: 'Phone',            value: d.phone },
    { label: 'Experience Level', value: d.experienceLevel },
    { label: 'Educational Bg',   value: d.educationalBackground },
  ];
  return {
    subject: `[CyCraft Apply] ${d.fullName} — ${d.experienceLevel}`,
    html: renderHtmlShell(title, fields),
    text: renderPlainText(title, fields),
  };
}

// ────────────────────────────────────────────────────────────────────────
// Contact form template (generic enquiry)
// ────────────────────────────────────────────────────────────────────────
export interface ContactTemplateInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function contactTemplate(d: ContactTemplateInput) {
  const title = `New Message — ${d.subject}`;
  const fields: Field[] = [
    { label: 'Full Name', value: d.fullName },
    { label: 'Email',     value: d.email },
    { label: 'Phone',     value: d.phone },
    { label: 'Subject',   value: d.subject },
    { label: 'Message',   value: d.message },
  ];
  return {
    subject: `[CyCraft Contact] ${d.subject}`,
    html: renderHtmlShell(title, fields),
    text: renderPlainText(title, fields),
  };
}

// ────────────────────────────────────────────────────────────────────────
// Course enquiry template (per-course detail page form)
// ────────────────────────────────────────────────────────────────────────
export interface EnquiryTemplateInput {
  courseSlug: string;
  courseTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
}

export function enquiryTemplate(d: EnquiryTemplateInput) {
  const title = `New Course Enquiry — ${d.courseTitle}`;
  const fields: Field[] = [
    { label: 'Course',    value: d.courseTitle },
    { label: 'Slug',      value: d.courseSlug },
    { label: 'Full Name', value: d.fullName },
    { label: 'Email',     value: d.email },
    { label: 'Phone',     value: d.phone },
    { label: 'Message',   value: d.message },
  ];
  return {
    subject: `[CyCraft Enquiry] ${d.courseTitle} — ${d.fullName}`,
    html: renderHtmlShell(title, fields),
    text: renderPlainText(title, fields),
  };
}
