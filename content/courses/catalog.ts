export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type CourseCategory =
  | 'Offensive'
  | 'Defensive'
  | 'Web'
  | 'Cloud'
  | 'Malware'
  | 'Development'
  | 'Data'
  | 'Systems';

export interface Course {
  slug: string;
  title: string;
  description: string;
  durationWeeks: number;
  priceInr: number;
  level: CourseLevel;
  categories: CourseCategory[];
  /** Self-paced video runtime in hours, as published in the EC-Council
   *  brochure ("X+ hours of self-paced video training"). Drives the
   *  "Video Hours" stat in the course-detail curriculum section. */
  videoHours: number;
  /** Hands-on lab count as published in the brochure. For Cloud Security
   *  this counts the AWS/Azure/M365 lab tasks total (24) rather than a
   *  per-module figure (the brochure quotes both, tasks is the specific
   *  number). Drives the "Lab Exercises" stat. */
  labCount: number;
  /** Pexels CDN image URL displayed on the card's mascot panel. If the
   *  image fails to load (404), the card falls back to the existing
   *  gradient + 3-letter glyph placeholder. */
  image?: string;
  /** External URL (EC-Council course page). When present, the catalog
   *  card opens this URL in a new tab and bypasses the internal
   *  /courses/[slug] detail route (which has no content for external
   *  partners). When absent, the card navigates to the internal route. */
  externalUrl?: string;
}

export const coursesCatalogContent = {
  badge: 'COURSE_CATALOGUE',
  heading: 'Choose your engagement',
  subhead:
    'Eight EC-Council Essentials Series tracks. Filter by level or focus area — each program ships with hands-on labs, structured modules, and an industry-recognised credential at the end.',
  // Headline morph: heading rotates through these as the user scrolls
  // through the catalog timeline. Each phrase swaps in over a beat.
  headingMorphs: [
    'Choose your engagement',
    'Pick your operator track',
    'Find your specialisation',
  ] as const,
  // Dramatic stats — count up from 0 with elastic ease as the camera
  // crosses 0.10-0.22 of the pinned timeline. Values are intentionally
  // round numbers that read instantly on a hero canvas.
  stats: [
    { value: 8, suffix: '', label: 'Programs', accent: 'beam' as const },
    { value: 5, suffix: '', label: 'Focus Areas', accent: 'beam' as const },
    { value: 2, suffix: '', label: 'Difficulty Tiers', accent: 'terminal' as const },
    { value: 12, suffix: '+', label: 'Industry Mentors', accent: 'red-team' as const },
  ],
  // Filters reflect levels/categories actually used by the current
  // course list — chips that would always show 0 results are omitted.
  levelFilters: ['All', 'Beginner', 'Intermediate'] as const,
  categoryFilters: ['All', 'Offensive', 'Defensive', 'Cloud', 'Malware'] as const,
  // EC-Council Essentials Series — 8 industry-aligned introductory tracks.
  // Each card navigates to the internal /courses/[slug] detail page,
  // populated from content/courses/details/<slug>.ts with curriculum,
  // prerequisites, and outcomes sourced from the official EC-Council
  // course pages.
  courses: [
    {
      slug: 'ethical-hacking-essentials',
      title: 'Ethical Hacking Essentials',
      description:
        'Introductory cybersecurity course covering ethical hacking and penetration testing fundamentals. Hands-on labs, CTF-based Capstone Project, and 12 modules.',
      durationWeeks: 6,
      priceInr: 15000,
      level: 'Beginner',
      categories: ['Offensive'],
      videoHours: 15,
      labCount: 11,
      image:
        'https://images.pexels.com/photos/5380589/pexels-photo-5380589.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'network-defense-essentials',
      title: 'Network Defense Essentials',
      description:
        'Fundamentals of information security and network defense — identification, authentication, authorization, and visualization. 12 modules, 14+ hours, 11 labs.',
      durationWeeks: 7,
      priceInr: 15000,
      level: 'Beginner',
      categories: ['Defensive'],
      videoHours: 14,
      labCount: 11,
      image:
        'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'digital-forensics-essentials',
      title: 'Digital Forensics Essentials',
      description:
        'Entry-level foundational course covering digital forensics investigation phases — dark web forensics, Linux forensics, and web application investigation. 12 modules, 11 labs.',
      durationWeeks: 6,
      priceInr: 15000,
      level: 'Beginner',
      categories: ['Defensive', 'Malware'],
      videoHours: 11,
      labCount: 11,
      image:
        'https://images.pexels.com/photos/270373/pexels-photo-270373.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'cloud-security-essentials',
      title: 'Cloud Security Essentials',
      description:
        'Cloud computing and security fundamentals — data protection, encryption, and securing identities and applications across cloud and hybrid infrastructures. 6 hands-on labs, 10+ hours.',
      durationWeeks: 5,
      priceInr: 15000,
      level: 'Intermediate',
      categories: ['Defensive', 'Cloud'],
      videoHours: 10,
      labCount: 24,
      image:
        'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'devsecops-essentials',
      title: 'DevSecOps Essentials',
      description:
        'Fundamental DevSecOps skills — identifying application development risks and securing applications across on-premises and cloud environments. 10 modules, 7 practical labs.',
      durationWeeks: 5,
      priceInr: 15000,
      level: 'Intermediate',
      categories: ['Defensive', 'Development'],
      videoHours: 7,
      labCount: 7,
      image:
        'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'iot-security-essentials',
      title: 'IoT Security Essentials',
      description:
        'Comprehensive guide to securing IoT systems — from IoT fundamentals to advanced security threats and security engineering. 11 modules, 8+ hours of training, 5 labs.',
      durationWeeks: 5,
      priceInr: 15000,
      level: 'Intermediate',
      categories: ['Defensive', 'Systems'],
      videoHours: 8,
      labCount: 5,
      image:
        'https://images.pexels.com/photos/2881229/pexels-photo-2881229.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'soc-essentials',
      title: 'SOC Essentials',
      description:
        'Designed for aspiring security professionals and career switchers — SOC components, architecture, and cyber threat identification. 8 modules, 10+ hours, 6 hands-on labs.',
      durationWeeks: 5,
      priceInr: 15000,
      level: 'Beginner',
      categories: ['Defensive'],
      videoHours: 10,
      labCount: 6,
      image:
        'https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'threat-intelligence-essentials',
      title: 'Threat Intelligence Essentials',
      description:
        'Strong foundational knowledge of threat intelligence concepts, tools, and the cyber threat landscape. Prepares learners for careers as threat intelligence analysts. 18+ hours, 10 modules, 5 labs.',
      durationWeeks: 8,
      priceInr: 15000,
      level: 'Intermediate',
      categories: ['Defensive'],
      videoHours: 18,
      labCount: 5,
      image:
        'https://images.pexels.com/photos/1933900/pexels-photo-1933900.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ] as ReadonlyArray<Course>,
} as const;
