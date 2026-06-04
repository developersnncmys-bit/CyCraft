import type { CourseDetail } from './types';

export const wirelessSecurityMasterAirwavesDetail: CourseDetail = {
  slug: 'wireless-security-master-airwaves',
  longDescription:
    'Wireless assessment: protocol flaws, cracking, rogue APs and detection strategies.',
  syllabus: [
    'Wireless Mastery — Foundations, Ethics & Legal Frameworks',
    'RF Intelligence — Radio Fundamentals & Modulation Deep-Dive',
    'Standards Unlocked — Wi-Fi (802.11), Bluetooth, Zigbee, NFC & Cellular',
    'Architectures & Topologies — ESS, BSS, Infrastructure & Ad-hoc Design',
    'Threat Radar — Rogue APs, Evil Twin, Jamming & Protocol Flaws',
    'Protocol Forensics — WEP, WPA/WPA2, WPA3 & Authentication Internals',
    'Recon Precision — Passive OSINT, Spectrum Surveys & Device Fingerprinting',
    'Stealth Scanning — Advanced Passive/Active Discovery & Mapping',
    'Handshake Capture & Cracking — Practical WPA/WPA2/SAE Workflows',
    'Advanced RF Attacks — Deauth, Packet Injection, Frame Forgery & MitM',
    'Enterprise Evasion — Bypassing Firewalls, 802.1X & Enterprise Auth',
    'Hardware Arsenal — Adapters, Antennas, SDRs & Lab Buildouts',
    'Toolbox Mastery — Aircrack-ng, Kismet, Bettercap, Eaphammer & More',
    'Post-Exploitation — Persistence, Pivoting & Covert Data Exfiltration',
    'Reports & Defense — Executive Reporting, Remediation Playbooks & Red/Blue Labs',
  ],
  prerequisites: [
    'Networking fundamentals',
    'Linux command-line',
  ],
  outcomes: [
    'Audit Wi-Fi setups',
    'Exploit configuration issues',
    'Implement wireless defenses',
  ],
};
