'use client';
/* Course Detail Mascot — visual centrepiece between hero and syllabus.
 *
 * Project design language only — no per-course illustration art (yet).
 * The screenshot shows a stylised lion on a white background; the
 * project sits in the dark cybersecurity palette, so we use a layered
 * radial-gradient + concentric ring composition with the course's first
 * three letters as a watermark glyph. Same approach as the Gallery
 * event cards — distinct per course, no real image needed.
 *
 * When real mascot artwork ships, drop an <img> in place of the glyph
 * span and keep the gradient as the surrounding aura.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { Course } from '@/content/courses/catalog';

// Cycle through five accents based on slug hash so adjacent courses in
// the catalogue feel distinct. Pure presentation — does not affect
// behaviour, search, or any other consumer of the slug.
const ACCENTS = [
  { core: 'var(--color-beam)', glow: 'rgba(77,217,255,0.32)', halo: 'rgba(77,217,255,0.12)' },
  { core: 'var(--color-red-team-glow)', glow: 'rgba(255,61,90,0.28)', halo: 'rgba(255,61,90,0.10)' },
  { core: 'var(--color-terminal)', glow: 'rgba(0,255,148,0.26)', halo: 'rgba(0,255,148,0.08)' },
  { core: 'var(--color-blue-team-glow)', glow: 'rgba(61,168,255,0.28)', halo: 'rgba(61,168,255,0.10)' },
  { core: '#c8aaff', glow: 'rgba(168,120,255,0.28)', halo: 'rgba(168,120,255,0.10)' },
] as const;

const accentFor = (slug: string) => {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return ACCENTS[Math.abs(h) % ACCENTS.length];
};

export default function CourseMascot({ course }: { course: Course }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const accent = accentFor(course.slug);
  const glyph = course.title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(['.cd-mascot-frame', '.cd-mascot-glyph', '.cd-mascot-ring'], {
          opacity: 1, scale: 1, rotate: 0,
        });
        return;
      }

      gsap.set('.cd-mascot-frame', { opacity: 0, scale: 0.94 });
      gsap.set('.cd-mascot-glyph', { opacity: 0, scale: 0.85 });
      gsap.set('.cd-mascot-ring', { opacity: 0, scale: 0.9 });

      const trigger = {
        trigger: root,
        start: 'top 78%',
        toggleActions: 'play none none reset',
      } as ScrollTrigger.Vars;

      gsap.to('.cd-mascot-frame', {
        opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: trigger,
      });
      gsap.to('.cd-mascot-ring', {
        opacity: 1, scale: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        delay: 0.1,
        scrollTrigger: trigger,
      });
      gsap.to('.cd-mascot-glyph', {
        opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)',
        delay: 0.3,
        scrollTrigger: trigger,
      });

      // Slow infinite drift on the outer ring — adds life without scroll cost.
      gsap.to('.cd-mascot-ring-outer', {
        rotate: 360,
        duration: 40,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion, course.slug] },
  );

  return (
    <section
      ref={sectionRef}
      id="cd-mascot"
      aria-hidden="true"
      style={{
        position: 'relative',
        background: 'transparent',
        overflow: 'hidden',
        paddingTop: 'clamp(2rem, 4vh, 3rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
    >
      <div
        className="section-container"
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          className="cd-mascot-frame"
          style={{
            position: 'relative',
            width: 'min(480px, 80%)',
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform, opacity',
          }}
        >
          {/* Outer drifting ring */}
          <div
            className="cd-mascot-ring cd-mascot-ring-outer"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `1px dashed ${accent.core}44`,
              willChange: 'transform',
            }}
          />
          {/* Middle ring */}
          <div
            className="cd-mascot-ring"
            style={{
              position: 'absolute',
              inset: '12%',
              borderRadius: '50%',
              border: `1px solid ${accent.core}55`,
              boxShadow: `0 0 36px ${accent.halo} inset`,
            }}
          />
          {/* Inner aura */}
          <div
            className="cd-mascot-ring"
            style={{
              position: 'absolute',
              inset: '24%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${accent.glow} 0%, ${accent.halo} 45%, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />
          {/* Glyph */}
          <span
            className="cd-mascot-glyph"
            style={{
              position: 'relative',
              zIndex: 2,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 9vw, 7rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: accent.core,
              textShadow: `0 0 28px ${accent.glow}, 0 0 60px ${accent.halo}`,
              userSelect: 'none',
            }}
          >
            {glyph}
          </span>
        </div>
      </div>
    </section>
  );
}
