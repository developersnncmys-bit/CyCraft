import type { CourseDetail } from './types';

// Source: EC-Council T|IE brochure (Threat Intelligence Essentials, exam
// code 112-57). Ten modules with sub-topics, prerequisites, learning
// outcomes, and reference stats summarised here. Each `syllabus` entry
// covers one brochure module — title followed by the topics listed
// under it in the brochure's Course Outline. Labs use DetectionLab,
// SPLUNK Attack Range, AlienVault OTX, MISP, TraceLab, and Anomali
// STAXX environments per the brochure.

export const threatIntelligenceEssentialsDetail: CourseDetail = {
  slug: 'threat-intelligence-essentials',
  longDescription:
    'Threat Intelligence Essentials (T|IE) is an entry-level cybersecurity course covering the foundations of threat intelligence — separating intelligence from data and information, the threat intelligence lifecycle and maturity models, the four intelligence types (strategic, operational, tactical, technical), data collection and OSINT, Threat Intelligence Platforms (TIPs), analysis, threat hunting, sharing and collaboration, and integration into incident response. The programme ships 18+ hours of self-paced video training across 10 modules, 5 hands-on lab exercises run inside a DetectionLab SOC environment plus SPLUNK Attack Range, AlienVault OTX, MISP, TraceLab, and Anomali STAXX, 900+ pages of e-courseware, and a CTF-based Capstone Project in a sandboxed live-VM environment. Designed for school students, fresh graduates, career starters and switchers, IT teams, and cybersecurity administrators / engineers / architects — no prior cybersecurity knowledge or IT work experience required. Prepares learners for progressive roles such as SOC Analyst, Threat Intelligence Analyst, IT Risk Analyst, or Cybersecurity Analyst. Successful candidates can sit the proctored 112-57 exam (75 multiple-choice questions, 2 hours) for the globally recognised T|IE credential.',
  syllabus: [
    'Introduction to Threat Intelligence — terminology; key differences between intelligence, information, and data; importance and integration into cyber operations; lifecycles and maturity models; roles, responsibilities, and use cases; standards and frameworks for measuring effectiveness; setting up SPLUNK Attack Range',
    'Types of Threat Intelligence — strategic, operational, tactical, and technical; use cases for each; generation process; informing regulatory compliance; augmenting vulnerability management; geopolitical and industry-related intelligence; integration with risk management',
    'Cyber Threat Landscape — overview of trends and challenges; emerging threats, threat actors, and attack vectors; Advanced Persistent Threats; the Cyber Kill Chain; vulnerabilities and Indicators of Compromise; geopolitical and economic impacts; emerging technology impact; MITRE ATT&CK and Splunk Attack Range IOC labs',
    'Data Collection and Sources — feeds, sources, and evaluation criteria; collection methods and techniques (OSINT, HUMINT, IoC analysis); bulk data collection considerations; normalising, enriching, and extracting intelligence; legal and ethical considerations',
    'Threat Intelligence Platforms (TIPs) — TIP roles and features; aggregation, analysis, and dissemination; automation and orchestration; evaluation and integration into existing infrastructure; collaboration, sharing, and threat-hunting features; customisation and visualisation; labs on AlienVault OTX and MISP',
    'Threat Intelligence Analysis — data analysis techniques; statistical analysis and Analysis of Competing Hypotheses; identifying threat-actor artifacts; threat prioritisation, profiling, and attribution; predictive and proactive intelligence; reporting and visualisation; threat-actor profile and MISP report-generation labs',
    'Threat Hunting and Detection — operational overview and process dissection; methodologies and frameworks; proactive threat hunting; using threat hunting for detection and response; tool selection and techniques; forming threat-hunting hypotheses; threat-hunting lab in SPLUNK ATT&CK Range',
    'Threat Intelligence Sharing and Collaboration — information-sharing initiatives; sharing platforms; building trust within intelligence communities; cross-industry and cross-sector sharing; building private and public sharing channels; legal and privacy implications; sharing via MISP and Anomali STAXX',
    'Threat Intelligence in Incident Response — integration into IR processes; role in prevention via workflows and playbooks; intelligence-driven triage and forensic analysis; adapting IR plans with new intelligence; coordinating with external partners; intelligence-driven handling and recovery; post-incident analysis and lessons learned; measurement and continuous improvement',
    'Future Trends and Continuous Learning — emerging threat-intelligence approaches; convergence of threat intelligence and risk management; continuous learning approaches; adapting professional skillsets; future challenges; community engagement; role in national security and defense; influence on future cybersecurity regulations',
  ],
  prerequisites: [
    'No prior cybersecurity knowledge required',
    'No prior IT work experience required',
  ],
  outcomes: [
    'Essential threat-intelligence terminology and maturity models',
    'Evaluating strategic, operational, tactical, and technical intelligence types',
    'The cyber threat landscape — trends, threat actors, and ongoing challenges',
    'Data collection methods and credible threat-intelligence sources',
    'Working with Threat Intelligence Platforms (TIPs)',
    'Threat-intelligence analysis and threat-actor profiling',
    'Threat hunting and proactive detection',
    'Threat-intelligence sharing and collaboration',
    'Integrating threat intelligence into incident response',
    'Future trends and continuous-learning approaches',
  ],
};
