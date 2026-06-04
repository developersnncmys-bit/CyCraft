import type { CourseDetail } from './types';

export const redTeamExpertDetail: CourseDetail = {
  slug: 'red-team-expert',
  longDescription:
    'Full-scope red team training: planning, execution, persistence and reporting.',
  syllabus: [
    'Master Red Team Strategy & Adversary Mindset',
    'Plan High-Fidelity Red Team Engagements',
    'OSINT & Targeted Reconnaissance at Scale',
    'Initial Access — Precision Phishing & Social Engineering',
    'Command & Control Mastery — Build Resilient C2 Infrastructure',
    'Covert Persistence — Backdoors, Implants & Survivability',
    'Privilege Escalation & Domain Dominance',
    'Lateral Movement & Enterprise Pivoting',
    'Adversary Emulation — MITRE ATT&CK Driven Operations',
    'Living Off the Land — LOLBins, Fileless & Evasion Techniques',
    'Bypass Defenses — AV, EDR, IDS/IPS & Network Evasion',
    'Data Exfiltration — Covert Channels & Stealthy Extraction',
    'Physical & Supply-Chain Breaches — Blended Attack Scenarios',
    'Automation & Scripting — Python, PowerShell & Custom Tooling',
    'Operational Reporting, Compliance & Purple-Team Collaboration',
  ],
  prerequisites: [
    'Advanced pentesting skills',
    'Strong networking & OS knowledge',
  ],
  outcomes: [
    'Run red team ops',
    'Bypass defenses',
    'Deliver realistic breach simulations',
  ],
};
