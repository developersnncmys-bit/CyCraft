import type { CourseDetail } from './types';

// Source: EC-Council I|SE brochure (IoT Security Essentials, exam code
// 112-58). Eleven modules with sub-topics, prerequisites, learning
// outcomes, and reference stats summarised here. Each `syllabus` entry
// covers one brochure module — title followed by the topics described
// in the brochure's Course Outline.

export const iotSecurityEssentialsDetail: CourseDetail = {
  slug: 'iot-security-essentials',
  longDescription:
    'IoT Security Essentials (I|SE) is an entry-level cybersecurity course covering the essentials of securing Internet of Things systems — from IoT fundamentals and communication protocols through to cloud integration, threat intelligence, incident response, and security engineering principles. The programme ships 8+ hours of self-paced video training across 11 modules, 5 hands-on lab exercises, 900+ pages of e-courseware, and a CTF-based Capstone Project in a sandboxed live-VM environment. Designed for school students, fresh graduates, career starters and switchers, and IT or technology teams with little to no prior experience — no cybersecurity background or IT work experience required. Successful candidates can sit the proctored 112-58 exam (75 multiple-choice questions, 2 hours) for the globally recognised I|SE credential. Graduates can identify, assess, and mitigate security risks across IoT environments while protecting the integrity, confidentiality, and availability of IoT systems and data.',
  syllabus: [
    'IoT Fundamentals — basics of IoT and the different sectors where IoT is established',
    'IoT Networking and Communication — networking basics; the OSI model and TCP model; IEEE IoT standards list',
    'IoT Processors and Operating Systems — hardware devices, processors, and operating systems used in IoT',
    'Cloud and IoT — cloud computing fundamentals, characteristics, and types of cloud services',
    'IoT Advanced Topics — web communications; mobile applications; native applications',
    'IoT Threats — common IoT attacks including Mirai, BrickerBot, Sybil, and Blackhole attacks',
    'Basic Security — the CIA triangle; Wired Equivalent Privacy (WEP); Wi-Fi Protected Access (WPA); IoT security measures',
    'Cloud Security — state of cloud security; cloud vulnerabilities; NSA guidance; secure cloud computing',
    'Threat Intelligence — National Vulnerability Database; US-CERT; Shodan; STRIDE; DREAD; PASTA; CVSS',
    'IoT Incident Response — incident response standards, processes, procedures, tools, and indicators of compromise',
    'IoT Security Engineering — the 12 practices of the Microsoft Secure Development Lifecycle; threat modeling',
  ],
  prerequisites: [
    'No prior cybersecurity knowledge required',
    'No prior IT work experience required',
  ],
  outcomes: [
    'Emergence of the Internet of Things (IoT)',
    'Devices and components that power smart-home environments',
    'IoT communication models',
    'IoT networking and communication protocols',
    'Cloud computing and its role in IoT deployments',
    'Different types of threats to IoT systems',
    'Incident response procedures for IoT environments',
    'Secure design and threat modeling for IoT solutions',
  ],
};
