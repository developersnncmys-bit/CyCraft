import type { CourseDetail } from './types';

// Source: EC-Council D|SE brochure (DevSecOps Essentials, exam code
// 112-55). Ten modules with sub-topics, prerequisites, learning
// outcomes, and reference stats summarised here. Each `syllabus` entry
// covers one brochure module — title followed by the sub-topics listed
// under it in the brochure's Course Outline.

export const devSecOpsEssentialsDetail: CourseDetail = {
  slug: 'devsecops-essentials',
  longDescription:
    'DevSecOps Essentials (D|SE) is an entry-level cybersecurity course covering the foundations of secure application development — identifying application development risk and securing, testing, and monitoring applications across on-premises, public cloud, and hybrid infrastructures. The programme walks through application development concepts, application security fundamentals, DevOps and DevSecOps principles, the DevSecOps toolchain, CI/CD pipelines, and implementing security and monitoring across the SDLC. It ships 7+ hours of self-paced video training across 10 modules, 7 hands-on lab exercises, 900+ pages of e-courseware, and a Capstone Project with real-world challenges. Designed for school students, fresh graduates, career starters and switchers, application developers, risk and project managers, administrators, engineers, and architects — no prior cybersecurity knowledge or IT work experience required. Successful candidates can sit the proctored 112-55 exam (75 multiple-choice questions, 2 hours) for the globally recognised D|SE credential.',
  syllabus: [
    'Application Development Concepts — history and evolution of application development; application architectures; the development lifecycle; testing and quality assurance; monitoring, maintenance, and support',
    'Application Security Fundamentals — secure application development principles; common risks and threats; OWASP Top 10; application security techniques; secure design and threat modeling; secure coding and code review; SAST and DAST testing; secure configurations; risk management and project management in secure development',
    'Introduction to DevOps — DevOps principles; DevOps pipelines; DevOps and project management',
    'Introduction to DevSecOps — understanding DevSecOps; DevOps vs DevSecOps; principles and culture; shift-left security; DevSecOps pipelines; pillars; benefits and challenges',
    'DevSecOps Management Tools — project management tools; IDE tools; source-code management tools; build tools; continuous testing tools',
    'DevSecOps Code and CI/CD Tools — continuous integration tools; Infrastructure-as-Code tools; configuration management tools; continuous monitoring tools',
    'DevSecOps Pipelines — role of DevSecOps in the CI/CD pipeline; DevSecOps tools and ecosystem; embracing the DevSecOps lifecycle; key elements of the pipeline; integrating security into the DevOps pipeline',
    'DevSecOps CI/CD Testing and Assessments — implementing security and controls into the CI/CD pipeline; continuous security with Security-as-Code; continuous application testing for pipeline security; application assessments and penetration testing',
    'Implementing DevSecOps Testing and Threat Modeling — integrating security threat modeling in the Plan stage; secure coding in the Code stage; SAST / DAST / IAST in the Build and Test stage; RASP and VAPT in the Release and Deploy stage',
    'Implementing DevSecOps Monitoring Feedback — Infrastructure-as-Code; configuration orchestration; security in the Operate and Monitor stage; Compliance-as-Code; logging, monitoring, and alerting; continuous feedback loop',
  ],
  prerequisites: [
    'No prior cybersecurity knowledge required',
    'No prior IT work experience required',
  ],
  outcomes: [
    'Fundamentals of application development',
    'Application security knowledge — risks, threats, OWASP Top 10, secure coding',
    'Understanding of DevOps and DevSecOps principles and culture',
    'The DevSecOps toolchain — management, code, CI/CD, and monitoring tools',
    'DevSecOps and CI/CD pipeline integration',
    'Implementing security testing, threat modeling, and monitoring across the SDLC',
  ],
};
