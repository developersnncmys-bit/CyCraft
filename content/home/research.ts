export interface ResearchHighlight {
  id: string;
  category: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
}

export const homeResearchContent = {
  badge: 'RESEARCH & INNOVATION',
  heading: 'Research-Driven Security',
  description:
    'Vulnerability discovery, CVE writeups, and threat intelligence from our research wing — published, peer-reviewed, and used in the wild.',
  highlights: [
    {
      id: 'cve-2026-0142',
      category: 'CVE Research',
      tag: 'CRITICAL',
      title: 'Authentication bypass in a widely deployed IoT gateway',
      excerpt:
        'A session-handling flaw allows remote attackers to bypass authentication on 4M+ deployed devices. Full writeup, PoC, and vendor coordination timeline.',
      date: '2026-04-18',
    },
    {
      id: 'threat-apt-cloud',
      category: 'Threat Intelligence',
      tag: 'ANALYSIS',
      title: 'Cloud-native APT campaign targeting Indian fintech',
      excerpt:
        'A 4-month investigation into a sophisticated supply-chain attack against three regional banks. Full IOCs, TTPs, and detection rules published.',
      date: '2026-03-02',
    },
    {
      id: 'tooling-llm-fuzzer',
      category: 'Tooling',
      tag: 'OPEN SOURCE',
      title: 'LLM-assisted fuzzer for protocol analysis',
      excerpt:
        'A new fuzzing framework that uses LLMs to generate context-aware test cases. 3× higher path coverage than baseline AFL++ on tested protocols.',
      date: '2026-01-25',
    },
  ] satisfies readonly ResearchHighlight[],
  cta: { label: 'VIEW ALL RESEARCH', href: '#research' },
} as const;
