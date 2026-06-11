'use client';
/**
 * Shared layout for the Privacy Policy and Terms & Conditions pages.
 * "Dossier" treatment — classified-document hero, sticky left rail of
 * section anchors on desktop, terminal-framed cards per section. Plain
 * reading layout (no pinned cinema, no scrub timelines): these are
 * pages users come to read, not scroll-choreographies.
 */
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface Section {
  readonly heading: string;
  readonly body: readonly string[];
}

interface LegalContent {
  readonly title: string;
  readonly subtitle: string;
  readonly lastUpdated: string;
  readonly intro: string;
  readonly sections: readonly Section[];
}

interface LegalPageProps {
  content: LegalContent;
  /** Slug used to namespace ids and scroll behaviour. */
  slug: 'privacy' | 'terms';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Two-character section index, used by both the TOC and the section badges. */
const idx2 = (n: number) => String(n + 1).padStart(2, '0');

/** A reusable pair of corner brackets — purely decorative; absolute-positioned
 *  inside a relative parent. Mimics the lab-tile / terminal-frame motif used
 *  elsewhere on the site. */
function CornerBrackets({ color = 'rgba(168,240,255,0.35)' }: { color?: string }) {
  const armStyle: React.CSSProperties = {
    position: 'absolute',
    width: '14px',
    height: '14px',
    pointerEvents: 'none',
  };
  return (
    <>
      <span aria-hidden="true" style={{ ...armStyle, top: 0, left: 0, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span aria-hidden="true" style={{ ...armStyle, top: 0, right: 0, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <span aria-hidden="true" style={{ ...armStyle, bottom: 0, left: 0, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span aria-hidden="true" style={{ ...armStyle, bottom: 0, right: 0, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    </>
  );
}

export function LegalPage({ content, slug }: LegalPageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  // Track which section is currently in view, highlight its TOC entry.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>('.legal-section-el'));
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost-visible entry and treat that as active.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const i = Number((visible[0].target as HTMLElement).dataset.index ?? 0);
          setActiveIdx(i);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 },
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content.sections.length]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = rootRef.current;
      if (!root) return;

      gsap.from(root.querySelectorAll<HTMLElement>('.legal-hero-el'), {
        opacity: 0,
        y: 16,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power3.out',
      });

      const sections = root.querySelectorAll<HTMLElement>('.legal-section-el');
      sections.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reset',
            },
          },
        );
      });
    },
    { scope: rootRef, dependencies: [reducedMotion, slug] },
  );

  const classification = slug === 'privacy' ? 'DATA HANDLING' : 'SERVICE TERMS';
  const docCode = slug === 'privacy' ? 'CYC-LGL-PRV-01' : 'CYC-LGL-TRM-01';

