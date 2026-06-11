import type { CourseDetail } from './types';

// Source: EC-Council D|FE brochure (Digital Forensics Essentials, exam
// code 112-53). Twelve modules with sub-topics, prerequisites, learning
// outcomes, and reference stats summarised here. Each `syllabus` entry
// covers one brochure module — title followed by the sub-topics listed
// under it in the brochure's Course Outline.

export const digitalForensicsEssentialsDetail: CourseDetail = {
  slug: 'digital-forensics-essentials',
  longDescription:
    'Digital Forensics Essentials (D|FE) is an entry-level cybersecurity course covering the fundamentals of computer forensics and the forensic investigation process — hard disks and file systems, data acquisition, anti-forensics, Windows / Linux / Mac forensics, network forensics, web-attack investigation, dark-web forensics, email-crime investigation, and malware forensics. The programme ships 11+ hours of self-paced video training across 12 modules, 11 hands-on lab activities, 750+ pages of e-courseware, and a CTF-based Capstone Project run inside a sandboxed live-VM environment. Designed for school students, fresh graduates, career starters and switchers, and IT or technology teams with little to no prior experience — no cybersecurity background or IT work experience required. Successful candidates can sit the proctored 112-53 exam (75 multiple-choice questions, 2 hours) for the globally recognised D|FE credential.',
  syllabus: [
    'Computer Forensics Fundamentals — fundamentals of computer forensics; digital evidence; forensic readiness; roles and responsibilities of a forensic investigator; legal compliance',
    'Computer Forensics Investigation Process — investigation process and its importance; pre-investigation, investigation, and post-investigation phases',
    'Understanding Hard Disks and File Systems — disk drive types and characteristics; logical structure of a disk; booting process for Windows / Linux / Mac; file systems for Windows / Linux / Mac; file system examination',
    'Data Acquisition and Duplication — fundamentals; types of acquisition; acquisition formats; acquisition methodology',
    'Defeating Anti-forensics Techniques — anti-forensics techniques; countermeasures',
    'Windows Forensics — volatile and non-volatile information; memory and registry analysis; browser cache, cookies, and history; Windows files and metadata',
    'Linux and Mac Forensics — volatile and non-volatile data in Linux; filesystem image analysis with The Sleuth Kit; memory forensics; Mac forensics',
    'Network Forensics — fundamentals; event correlation concepts and types; identifying Indicators of Compromise from network logs; investigating network traffic',
    'Investigating Web Attacks — web application forensics; IIS and Apache web-server logs; investigating web attacks on Windows servers; detecting and investigating web-application attacks',
    'Dark Web Forensics — dark web concepts; dark web forensics; Tor browser forensics',
    'Investigating Email Crimes — email basics; email crime investigation steps',
    'Malware Forensics — malware components and distribution methods; forensics fundamentals and malware-analysis types; static and dynamic analysis; analysing suspicious Word documents; system and network behaviour analysis',
  ],
  prerequisites: [
    'No prior cybersecurity knowledge required',
    'No prior IT work experience required',
  ],
  outcomes: [
    'Key issues affecting computer forensics',
    'Different types of digital evidence',
    'Computer forensic investigation process and its phases',
    'Different types of disk drives and file systems',
    'Data acquisition methods and methodology',
    'Anti-forensics techniques and countermeasures',
    'Volatile and non-volatile information gathering from Windows, Linux, and Mac systems',
    'Network forensics fundamentals, event correlation, and traffic investigation',
    'Web-server log analysis and web-application forensics',
    'Dark-web forensics',
    'Email-crime investigation',
    'Malware forensics fundamentals and different types of malware analysis',
  ],
};
