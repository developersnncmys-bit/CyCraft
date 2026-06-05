import type { BlogPostDetail } from './types';

export const kyrgyzstanNetsupportRatDetail: BlogPostDetail = {
  slug: 'kyrgyzstan-justice-ministry-netsupport-rat-fake-pdfs',
  deck:
    'Bloody Wolf is hiding NetSupport RAT inside fake Justice Ministry PDFs and Java installers — and old-school tactics keep catching unprepared victims across Central Asia.',
  body: [
    {
      type: 'heading',
      level: 2,
      text: 'NetSupport RAT Campaign — Hackers Pretend to be Kyrgyz Ministry',
    },
    {
      type: 'paragraph',
      text:
        "A new campaign by the hacking group Bloody Wolf is distributing a well-known remote-access trojan — NetSupport RAT — across Kyrgyzstan and Uzbekistan. The attackers pose as the country's Justice Ministry and send fake PDF documents or Java-based installers to lure victims. Once opened, the RAT installs silently, giving full remote control to attackers.",
    },

    {
      type: 'heading',
      level: 2,
      text: 'Attack Vector: Fake PDFs + Old Java Exploits',
    },
    {
      type: 'paragraph',
      text:
        'The infection begins when targets receive a PDF or a seemingly legitimate file claiming to be from the "Justice Ministry." The payload uses legacy techniques: outdated Java exploits or bundled installers — often ignored by modern users but still effective in regions where security hygiene is weak.',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'PDF disguised as an official legal document or notice.',
        'Embedded or accompanying Java-based installer leading to RAT deployment.',
        'NetSupport RAT runs quietly in background, granting remote access.',
        'The malware disables or bypasses common antivirus tools to stay hidden.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'Target Region & Impact',
    },
    {
      type: 'paragraph',
      text:
        'According to researchers, the campaign is concentrated in Kyrgyzstan and Uzbekistan. Victims include individuals and small-scale organizations who likely receive unexpected "official documents." Because the malware uses older tools, many traditional detections miss it — making it especially dangerous for regions with lower cyber-security awareness.',
    },

    {
      type: 'heading',
      level: 2,
      text: 'Why Old Malware Still Works',
    },
    {
      type: 'paragraph',
      text:
        'Even though NetSupport RAT has been around since 2013, the combination of social engineering + outdated attack vectors remains surprisingly effective — especially in areas where:',
    },
    {
      type: 'list',
      style: 'bullet',
      items: [
        'Users ignore software-update prompts.',
        'Security tools are outdated or absent.',
        'Users are unfamiliar with phishing tactics.',
        'Legal-looking PDFs evoke trust, leading to lowered guard.',
      ],
    },
    {
      type: 'quote',
      text:
        'The campaign is a reminder: old malware + new victims = dangerous success.',
    },

    {
      type: 'callout',
      tone: 'beam',
      title: 'Final Thoughts',
      text:
        'Security tools and users often focus on novel threats — but sometimes, legacy tools like NetSupport RAT remain effective because people forget them. If you are based in or connected with Kyrgyzstan or Uzbekistan, treat unsolicited PDFs or Java-based installers with extreme caution. Keep all security software updated and always verify the legitimacy of documents before opening them.',
    },
  ],
  tags: [
    'NetSupport RAT',
    'Bloody Wolf',
    'Kyrgyzstan',
    'Uzbekistan',
    'Android & Windows Security',
    'Malware Campaign',
  ],
};
