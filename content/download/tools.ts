export interface DownloadTool {
  id: string;
  name: string;
  shortCode: string;
  description: string;
  highlights: readonly string[];
  size: string;
  platform: string;
  /** All toolkits are member-tier — clicking the action button routes to
   *  /courses so the user enrols (or signs in) before the bundle unlocks. */
  href: string;
  actionLabel: string;
}

export const downloadToolsContent = {
  badge: 'TOOLKITS',
  heading: 'Built in the Lab. Shared with Graduates.',
  description:
    'The exact toolkits CyCraft instructors use to run the hands-on labs — packaged for offline use, versioned, and updated each quarter.',
  tools: [
    {
      id: 'recon',
      name: 'CyCraft Recon Toolkit',
      shortCode: 'RECON-7',
      description:
        'OSINT pipeline + subdomain enumeration + service fingerprinting bundled with sane defaults and result-ranking scripts.',
      highlights: ['Subdomain enum', 'Service fingerprint', 'Result ranking'],
      size: '86 MB',
      platform: 'Linux / WSL',
      href: '/courses',
      actionLabel: 'Unlock Toolkit',
    },
    {
      id: 'malware-lab',
      name: 'Malware Lab Bundle',
      shortCode: 'MALA-3',
      description:
        'Isolated VM bundle with disassemblers, sandbox configs, and a curated sample set for safe reverse-engineering practice.',
      highlights: ['Isolated VM', 'Sandbox configs', 'Sample set'],
      size: '412 MB',
      platform: 'VirtualBox / VMware',
      href: '/courses',
      actionLabel: 'Unlock Toolkit',
    },
    {
      id: 'phish-kit',
      name: 'Phishing Simulation Kit',
      shortCode: 'PHISH-2',
      description:
        'Templated phishing campaigns + tracking server + scoring sheets for running awareness exercises against opt-in cohorts.',
      highlights: ['Email templates', 'Tracker server', 'Scoring sheets'],
      size: '8.6 MB',
      platform: 'Docker',
      href: '/courses',
      actionLabel: 'Unlock Toolkit',
    },
    {
      id: 'web-lab',
      name: 'Web App Lab Stack',
      shortCode: 'WEB-5',
      description:
        'Pre-configured vulnerable apps (OWASP Juice Shop, DVWA, custom CTF) with a single docker-compose to spin the whole class lab.',
      highlights: ['9 vulnerable apps', 'docker-compose', 'Reset scripts'],
      size: '1.2 GB',
      platform: 'Docker',
      href: '/courses',
      actionLabel: 'Unlock Toolkit',
    },
    {
      id: 'cloud-sec',
      name: 'Cloud Security Reference',
      shortCode: 'CLOUD-1',
      description:
        'IAM templates, hardened Terraform modules, and audit scripts for AWS / GCP / Azure used in the cloud security capstone.',
      highlights: ['Terraform modules', 'Audit scripts', 'IAM templates'],
      size: '4.8 MB',
      platform: 'Cross-cloud',
      href: '/courses',
      actionLabel: 'Unlock Toolkit',
    },
    {
      id: 'ir-runbook',
      name: 'Incident Response Runbook',
      shortCode: 'IR-RB',
      description:
        'Markdown-based runbook templates covering common incident scenarios — fork it and adapt to your org\'s playbooks.',
      highlights: ['12 scenarios', 'Markdown', 'Editable templates'],
      size: '0.4 MB',
      platform: 'Any',
      href: '/courses',
      actionLabel: 'Unlock Toolkit',
    },
  ] satisfies readonly DownloadTool[],
} as const;
