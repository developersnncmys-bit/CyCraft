export const downloadHeroContent = {
  badge: 'RESOURCE_VAULT',
  headlinePrefix: 'Resource',
  headlineAccent: 'Library',
  tagline:
    'Study guides, research whitepapers, security toolkits, and lab resources — curated by CyCraft instructors and the research wing. Free for the basics, members for the depth.',
  pills: [
    { label: 'PDFs', icon: 'doc' },
    { label: 'Whitepapers', icon: 'paper' },
    { label: 'Toolkits', icon: 'terminal' },
  ],
  terminalLines: [
    '> vault.connect("cycraft-resources")',
    '> indexed: 250+ files across 4 categories',
    '> access: public + member-restricted tiers',
  ],
  primaryCta: { label: 'Browse Vault', href: '#download-categories' },
  secondaryCta: { label: 'View Featured Files', href: '#download-files' },
} as const;
