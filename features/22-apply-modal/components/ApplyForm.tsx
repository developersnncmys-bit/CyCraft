'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applySchema, type ApplyFormData } from '../schema';
import { FormField, inputStyle, inputFocusCSS } from './FormField';

interface ApplyFormProps { onClose: () => void }

export function ApplyForm({ onClose }: ApplyFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [charCount, setCharCount] = useState(0);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ApplyFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setTimeout(() => { onClose(); }, 2500);
    } catch {
      setStatus('error');
      setErrorMsg('Connection failed. Please try again.');
    }
  };

  // ── Success state ──────────────────────────────────────────────────────
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
        {/* Animated check */}
        <div
          style={{
            width: '56px', height: '56px',
            border: '2px solid var(--color-terminal)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(0,255,148,0.2)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12 L10 17 L19 8" stroke="var(--color-terminal)" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
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
          TRANSMISSION COMPLETE
          <span style={{ animation: 'cursor-blink 1s step-end infinite', marginLeft: '4px' }}>▊</span>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
          Application received. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{inputFocusCSS}</style>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
      >
        {/* Honeypot */}
        <input {...register('website')} type="text" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

        {/* Row 1 — Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Full Name" error={errors.fullName} required>
            <input
              {...register('fullName')}
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="apply-input"
              style={inputStyle}
            />
          </FormField>

          <FormField label="Email Address" error={errors.email} required>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              className="apply-input"
              style={inputStyle}
            />
          </FormField>
        </div>

        {/* Row 2 — Phone + Experience Level */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Phone Number" error={errors.phone} required>
            <input
              {...register('phone')}
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              className="apply-input"
              style={inputStyle}
            />
          </FormField>

          <FormField label="Experience Level" error={errors.experienceLevel} required>
            <select
              {...register('experienceLevel')}
              defaultValue="Beginner"
              className="apply-input"
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </FormField>
        </div>

        {/* Row 3 — Educational Background */}
        <FormField
          label="Educational Background (Optional)"
          error={errors.educationalBackground}
          hint={`${charCount}/500 characters`}
        >
          <textarea
            {...register('educationalBackground', {
              onChange: (e) => setCharCount(e.target.value.length),
            })}
            rows={2}
            maxLength={500}
            placeholder="Tell us about your background…"
            className="apply-input"
            style={{ ...inputStyle, resize: 'none', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
          />
        </FormField>

        {/* Error */}
        {status === 'error' && (
          <p
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

        {/* Actions — Cancel button removed; the modal's close (X) at the
            top-right is the only dismiss surface. Submit button is now
            right-aligned in the row. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: '0.25rem',
            gap: '1rem',
          }}
        >
          <button
            type="submit"
            disabled={!isValid || status === 'loading'}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: isValid && status !== 'loading' ? 'var(--color-void)' : 'var(--color-text-disabled)',
              background: isValid && status !== 'loading'
                ? 'var(--color-beam)'
                : 'rgba(168,240,255,0.08)',
              border: 'none',
              cursor: isValid && status !== 'loading' ? 'pointer' : 'not-allowed',
              padding: '0.85rem 2rem',
              transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
              boxShadow: isValid && status !== 'loading'
                ? '0 0 20px rgba(168,240,255,0.25)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (isValid && status !== 'loading') {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(168,240,255,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isValid ? '0 0 20px rgba(168,240,255,0.25)' : 'none';
            }}
          >
            {status === 'loading' ? 'Sending…' : 'Enroll Now'}
          </button>
        </div>
      </form>
    </>
  );
}
