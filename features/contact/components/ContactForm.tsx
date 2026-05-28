'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '../schema';
import {
  FormField,
  inputStyle,
  inputFocusCSS,
} from '@/features/22-apply-modal/components/FormField';
import { contactFormContent } from '@/content/contact/form';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      reset();
      setCharCount(0);
    } catch {
      setStatus('error');
      setErrorMsg('Connection failed. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            border: '2px solid var(--color-terminal)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(0,255,148,0.2)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12 L10 17 L19 8"
              stroke="var(--color-terminal)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-terminal)',
            letterSpacing: '0.12em',
          }}
        >
          {contactFormContent.successHeadline}
          <span style={{ animation: 'cursor-blink 1s step-end infinite', marginLeft: '4px' }}>
            ▊
          </span>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '320px',
          }}
        >
          {contactFormContent.successBody}
        </p>

        <button
          type="button"
          onClick={() => setStatus('idle')}
          style={{
            marginTop: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-beam)',
            background: 'transparent',
            border: '1px solid rgba(168,240,255,0.4)',
            padding: '0.65rem 1.4rem',
            cursor: 'pointer',
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{inputFocusCSS}</style>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        {/* Honeypot */}
        <input
          {...register('website')}
          type="text"
          style={{ display: 'none' }}
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Row 1 — Full Name + Email Address */}
        <div className="contact-form-row contact-form-field-row">
          <FormField label={contactFormContent.fields.fullName.label} error={errors.fullName} required>
            <input
              {...register('fullName')}
              type="text"
              autoComplete="name"
              placeholder={contactFormContent.fields.fullName.placeholder}
              className="apply-input"
              style={inputStyle}
            />
          </FormField>

          <FormField label={contactFormContent.fields.email.label} error={errors.email} required>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder={contactFormContent.fields.email.placeholder}
              className="apply-input"
              style={inputStyle}
            />
          </FormField>
        </div>

        {/* Row 2 — Phone + Subject */}
        <div className="contact-form-row contact-form-field-row">
          <FormField label={contactFormContent.fields.phone.label} error={errors.phone} required>
            <input
              {...register('phone')}
              type="tel"
              autoComplete="tel"
              placeholder={contactFormContent.fields.phone.placeholder}
              className="apply-input"
              style={inputStyle}
            />
          </FormField>

          <FormField label={contactFormContent.fields.subject.label} error={errors.subject} required>
            <input
              {...register('subject')}
              type="text"
              placeholder={contactFormContent.fields.subject.placeholder}
              className="apply-input"
              style={inputStyle}
            />
          </FormField>
        </div>

        {/* Row 3 — Message */}
        <div className="contact-form-field-row">
        <FormField
          label={contactFormContent.fields.message.label}
          error={errors.message}
          required
          hint={`${charCount}/2000 characters`}
        >
          <textarea
            {...register('message', {
              onChange: (e) => setCharCount(e.target.value.length),
            })}
            rows={6}
            maxLength={2000}
            placeholder={contactFormContent.fields.message.placeholder}
            className="apply-input"
            style={{
              ...inputStyle,
              resize: 'vertical',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.6,
              minHeight: '140px',
            }}
          />
        </FormField>
        </div>

        {status === 'error' && (
          <p
            className="contact-form-msg"
            role="alert"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-red-team)',
              margin: 0,
              letterSpacing: '0.06em',
            }}
          >
            ⚠ {errorMsg}
          </p>
        )}

        {/* Send Message — full-width red CTA per screenshot */}
        <button
          className="contact-form-submit"
          type="submit"
          disabled={!isValid || status === 'loading'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            width: '100%',
            padding: '1.1rem 1.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#fff',
            background:
              isValid && status !== 'loading'
                ? 'var(--color-red-team)'
                : 'rgba(255,61,90,0.35)',
            border: 'none',
            cursor: isValid && status !== 'loading' ? 'pointer' : 'not-allowed',
            transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
            boxShadow:
              isValid && status !== 'loading'
                ? '0 0 24px rgba(255,61,90,0.4)'
                : 'none',
            marginTop: '0.5rem',
          }}
          onMouseEnter={(e) => {
            if (isValid && status !== 'loading') {
              const el = e.currentTarget;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 0 36px rgba(255,61,90,0.6)';
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = 'translateY(0)';
            el.style.boxShadow =
              isValid && status !== 'loading' ? '0 0 24px rgba(255,61,90,0.4)' : 'none';
          }}
        >
          {status === 'loading' ? 'Sending…' : contactFormContent.submitLabel}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </form>
    </>
  );
}
