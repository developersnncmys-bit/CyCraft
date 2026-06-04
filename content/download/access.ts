export type AccessTierId = 'public' | 'member' | 'premium';

export interface AccessTier {
  id: AccessTierId;
  label: string;
  tagline: string;
  description: string;
  includes: readonly string[];
  cta: { label: string; href: string };
  accent: 'cyan' | 'green' | 'red';
}

export const downloadAccessContent = {
  badge: 'ACCESS TIERS',
  heading: 'Free for the Basics. Members for the Depth.',
  description:
    'Anyone can grab the study notes and research papers. The hands-on toolkits and red-team material sit behind a CyCraft login to keep things responsible.',
  tiers: [
    {
      id: 'public',
      label: 'Public',
      tagline: 'No account needed',
      description:
        'Open study materials, research whitepapers, and CVE writeups. Direct download — just hit the file.',
      includes: [
        'Course notes & lecture decks',
        'Research whitepapers & CVE writeups',
        'Aptitude prep + revision packs',
        'Public cheat-sheets',
      ],
      cta: { label: 'Browse Public Files', href: '#download-files' },
      accent: 'cyan',
    },
    {
      id: 'member',
      label: 'Member',
      tagline: 'Free with any course',
      description:
        'Unlocks the hands-on toolkits and lab bundles — recon kits, lab VMs, phishing simulator, IR runbooks. Tracked downloads.',
      includes: [
        'All public files',
        'Recon + lab toolkits',
        'Vulnerable app stacks (Docker)',
        'Quarterly tooling updates',
      ],
      cta: { label: 'Browse Courses', href: '/courses' },
      accent: 'green',
    },
    {
      id: 'premium',
      label: 'Premium',
      tagline: 'Cohort + partner only',
      description:
        'Red-team playbooks, partner-shared material, and exam-prep packs. Reserved for active cohorts and organisations on a CyCraft partnership.',
      includes: [
        'All member files',
        'Red-team playbooks',
        'Partner-shared research',
        'Certification exam prep packs',
      ],
      cta: { label: 'Talk to Admissions', href: '/contact' },
      accent: 'red',
    },
  ] satisfies readonly AccessTier[],
} as const;
