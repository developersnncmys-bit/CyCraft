import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Shared SMTP transport for all outbound mail (apply, contact, enquiry).
 *
 * Reads SMTP credentials from env. To keep the project provider-agnostic
 * we use raw SMTP — works with Gmail (app password), Outlook, Resend SMTP,
 * SendGrid SMTP, Amazon SES SMTP, or any custom mail server.
 *
 * Required env (see .env.example):
 *   SMTP_HOST       — e.g. smtp.gmail.com
 *   SMTP_PORT       — e.g. 587 (STARTTLS) or 465 (SSL)
 *   SMTP_USER       — auth username (often the same as MAIL_FROM)
 *   SMTP_PASSWORD   — auth password (for Gmail use an App Password)
 *   MAIL_FROM       — "Name <address@domain>" used as the From header
 *   MAIL_TO         — comma-separated list of admin recipients
 *
 * The transporter is cached on globalThis so dev-server hot reloads don't
 * leak SMTP connections.
 */
declare global {
  var __mailTransporter: Transporter | undefined;
}

export function getMailer(): Transporter {
  if (globalThis.__mailTransporter) return globalThis.__mailTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP credentials missing: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD in .env.local',
    );
  }

  // port 465 ⇒ SSL on connect; port 587 ⇒ STARTTLS upgrade.
  const secure = port === 465;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  globalThis.__mailTransporter = transporter;
  return transporter;
}

export function getMailFrom(): string {
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;
  if (!from) throw new Error('MAIL_FROM (or SMTP_USER fallback) not set');
  return from;
}

export function getMailTo(): string[] {
  const to = process.env.MAIL_TO;
  if (!to) throw new Error('MAIL_TO not set (comma-separated admin recipients)');
  return to.split(',').map((s) => s.trim()).filter(Boolean);
}
