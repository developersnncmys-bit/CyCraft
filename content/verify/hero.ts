export const verifyHeroContent = {
  badge: 'CERTIFICATE_VERIFICATION',
  headlinePrefix: 'Certificate',
  headlineAccent: 'Verification',
  tagline:
    'Verify the authenticity of any CyCraft-issued certificate. Enter the certificate ID or follow the QR code to confirm the candidate, course, and issue date.',
  pills: [
    { label: 'Tamper-Proof', icon: 'lock' },
    { label: 'Public Verify', icon: 'bolt' },
    { label: 'QR-Enabled', icon: 'prompt' },
  ],
  terminalLines: [
    '> registry.load("certificates")',
    '> records: signed | issuance-logged | revocation-ready',
    '> lookup: certificate-id | qr-payload',
  ],
} as const;
