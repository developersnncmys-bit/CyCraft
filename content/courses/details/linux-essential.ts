import type { CourseDetail } from './types';

export const linuxEssentialDetail: CourseDetail = {
  slug: 'linux-essential',
  longDescription:
    'Practical Linux skills: shell, users, permissions and automation with scripts.',
  syllabus: [
    'Linux Foundations — Explore the Power and Philosophy of Open Source',
    'From ISO to Interface — Installing Linux on VMware or VirtualBox',
    'Command Line Mastery — Navigating Terminals and Shells with Confidence',
    'Essential Commands — File Management, Text Processing, and System Insight',
    'File System Architecture — Understanding the Linux Directory Hierarchy',
    'Permission Power — Mastering chmod, chown, and Access Control Lists (ACLs)',
    'Editing Like a Pro — Hands-on with Nano and Vim Text Editors',
    'User Dominion — Creating and Managing Users, Groups, and Password Policies',
    'Process Perfection — Monitoring, Managing, and Controlling System Processes',
    'System Insight — Analysing Logs and Optimizing System Performance',
    'Networking Essentials — Configuring and Troubleshooting Connections',
    'Security Stronghold — Firewalls, SSH Hardening, and Authentication Best Practices',
    'Automation Power — Writing and Executing Shell & Bash Scripts',
    'Package Management — Installing, Updating, and Managing Software Efficiently',
    'Capstone Mastery — Real-World Linux System Administration Project',
  ],
  prerequisites: [
    'None',
  ],
  outcomes: [
    'Operate Linux systems',
    'Automate tasks',
    'Manage services and users',
  ],
};
