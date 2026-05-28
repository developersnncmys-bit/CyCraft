export const projectsContent = {
  heading: 'PROJECT-FIRST CURRICULUM',
  description: 'Build real systems. We focus on production portfolios from Year 1.',
  projects: [
    {
      id: 'ransomware-sandbox',
      title: 'Custom Ransomware Sandbox',
      description:
        'Use C++ and low-level APIs to build a benign encryption tool, then create an isolated sandbox to monitor and reverse-engineer it.',
      language: 'C++',
      code: `#include <windows.h>
#include <wincrypt.h>

BOOL EncryptFile(LPCSTR path) {
  HANDLE hFile = CreateFileA(
    path, GENERIC_READ | GENERIC_WRITE,
    0, NULL, OPEN_EXISTING, 0, NULL
  );
  // AES-256 encryption logic
  HCRYPTPROV hProv;
  CryptAcquireContext(&hProv, NULL,
    MS_ENH_RSA_AES_PROV, PROV_RSA_AES, 0);
  // Sandbox intercepts here ↓
  return EncryptFileA(path);
}`,
    },
    {
      id: 'vuln-crawler',
      title: 'Vulnerability Crawler',
      description:
        'Build an automated Python utility that crawls domains, identifies OWASP Top 10 vulnerabilities, and generates PDF audit reports.',
      language: 'Python',
      code: `import requests
from bs4 import BeautifulSoup

class VulnCrawler:
    OWASP_CHECKS = [
        "sql_injection",
        "xss_reflected",
        "insecure_headers",
        "open_redirect",
    ]

    def scan(self, url: str) -> dict:
        resp = requests.get(url, timeout=10)
        findings = {}
        for check in self.OWASP_CHECKS:
            handler = getattr(self, f"_check_{check}")
            findings[check] = handler(resp)
        return findings`,
    },
    {
      id: 'zero-trust',
      title: 'Zero Trust Network',
      description:
        'Architect a software-defined perimeter using Linux Namespaces and iptables to enforce strict identity-based access control.',
      language: 'Bash',
      code: `#!/bin/bash
# Zero Trust perimeter — identity-based ACL

create_namespace() {
  local ns=$1 veth_host=$2 veth_ns=$3
  ip netns add "$ns"
  ip link add "$veth_host" type veth peer name "$veth_ns"
  ip link set "$veth_ns" netns "$ns"
}

apply_policy() {
  # Default deny — explicit allow only
  iptables -P INPUT DROP
  iptables -P FORWARD DROP
  iptables -A INPUT -m conntrack \\
    --ctstate ESTABLISHED,RELATED -j ACCEPT
}`,
    },
  ],
} as const;
