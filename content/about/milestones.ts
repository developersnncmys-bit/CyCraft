/**
 * Content (v1.3) — Section 7 "Vision for the Future".
 * Two short statements replace the previous milestone grid. The
 * `aboutMilestonesContent` shape keeps `badge`, `heading`, `description` so
 * the section's pinned timeline (which targets `.about-mile-badge / heading /
 * desc`) keeps firing unchanged. The legacy `milestones[]` array is dropped;
 * `Milestone` is kept exported as an alias for any out-of-tree import.
 */
export interface VisionStatement {
  id: string;
  body: string;
}

/** @deprecated kept for compatibility with any legacy import path. */
export type Milestone = VisionStatement;

export const aboutMilestonesContent = {
  badge: 'OUR VISION',
  heading: 'Vision for the Future',
  description: 'Where institutional partnerships take us next.',
  statements: [
    {
      id: 'vision-future',
      body:
        'CyCraft envisions a future where every student has access to practical, industry-relevant learning experiences that prepare them to become innovators, leaders, and problem solvers in the digital economy.',
    },
    {
      id: 'vision-commitment',
      body:
        'We are committed to helping institutions create learning ecosystems that inspire growth, innovation, and excellence.',
    },
  ] satisfies readonly VisionStatement[],
} as const;
