import type { CourseDetail } from './types';

// Source: EC-Council S|CE web page screenshots (SOC Essentials course page,
// eccouncil.org/train-certify/soc-essentials-course-sce/). Eight modules
// surfaced as accordion titles only — sub-topic detail not visible in the
// collapsed screenshots, so syllabus entries are intentionally shallower
// than the brochure-sourced courses in this series. Exam code is not shown
// on the public page captures and is omitted rather than guessed.

export const socEssentialsDetail: CourseDetail = {
  slug: 'soc-essentials',
  longDescription:
    'SOC Essentials (S|CE) is an entry-level cybersecurity course covering the foundations of security operations — computer network and security fundamentals, the cyber threat landscape, SOC roles and architecture, log management, incident detection and analysis, threat intelligence and hunting, and incident response. The programme ships 10+ hours of premium self-paced video training across 8 modules, 6 hands-on lab practical exercises, 900+ pages of e-courseware, and a CTF-based Capstone Project run in a sandboxed live-VM environment. Includes one year of courseware access, six months of lab access, and a proctored exam voucher valid for one year. Designed for high-school and college students, career starters and switchers, IT teams, SOC analysts, and security engineers — no prior cybersecurity knowledge or IT work experience required. Graduates leave able to identify cyber threats, understand SOC components, perform centralised log management, triage and analyse security incidents, and execute the incident-response lifecycle.',
  syllabus: [
    'Computer Network and Security Fundamentals',
    'Fundamentals of Cyber Threats',
    'Introduction to Security Operations Center',
    'SOC Components and Architecture',
    'Introduction to Log Management',
    'Incident Detection and Analysis',
    'Threat Intelligence and Hunting',
    'Incident Response and Handling',
  ],
  prerequisites: [
    'No prior cybersecurity knowledge required',
    'No prior IT work experience required',
  ],
  outcomes: [
    'Computer network fundamentals and security controls',
    'Cyber threat concepts — actors, vulnerabilities, and attack types',
    'SOC fundamentals, roles, and operational metrics',
    'SOC components and architecture',
    'SIEM architecture and deployment models',
    'Log management fundamentals',
    'Centralised log management practices',
    'Dashboards, reporting, and incident escalation',
    'Threat-intelligence sources, types, and lifecycle',
    'The incident-response lifecycle',
  ],
};
