/**
 * Privacy Policy page. Layout + scroll reveals live in the shared
 * <LegalPage /> component; copy lives in /content/legal/privacy.ts so
 * legal review can rewrite text without touching JSX.
 */
import type { Metadata } from 'next';
import { LegalPage } from '@/features/legal/LegalPage';
import HomeFooter from '@/features/home/11-footer';
import { privacyContent } from '@/content/legal/privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy | CyCraft',
  description:
    'How CyCraft collects, uses, and protects your personal information.',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalPage content={privacyContent} slug="privacy" />
      <HomeFooter />
    </>
  );
}
