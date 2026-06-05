import type { BlogPostDetail } from './types';

export const landfallSamsungZeroDayDetail: BlogPostDetail = {
  slug: 'landfall-spyware-samsung-galaxy-zero-day',
  deck:
    'A commercial-grade Android spyware called LANDFALL exploited a Samsung Galaxy zero-day for nearly seven months — delivered silently through WhatsApp images and attributed to a surveillance vendor in the Pegasus mould.',
  body: [
    {
      type: 'heading',
      level: 2,
      text: 'Newly Identified Android Spyware Linked to Commercial Vendor',
    },
    {
      type: 'paragraph',
      text:
        'A powerful Android spyware strain called LANDFALL has been uncovered targeting Samsung Galaxy devices through a previously unknown zero-day vulnerability. Researchers believe the malware originates from a commercial surveillance vendor due to its sophistication and operational structure.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'How LANDFALL Infects Devices',
    },
    {
      type: 'paragraph',
      text:
        "The attackers exploited a zero-day flaw inside Samsung’s image processing libraries, used by Galaxy phones to render images. The infection chain began through malicious images sent over WhatsApp, where opening the image triggered the vulnerability and initiated the spyware installation.",
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Delivered through WhatsApp as seemingly normal images.',
        "Triggered a flaw in the device’s media processing pipeline.",
        'Installed spyware silently without any user interaction.',
        'Exfiltrated contacts, messages, app data, and device metadata.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'Likely Built by a Commercial Spyware Vendor',
    },
    {
      type: 'paragraph',
      text:
        "Investigators noted that LANDFALL does not resemble common criminal malware. Instead, it shows signs of being developed by an advanced surveillance vendor, similar to FinFisher, QuaDream, or NSO’s Pegasus frameworks.",
    },
    {
      type: 'paragraph',
      text:
        'Its modular structure, stealth, and exploit quality strongly indicate a state-level or commercial customer.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'Zero-Day Fix Delayed for Months',
    },
    {
      type: 'paragraph',
      text:
        'The vulnerability was privately reported to Samsung in September 2024. However, a patch was not released until April 2025 — nearly seven months later.',
    },
    {
      type: 'paragraph',
      text:
        'During this window, attackers had uninterrupted access to vulnerable Galaxy devices, allowing them to spy on selected targets across regions.',
    },

    {
      type: 'callout',
      tone: 'beam',
      title: 'Final Thoughts',
      text:
        'LANDFALL highlights a growing market of commercial-grade Android spyware built for stealth and targeted surveillance. The delayed patch timeline also raises questions about vendor responsiveness to critical vulnerabilities. Users of Samsung Galaxy devices should ensure they have the April 2025 or later firmware installed to remain protected.',
    },
  ],
  tags: [
    'LANDFALL',
    'Android Spyware',
    'Samsung',
    'Zero-Day',
    'Mobile Security',
    'Commercial Malware',
  ],
};
