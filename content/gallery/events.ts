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
  /** Host venue or campus — rendered in the card subtitle. */
  venue: string;
  /** ISO date — used to sort and to render a "MMM YYYY" stamp on each card. */
  date: string;
  /** Number of photos this album would hold; rendered as "N photos" badge. */
  photoCount: number;
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

export const galleryEventsContent = {
  badge: 'EVENT GALLERY',
  heading: 'Public Engagements',
  description:
    'Every CyCraft event is co-hosted with a campus, corporate partner, or community chapter. Below is the running log of recent engagements.',
  events: [
    {
      id: 'bsides-blr-2024',
      title: 'BSIDES Bangalore 2024 Workshop',
      category: 'Workshop',
      venue: 'BSIDES Bangalore',
      date: '2024-11-09',
      photoCount: 2,
    },
    {
      id: 'reva-training',
      title: '1 out of 100 — Training at REVA University',
      category: 'Workshop',
      venue: 'REVA University, Bangalore',
      date: '2024-09-18',
      photoCount: 3,
    },
    {
      id: 'bmsit-talk',
      title: 'BMSIT Talk on Cybersecurity Trends',
      category: 'Talk',
      venue: 'BMSIT, Bangalore',
      date: '2024-08-22',
      photoCount: 2,
    },
    {
      id: 'skit-workshop',
      title: 'SKIT Students Workshop on Cybersecurity',
      category: 'Workshop',
      venue: 'SKIT, Jaipur',
      date: '2024-06-14',
      photoCount: 4,
    },
    {
      id: 'bsides-meetup',
      title: 'BSIDES Meetup with the Bsides Bangalore Founder',
      category: 'Meetup',
      venue: 'BSIDES Bangalore',
      date: '2024-05-30',
      photoCount: 3,
    },
    {
      id: 'microland',
      title: 'Cybersecurity Training for Microland Employees',
      category: 'Corporate',
      venue: 'Microland HQ, Bangalore',
      date: '2024-04-12',
      photoCount: 3,
    },
    {
      id: 'amrita-cyber',
      title: 'Amrita Vishwa Vidyapeetham Workshop on Cybersecurity',
      category: 'Workshop',
      venue: 'Amrita Vishwa Vidyapeetham',
      date: '2024-02-20',
      photoCount: 3,
    },
    {
      id: 'amrita-pentest',
      title: 'Amrita Vishwa Vidyapeetham Workshop on Penetration Testing',
      category: 'Workshop',
      venue: 'Amrita Vishwa Vidyapeetham',
      date: '2024-02-21',
      photoCount: 7,
    },
    {
      id: 'christ-inaugural',
      title: 'Inaugural Ceremony — Cyber Security Club, Christ University',
      category: 'Inaugural',
      venue: 'Christ University, Bangalore',
      date: '2025-07-28',
      photoCount: 7,
    },
  ] satisfies readonly GalleryEvent[],
} as const;
