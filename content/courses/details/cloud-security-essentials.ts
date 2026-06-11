import type { CourseDetail } from './types';

// Source: EC-Council C|SE brochure (Cloud Security Essentials, exam code
// 112-54). Eight modules with sub-topics, prerequisites, learning
// outcomes, and reference stats summarised here. Each `syllabus` entry
// covers one brochure module — title followed by the sub-topics listed
// under it in the brochure's Course Outline. Labs per module reference
// AWS / Azure / M365 setup tasks but live outside the current schema.

export const cloudSecurityEssentialsDetail: CourseDetail = {
  slug: 'cloud-security-essentials',
  longDescription:
    'Cloud Security Essentials (C|SE) is an entry-level cybersecurity course covering the foundational and essential aspects of cloud security — cloud computing principles, identity and access management, data protection and encryption, network security, application security, monitoring and incident response, risk assessment, and compliance and governance across AWS and Azure environments. The programme ships 10+ hours of self-paced video training across 8 modules, hands-on lab practical exercises in every module (24+ AWS / Azure / M365 lab tasks total), 900+ pages of e-courseware, and a Capstone Project with real-world challenges. Designed for school students, fresh graduates, career starters and switchers, IT and cybersecurity teams, system / cloud administrators, and engineers — no prior cybersecurity knowledge or IT work experience required. Successful candidates can sit the proctored 112-54 exam (75 multiple-choice questions, 2 hours) for the globally recognised C|SE credential.',
  syllabus: [
    'Cloud Computing and Security Fundamentals — cloud computing types and service models; security challenges and shared responsibility; evaluating cloud service providers; security benefits; threats and attacks in cloud environments; design principles and architecture',
    'Identity and Access Management (IAM) in the Cloud — IAM fundamentals; principals and roles; Role-Based Access Control (RBAC); identity federation; SSO and Self-Service Password Reset; Multifactor Authentication (MFA); principle of least privilege; auditing and monitoring',
    'Data Protection and Encryption in the Cloud — data classification and lifecycle; encryption at rest and in transit; customer- vs provider-managed keys; Data Loss Prevention (DLP); backup and disaster recovery strategies',
    'Network Security in Cloud — cloud network fundamentals; Virtual Private Clouds (VPC); network isolation and segmentation; NACLs and Network Security Groups (NSG); remote access; firewalls and intrusion detection',
    'Application Security in Cloud — Secure SDLC in the cloud; Web Application Firewall (WAF); OWASP Top Ten; security-by-design principles; secure coding; API security and integration best practices; serverless security; container security (Docker, Kubernetes)',
    'Cloud Security Monitoring and Incident Response — cloud logging; security monitoring; SIEM and SOAR; cloud-native monitoring solutions; continuous monitoring; incident response and investigation',
    'Cloud Security Risk Assessment and Management — risk management frameworks and assessment strategies; risk analysis techniques; auditing and monitoring cloud resources; cloud security assessments and penetration testing',
    'Cloud Compliance and Governance — regulatory and industry compliance; cloud security standards; security governance and risk management within cloud and hybrid architectures',
  ],
  prerequisites: [
    'No prior cybersecurity knowledge required',
    'No prior IT work experience required',
  ],
  outcomes: [
    'Fundamentals of cloud computing and security',
    'Identity and access management in the cloud',
    'Data protection and encryption in the cloud',
    'Network security in cloud environments',
    'Application security in cloud environments',
    'Cloud security monitoring and incident response',
    'Cloud security risk assessment and management',
    'Cloud compliance and governance basics',
  ],
};
