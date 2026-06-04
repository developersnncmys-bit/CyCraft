export type DownloadCategoryIcon = 'doc' | 'paper' | 'terminal' | 'lock';

export interface DownloadCategory {
  id: string;
  icon: DownloadCategoryIcon;
  tag: string;
  title: string;
  description: string;
  meta: {
    count: string;
    formats: string;
    access: string;
  };
  /** Where the card's CTA takes the user — Public/Member categories scroll to
   *  the in-page Featured Files table; the gated Restricted Vault routes
   *  through /contact for admissions. */
  cta: { label: string; href: string };
}

export const downloadCategoriesContent = {
  badge: 'CATEGORIES',
  heading: 'Four Vaults, One Library',
  description:
    'Everything ships through the same access control — only the content and the membership gate change.',
  categories: [
    {
      id: 'study',
      icon: 'doc',
      tag: 'LEARN',
      title: 'Study Materials',
      description:
        'Course PDFs, lecture slide decks, lab handouts, and revision notes that go with every CyCraft track. Curated by the trainer who owns the course.',
      meta: {
        count: '120+ files',
        formats: 'PDF · PPTX · MD',
        access: 'Public',
      },
      cta: { label: 'Browse Study Files', href: '#download-files' },
    },
    {
      id: 'research',
      icon: 'paper',
      tag: 'INVESTIGATE',
      title: 'Research Resources',
      description:
        'Whitepapers, threat-intelligence reports, CVE writeups, and incident post-mortems published by the CyCraft research wing.',
      meta: {
        count: '45+ papers',
        formats: 'PDF · MD',
        access: 'Public',
      },
      cta: { label: 'Open Research Hub', href: '/research' },
    },
    {
      id: 'tools',
      icon: 'terminal',
      tag: 'OPERATE',
      title: 'Cybersecurity Tools',
      description:
        'Recon toolkits, lab VM bundles, scripts, payload templates, and reference configs. Used inside our hands-on labs — open-sourced for graduates.',
      meta: {
        count: '60+ toolkits',
        formats: 'TAR · ZIP · SH',
        access: 'Member',
      },
      cta: { label: 'See Toolkits', href: '#download-tools' },
    },
    {
      id: 'restricted',
      icon: 'lock',
      tag: 'MEMBERS ONLY',
      title: 'Restricted Vault',
      description:
        'Premium playbooks, exam prep packs, and partner-shared red-team material. Available to enrolled cohorts and partner organisations only.',
      meta: {
        count: '30+ files',
        formats: 'Mixed',
        access: 'Premium',
      },
      cta: { label: 'Request Access', href: '/contact' },
    },
  ] satisfies readonly DownloadCategory[],
} as const;
