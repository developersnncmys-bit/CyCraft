'use client';
/* Verify Form — pinned cinematic with stateful lookup + inline result.
 *
 * 350% pin. The user lands on an empty form, types or clicks a sample ID,
 * submits, and the result card swaps in below the form. The result lives
 * inside the same pinned section so the camera doesn't release between
 * input and outcome — feels like one continuous lookup.
 *
 * Internal beats (0–1):
 *   0.00–0.05  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.18–0.32  Form panel slides up and ignites
 *   0.32–0.50  Sample-ID chips fade in below the form
 *   0.50–0.85  Result area fades in from "awaiting lookup" state
 *   0.85–1.00  Camera dollies in 4%
 *
 * Static demo: certificate registry lives in content/verify/certificates.ts.
 * Once the Admin Panel ships, swap `findCertificate` for an API call.
 *
 * URL prefill: ?id=XYZ on mount auto-fills + auto-submits, so QR codes
 * pointing at /verify?id=… land users straight on a populated result.
 */
import { useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { verifyFormContent } from '@/content/verify/form';
import {
  findCertificate,
  type Certificate,
  type CertificateStatus,
} from '@/content/verify/certificates';

type LookupState =
  | { kind: 'empty' }
  | { kind: 'loading' }
  | { kind: 'found'; certificate: Certificate }
  | { kind: 'notFound'; query: string };

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const statusLabel = (status: CertificateStatus): string => {
  if (status === 'valid') return verifyFormContent.result.statusValid;
  if (status === 'revoked') return verifyFormContent.result.statusRevoked;
  return verifyFormContent.result.statusExpired;
};

const statusTone = (status: CertificateStatus) => {
  if (status === 'valid') {
    return {
      bg: 'rgba(0,255,148,0.10)',
      border: 'var(--color-terminal)',
      color: 'var(--color-terminal)',
      glow: 'rgba(0,255,148,0.20)',
    };
  }
  return {
    bg: 'rgba(255,61,90,0.10)',
    border: 'var(--color-red-team)',
    color: 'var(--color-red-team-glow)',
    glow: 'rgba(255,61,90,0.20)',
  };
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CheckShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

interface ResultPanelProps {
  state: LookupState;
}

function ResultPanel({ state }: ResultPanelProps) {
  if (state.kind === 'empty') {
    return (
      <div
        className="verify-form-result"
        role="status"
        aria-live="polite"
        style={{
          padding: '2rem 1.75rem',
          background: 'rgba(13,16,20,0.4)',
          border: '1px dashed rgba(168,240,255,0.18)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          alignItems: 'flex-start',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'rgba(168,240,255,0.06)',
            border: '1px solid rgba(168,240,255,0.18)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <ClockIcon />
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          {verifyFormContent.emptyState.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {verifyFormContent.emptyState.body}
        </p>
      </div>
    );
  }

  if (state.kind === 'loading') {
    return (
      <div
        className="verify-form-result"
        role="status"
        aria-live="polite"
        style={{
          padding: '2rem 1.75rem',
          background: 'rgba(13,16,20,0.4)',
          border: '1px solid rgba(168,240,255,0.18)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          alignItems: 'flex-start',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--color-beam)',
            textTransform: 'uppercase',
          }}
        >
          {verifyFormContent.buttonBusyLabel}
        </span>
      </div>
    );
  }

  if (state.kind === 'notFound') {
    return (
      <div
        className="verify-form-result"
        role="status"
        aria-live="polite"
        style={{
          padding: '2rem 1.75rem',
          background: 'rgba(255,61,90,0.06)',
          border: '1px solid rgba(255,61,90,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          alignItems: 'flex-start',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'rgba(255,61,90,0.12)',
            border: '1px solid rgba(255,61,90,0.35)',
            color: 'var(--color-red-team-glow)',
          }}
        >
          <AlertIcon />
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          {verifyFormContent.notFoundState.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {verifyFormContent.notFoundState.body}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.04em',
            color: 'var(--color-text-tertiary)',
            margin: '0.25rem 0 0',
          }}
        >
          Query:{' '}
          <span style={{ color: 'var(--color-red-team-glow)' }}>{state.query}</span>
        </p>
      </div>
    );
  }

  const cert = state.certificate;
  const tone = statusTone(cert.status);
  return (
    <div
      className="verify-form-result"
      role="status"
      aria-live="polite"
      style={{
        position: 'relative',
        padding: '2rem 1.75rem',
        background: 'rgba(13,16,20,0.55)',
        border: `1px solid ${tone.border}`,
        boxShadow: `0 16px 36px rgba(0,0,0,0.45), 0 0 24px ${tone.glow}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: tone.bg,
            border: `1px solid ${tone.border}`,
            color: tone.color,
            flexShrink: 0,
          }}
        >
          {cert.status === 'valid' ? <CheckShieldIcon /> : <AlertIcon />}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: tone.color,
            }}
          >
            {statusLabel(cert.status)}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            {cert.candidateName}
          </span>
        </div>
      </div>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem 1.5rem',
          margin: 0,
        }}
      >
        {(
          [
            [verifyFormContent.result.fieldCourse, cert.course],
            [verifyFormContent.result.fieldGrade, cert.grade],
            [verifyFormContent.result.fieldCompletion, formatDate(cert.completionDate)],
            [verifyFormContent.result.fieldIssue, formatDate(cert.issueDate)],
            [verifyFormContent.result.fieldId, cert.id],
          ] as const
        ).map(([label, value]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <dt
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </dt>
            <dd
              style={{
                fontFamily: label === verifyFormContent.result.fieldId ? 'var(--font-mono)' : 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-primary)',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {cert.status === 'revoked' && cert.revokedReason && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-red-team-glow)',
            margin: 0,
            lineHeight: 1.5,
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255,61,90,0.2)',
          }}
        >
          <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginRight: '0.5rem' }}>
            Reason:
          </strong>
          {cert.revokedReason}
        </p>
      )}
    </div>
  );
}

export default function VerifyForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const searchParams = useSearchParams();

  // URL prefill — QR codes point at /verify?id=XYZ, so on the first render
  // we resolve the result synchronously. This avoids a useEffect-driven
  // setState cascade and means a QR scan lands on a populated result card
  // with no loading flash.
  const initialId = (searchParams.get('id') ?? '').trim();
  const [query, setQuery] = useState(initialId);
  const [state, setState] = useState<LookupState>(() => {
    if (!initialId) return { kind: 'empty' };
    const cert = findCertificate(initialId);
    return cert
      ? { kind: 'found', certificate: cert }
      : { kind: 'notFound', query: initialId };
  });

  const performLookup = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      setState({ kind: 'empty' });
      return;
    }
    setState({ kind: 'loading' });
    // Tiny artificial delay so the loading state is visible and the swap
    // feels like a server lookup rather than an instant client-side filter.
    window.setTimeout(() => {
      const cert = findCertificate(trimmed);
      if (cert) {
        setState({ kind: 'found', certificate: cert });
      } else {
        setState({ kind: 'notFound', query: trimmed });
      }
      // Result height changed — refresh pinned section bounds.
      ScrollTrigger.refresh();
    }, 350);
  };

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const ALL = [
        '.verify-form-badge',
        '.verify-form-heading',
        '.verify-form-desc',
        '.verify-form-panel',
        '.verify-form-sample',
        '.verify-form-result-wrap',
      ];

      if (reducedMotion) {
        gsap.set(ALL, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.verify-form-badge, .verify-form-heading, .verify-form-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 78%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          },
        );
        gsap.fromTo(
          '.verify-form-panel, .verify-form-sample, .verify-form-result-wrap',
          { opacity: 0, y: 28, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.verify-form-panel',
              start: 'top 82%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          },
        );
        return;
      }

      // Desktop pinned ────────────────────────────────────────────────────
      gsap.set(['.verify-form-badge', '.verify-form-desc'], { opacity: 0, y: 20 });
      gsap.set('.verify-form-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.verify-form-panel', { opacity: 0, y: 40, scale: 0.96 });
      gsap.set('.verify-form-sample', { opacity: 0, y: 16 });
      gsap.set('.verify-form-result-wrap', { opacity: 0, y: 28 });
      gsap.set('.verify-form-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.verifyForm,
        scrub: 1,
        enabled: true,
      });

      tl.to('.verify-form-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.verify-form-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.verify-form-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.13);
      tl.to(
        '.verify-form-panel',
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power3.out' },
        0.20,
      );
      tl.to('.verify-form-sample', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.38);
      tl.to('.verify-form-result-wrap', { opacity: 1, y: 0, duration: 0.20, ease: 'power3.out' }, 0.55);
      tl.to('.verify-form-camera', { scale: 1.03, duration: 0.10, ease: 'power2.inOut' }, 0.88);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performLookup(query);
  };

  const onSampleClick = (id: string) => {
    setQuery(id);
    performLookup(id);
    inputRef.current?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="verify-form"
      aria-label={verifyFormContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="verify-form-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(5rem, 10vh, 8rem)',
          paddingBottom: 'clamp(5rem, 10vh, 8rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          className="section-container"
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vh, 4.5rem)' }}
        >
          <div className="verify-form-badge" style={{ display: 'inline-block' }}>
            <Badge label={verifyFormContent.badge} />
          </div>
          <h2
            className="verify-form-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1.5rem 0 1rem',
              lineHeight: 1.1,
            }}
          >
            {verifyFormContent.heading}
          </h2>
          <p
            className="verify-form-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {verifyFormContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{
            maxWidth: '760px',
            marginInline: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <form
            className="verify-form-panel"
            onSubmit={onSubmit}
            style={{
              position: 'relative',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              background: 'rgba(13,16,20,0.55)',
              border: '1px solid rgba(168,240,255,0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <label
              htmlFor="certificate-id"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-beam)',
              }}
            >
              {verifyFormContent.inputLabel}
            </label>
            <div style={{ position: 'relative' }}>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                id="certificate-id"
                name="certificate-id"
                type="text"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={verifyFormContent.inputPlaceholder}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem 1rem 3rem',
                  background: 'rgba(5,6,8,0.6)',
                  border: '1px solid rgba(168,240,255,0.18)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  letterSpacing: '0.04em',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-beam)';
                  e.currentTarget.style.boxShadow = '0 0 18px rgba(77,217,255,0.18)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(168,240,255,0.18)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={state.kind === 'loading'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1rem 2rem',
                background: 'var(--color-beam)',
                color: 'var(--color-void)',
                border: '1px solid var(--color-beam)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: state.kind === 'loading' ? 'wait' : 'pointer',
                opacity: state.kind === 'loading' ? 0.7 : 1,
                boxShadow: '0 0 24px rgba(77,217,255,0.32)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (state.kind === 'loading') return;
                el.style.transform = 'translateY(-1px)';
                el.style.boxShadow = '0 0 32px rgba(77,217,255,0.5)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 0 24px rgba(77,217,255,0.32)';
              }}
            >
              {state.kind === 'loading'
                ? verifyFormContent.buttonBusyLabel
                : verifyFormContent.buttonLabel}
              <span aria-hidden="true">›</span>
            </button>
          </form>

          <div
            className="verify-form-sample"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <span>{verifyFormContent.hintLabel}</span>
            {verifyFormContent.sampleIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onSampleClick(id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  background: 'rgba(168,240,255,0.04)',
                  border: '1px solid rgba(168,240,255,0.22)',
                  color: 'var(--color-beam)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(168,240,255,0.10)';
                  e.currentTarget.style.borderColor = 'var(--color-beam)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(168,240,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(168,240,255,0.22)';
                }}
              >
                {id}
              </button>
            ))}
          </div>

          <div className="verify-form-result-wrap">
            <ResultPanel state={state} />
          </div>
        </div>
      </div>
    </section>
  );
}
