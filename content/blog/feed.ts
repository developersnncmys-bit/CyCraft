export type BlogCategory =
  | 'Malware'
  | 'Web Security'
  | 'Cloud Security'
  | 'Reverse Engineering'
  | 'Threat Intel'
  | 'Industry News';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  publishedAt: string; // ISO date
  readMinutes: number;
  author: string;
  featured?: boolean;
}

export const blogFeedContent = {
  badge: 'RECENT_DISPATCHES',
  heading: 'Recent transmissions',
  subhead:
    'Threat-intel writeups, vulnerability deep-dives and industry shifts — filter the feed or search the archive. Every post is reviewed by our research wing before it ships.',
  categoryFilters: [
    'All',
    'Malware',
    'Web Security',
    'Cloud Security',
    'Reverse Engineering',
    'Threat Intel',
    'Industry News',
  ] as const,
  viewAllCta: {
    label: 'View All Posts',
    href: '/blog/archive',
  },
  posts: [
    {
      slug: 'kyrgyzstan-justice-ministry-netsupport-rat-fake-pdfs',
      title:
        'Hackers Posing as Kyrgyzstan Justice Ministry Spread NetSupport RAT via Fake PDFs',
      excerpt:
        'A hacking campaign — attributed to the group — is distributing 2013-era exploits across Kyrgyzstan and Uzbekistan via fake PDFs and outdated Java exploits, targeting unsuspecting users with a long-standing remote-access tool.',
      category: 'Threat Intel',
      publishedAt: '2025-12-01',
      readMinutes: 8,
      author: 'EthicalByte',
      featured: true,
    },
    {
      slug: 'roningloader-fake-chrome-teams-gh0st-rat',
      title:
        'RONINGLOADER Uses Fake Chrome and Teams Apps to Deploy Modified Gh0st RAT',
      excerpt:
        'Hackers from the Dragon Breath group are pushing a multi-stage loader called RONINGLOADER through fake Chrome and Microsoft Teams installers, disabling security tools with real Windows drivers and dropping a modified variant of Gh0st RAT that hides inside regsvr32.exe.',
      category: 'Malware',
      publishedAt: '2025-11-21',
      readMinutes: 9,
      author: 'EthicalByte',
    },
    {
      slug: 'landfall-spyware-samsung-galaxy-zero-day',
      title:
        'Commercial-Grade LANDFALL Spyware Exploits Zero-Day in Samsung Galaxy Phones',
      excerpt:
        "A newly identified Android spyware named LANDFALL exploited an unpatched zero-day flaw in Samsung Galaxy devices' image-processing libraries. The spyware was delivered through WhatsApp and operated silently for months before Samsung released a fix in April 2025.",
      category: 'Malware',
      publishedAt: '2025-11-21',
      readMinutes: 7,
      author: 'EthicalByte',
    },
    {
      slug: 'cloudflare-routing-failure-worldwide-outage',
      title:
        'Major Cloudflare Routing Failure Disrupts Websites Worldwide',
      excerpt:
        "A sudden internal routing flaw inside Cloudflare's global network caused widespread website slowdowns and outages across services depending on its DNS, CDN, and traffic filtering systems.",
      category: 'Industry News',
      publishedAt: '2025-11-20',
      readMinutes: 5,
      author: 'EthicalByte',
    },
    {
      slug: 'landfall-spyware-trusted-devices-system-wide-threat',
      title:
        'LANDFALL Spyware Hits Samsung Phones — Trusted Devices Turn System-Wide Threat',
      excerpt:
        "A zero-day in Samsung's image-processing library let LANDFALL infiltrate Galaxy models and run persistent surveillance.",
      category: 'Threat Intel',
      publishedAt: '2025-11-19',
      readMinutes: 6,
      author: 'EthicalByte',
    },
    {
      slug: 'ai-browser-indirect-prompt-injection',
      title:
        'The Invisible Hack — Indirect Prompt Injection Targets AI Browsers',
      excerpt:
        'Brave demo shows how hidden prompts in web content can trick AI-powered browsers to exfiltrate logged-in data. One click is all it takes.',
      category: 'Web Security',
      publishedAt: '2025-11-05',
      readMinutes: 4,
      author: 'EthicalByte',
    },
  ] as ReadonlyArray<BlogPost>,
} as const;
