import type { CourseDetail } from './types';

export const pythonForHackersDetail: CourseDetail = {
  slug: 'python-for-hackers',
  longDescription:
    'Build security automation, exploit scripts and reconnaissance tools in Python.',
  syllabus: [
    'Master Python for Offensive Automation',
    'Command Control: Sockets & Network Engineering',
    'Automate Recon & OSINT at Scale',
    'Engineer Custom Scanners & Payloads',
    'Automate Web Exploitation & Burp Integration',
    'Script Advanced Binary & Memory Workflows',
    'Build Reliable Exploit Toolchains (Ethical)',
    'Decrypt, Crack & Analyze Cryptographic Flaws',
    'Reverse Engineer Binaries with Precision',
    'Forge Persistence, C2 Concepts & Stealth',
    'Scale Attacks: Parallelism, Async & Performance',
    'Test, Debug & Harden Your Tools',
    'Data Science for Security: ML & Analytics',
    'Reporting Automation & Professional Deliverables',
    'Capstone: Full Campaign — From Recon to Report',
  ],
  prerequisites: [
    'Basic Python',
    'Networking fundamentals',
  ],
  outcomes: [
    'Develop pentest scripts',
    'Automate security workflows',
    'Integrate tools with Python',
  ],
};
