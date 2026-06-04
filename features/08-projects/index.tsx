'use client';
/* Project-First Curriculum — Act III, Section 8 of 22
 * Cinema mode: pinned 300vh. 3D code-window stack shuffles on scroll. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { projectsContent } from '@/content/projects';
import { ProjectStack } from './components/ProjectStack';
import { useProjectShuffle } from './hooks/useProjectShuffle';

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useProjectShuffle(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="projects" act={3}>
      <div
        className="projects-camera-el"
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
            {/* ── Left: text ── */}
            <div className="projects-col" style={{ flex: '1 1 360px', minWidth: 0 }}>
              <h2
                className="projects-heading-el"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.1,
                  willChange: 'transform, opacity',
                }}
              >
                {projectsContent.heading}
              </h2>
              <p
                className="projects-desc-el"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.55,
                  marginBottom: '1.25rem',
                  willChange: 'opacity',
                }}
              >
                {projectsContent.description}
              </p>

              {/* Project title list */}
              <ol
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
                aria-label="Projects list"
              >
                {projectsContent.projects.map((p, i) => (
                  <li
                    key={p.id}
                    className="projects-list-item-el"
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginBottom: '0.65rem',
                      alignItems: 'flex-start',
                      willChange: 'transform, opacity',
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
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-beam)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {p.title}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-tertiary)',
                          lineHeight: 1.5,
                        }}
                      >
                        {p.description}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* ── Right: 3D code window stack ── */}
            <div className="projects-col projects-stack-wrap-el" style={{ flex: '1 1 400px', minWidth: 0, willChange: 'opacity' }}>
              <ProjectStack projects={projectsContent.projects} />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
