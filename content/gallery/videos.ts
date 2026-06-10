export interface GalleryVideo {
  id: string;
  title: string;
  /** Free-text description rendered under the title. */
  summary: string;
  /** Short metric badge in the thumbnail's bottom-right corner. Originally a
   *  video runtime ("MM:SS"); now repurposed as a 1-3 word stat label
   *  ("2 DAYS", "500+ STUDENTS", "90% PLACED") for the Highlight Reels
   *  spotlight cards in CyCraft Website Updates v1.3 §11. */
  duration: string;
  /** External URL — opens in a new tab on click. Plug in the real YouTube
   *  or Vimeo URL once the channel ships. */
  href: string;
  /** Short tag rendered as a chip on the thumbnail (e.g. "WORKSHOP"). */
  tag: string;
  /** Image URL displayed as the thumbnail. AI-generated per Updates v1.3
   *  §11 ("each card with an AI-generated image"). When the URL fails to
   *  load (onError), the card falls back to the existing gradient + rings
   *  + play-badge composition underneath, so the card never breaks. */
  image?: string;
}

// Content (v1.3) — Section 11 "Highlight Reels". Four featured spotlight
// cards per the brief. Schema (title / summary / duration / href / tag)
// is preserved so the existing pinned 2×2 tile grid with per-tile stagger
// reveal keeps firing unchanged. `duration` is repurposed as a short
// metric badge for each spotlight; `href` points to the CyCraft YouTube
// channel as the existing placeholder until video assets are produced.
export const galleryVideosContent = {
  // Badge changed from "VIDEO GALLERY" → "SPOTLIGHTS" per Updates v1.3 §11:
  // the brief specifies "featured spotlight cards" (image + title + blurb),
  // not video tiles. The section name "Highlight Reels" stays — that's the
  // PDF section title — but the badge above now reads correctly.
  badge: 'SPOTLIGHTS',
  heading: 'Highlight Reels',
  description:
    'Spotlights from recent CyCraft initiatives — bootcamps, partnerships, faculty enablement, and career outcomes.',
  videos: [
    {
      id: 'cyber-fundamentals-bootcamp',
      title: 'Workshop Highlight: Cybersecurity Fundamentals Bootcamp',
      summary:
        'A 2-day intensive bootcamp where 80+ students learned ethical hacking basics, network scanning, and vulnerability assessment in a hands-on lab environment.',
      duration: '2 DAYS',
      href: 'https://www.youtube.com/@cycraft',
      tag: 'WORKSHOP',
      image: '/gallery/highlight%20card%201.png',
    },
    {
      id: 'college-engineering-collab',
      title: 'Partnership Spotlight: College of Engineering Collaboration',
      summary:
        'CyCraft partnered with a leading engineering college to launch a Cybersecurity Center of Excellence, giving 500+ students access to industry-grade training labs and certifications.',
      duration: '500+ STUDENTS',
      href: 'https://www.youtube.com/@cycraft',
      tag: 'PARTNERSHIP',
      image: '/gallery/highlight%20card%202.png',
    },
    {
      id: 'faculty-upskilling-40',
      title: 'Faculty Enablement: Upskilling 40 Educators',
      summary:
        'A dedicated faculty development workshop trained 40 professors in modern cybersecurity tools, cloud security, and hands-on lab facilitation techniques.',
      duration: '40 EDUCATORS',
      href: 'https://www.youtube.com/@cycraft',
      tag: 'FACULTY',
      image: '/gallery/highlight%20card%203.png',
    },
    {
      id: 'career-outcomes-90',
      title: 'Career Outcomes: 90% Placement in Tech Roles',
      summary:
        'Students who completed CyCraft programs achieved a 90% placement rate in cybersecurity, IT, and software roles within 6 months of program completion.',
      duration: '90% PLACED',
      href: 'https://www.youtube.com/@cycraft',
      tag: 'OUTCOMES',
      image: '/gallery/highlight%20card%204.png',
    },
  ] satisfies readonly GalleryVideo[],
} as const;
