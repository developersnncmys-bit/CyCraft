'use client';
/* 3D CSS stack of CodeWindows. Parent has perspective so translateZ works.
 * GSAP rotates window order on scroll (rear-most slides to front). */
import type { projectsContent } from '@/content/projects';
import { CodeWindow } from './CodeWindow';

type Projects = typeof projectsContent.projects;

interface ProjectStackProps {
  projects: Projects;
}

export function ProjectStack({ projects }: ProjectStackProps) {
  return (
    <div
      className="project-stack-scene"
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 40%',
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
      }}
    >
      <div
        className="project-stack-inner"
        style={{
          position: 'relative',
          height: '380px',
          transformStyle: 'preserve-3d',
        }}
      >
        {projects.map((project, i) => (
          <CodeWindow
            key={project.id}
            title={project.title}
            language={project.language}
            code={project.code}
            stackIndex={i as 0 | 1 | 2}
          />
        ))}
      </div>
    </div>
  );
}
