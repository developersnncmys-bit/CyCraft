import type { CourseDetail } from './types';

export const devopsFlowAutomateDeliverDetail: CourseDetail = {
  slug: 'devops-flow-automate-deliver',
  longDescription:
    'CI/CD pipelines, infrastructure as code, and observability for modern delivery teams.',
  syllabus: [
    'DevOps Demystified — Culture, Mindset & The Software Delivery Revolution',
    'Version Mastery — Git, GitHub & Collaborative Workflow Excellence',
    'Build Smart — Continuous Integration with Jenkins, GitHub Actions & GitLab CI',
    'Ship Fast — Continuous Delivery & Deployment Pipelines in Action',
    'Container Power — Docker Fundamentals, Images & Container Orchestration',
    'Kubernetes Unleashed — Pods, Services, Deployments & Cluster Management',
    'Infrastructure as Code — Terraform, Ansible & Automated Provisioning',
    'Configuration Mastery — Chef, Puppet & Scalable Server Management',
    'Cloud Native Delivery — AWS, Azure & GCP DevOps Toolchains',
    'Observe Everything — Monitoring, Logging & Alerting with Prometheus & Grafana',
    'Secure the Pipeline — DevSecOps, Secrets Management & Vulnerability Scanning',
    'Scale with Confidence — Auto-Scaling, Load Balancing & High Availability',
    'GitOps Revolution — ArgoCD, Flux & Declarative Delivery Workflows',
    'Site Reliability — SRE Principles, SLOs, SLIs & Incident Response',
    'Capstone Delivery — End-to-End DevOps Pipeline from Code to Production',
  ],
  prerequisites: [
    'Linux basics',
    'Networking fundamentals',
  ],
  outcomes: [
    'Build CI/CD pipelines',
    'Automate infrastructure provisioning',
    'Operate production-grade delivery workflows',
  ],
};
