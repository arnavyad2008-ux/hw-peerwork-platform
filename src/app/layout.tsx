import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MarketplaceProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CyberFaceBackground } from '@/components/background/CyberFaceBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Arnav Yadav — Senior Frontend Architect & Full-Stack Engineer',
    template: '%s | Arnav Yadav',
  },
  description: 'World-class freelance developer portfolio and software consultancy by Arnav Yadav. High-performance Next.js 15, TypeScript, distributed systems, and modern design systems.',
  keywords: [
    'Arnav Yadav',
    'Frontend Architect',
    'Freelance Developer',
    'Next.js 15',
    'Full-Stack Engineer',
    'UI/UX Designer',
    'React 19',
    'Supabase',
    'Tailwind CSS',
    'Framer Motion',
  ],
  authors: [{ name: 'Arnav Yadav', url: 'https://arnavyadav.com' }],
  creator: 'Arnav Yadav',
  icons: {
    icon: '/logo.png',
  },
  metadataBase: new URL('https://arnavyadav.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-[#0a0a0c] text-slate-100 transition-colors relative`}>
        {/* Interactive Low-Poly Cyberpunk Wireframe Face Background */}
        <CyberFaceBackground />

        {/* Hypnotic Atmospheric Background Animations */}
        <div className="ambient-glow" aria-hidden="true">
          <div className="ambient-blob-1" />
          <div className="ambient-blob-2" />
        </div>

        <MarketplaceProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <AuthGuard>
                {children}
              </AuthGuard>
            </main>
            <Footer />
          </div>
        </MarketplaceProvider>
      </body>
    </html>
  );
}
