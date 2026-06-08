'use client';
/* Project-First Curriculum — Act III, Section 8 of 22.
 * Film-mode: pinned ~200vh. Project list staggers in alongside zoom-in stack. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { projectsContent } from '@/content/projects';
import { ProjectStack } from './components/ProjectStack';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=200%' });

  return (
    <SectionWrapper ref={sectionRef} id="projects" act={3}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(168,240,255,0.10), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(140,80,255,0.06), transparent 60%)',
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
            'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(168,240,255,0.02) 8px, rgba(168,240,255,0.02) 9px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera projects-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: 'clamp(5rem, 9vh, 6rem) var(--section-padding) clamp(2rem, 4vh, 3rem)',
          }}
        >
          <div
            className="section-container"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'clamp(3rem, 6vw, 5rem)',
              alignItems: 'center',
            }}
          >
            {/* Left: text */}
            <div className="projects-col" style={{ flex: '1 1 360px', minWidth: 0 }}>
              <h2
                className="film-fade projects-heading-el"
                data-at="0.05"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.1,
                }}
              >
                {projectsContent.heading}
              </h2>
              <p
                className="film-fade projects-desc-el"
                data-at="0.12"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.55,
                  marginBottom: '1.25rem',
                }}
              >
                {projectsContent.description}
              </p>

              <ol
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
                aria-label="Projects list"
              >
                {projectsContent.projects.map((p, i) => (
                  <li
                    key={p.id}
                    className="film-fade projects-list-item-el"
                    data-at={`${0.25 + i * 0.08}`}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginBottom: '0.65rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-disabled)',
                        minWidth: '1.5rem',
                        paddingTop: '2px',
                      }}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-beam)', marginBottom: '0.25rem' }}>
                        {p.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
                        {p.description}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right: 3D code window stack — zooms in */}
            <div className="film-image-zoom projects-col projects-stack-wrap-el" style={{ flex: '1 1 400px', minWidth: 0 }}>
              <ProjectStack projects={projectsContent.projects} />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