  return (
    <main
      ref={rootRef}
      style={{
        position: 'relative',
        zIndex: 1,
        paddingTop: 'clamp(5rem, 10vh, 7rem)',
        paddingBottom: 'clamp(4rem, 8vh, 6rem)',
        paddingInline: 'var(--section-padding)',
        background: 'var(--color-void)',
        color: 'var(--color-text-primary)',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Decorative scan-line / grid texture on the page background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          width: 'clamp(420px, 70vw, 900px)',
          height: '380px',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse, rgba(168,240,255,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="section-container"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* ── Hero — classified-document frame ───────────────────────────── */}
        <div
          className="legal-hero-el"
          style={{
            position: 'relative',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            border: '1px solid rgba(168,240,255,0.12)',
            background: 'rgba(168,240,255,0.025)',
            marginBottom: 'clamp(3rem, 6vh, 4.5rem)',
          }}
        >
          <CornerBrackets />

          {/* Top meta-strip — classification + doc code + last updated */}
          <div
            className="legal-hero-el"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.75rem 1.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              borderBottom: '1px solid rgba(168,240,255,0.08)',
              paddingBottom: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-beam)',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-beam)', boxShadow: '0 0 8px var(--color-beam-glow)' }} />
              {classification}
            </span>
            <span>Doc · {docCode}</span>
            <span>Rev · {formatDate(content.lastUpdated)}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--color-text-disabled)' }}>{slug === 'privacy' ? 'GDPR / DPDP — placeholder' : 'Terms of Service'}</span>
          </div>

          {/* Eyebrow */}
          <div
            className="legal-hero-el"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              color: 'var(--color-beam)',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
            }}
          >
            // {content.title}
          </div>

          {/* Title */}
          <h1
            className="legal-hero-el"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              lineHeight: 1,
              margin: '0 0 1rem',
              color: 'var(--color-text-primary)',
            }}
          >
            {content.title}
          </h1>

          {/* Subtitle */}
          <p
            className="legal-hero-el"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              color: 'var(--color-text-secondary)',
              margin: '0 0 1.5rem',
              lineHeight: 1.5,
              maxWidth: '640px',
            }}
          >
            {content.subtitle}
          </p>

          {/* Intro paragraph — sits inside the dossier frame */}
          <p
            className="legal-hero-el"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '780px',
            }}
          >
            {content.intro}
          </p>
        </div>

        {/* ── Body — sticky TOC + section cards ─────────────────────────── */}
        <div className="legal-body-grid">
          <style>{`
            .legal-body-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: clamp(1.5rem, 3vw, 2.5rem);
            }
            @media (min-width: 900px) {
              .legal-body-grid {
                grid-template-columns: 240px 1fr;
              }
            }
            @media (min-width: 1200px) {
              .legal-body-grid {
                grid-template-columns: 280px 1fr;
              }
            }
            .legal-toc {
              position: relative;
            }
            @media (min-width: 900px) {
              .legal-toc {
                position: sticky;
                top: 6rem;
                align-self: start;
                max-height: calc(100vh - 8rem);
                overflow-y: auto;
              }
            }
            .legal-toc-item {
              display: grid;
              grid-template-columns: 36px 1fr;
              gap: 0.5rem;
              align-items: baseline;
              padding: 0.45rem 0.75rem 0.45rem 0;
              font-family: var(--font-mono);
              font-size: 0.6875rem;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: var(--color-text-tertiary);
              border-left: 1px solid rgba(168,240,255,0.08);
              padding-left: 0.75rem;
              transition: color 0.2s, border-color 0.2s, background 0.2s;
              cursor: pointer;
              text-decoration: none;
            }
            .legal-toc-item:hover {
              color: var(--color-text-secondary);
            }
            .legal-toc-item[data-active="true"] {
              color: var(--color-beam);
              border-left-color: var(--color-beam);
              background: rgba(168,240,255,0.03);
            }
            .legal-toc-item-num {
              color: var(--color-beam);
              opacity: 0.7;
            }
            .legal-toc-item[data-active="true"] .legal-toc-item-num {
              opacity: 1;
            }
          `}</style>

          {/* Sticky table-of-contents rail */}
          <nav className="legal-toc" aria-label={`${content.title} — table of contents`}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-beam)',
                marginBottom: '0.85rem',
                paddingLeft: '0.75rem',
              }}
            >
              // Sections
            </div>
            <div role="list">
              {content.sections.map((s, i) => (
                <a
                  key={`toc-${slug}-${i}`}
                  href={`#${slug}-sec-${i}`}
                  className="legal-toc-item"
                  data-active={activeIdx === i || undefined}
                  role="listitem"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(`${slug}-sec-${i}`);
                    if (el) {
                      window.scrollTo({
                        top: el.getBoundingClientRect().top + window.scrollY - 80,
                        behavior: 'smooth',
                      });
                    }
                  }}
                >
                  <span className="legal-toc-item-num">{idx2(i)}</span>
                  <span style={{ whiteSpace: 'normal', lineHeight: 1.35 }}>
                    {s.heading}
                  </span>
                </a>
              ))}
            </div>
          </nav>

          {/* Section cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vh, 1.5rem)' }}>
            {content.sections.map((section, i) => (
              <article
                key={`${slug}-${i}`}
                id={`${slug}-sec-${i}`}
                className="legal-section-el"
                data-index={i}
                style={{
                  position: 'relative',
                  padding: 'clamp(1.4rem, 2.6vw, 2rem) clamp(1.4rem, 2.6vw, 2rem) clamp(1.4rem, 2.6vw, 2rem) clamp(1.4rem, 2.6vw, 2.25rem)',
                  border: '1px solid rgba(168,240,255,0.08)',
                  background: 'rgba(168,240,255,0.018)',
                  scrollMarginTop: '5rem',
                }}
              >
                {/* Beam accent rail on the left edge */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 'clamp(1.4rem, 2.6vw, 2rem)',
                    left: 0,
                    width: '2px',
                    height: '32px',
                    background: 'var(--color-beam)',
                    boxShadow: '0 0 8px var(--color-beam-glow)',
                  }}
                />

                {/* Heading row: § + index + heading */}
                <header
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.85rem',
                    flexWrap: 'wrap',
                    marginBottom: '1rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid rgba(168,240,255,0.06)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.18em',
                      color: 'var(--color-beam)',
                      textTransform: 'uppercase',
                    }}
                  >
                    § {idx2(i)}
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-primary)',
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    {section.heading}
                  </h2>
                </header>

                {section.body.length === 1 ? (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {section.body[0]}
                  </p>
                ) : (
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}
                  >
                    {section.body.map((p, j) => (
                      <li
                        key={j}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '20px 1fr',
                          gap: '0.5rem',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-base)',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.65,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--color-beam)',
                            paddingTop: '0.35rem',
                            letterSpacing: '0.1em',
                          }}
                        >
                          ›
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            {/* Footer slug — end-of-document marker */}
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem 1.25rem',
                border: '1px dashed rgba(168,240,255,0.12)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem 1.5rem',
                justifyContent: 'space-between',
              }}
            >
              <span>// End of document</span>
              <span style={{ color: 'var(--color-text-disabled)' }}>{docCode} · Rev {formatDate(content.lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
