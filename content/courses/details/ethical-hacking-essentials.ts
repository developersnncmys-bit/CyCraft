import type { CourseDetail } from './types';

// Source: EC-Council E|HE brochure (Ethical Hacking Essentials, exam code
// 112-52). Twelve modules with sub-topics, prerequisites, learning
// outcomes, and reference stats summarised here. Each `syllabus` entry
// covers one brochure module — title followed by the sub-topics listed
// under it in the brochure's Course Outline.

export const ethicalHackingEssentialsDetail: CourseDetail = {
  slug: 'ethical-hacking-essentials',
  longDescription:
    'Ethical Hacking Essentials (E|HE) is an entry-level cybersecurity course covering ethical hacking and penetration testing fundamentals — threats and vulnerabilities, password cracking, web application attacks, IoT and OT attacks, cloud security, and pentesting basics. The programme ships 15+ hours of self-paced video lessons across 12 modules, 11 hands-on lab activities, 750+ pages of e-courseware, and a CTF-based Capstone Project run inside a sandboxed live-VM environment. Designed for school students, fresh graduates, career starters and switchers, and IT or technology teams with little to no prior experience — no cybersecurity background or IT work experience required. Successful candidates can sit the proctored 112-52 exam (75 multiple-choice questions, 2 hours) for the globally recognised E|HE credential.',
  syllabus: [
    'Information Security Fundamentals — fundamentals; laws and regulations',
    'Ethical Hacking Fundamentals — Cyber Kill Chain methodology; hacking concepts and hacker classes; hacking-cycle phases; ethical hacking scope and limitations; ethical hacking tools',
    'Information Security Threats and Vulnerability Assessment — threats and threat sources; malware and its types; malware countermeasures; vulnerabilities; vulnerability assessment',
    'Password Cracking Techniques and Countermeasures — cracking techniques; cracking tools; countermeasures',
    'Social Engineering Techniques and Countermeasures — concepts and phases; techniques; insider threats and identity theft; countermeasures',
    'Network-Level Attacks and Countermeasures — packet sniffing; sniffing techniques and countermeasures; DoS / DDoS attacks and countermeasures; session hijacking and countermeasures',
    'Web Application Attacks and Countermeasures — web-server attacks; web application architecture and vulnerability stack; web-app threats; SQL injection; corresponding countermeasures',
    'Wireless Attacks and Countermeasures — wireless terminology and encryption; wireless network-specific attacks; Bluetooth attacks; countermeasures',
    'Mobile Attacks and Countermeasures — mobile attack anatomy; platform attack vectors and vulnerabilities; MDM concepts; countermeasures',
    'IoT and OT Attacks and Countermeasures — IoT concepts, threats, and countermeasures; OT concepts, threats, and countermeasures',
    'Cloud Computing Threats and Countermeasures — cloud computing concepts; container technology; cloud threats; cloud attack countermeasures',
    'Penetration Testing Fundamentals — pentesting fundamentals and benefits; strategies and phases; guidelines and recommendations',
  ],
  prerequisites: [
    'No prior cybersecurity knowledge required',
    'No prior IT work experience required',
  ],
  outcomes: [
    'Key information security issues, laws, and standards',
    'Fundamentals of ethical hacking',
    'Information security threats and vulnerabilities',
    'Different types of malware',
    'Password-cracking techniques and countermeasures',
    'Social engineering techniques, insider threats, identity theft, and countermeasures',
    'Network-level attacks (sniffing, DoS, session hijacking) and countermeasures',
    'Application-level attacks (web-server, web app, SQL injection) and countermeasures',
    'Wireless encryption, threats, and countermeasures',
    'Mobile platform attack vectors, MDM, and security guidelines',
    'IoT and OT concepts, attacks, and countermeasures',
    'Cloud computing technologies, threats, and security techniques',
    'Fundamentals of penetration testing',
  ],
};
