export interface GalleryVideo {
  id: string;
  title: string;
  /** Free-text description rendered under the title. */
  summary: string;
  /** Format MM:SS or H:MM:SS. */
  duration: string;
  /** External URL — opens in a new tab on click. Plug in the real YouTube
   *  or Vimeo URL once the channel ships. */
  href: string;
  /** Short tag rendered as a chip on the thumbnail (e.g. "WORKSHOP"). */
  tag: string;
}

export const galleryVideosContent = {
  badge: 'VIDEO GALLERY',
  heading: 'Highlight Reels',
  description:
    'Short recap films from CyCraft events — workshops, panels, and campus inaugurations. Click any tile to open on YouTube.',
  videos: [
    {
      id: 'campus-walkthrough',
      title: 'CyCraft Campus Walkthrough',
      summary:
        'A two-minute tour through the CyCraft training lab, research wing, and student common rooms.',
      duration: '03:42',
      href: 'https://www.youtube.com/@cycraft',
      tag: 'TOUR',
    },
    {
      id: 'bsides-highlights',
      title: 'BSIDES Bangalore Workshop Highlights',
      summary:
        'Hands-on session recap from the BSIDES Bangalore 2024 workshop — Q&A, demo runs, and student wrap-up.',
      duration: '05:18',
      href: 'https://www.youtube.com/@cycraft',
      tag: 'WORKSHOP',
    },
    {
      id: 'christ-inaugural-film',
      title: 'Cyber Security Club — Inaugural Highlights',
      summary:
        'Christ University Bangalore Cyber Security Club inaugural ceremony with guests of honour.',
      duration: '07:24',
      href: 'https://www.youtube.com/@cycraft',
      tag: 'INAUGURAL',
    },
    {
      id: 'career-panel',
      title: 'Cybersecurity Career Panel',
      summary:
        'Panel discussion with hiring managers, alumni, and faculty on breaking into cybersecurity.',
      duration: '12:35',
      href: 'https://www.youtube.com/@cycraft',
      tag: 'PANEL',
    },
  ] satisfies readonly GalleryVideo[],
} as const;
