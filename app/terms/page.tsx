/**
 * Terms & Conditions page. Layout + scroll reveals live in the shared
 * <LegalPage /> component; copy lives in /content/legal/terms.ts so
 * legal review can rewrite text without touching JSX.
 */
import type { Metadata } from 'next';
import { LegalPage } from '@/features/legal/LegalPage';
import HomeFooter from '@/features/home/11-footer';
import { termsContent } from '@/content/legal/terms';

export const metadata: Metadata = {
  title: 'Terms & Conditions | CyCraft',
  description:
    'The rules that govern your use of cycraft.in, our courses, programmes, and services.',
  robots: { index: true, follow: true },
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <LegalPage content={termsContent} slug="terms" />
      <HomeFooter />
    </>
  );
}
