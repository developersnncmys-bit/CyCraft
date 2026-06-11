'use client';
/* Course Detail — Act V — Deployment.
 *
 * Replaces the sticky right-rail enquiry form that lived next to the
 * syllabus list. The form now has its own act so the page reads as a
 * dossier walk-through (briefing → overview → curriculum → operator
 * profile → deployment) instead of a two-column course brochure.
 *
 * Two CTAs at the top: primary "APPLY_NOW" deep-links to the apply
 * modal pre-selected for this course (/courses?apply=1&slug=...);
 * secondary anchor scrolls to the enquiry form below.
 *
 * The form itself is the same simulated submit as before — when the
 * real /api/enquiries endpoint ships, replace the timeout with a fetch.
 */
import { useRef, useState, type FormEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { Course } from '@/content/courses/catalog';

type FormState =
  | { kind: 'idle' }
  | { kind: 'busy' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

interface CourseDeploymentProps {
  course: Course;
}

const isOffensive = (level: Course['level']) =>
  level === 'Advanced' || level === 'Expert';

export default function CourseDeployment({ course }: CourseDeploymentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const offensive = isOffensive(course.level);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setState({ kind: 'error', message: 'Name, email, and phone are required.' });
      return;
    }
    setState({ kind: 'busy' });
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug: course.slug,
          courseTitle: course.title,
          fullName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('request failed');
      setState({ kind: 'success' });
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      ScrollTrigger.refresh();
    } catch {
      setState({
        kind: 'error',
        message: 'Connection failed. Please try again or email us directly.',
      });
    }
  };

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          ['.cd-dep-badge', '.cd-dep-heading', '.cd-dep-sub', '.cd-dep-panel'],
          { opacity: 1, y: 0, filter: 'none' },
        );
        return;
      }

      gsap.set('.cd-dep-badge', { opacity: 0, y: 10 });
      gsap.set('.cd-dep-heading', { opacity: 0, y: 20 });
      gsap.set('.cd-dep-sub', { opacity: 0, y: 14, filter: 'blur(4px)' });
      gsap.set('.cd-dep-panel', { opacity: 0, y: 24 });

      const trigger = {
        trigger: root,
        start: 'top 80%',
        toggleActions: 'play none none none',
      } as ScrollTrigger.Vars;

      gsap.to('.cd-dep-badge', {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', scrollTrigger: trigger,
      });
      gsap.to('.cd-dep-heading', {
        opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out', scrollTrigger: trigger,
      });
      gsap.to('.cd-dep-sub', {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, delay: 0.2,
        ease: 'power3.out', scrollTrigger: trigger,
      });
      gsap.to('.cd-dep-panel', {
        opacity: 1, y: 0, duration: 0.7, delay: 0.3,
        ease: 'power3.out', scrollTrigger: trigger,
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion, course.slug] },
  );

  return (
    <section
      ref={sectionRef}
      id="cd-deployment"
      aria-label="Apply or enquire"
      style={{
        position: 'relative',
        paddingTop: 'clamp(2.5rem, 7vh, 5rem)',
        paddingBottom: 'clamp(3.5rem, 9vh, 7rem)',
        background: 'transparent',
      }}
    >
      <style>{`
        @media (max-width: 600px) {
          /* Full-width submit on mobile — bigger tap target, mono buttons
             look stronger when they fill the form column. */
          .cd-dep-submit {
            align-self: stretch !important;
            text-align: center;
          }
        }
      `}</style>
      {/* Soft glow pool behind the deployment block */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: '900px',
          height: '500px',
          borderRadius: '50%',
          background: offensive
            ? 'radial-gradient(ellipse, rgba(255,61,90,0.10) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(168,240,255,0.10) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="section-container"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(2rem, 4vh, 3rem)',
          maxWidth: '880px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="cd-dep-badge">
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-beam)',
                borderBottom: '1px solid rgba(168,240,255,0.3)',
                paddingBottom: '3px',
              }}
            >
              {'// DEPLOYMENT / ACT_IV'}
            </span>
          </div>

          <h2
            className="cd-dep-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: 1.12,
            }}
          >
            Ready to deploy on <span style={{ color: 'var(--color-beam)' }}>{course.title}</span>?
          </h2>

          <p
            className="cd-dep-sub"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              margin: 0,
              willChange: 'transform, opacity, filter',
            }}
          >
            Apply for the next cohort, or send an enquiry and admissions will
            reach out within 24 hours with cohort dates, payment options, and
            the full week-by-week brief.
          </p>

        </div>

        {/* Form panel — terminal-style */}
        <div
          id="cd-deployment-form"
          className="cd-dep-panel"
          style={{
            position: 'relative',
            padding: 'clamp(1.5rem, 3vw, 2.25rem)',
            background: 'rgba(13,16,20,0.7)',
            border: '1px solid rgba(168,240,255,0.18)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            willChange: 'transform, opacity',
          }}
        >
          {/* Title bar — mono, wraps on narrow phones */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              columnGap: '0.85rem',
              rowGap: '0.25rem',
              paddingBottom: '0.85rem',
              marginBottom: '1.5rem',
              borderBottom: '1px dashed rgba(168,240,255,0.2)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-beam)',
            }}
          >
            <span>{`// enquiry_channel / open`}</span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>
              {course.slug.split('-').slice(0, 2).join('_').toUpperCase()}
            </span>
          </div>

          {state.kind === 'success' ? (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: '1.25rem',
                background: 'rgba(0,255,148,0.08)',
                border: '1px solid var(--color-terminal)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  color: 'var(--color-terminal)',
                  textTransform: 'uppercase',
                }}
              >
                {'> transmission_complete'}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                Enquiry received. Admissions will be in touch within 24 hours
                about <strong>{course.title}</strong>.
              </span>
              <button
                type="button"
                onClick={() => setState({ kind: 'idle' })}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '0.25rem',
                  padding: '0.5rem 0.9rem',
                  background: 'transparent',
                  border: '1px solid rgba(168,240,255,0.3)',
                  color: 'var(--color-beam)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.95rem, 2.5vw, 1.15rem)' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
                  gap: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                }}
              >
                <FormField label="Full Name" required id={`cd-dep-name-${course.slug}`} value={name} onChange={setName} autoComplete="name" />
                <FormField label="Email Address" required id={`cd-dep-email-${course.slug}`} type="email" value={email} onChange={setEmail} autoComplete="email" />
                <FormField label="Phone Number" required id={`cd-dep-phone-${course.slug}`} type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
              </div>
              <FormField label="Message (optional)" id={`cd-dep-msg-${course.slug}`} multiline value={message} onChange={setMessage} />

              {state.kind === 'error' && (
                <p
                  role="alert"
                  style={{
                    margin: 0,
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(255,61,90,0.08)',
                    border: '1px solid rgba(255,61,90,0.35)',
                    color: 'var(--color-red-team-glow)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                className="cd-dep-submit"
                disabled={state.kind === 'busy'}
                style={{
                  marginTop: '0.25rem',
                  alignSelf: 'flex-start',
                  padding: '1rem 1.6rem',
                  background: offensive ? 'var(--color-red-team)' : 'var(--color-beam)',
                  color: offensive ? '#fff' : 'var(--color-void)',
                  border: `1px solid ${offensive ? 'var(--color-red-team)' : 'var(--color-beam)'}`,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  cursor: state.kind === 'busy' ? 'wait' : 'pointer',
                  opacity: state.kind === 'busy' ? 0.7 : 1,
                  boxShadow: offensive
                    ? '0 0 22px rgba(255,61,90,0.28)'
                    : '0 0 22px rgba(77,217,255,0.28)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (state.kind === 'busy') return;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {state.kind === 'busy' ? 'Transmitting…' : 'Submit Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: 'text' | 'email' | 'tel';
  multiline?: boolean;
  autoComplete?: string;
}

function FormField({
  label,
  id,
  value,
  onChange,
  required = false,
  type = 'text',
  multiline = false,
  autoComplete,
}: FormFieldProps) {
  const sharedStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem',
    background: 'rgba(5,6,8,0.7)',
    border: '1px solid rgba(168,240,255,0.18)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    // 16px floor — iOS Safari auto-zooms the page on focus when the
    // input font is under 16px, which then leaves the user pinch-zoomed
    // and disoriented. Keep the visual size as --text-sm via line-height
    // tweaks if needed, but never let computed font-size dip below 16px.
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    resize: multiline ? ('vertical' as const) : ('none' as const),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary)',
        }}
      >
        {'> '}{label}
        {required && (
          <span aria-hidden="true" style={{ color: 'var(--color-red-team-glow)', marginLeft: '0.25rem' }}>
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={sharedStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-beam)';
            e.currentTarget.style.boxShadow = '0 0 14px rgba(77,217,255,0.18)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(168,240,255,0.18)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          style={sharedStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-beam)';
            e.currentTarget.style.boxShadow = '0 0 14px rgba(77,217,255,0.18)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(168,240,255,0.18)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      )}
    </div>
  );
}
