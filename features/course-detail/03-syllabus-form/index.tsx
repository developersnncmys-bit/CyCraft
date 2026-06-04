'use client';
/* Course Syllabus + Enquire form — two-column on desktop, stacked on
 * mobile. The form sits sticky in the right rail so it stays visible
 * while the user reads through a long syllabus list.
 *
 * The form is intentionally simple — local state, simulated submit,
 * success state. When the real /api/enquiries endpoint ships, replace
 * the timeout in `handleSubmit` with a fetch().
 */
import { useRef, useState, type FormEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import type { Course } from '@/content/courses/catalog';

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 12 15 17 9" />
    </svg>
  );
}

type FormState =
  | { kind: 'idle' }
  | { kind: 'busy' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

interface CourseSyllabusFormProps {
  course: Course;
  /** Per-slug syllabus from the detail registry; null when the slug
   *  doesn't have a detail entry yet — section degrades to a friendly
   *  "coming soon" note so the page still renders. */
  syllabus: readonly string[] | null;
}

export default function CourseSyllabusForm({
  course,
  syllabus,
}: CourseSyllabusFormProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 900px)');

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
    // Simulated submit — swap for real fetch('/api/enquiries', { … }) once
    // the backend endpoint ships. Per PRD §3.10 / §5.2 the submission is
    // captured into the Admin "Inquiry Management" module.
    await new Promise((r) => setTimeout(r, 700));
    setState({ kind: 'success' });
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    // Allow scroll triggers to recompute after the success card height swap.
    ScrollTrigger.refresh();
  };

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const items = root.querySelectorAll<HTMLElement>('.cd-syllabus-item');

      if (reducedMotion) {
        gsap.set(
          ['.cd-syllabus-heading', '.cd-syllabus-item', '.cd-form-panel'],
          { opacity: 1, x: 0, y: 0 },
        );
        return;
      }

      gsap.set('.cd-syllabus-heading', { opacity: 0, y: 20 });
      gsap.set(items, { opacity: 0, x: -16 });
      gsap.set('.cd-form-panel', { opacity: 0, y: 24 });

      const trigger = {
        trigger: root,
        start: 'top 78%',
        toggleActions: 'play none none reset',
      } as ScrollTrigger.Vars;

      gsap.to('.cd-syllabus-heading', {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: trigger,
      });
      gsap.to('.cd-form-panel', {
        opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out',
        scrollTrigger: trigger,
      });

      // Each syllabus item ignites on its own entry so the list reads as
      // it scrolls in — important because the catalog detail can carry
      // 15+ bullets and they'd flash in all at once otherwise.
      items.forEach((item) => {
        gsap.to(item, {
          opacity: 1, x: 0, duration: 0.45, ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none reset',
          } as ScrollTrigger.Vars,
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion, course.slug] },
  );

  return (
    <section
      ref={sectionRef}
      id="cd-syllabus-form"
      aria-label="Course syllabus and enquiry"
      style={{
        position: 'relative',
        background: 'transparent',
        paddingTop: 'clamp(3rem, 7vh, 5rem)',
        paddingBottom: 'clamp(3rem, 7vh, 5rem)',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: isWide ? 'minmax(0, 1.5fr) minmax(320px, 1fr)' : '1fr',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'start',
        }}
      >
        {/* Left — syllabus */}
        <div>
          <h2
            className="cd-syllabus-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: '0 0 2rem',
              lineHeight: 1.15,
            }}
          >
            Course Syllabus
          </h2>

          {syllabus && syllabus.length > 0 ? (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {syllabus.map((item, i) => (
                <li
                  key={`${course.slug}-syl-${i}`}
                  className="cd-syllabus-item"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.5,
                    willChange: 'transform, opacity',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255,61,90,0.10)',
                      border: '1px solid rgba(255,61,90,0.45)',
                      color: 'var(--color-red-team-glow)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}
                  >
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
                padding: '1.5rem',
                background: 'rgba(13,16,20,0.4)',
                border: '1px dashed rgba(168,240,255,0.18)',
                margin: 0,
              }}
            >
              Detailed curriculum for this course is being finalised. Use the form
              alongside to enquire and we will share the week-by-week outline.
            </p>
          )}
        </div>

        {/* Right — sticky enquire form */}
        <div
          style={{
            position: isWide ? 'sticky' : 'static',
            top: isWide ? '6rem' : 'auto',
            alignSelf: 'start',
          }}
        >
          <div
            className="cd-form-panel"
            style={{
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              background: 'rgba(13,16,20,0.55)',
              border: '1px solid rgba(168,240,255,0.18)',
              willChange: 'transform, opacity',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--color-text-primary)',
                margin: '0 0 1.5rem',
              }}
            >
              Enquire Now
            </h2>

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
                  gap: '0.6rem',
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
                  Transmission Complete
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  Enquiry received. Our admissions team will be in touch within
                  24 hours about <strong>{course.title}</strong>.
                </span>
                <button
                  type="button"
                  onClick={() => setState({ kind: 'idle' })}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '0.5rem',
                    padding: '0.45rem 0.9rem',
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
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <FormField
                  label="Full Name"
                  required
                  id={`cd-name-${course.slug}`}
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
                <FormField
                  label="Email Address"
                  required
                  id={`cd-email-${course.slug}`}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
                <FormField
                  label="Phone Number"
                  required
                  id={`cd-phone-${course.slug}`}
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  autoComplete="tel"
                />
                <FormField
                  label="Message"
                  id={`cd-message-${course.slug}`}
                  multiline
                  value={message}
                  onChange={setMessage}
                />

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
                  disabled={state.kind === 'busy'}
                  style={{
                    marginTop: '0.5rem',
                    padding: '1rem 1.5rem',
                    background: 'var(--color-red-team)',
                    color: '#fff',
                    border: '1px solid var(--color-red-team)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    cursor: state.kind === 'busy' ? 'wait' : 'pointer',
                    opacity: state.kind === 'busy' ? 0.7 : 1,
                    boxShadow: '0 0 24px rgba(255,61,90,0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (state.kind === 'busy') return;
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-1px)';
                    el.style.boxShadow = '0 0 32px rgba(255,61,90,0.45)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 0 24px rgba(255,61,90,0.3)';
                  }}
                >
                  {state.kind === 'busy' ? 'Submitting…' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
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
    background: 'rgba(5,6,8,0.6)',
    border: '1px solid rgba(168,240,255,0.18)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    resize: multiline ? ('vertical' as const) : ('none' as const),
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-beam)';
    e.currentTarget.style.boxShadow = '0 0 14px rgba(77,217,255,0.18)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(168,240,255,0.18)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary)',
        }}
      >
        {label}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
    </div>
  );
}
