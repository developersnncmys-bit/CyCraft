import type { CourseDetail } from './types';

export const apiSecurityDetail: CourseDetail = {
  slug: 'api-security',
  longDescription:
    'API-specific pentesting: auth flows, input validation, and automation for repeatable tests.',
  syllabus: [
    'Master the Fundamentals of API Security & Ethical Testing',
    'Understand the Architecture & Authentication Models of APIs — REST, SOAP, GraphQL, OAuth, JWT',
    'Identify and Exploit Common API Vulnerabilities — Injection, Auth Flaws, Info Disclosure, DoS',
    'Plan and Scope Penetration Tests with Precision — Define Legal and Technical Boundaries',
    'Conduct Reconnaissance — API Discovery, Fingerprinting & Framework Identification',
    'Perform Authentication and Authorization Testing — Token Manipulation & Privilege Escalation',
    'Uncover Input Validation Weaknesses — SQLi, XSS & Parameter Tampering',
    'Leverage Professional Tools — Burp Suite, OWASP ZAP, Insomnia for API Testing',
    'Apply Advanced Security Testing Techniques — Fuzzing, Error Analysis & Payload Manipulation',
    'Exploit Vulnerabilities & Execute Post-Exploitation — IDOR, Session Fixation, Data Exfiltration',
    'Document Findings in Professional Reports & Communicate with Stakeholders',
    'Implement Effective Remediation Strategies — Patch, Harden & Secure APIs',
    'Engage in Real-World API Breach Case Studies — Analyze and Learn from Failures',
    'Perform Hands-On Labs — Build, Attack & Secure API Test Environments',
    'Adhere to Global Standards — OWASP API Top 10, GDPR, PCI-DSS Compliance',
    'Adopt Industry Best Practices — Secure Development & Continuous Monitoring',
  ],
  prerequisites: [
    'Web pentesting basics',
    'HTTP/JSON knowledge',
  ],
  outcomes: [
    'Assess API security',
    'Exploit and mitigate API flaws',
    'Automate API assessments',
  ],
};
