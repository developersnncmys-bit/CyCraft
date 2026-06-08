'use client';
/* Curriculum Roadmap — Act IV, Section 11 of 22.
 * Film-mode: pinned ~320vh. Heading stays composed; below it, the 4 years
 * cross-fade one at a time (Y1 → Y2 → Y3 → Y4). Each year is one beat of
 * the pin window (~80vh of scroll per year), giving every year clean space
 * to display its 2 semesters at full size.
 *
 * Stacking 8 semesters at once collapsed the layout (couldn't fit in 100vh
 * pinned canvas) and clipped the heading — replaced with sequential reveal.
 */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { curriculumContent } from '@/content/curriculum';
import { SemesterCheckpoint } from './components/SemesterCheckpoint';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

// Group semesters by year (1..4), 2 semesters per year.
type Semester = (typeof curriculumContent.semesters)[number];
const YEARS: { year: number; phase: string; semesters: Semester[] }[] = (() => {
  const groups = new Map<number, Semester[]>();
  curriculumContent.semesters.forEach((s) => {
    const list = groups.get(s.year) ?? [];
    list.push(s);
    groups.set(s.year, list);
  });
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, sems]) => ({ year, phase: sems[0].phase, semesters: sems }));
})();

// Sequenced reveal — each year's fade-OUT completes before the next year's
// fade-IN begins, so no two years are ever simultaneously visible (which read
// as text ghosting through the other year). Last year holds through the end.
//   Y1: in 0.10–0.16 → out 0.24–0.30
//   Y2: in 0.32–0.38 → out 0.46–0.52
//   Y3: in 0.54–0.60 → out 0.68–0.74
//   Y4: in 0.76–0.82 → hold
const YEAR_AT = [0.10, 0.32, 0.54, 0.76] as const;
const YEAR_OUT = [0.24, 0.46, 0.68, null] as const;
const FADE_DUR = '0.06';

export default function CurriculumRoadmapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  useFilmReveal(sectionRef, { pin: '+=320%' });

  return (
    <SectionWrapper ref={sectionRef} id="curriculum" act={4}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(140,80,255,0.12), transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(168,240,255,0.06), transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="film-bg-mid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-5%',
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(168,240,255,0.02) 8px, rgba(168,240,255,0.02) 9px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera curriculum-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          willChange: 'transform',
          overflow: 'hidden',
          paddingTop: 'clamp(5rem, 8.5vh, 6rem)',
          paddingInline: 'var(--section-padding)',
          paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header — stays composed for the full pin */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
          <div className="film-fade curriculum-badge-el" data-at="0.03" style={{ display: 'inline-block' }}>
            <Badge label={curriculumContent.badge} />
          </div>
          <h2
            className="film-fade curriculum-heading-el"
            data-at="0.06"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.4vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '0.6rem 0 0.4rem',
              lineHeight: 1.1,
            }}
          >
            {curriculumContent.heading}
          </h2>
          <p
            className="film-fade curriculum-desc-el"
            data-at="0.09"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            {curriculumContent.description}
          </p>
        </div>

        {/* Year stage — each year absolute-positioned in same area, cross-fading. */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            maxWidth: '1100px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {YEARS.map((yr, idx) => {
            const at = YEAR_AT[idx];
            const out = YEAR_OUT[idx];
            const dataAttrs: Record<string, string> = {
              'data-at': String(at),
              'data-dur': FADE_DUR,
            };
            if (out !== null) {
              dataAttrs['data-out-at'] = String(out);
              dataAttrs['data-out-dur'] = FADE_DUR;
            }

            return (
              <div
                key={yr.year}
                className="film-fade"
                {...dataAttrs}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(1rem, 2vh, 1.5rem)',
                }}
              >
                {/* Year title */}
                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      letterSpacing: '0.25em',
                      color: 'var(--color-beam)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Year {yr.year} · {yr.phase}
                  </span>
                </div>

                {/* Two semester checkpoints + beam line */}
                {isDesktop ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2px 1fr',
                      gap: '0 3rem',
                      alignItems: 'start',
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <SemesterCheckpoint semester={yr.semesters[0]} isYearStart={false} />
                    </div>
                    <div style={{ position: 'relative', height: '100%' }}>
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '2px',
                          height: '100%',
                          background: 'linear-gradient(to bottom, var(--color-beam) 0%, var(--color-blue-team) 50%, var(--color-terminal) 100%)',
                          boxShadow: '0 0 12px var(--color-beam-glow)',
                        }}
                      />
                    </div>
                    <div>
                      {yr.semesters[1] && <SemesterCheckpoint semester={yr.semesters[1]} isYearStart={false} />}
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(168,240,255,0.2)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {yr.semesters.map((sem) => (
                      <SemesterCheckpoint key={sem.id} semester={sem} isYearStart={false} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(0,255,148,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
