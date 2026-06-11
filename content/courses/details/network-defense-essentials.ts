import type { CourseDetail } from './types';

// Source: EC-Council N|DE brochure (Network Defense Essentials, exam code
// 112-51). Twelve modules with sub-topics, prerequisites, learning
// outcomes, and reference stats summarised here. Each `syllabus` entry
// covers one brochure module — title followed by the sub-topics listed
// under it in the brochure's Course Outline.

export const networkDefenseEssentialsDetail: CourseDetail = {
  slug: 'network-defense-essentials',
  longDescription:
    'Network Defense Essentials (N|DE) is an introductory cybersecurity course covering the fundamental concepts of information security and network defense — identification, authentication and authorization, virtualization and cloud computing, wireless networks, mobile and IoT devices, cryptography and PKI, data security, and network traffic monitoring. The programme ships 14+ hours of self-paced video training across 12 modules, 11 hands-on lab activities, 750+ pages of e-courseware, and a CTF-based Capstone Project run inside a sandboxed live-VM environment. Designed for school students, fresh graduates, career starters and switchers, and IT or technology teams with little to no prior experience — no prior knowledge required. Successful candidates can sit the proctored 112-51 exam (75 multiple-choice questions, 2 hours) for the globally recognised N|DE credential.',
  syllabus: [
    'Network Security Fundamentals — fundamentals of network security; network security protocols',
    'Identification, Authentication and Authorization — access control principles, terminologies, and models; Identity and Access Management (IAM) concepts',
    'Network Security Controls — Administrative Controls — regulatory frameworks, laws, and acts; designing and developing security policies; security and awareness training',
    'Network Security Controls — Physical Controls — importance of physical security; physical security controls; workplace security; environmental controls',
    'Network Security Controls — Technical Controls — network segmentation; firewalls; IDS / IPS; honeypots; proxy servers; VPN fundamentals; SIEM; User Behavior Analytics (UBA); antivirus / anti-malware',
    'Virtualization and Cloud Computing — virtualization essential concepts and OS; virtualization security; cloud computing fundamentals; cloud security best practices',
    'Wireless Network Security — wireless network fundamentals; encryption mechanisms; authentication methods; implementing wireless security measures',
    'Mobile Device Security — connection methods; Mobile Device Management (MDM) concepts; enterprise mobile usage policies and risks; enterprise mobile security solutions; mobile platform best practices',
    'IoT Device Security — IoT devices, application areas, and communication models; security in IoT-enabled environments',
    'Cryptography and PKI — cryptographic techniques; cryptographic algorithms; cryptography tools; Public Key Infrastructure',
    'Data Security — data security and its importance; data encryption controls; data backup and retention; Data Loss Prevention concepts',
    'Network Traffic Monitoring — need and advantages of monitoring; baseline traffic signatures for normal and suspicious traffic; monitoring for suspicious traffic',
  ],
  prerequisites: [
    'No prior cybersecurity knowledge required',
    'No prior IT work experience required',
  ],
  outcomes: [
    'Key issues affecting network security',
    'Essential network security protocols',
    'Identification, authentication, and authorization concepts',
    'Administrative controls — frameworks, laws, acts, and security policies',
    'Physical controls — workplace and environmental security',
    'Technical controls — segmentation, firewalls, IDS / IPS, honeypots, proxies, VPN, SIEM, UBA, anti-malware',
    'Fundamentals of virtualization, cloud computing, and cloud security',
    'Wireless network fundamentals, encryption, and security measures',
    'Fundamentals of mobile and IoT device security',
    'Cryptography and PKI concepts',
    'Data security, encryption, backup, and Data Loss Prevention techniques',
    'Network traffic monitoring for suspicious traffic',
  ],
};
