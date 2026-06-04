'use client';
/* Course Prerequisites + Learning Outcomes.
 *
 * Two-column on desktop: Prerequisites left, Learning Outcomes right.
 * Stacks single-column on mobile. Each list item ignites on scroll
 * with the same check-icon treatment as the syllabus, so the page reads
 * as one consistent list family.
 *
 * The section as a whole only renders when at least one list has
 * content — see app/courses/[slug]/page.tsx where the parent decides
 * whether to mount the component based on the detail entry.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 12 15 17 9" />
    </svg>
  );
}

interface CoursePrereqOutcomesProps {
  prerequisites: readonly string[];
  outcomes: readonly string[];
}

export default function CoursePrereqOutcomes({
  prerequisites,
  outcomes,
}: CoursePrereqOutcomesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 768px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const items = root.querySelectorAll<HTMLElement>('.cd-po-item');
      const headings = root.querySelectorAll<HTMLElement>('.cd-po-heading');

      if (reducedMotion) {
        gsap.set([headings, items], { opacity: 1, x: 0, y: 0 });
        return;
      }

      gsap.set(headings, { opacity: 0, y: 20 });
      gsap.set(items, { opacity: 0, x: -16 });

      const trigger = {
        trigger: root,
        start: 'top 80%',
        toggleActions: 'play none none reset',
      } as ScrollTrigger.Vars;

      gsap.to(headings, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: trigger,
      });

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
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  // Render only what's available — if one side is empty, the other
  // takes the full row so we don't show a lone heading-with-no-list.
  const hasPrereq = prerequisites.length > 0;
  const hasOutcomes = outcomes.length > 0;
  if (!hasPrereq && !hasOutcomes) return null;

  const cols =
    isWide && hasPrereq && hasOutcomes ? '1fr 1fr' : '1fr';

  return (
    <section
      ref={sectionRef}
      id="cd-prereq-outcomes"
      aria-label="Prerequisites and learning outcomes"
      style={{
        position: 'relative',
        background: 'transparent',
        paddingTop: 'clamp(3rem, 7vh, 5rem)',
        paddingBottom: 'clamp(4rem, 9vh, 7rem)',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: cols,
          gap: 'clamp(2.5rem, 5vw, 4rem)',
          alignItems: 'start',
        }}
      >
        {hasPrereq && <PoColumn heading="Prerequisites" items={prerequisites} />}
        {hasOutcomes && <PoColumn heading="Learning Outcomes" items={outcomes} />}
      </div>
    </section>
  );
}

function PoColumn({
  heading,
  items,
}: {
  heading: string;
  items: readonly string[];
}) {
  return (
    <div>
      <h2
        className="cd-po-heading"
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
        {heading}
      </h2>
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
        {items.map((item, i) => (
          <li
            key={`${heading}-${i}`}
            className="cd-po-item"
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
    </div>
  );
}
