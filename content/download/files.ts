export type FileTier = 'free' | 'member' | 'premium';
export type FileFormat = 'PDF' | 'ZIP' | 'TAR' | 'PPTX' | 'MD' | 'SH';

export interface DownloadFile {
  rank: number;
  /** Stable slug used for the download URL. */
  id: string;
  name: string;
  category: string;
  format: FileFormat;
  sizeMb: number;
  downloads: number;
  tier: FileTier;
  /** Where the row's action button takes the user.
   *  - Free   → direct file URL (browser will trigger download)
   *  - Member → /courses (must enrol to unlock)
   *  - Premium→ /contact (must talk to admissions) */
  href: string;
  /** Action button label tuned to the tier. */
  actionLabel: 'Download' | 'Unlock' | 'Request';
}

/** URL the placeholder file lives at on the CDN once the backend ships. */
const fileUrl = (id: string, format: FileFormat) =>
  `/files/${id}.${format.toLowerCase()}`;

const buildEntry = (
  rank: number,
  id: string,
  name: string,
  category: string,
  format: FileFormat,
  sizeMb: number,
  downloads: number,
  tier: FileTier,
): DownloadFile => {
  let href: string;
  let actionLabel: 'Download' | 'Unlock' | 'Request';
  switch (tier) {
    case 'free':
      href = fileUrl(id, format);
      actionLabel = 'Download';
      break;
    case 'member':
      href = '/courses';
      actionLabel = 'Unlock';
      break;
    case 'premium':
      href = '/contact';
      actionLabel = 'Request';
      break;
  }
  return { rank, id, name, category, format, sizeMb, downloads, tier, href, actionLabel };
};

export const downloadFilesContent = {
  badge: 'FEATURED FILES',
  heading: 'Top Downloads — Last 30 Days',
  description:
    'The ten most-fetched resources across the vault, refreshed nightly. Member-only files are visible here but require a CyCraft login to download.',
  entries: [
    buildEntry( 1, 'ethical-hacking-notes',     'Ethical Hacking — Complete Course Notes',    'Study',     'PDF',  18.4, 4820, 'free'),
    buildEntry( 2, 'owasp-top10-2025',          'OWASP Top 10 — 2025 Threat Brief',           'Research',  'PDF',   4.2, 3915, 'free'),
    buildEntry( 3, 'recon-toolkit-linux',       'CyCraft Recon Toolkit (Linux)',              'Tools',     'TAR',  86.0, 3104, 'member'),
    buildEntry( 4, 'comptia-secplus-revision',  'CompTIA Security+ — Revision Pack',          'Study',     'PDF',  22.1, 2780, 'free'),
    buildEntry( 5, 'malware-re-lab-bundle',     'Malware Reverse-Engineering Lab Bundle',     'Tools',     'ZIP', 412,   2240, 'member'),
    buildEntry( 6, 'cve-spotlight-q1-2026',     'CVE Spotlight — Q1 2026 Roundup',            'Research',  'PDF',   6.8, 1985, 'free'),
    buildEntry( 7, 'aws-security-cheatsheet',   'AWS Security — Architecture Cheatsheet',     'Study',     'PDF',   3.4, 1742, 'free'),
    buildEntry( 8, 'red-team-playbook-lateral', 'Red-Team Playbook — Lateral Movement',       'Restricted','PDF',  14.0, 1450, 'premium'),
    buildEntry( 9, 'ir-runbook-template',       'Incident Response Runbook Template',         'Study',     'MD',    0.4, 1295, 'free'),
    buildEntry(10, 'phishing-simulation-kit',   'CyCraft Phishing Simulation Kit',            'Tools',     'SH',    8.6, 1180, 'member'),
  ] satisfies readonly DownloadFile[],
  columns: {
    rank: 'Rank',
    name: 'File',
    category: 'Category',
    format: 'Type',
    size: 'Size',
    tier: 'Access',
    action: 'Get',
  },
} as const;
