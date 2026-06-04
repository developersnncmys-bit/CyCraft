import type { CourseDetail } from './types';

export const ethicalCyberSecurityDetail: CourseDetail = {
  slug: 'ethical-cyber-security',
  longDescription:
    'Ethical cybersecurity safeguards sensitive data, ensures integrity and confidentiality, enables regulatory compliance, builds client trust, prevents financial loss, and proactively enhances security posture by identifying vulnerabilities before malicious exploitation.',
  syllabus: [
    'Master Cybersecurity Fundamentals',
    'Ethics, Legalities & Responsible Disclosure',
    'Frameworks, Standards & Compliance (NIST / ISO / GDPR / PCI)',
    'Network Architecture & Defense (Firewalls / IDS / VPNs)',
    'Linux for Security Professionals (Commands, Hardening)',
    'Penetration Testing Methodologies (Recon → Report)',
    'Vulnerability Discovery & Patch Management',
    'Web Application Security & OWASP Top 10',
    'Applied Cryptography & Secure Communications (SSL/TLS)',
    'Incident Response, Forensics & Recovery',
    'Ethical Hacking Toolchain (Nmap, Metasploit, Burp, Wireshark)',
    'Human Attack Surface: Social Engineering & Phishing',
    'Vulnerability Management & Risk Prioritization',
    'Hands-On Case Studies & Simulated Breaches',
    'Reporting, Remediation Playbooks & Capstone Presentation',
  ],
  prerequisites: [
    'Basic ethical hacking knowledge',
    'Linux familiarity',
    'Networking fundamentals',
  ],
  outcomes: [
    'Perform advanced pentests',
    'Develop custom exploits',
    'Lead red team simulations',
  ],
};
