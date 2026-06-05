import type { BlogPostDetail } from './types';

export const landfallTrustedDevicesDetail: BlogPostDetail = {
  slug: 'landfall-spyware-trusted-devices-system-wide-threat',
  deck:
    'A second LANDFALL campaign quietly drilled into Samsung Galaxy S22/S23/S24 and Z-series phones for months — disguised DNG images exploited CVE-2025-21042 to install keyloggers, mic taps and full data exfiltration with zero user interaction.',
  body: [
    {
      type: 'heading',
      level: 2,
      text: 'LANDFALL Spyware Penetrates Samsung Galaxy Phones',
    },
    {
      type: 'paragraph',
      text:
        "Security researchers discovered a sophisticated campaign targeting Samsung Galaxy devices via a zero-day vulnerability in the manufacturer’s image-processing library. The spyware — dubbed LANDFALL — exploited this flaw to silently infiltrate phones, deploy keylogging, audio recording and full data exfiltration modules.",
    },

    {
      type: 'heading',
      level: 2,
      text: 'How the Attack Worked',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Malicious DNG image files: Crafted DNG files (disguised as JPEGs) were delivered via messaging apps and exploited CVE-2025-21042.',
        'Silent execution: Opening the media triggered the image library exploit, executing payloads and installing spyware with no user interaction.',
        'Wide device coverage: Impacted devices include Galaxy S22, S23, S24 and Z-series models across targeted regions.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'Why This Is Dangerous',
    },
    {
      type: 'paragraph',
      text:
        'Devices are trusted platforms; when a low-level image-processing component is compromised, attackers gain a stealthy, persistent foothold. LANDFALL enabled continuous surveillance — capturing credentials, sensor feeds, location, microphone and more.',
    },
    {
      type: 'paragraph',
      text:
        'The campaign ran silently for months (mid-2024 to early-2025) before being publicly exposed.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'What You Can Do',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Install the latest Samsung software update immediately.',
        'Avoid opening unexpected image files or APKs received through messaging apps.',
        'Enable encryption + strong screen lock (PIN/biometric).',
        'Use mobile threat protection if available.',
        'Review app permissions (camera, mic, storage, location).',
      ],
    },

    {
      type: 'callout',
      tone: 'beam',
      title: 'Final Thoughts',
      text:
        'Modern smartphones are full computing platforms — every subsystem (even image libraries) must be treated as an attack surface. Stay updated, stay cautious, and never trust unsolicited media.',
    },
  ],
  tags: [
    'Samsung',
    'LANDFALL',
    'Spyware',
    'Android Security',
    'Zero-Day',
    'Mobile Threat',
  ],
};
