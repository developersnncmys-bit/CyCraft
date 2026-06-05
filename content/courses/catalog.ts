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
  /** Pexels CDN image URL displayed on the card's mascot panel. If the
   *  image fails to load (404), the card falls back to the existing
   *  gradient + 3-letter glyph placeholder. */
  image?: string;
}

export const coursesCatalogContent = {
  badge: 'COURSE_CATALOGUE',
  heading: 'Choose your engagement',
  subhead:
    'Twenty-one offensive, defensive, and adjacent tracks. Filter by level or focus area — each program ships with hands-on labs, live infrastructure, and a verifiable credential at the end.',
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
    { value: 21, suffix: '', label: 'Programs', accent: 'beam' as const },
    { value: 5, suffix: '', label: 'Focus Areas', accent: 'beam' as const },
    { value: 4, suffix: '', label: 'Difficulty Tiers', accent: 'terminal' as const },
    { value: 12, suffix: '+', label: 'Industry Mentors', accent: 'red-team' as const },
  ],
  levelFilters: ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'] as const,
  // PRD §3.3 lists 5 facets here. Catalog data also tags Development/Data/
  // Systems for the non-security tracks (Android, iOS, AI/ML, etc.); those
  // courses still appear under "All" but can't be filtered to directly —
  // intentional, to keep the filter row PRD-strict.
  categoryFilters: ['All', 'Offensive', 'Defensive', 'Web', 'Cloud', 'Malware'] as const,
  courses: [
    {
      slug: 'ethical-cyber-security',
      title: 'Ethical Cyber Security',
      description: 'Learn how to hack like a pro with a practical knowledge of hacking.',
      durationWeeks: 10,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Offensive'],
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'cyberbyte-pro',
      title: 'CyberByte Pro — Advanced Ethical Hacking',
      description: 'Push beyond fundamentals and master advanced offensive techniques.',
      durationWeeks: 10,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Offensive'],
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'pentester-pro-essential',
      title: 'Pentester Pro — Essential Edition',
      description: 'A practical, structured path to professional penetration testing.',
      durationWeeks: 8,
      priceInr: 25000,
      level: 'Intermediate',
      categories: ['Offensive'],
      image: 'https://images.pexels.com/photos/5380589/pexels-photo-5380589.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'python-for-hackers',
      title: 'Python for Hackers — Code That Breaks Limits',
      description: 'Turn Python into a pentesting toolset — scanners, bots and exploit scripts.',
      durationWeeks: 8,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Offensive', 'Development'],
      image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'ai-ml-intelligence-redefined',
      title: 'AI & ML — Intelligence Redefined',
      description: 'From data to models — learn practical machine learning and AI workflows.',
      durationWeeks: 10,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Data'],
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'cloud-systems-next-horizon',
      title: 'Cloud Systems — The Next Horizon',
      description: 'Learn cloud foundations: infrastructure, containers, and secure deployment.',
      durationWeeks: 8,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Cloud'],
      image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'data-science-from-data-to-decision',
      title: 'Data Science — From Data to Decision',
      description: 'Turn raw data into business impact with rigorous analysis and visualization.',
      durationWeeks: 10,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Data'],
      image: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'devops-flow-automate-deliver',
      title: 'DevOps — Flow, Automate, Deliver',
      description: 'Build reliable CI/CD pipelines, automate ops and run resilient systems.',
      durationWeeks: 8,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Systems', 'Cloud'],
      image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'android-development-essential',
      title: 'Android Development — Create Smart. Build Bold.',
      description: 'Design and ship Android apps with modern tools and production practices.',
      durationWeeks: 10,
      priceInr: 30000,
      level: 'Beginner',
      categories: ['Development'],
      image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'ios-development-crafted-in-swift',
      title: 'iOS Development — Crafted in Swift',
      description: 'Build elegant iOS apps with Swift and Apple design principles.',
      durationWeeks: 10,
      priceInr: 30000,
      level: 'Intermediate',
      categories: ['Development'],
      image: 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'linux-essential',
      title: 'Linux — The Core of Everything',
      description: 'Get command-line fluent and manage Linux systems confidently.',
      durationWeeks: 6,
      priceInr: 20000,
      level: 'Beginner',
      categories: ['Systems'],
      image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'robotics-intelligence-in-motion',
      title: 'Robotics — Intelligence in Motion',
      description: 'Design autonomous systems combining sensors, actuators and control logic.',
      durationWeeks: 10,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Systems'],
      image: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'iot-connected-world',
      title: 'IoT — The Connected World',
      description: 'Connect devices, collect data and build secure IoT solutions.',
      durationWeeks: 10,
      priceInr: 20000,
      level: 'Intermediate',
      categories: ['Systems'],
      image: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'web-exploitation-art-of-breach',
      title: 'Web Exploitation — The Art of Breach',
      description: 'Master web vulnerabilities and pragmatic exploitation techniques.',
      durationWeeks: 8,
      priceInr: 30000,
      level: 'Advanced',
      categories: ['Offensive', 'Web'],
      image: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'wireless-security-master-airwaves',
      title: 'Wireless Security — Master the Airwaves',
      description: 'Assess and secure wireless networks — practical, hands-on techniques.',
      durationWeeks: 8,
      priceInr: 30000,
      level: 'Advanced',
      categories: ['Offensive', 'Defensive'],
      image: 'https://images.pexels.com/photos/2881229/pexels-photo-2881229.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'infrastructure-pentesting',
      title: 'Infrastructure Pentesting — Deep Core Defense',
      description: 'Deep-dive assessments for servers, services and enterprise infrastructure.',
      durationWeeks: 10,
      priceInr: 30000,
      level: 'Advanced',
      categories: ['Offensive', 'Systems'],
      image: 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'network-pentesting',
      title: 'Network Pentesting — Mapping the Matrix',
      description: 'Hands-on internal and external network security assessments.',
      durationWeeks: 8,
      priceInr: 30000,
      level: 'Intermediate',
      categories: ['Offensive'],
      image: 'https://images.pexels.com/photos/1933900/pexels-photo-1933900.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'red-team-expert',
      title: 'Red Team — Adversary Simulation Masterclass',
      description: 'Plan and execute realistic adversary simulations end-to-end.',
      durationWeeks: 12,
      priceInr: 30000,
      level: 'Expert',
      categories: ['Offensive'],
      image: 'https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'blue-team-defenders-edge',
      title: "Blue Team — The Defender's Edge",
      description: 'Detect, respond and neutralize threats — SOC and threat-hunting skillset.',
      durationWeeks: 12,
      priceInr: 30000,
      level: 'Expert',
      categories: ['Defensive'],
      image: 'https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'digital-forensics',
      title: 'Digital Forensics — Decode the Truth',
      description: 'Recover evidence, analyze artifacts and produce forensic reports.',
      durationWeeks: 10,
      priceInr: 30000,
      level: 'Advanced',
      categories: ['Defensive', 'Malware'],
      image: 'https://images.pexels.com/photos/270373/pexels-photo-270373.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      slug: 'api-security',
      title: 'API Security — Breaking the Interface',
      description: 'Audit, exploit and secure APIs — REST and GraphQL focused testing.',
      durationWeeks: 6,
      priceInr: 30000,
      level: 'Intermediate',
      categories: ['Offensive', 'Web'],
      image: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ] as ReadonlyArray<Course>,
} as const;
