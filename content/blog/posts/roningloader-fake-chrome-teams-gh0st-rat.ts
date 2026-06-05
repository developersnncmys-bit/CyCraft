import type { BlogPostDetail } from './types';

export const roningloaderDragonBreathDetail: BlogPostDetail = {
  slug: 'roningloader-fake-chrome-teams-gh0st-rat',
  deck:
    'Dragon Breath is bundling RONINGLOADER inside trojanized Chrome and Teams installers, killing security tools with legitimately-signed drivers before dropping a modified Gh0st RAT.',
  body: [
    {
      type: 'heading',
      level: 2,
      text: 'Fake Chrome and Teams Apps Drop New RONINGLOADER Malware',
    },
    {
      type: 'paragraph',
      text:
        'Security researchers have uncovered a new malware chain where attackers use fake Google Chrome and Microsoft Teams installers to infect Windows systems. The loaders, bundled inside trojanized NSIS installers, deploy a tool named RONINGLOADER, which then delivers a modified version of Gh0st RAT for full remote control of the victim machine.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'How the Infection Starts',
    },
    {
      type: 'paragraph',
      text:
        'The campaign is linked to the threat group Dragon Breath (also known as APT-Q-27 / Golden Eye) and mainly targets Chinese-speaking users.',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Victims are lured to download what looks like legitimate installers for Chrome, Teams and other popular apps.',
        'These are actually trojanized NSIS installers that contain both a real app installer and a hidden malicious one.',
        'The benign part installs the expected software, while the hidden installer quietly starts the RONINGLOADER infection chain in the background.',
      ],
    },
    {
      type: 'paragraph',
      text:
        "This “good app + bad loader” trick helps attackers earn the user’s trust while still gaining a foothold on the system.",
    },

    {
      type: 'heading',
      level: 2,
      text: 'How RONINGLOADER Disables Security',
    },
    {
      type: 'paragraph',
      text:
        'Once active, RONINGLOADER goes after security tools before it drops the final payload. According to researchers, it uses several advanced tricks to weaken the host:',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Scans for antivirus products popular in its target region, including Microsoft Defender and Chinese security suites.',
        'Loads legitimately signed Windows drivers as temporary services and uses them to kill or block those security processes.',
        'Abuses Protected Process Light (PPL) and Windows Error Reporting to interfere with Defender and apply custom WDAC policies that block other vendors.',
      ],
    },
    {
      type: 'paragraph',
      text:
        'By leaning on real signed drivers and Windows features, RONINGLOADER makes its behavior look normal to many basic security products.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'Living Inside regsvr32.exe',
    },
    {
      type: 'paragraph',
      text:
        'After clearing the way, RONINGLOADER loads its next stages in memory and injects a malicious DLL into regsvr32.exe, a trusted Windows binary.',
    },
    {
      type: 'paragraph',
      text:
        'From there, it can launch additional code in high-privilege processes like TrustedInstaller.exe or other service executables. This makes the activity blend with normal system operations and helps the malware avoid both user suspicion and simple process-based monitoring.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'Final Payload: Modified Gh0st RAT',
    },
    {
      type: 'paragraph',
      text:
        'The last stage is a tailored build of Gh0st RAT, a long-running remote access trojan family now adapted for this campaign.',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Runs commands and tools on the victim machine.',
        'Captures keystrokes, clipboard data and active window titles.',
        'Downloads and executes additional payloads from attacker servers.',
        'Clears event logs and alters registry keys to hide traces.',
        'Injects into system processes like svchost.exe for long-term persistence.',
      ],
    },
    {
      type: 'paragraph',
      text:
        'In short, once Gh0st RAT is in place, the attacker can treat the victim system like a remote desktop under their control.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'What Regular Users Should Do',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Download apps only from official sources — Chrome, Teams and other software should come from their official websites or trusted app stores, not random download sites or ads.',
        "Be suspicious of “patched”, “fast” or “free” installers for well-known tools, especially if the site domain looks unusual.",
        'Keep Windows and security tools updated so that known loader and driver abuse techniques are blocked faster.',
        'Watch for unusual CPU/network activity after installing new software — fans spinning hard or constant outbound traffic can be early warning signs.',
      ],
    },

    {
      type: 'callout',
      tone: 'beam',
      title: 'Defender & SOC Takeaways',
      text:
        'RONINGLOADER shows how far modern loaders go to neutralize security first and only then drop their main payload. Monitoring for signed driver abuse, unusual regsvr32.exe activity, WDAC policy changes and rapid AV process kills is now just as important as watching for classic malware binaries.',
    },
  ],
  tags: [
    'RONINGLOADER',
    'Gh0st RAT',
    'Dragon Breath',
    'Malware',
    'Windows Security',
    'Threat Intel',
  ],
};
