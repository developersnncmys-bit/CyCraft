export const researchWingContent = {
  heading: "INDIA'S FIRST UNDERGRAD CYBER RESEARCH WING",
  workstation: {
    heading: 'Your Weapon of Choice',
    description:
      'No dusty labs. No legacy systems. From Day 1, every CyCraft student gets access to a high-performance Linux workstation — the same class of environment used by elite security engineers in the industry.',
    features: [
      'Pre-configured Pentesting Tools',
      'Access to Vulnerable machines & Web apps',
      'High-end Lab systems',
    ],
  },
  hackerHouse: {
    heading: 'The Red Team Hacker House',
    description:
      'A 24/7 residential campus environment. Designed for flow state, deep work, and late-night vulnerability research hackathons. Connect with like-minded peers who live and breathe security.',
  },
  // Fake streaming terminal lines — loops through these
  streamingLines: [
    'nmap -sV -p- 192.168.1.0/24',
    'Starting Nmap 7.94 ( https://nmap.org )',
    'Discovered open port 22/tcp on 192.168.1.14',
    'Discovered open port 80/tcp on 192.168.1.14',
    'msf6 > use exploit/multi/handler',
    'msf6 exploit(handler) > set PAYLOAD linux/x64/shell_reverse_tcp',
    'PAYLOAD => linux/x64/shell_reverse_tcp',
    'msf6 exploit(handler) > run',
    '[*] Started reverse TCP handler on 0.0.0.0:4444',
    '[+] Command shell session 1 opened',
    'whoami && id',
    'root uid=0(root) gid=0(root)',
    'cat /etc/passwd | grep -v nologin',
    'ls -la /var/www/html/',
    'python3 -c "import pty; pty.spawn(\'/bin/bash\')"',
    'root@target:/var/www/html#',
  ] as const,
} as const;
