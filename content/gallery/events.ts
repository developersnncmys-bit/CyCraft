export type EventCategory =
  | 'Workshop'
  | 'Meetup'
  | 'Talk'
  | 'Corporate'
  | 'Inaugural';

export interface GalleryEvent {
  id: string;
  /** Event title — same wording as the original EthicalByte gallery so the
   *  Admin can swap rows 1:1 once the gallery CMS ships (PRD §3.9). */
  title: string;
  category: EventCategory;
  /** Host venue or campus — rendered in the card subtitle. Repurposed in
   *  Updates v1.3 §10 to carry the descriptive caption that appears below
   *  the image (also serves as the AI-image generation prompt for the
   *  design team). */
  venue: string;
  /** ISO date — used to sort and to render a "MMM YYYY" stamp on each card. */
  date: string;
  /** Number of photos this album would hold; rendered as "N photos" badge. */
  photoCount: number;
  /** Image URL displayed in the card's hero area. AI-generated per Updates
   *  v1.3 §10 ("each image must be AI-generated, no stock photos"). When
   *  the URL fails to load (onError), the card falls back to the existing
   *  gradient + glyph + concentric ring composition underneath, so the
   *  card never breaks. */
  image?: string;
}

/**
 * Card gradient palette — one tone per index, cycled across the grid so
 * adjacent cards never share a tint. Each entry uses the project palette
 * (beam-cyan, red-team, terminal, blue-team, violet) at low alpha for the
 * card hero. The card title + chip overlay the gradient.
 */
export const galleryCardTones = [
  // Beam cyan
  {
    bg: 'linear-gradient(135deg, rgba(77,217,255,0.28) 0%, rgba(13,16,20,0.65) 60%, rgba(77,217,255,0.08) 100%)',
    accent: 'var(--color-beam)',
  },
  // Red-team
  {
    bg: 'linear-gradient(135deg, rgba(255,61,90,0.24) 0%, rgba(13,16,20,0.65) 60%, rgba(255,61,90,0.08) 100%)',
    accent: 'var(--color-red-team-glow)',
  },
  // Terminal green
  {
    bg: 'linear-gradient(135deg, rgba(0,255,148,0.22) 0%, rgba(13,16,20,0.65) 60%, rgba(0,255,148,0.06) 100%)',
    accent: 'var(--color-terminal)',
  },
  // Blue team
  {
    bg: 'linear-gradient(135deg, rgba(61,168,255,0.26) 0%, rgba(13,16,20,0.65) 60%, rgba(61,168,255,0.08) 100%)',
    accent: 'var(--color-blue-team-glow)',
  },
  // Violet
  {
    bg: 'linear-gradient(135deg, rgba(168,120,255,0.24) 0%, rgba(13,16,20,0.65) 60%, rgba(168,120,255,0.08) 100%)',
    accent: '#c8aaff',
  },
] as const;

// Content (v1.3) — Section 10 "Gallery Section". Six themed image cards
// per the brief. Schema (title / category / venue / date / photoCount) is
// preserved so the existing pinned camera-pan + per-card stagger reveal
// keep firing unchanged. `venue` carries the AI-image generation prompt /
// short caption per the brief's "Caption / Description" column.
export const galleryEventsContent = {
  badge: 'EVENT GALLERY',
  heading: 'Public Engagements',
  description:
    'Snapshots from CyCraft initiatives across institutional partnerships, workshops, hackathons, and industry engagements.',
  events: [
    {
      id: 'cybersecurity-workshop',
      title: 'Cybersecurity Workshop',
      category: 'Workshop',
      venue:
        'Students engaged in a hands-on cybersecurity workshop with laptops and screens showing network diagrams.',
      date: '2025-01-18',
      photoCount: 12,
      image: '/gallery/cybersecurity%20workshop.png',
    },
    {
      id: 'technology-bootcamp',
      title: 'Technology Bootcamp',
      category: 'Workshop',
      venue:
        'An intense coding and technology bootcamp session with participants working on terminals — energy-filled classroom.',
      date: '2025-02-22',
      photoCount: 18,
      image: '/gallery/Technology%20bootcamp.png',
    },
    {
      id: 'faculty-development',
      title: 'Faculty Development',
      category: 'Talk',
      venue:
        'Educators and faculty members attending a professional development seminar led by an industry expert at a whiteboard.',
      date: '2025-03-15',
      photoCount: 9,
      image: '/gallery/Faculty%20Development.png',
    },
    {
      id: 'student-hackathon',
      title: 'Student Hackathon',
      category: 'Meetup',
      venue:
        'College students collaborating at a hackathon — screens glowing, teams working intensely on innovation challenges.',
      date: '2025-04-12',
      photoCount: 24,
      image: '/gallery/Students%20hackathon.png',
    },
    {
      id: 'career-readiness-session',
      title: 'Career Readiness Session',
      category: 'Workshop',
      venue:
        'Students participating in mock interviews and resume-building workshops with mentors — professional, aspirational setting.',
      date: '2025-05-09',
      photoCount: 14,
      image: '/gallery/career%20readiness%20session.png',
    },
    {
      id: 'industry-expert-talk',
      title: 'Industry Expert Talk',
      category: 'Talk',
      venue:
        'A cybersecurity industry professional delivering a guest lecture to an engaged college audience in a modern auditorium.',
      date: '2025-06-20',
      photoCount: 11,
      image: '/gallery/industry%20expert%20talk.png',
    },
  ] satisfies readonly GalleryEvent[],
} as const;
