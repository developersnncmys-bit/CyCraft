/**
 * Generic Privacy Policy content. Suitable as a placeholder while legal
 * review prepares the final copy. Each `section` renders as an h2 + its
 * paragraphs/bullets on the page; reorder, edit, add, or remove freely.
 *
 * `lastUpdated` is rendered verbatim — keep it in `YYYY-MM-DD` so it
 * sorts/parses cleanly if it ever moves into a CMS later.
 */
export const privacyContent = {
  title: 'Privacy Policy',
  subtitle: 'How CyCraft collects, uses, and protects your information.',
  lastUpdated: '2026-06-10',
  intro:
    'CyCraft ("we", "us", "our") respects your privacy. This Privacy Policy explains what information we collect when you visit our website or use our services, how we use that information, and the choices you have. By using cycraft.in or any related service, you agree to the practices described here.',
  sections: [
    {
      heading: 'Information We Collect',
      body: [
        'We collect information you provide directly to us when you fill out forms (admissions, contact, course enrolments), subscribe to communications, or interact with our team. This may include your name, email address, phone number, educational background, and any free-text details you share.',
        'We also collect limited technical information automatically — IP address, browser type, device type, referring page, and pages viewed — through standard server logs and analytics tools. This data helps us understand site usage and improve performance.',
      ],
    },
    {
      heading: 'How We Use Your Information',
      body: [
        'Process and respond to your admission, enquiry, or programme application.',
        'Send you updates about courses, events, scholarships, and other information you have asked to receive.',
        'Improve the website, our programmes, and the user experience based on aggregate usage patterns.',
        'Comply with legal obligations, prevent fraud, and protect the rights and safety of CyCraft, our students, and the public.',
      ],
    },
    {
      heading: 'Cookies and Tracking',
      body: [
        'We use cookies and similar technologies to remember your preferences, keep you signed in where relevant, and measure how visitors use the site. You can disable cookies through your browser settings, though some parts of the site may not function correctly without them.',
      ],
    },
    {
      heading: 'Sharing Your Information',
      body: [
        'We do not sell your personal information. We share it only with: (a) service providers that help us operate the site, send communications, or host data (under contractual confidentiality); (b) educational and hiring partners when you have explicitly opted in; and (c) authorities when required by law.',
      ],
    },
    {
      heading: 'Data Retention',
      body: [
        'We retain your information only as long as is needed for the purposes described in this policy or as required by law. Application and academic records are retained for the duration of your relationship with CyCraft plus a reasonable period thereafter; marketing contacts are retained until you unsubscribe.',
      ],
    },
    {
      heading: 'Your Rights',
      body: [
        'Depending on your location, you may have the right to access, correct, delete, or restrict our use of your personal information, and to withdraw consent at any time. To exercise these rights, contact us at the email below — we will respond within a reasonable timeframe.',
      ],
    },
    {
      heading: 'Security',
      body: [
        'We take reasonable technical and organisational measures to protect your information against unauthorised access, alteration, disclosure, or destruction. No system is perfectly secure, however, and we cannot guarantee absolute security.',
      ],
    },
    {
      heading: "Children's Privacy",
      body: [
        'Our programmes are intended for prospective and current students who are eligible for higher-education enrolment. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child, contact us immediately and we will delete it.',
      ],
    },
    {
      heading: 'Changes to This Policy',
      body: [
        'We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page. Material changes will be notified through the site or by email where appropriate.',
      ],
    },
    {
      heading: 'Contact',
      body: [
        'Questions about this Privacy Policy or how we handle your information can be sent to info@cycraft.in. You can also reach us by post at CyCraft, Sattva Global City, Mysore Road, Bengaluru, Karnataka 560059.',
      ],
    },
  ],
} as const;
