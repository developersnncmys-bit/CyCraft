export const verifyQrContent = {
  badge: 'QR-BASED VERIFICATION',
  heading: 'Scan, Don’t Type',
  description:
    'Every CyCraft certificate is printed with a unique QR code. Scanning it on a phone opens a pre-filled verify URL on this page, so the candidate name, course, and dates appear instantly without retyping the ID.',
  /** Three info bullets that appear below the heading, in a row of cards. */
  features: [
    {
      id: 'unique',
      title: 'Unique Per Certificate',
      description:
        'Each QR encodes the certificate’s public ID and a signed checksum, regenerated only when the credential is reissued.',
    },
    {
      id: 'pre-filled',
      title: 'Pre-Filled Lookup',
      description:
        'Scanning opens cycraft.in/verify?id=… so the form auto-populates and the result loads on arrival. No typing.',
    },
    {
      id: 'offline-safe',
      title: 'Offline-Safe',
      description:
        'The QR holds the lookup URL, not the candidate’s data. Verification still happens server-side against the live registry.',
    },
  ],
  /** Sample URL displayed in a faux address-bar block, illustrative only. */
  sampleUrl: 'cycraft.in/verify?id=CYC-2024-0142',
} as const;
