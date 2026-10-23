import React from 'react';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { BentoServices } from '@/components/portfolio/BentoServices';
import { FeaturedWork } from '@/components/portfolio/FeaturedWork';
import { ProcessSection } from '@/components/portfolio/ProcessSection';
import { SocialProofSection } from '@/components/portfolio/SocialProofSection';
import { AboutSection } from '@/components/portfolio/AboutSection';
import { ContactSection } from '@/components/portfolio/ContactSection';

export const metadata: Metadata = {
  title: 'Arnav Yadav — Senior Frontend Architect & Full-Stack Engineer',
  description: 'World-class freelance developer portfolio of Arnav Yadav. Specializing in Next.js 15, TypeScript, distributed architectures, and ultra-premium UI/UX design systems.',
  openGraph: {
    title: 'Arnav Yadav — Senior Frontend Architect & Full-Stack Engineer',
    description: 'Engineering world-class web applications, distributed backends, and conversion-engineered digital products with Next.js, TypeScript, and modern design systems.',
    url: 'https://arnavyadav.com',
    siteName: 'Arnav Yadav Portfolio',
    images: [
      {
        url: '/logo.png',
        width: 618,
        height: 553,
        alt: 'Arnav Yadav — Frontend Architect',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arnav Yadav — Senior Frontend Architect & Full-Stack Engineer',
    description: 'High-performance freelance web applications and modern design systems. Available for select client projects & sprint retainers.',
    creator: '@arnavyadav',
    images: ['/logo.png'],
  },
};

export default function HomePage() {
  // Structured JSON-LD for Search Engines & Schema.org Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://arnavyadav.com/#person',
        name: 'Arnav Yadav',
        jobTitle: 'Senior Frontend Architect & Full-Stack Software Engineer',
        url: 'https://arnavyadav.com',
        image: 'https://arnavyadav.com/logo.png',
        sameAs: [
          'https://github.com/arnav-yadav',
          'https://linkedin.com/in/arnav-yadav',
          'https://twitter.com/arnavyadav',
        ],
        knowsAbout: [
          'Next.js',
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Full-Stack Architecture',
          'Supabase',
          'PostgreSQL',
          'WebSockets',
          'UI/UX Design Systems',
          'Performance Optimization',
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://arnavyadav.com/#service',
        name: 'Arnav Yadav Engineering Consultancy',
        description: 'Elite full-stack development, modern UI/UX design systems, and Next.js App Router engineering consultancy for venture-backed startups and enterprises.',
        provider: {
          '@id': 'https://arnavyadav.com/#person',
        },
        areaServed: 'Worldwide',
        priceRange: '$$$$',
      },
    ],
  };

  return (
    <>
      {/* Inlined Structured JSON-LD Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Main Content Sections */}
        <main>
          <HeroSection />
          <BentoServices />
          <FeaturedWork />
          <ProcessSection />
          <SocialProofSection />
          <AboutSection />
          <ContactSection />
        </main>
      </div>
    </>
  );
}
