import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { Navbar } from '@/components/layout/Navbar';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { CinemaBackground } from '@/components/layout/CinemaBackground';
import { GlobalBeam } from '@/components/core/Beam/GlobalBeam';
import { NoiseOverlay } from '@/components/core/NoiseOverlay/NoiseOverlay';
import { Preloader } from '@/components/layout/Preloader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cycraft.in',
  ),
  title: 'Cyber Intelligence Engineering B.Tech | CyCraft',
  description:
    'A revolutionary 4-year UG program in Cybersecurity & AI with project-first curriculum, expert mentorship, and elite placement support at S-VYASA University, Bangalore.',
  keywords: [
    'cybersecurity btech',
    'ethical hacking degree',
    'cyber intelligence engineering',
    'cycraft',
    's-vyasa university',
  ],
  openGraph: {
    title: 'Cyber Intelligence Engineering B.Tech | CyCraft',
    description: 'Scroll into the dark. Become the signal.',
    images: ['/images/og-image.jpg'],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <CinemaBackground />
        <GlobalBeam />
        <Preloader />
        <SmoothScrollProvider>
          <ScrollProgress />
          <Navbar />
          <main id="main-content">{children}</main>
        </SmoothScrollProvider>
        <NoiseOverlay />
      </body>
    </html>
  );
}
