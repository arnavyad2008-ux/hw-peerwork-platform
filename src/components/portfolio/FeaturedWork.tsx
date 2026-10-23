'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Coins, 
  CheckCircle2, 
  Terminal,
  Activity,
  Maximize2
} from 'lucide-react';

export function FeaturedWork() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'fullstack' | 'frontend' | 'ai'>('all');

  const PROJECTS = [
    {
      id: 'hw',
      title: 'hw — University Micro-Freelancing Exchange',
      category: 'fullstack',
      categoryLabel: 'Full-Stack & Escrow Architecture',
      tagline: 'High-velocity student freelancing platform with real-time milestone escrow and tuned reflex gaming economy.',
      metrics: '100k Nav Coins = ₹1 INR • 11 Static/Dynamic Routes • Zero Fake Gigs',
      problem: 'College students lack a safe, immediate, peer-to-peer venue to hire skilled campus peers for coding and assignments without predatory 20% platform commissions and scam chargebacks.',
      solution: 'Engineered a private .edu/.ac.in marketplace featuring multi-step gig commissioning, verified milestone escrow, real-time messaging, and a 6-game arcade that converts reflex scores directly into campus wallet balances.',
      tags: ['Next.js 15 (App Router)', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'Nav Coins Engine'],
      liveUrl: '/tasks',
      githubUrl: 'https://github.com/arnav-yadav/peerwork',
      featured: true,
      imageAlt: 'hw university micro-freelancing marketplace UI',
      accentColor: 'indigo',
    },
    {
      id: 'apex',
      title: 'Apex Cloud — Distributed Multi-Tenant Observability',
      category: 'fullstack',
      categoryLabel: 'Distributed Systems & WebGL Charts',
      tagline: 'Sub-millisecond telemetry monitoring suite ingesting 50,000+ metrics/sec across Kubernetes pods.',
      metrics: '< 18ms Query Latency • 50k Events/Sec • 99.99% Uptime',
      problem: 'Enterprise devops teams were overwhelmed by fragmented Datadog bills and sluggish dashboard re-renders during high-traffic infrastructure incidents.',
      solution: 'Built a GPU-accelerated canvas chart dashboard with Next.js Server Components, Go ingestion proxies, and ClickHouse columnar storage for real-time trace exploration.',
      tags: ['Next.js 15', 'Go Lang', 'ClickHouse', 'WebGL Canvas', 'Tailwind CSS', 'Docker'],
      liveUrl: 'https://apex-telemetry-demo.vercel.app',
      githubUrl: 'https://github.com/arnav-yadav/apex-observability',
      featured: false,
      imageAlt: 'Apex Telemetry observability dashboard',
      accentColor: 'cyan',
    },
    {
      id: 'kinetix',
      title: 'Kinetix AI — Agentic Voice & Workflow Platform',
      category: 'ai',
      categoryLabel: 'Conversational AI & WebSockets',
      tagline: 'Bidirectional streaming voice AI platform with sub-300ms speech-to-speech turnaround.',
      metrics: '280ms Voice-to-Voice • 12k Active Sessions • Tool Calling',
      problem: 'Traditional voice assistants suffer from noticeable 1.5s+ latency, speech-barge interruptions, and hallucinations during complex multi-step tool calls.',
      solution: 'Implemented Gemini Live API WebSocket stream with client-side Voice Activity Detection (VAD), background extended thinking, and asynchronous database schema execution.',
      tags: ['Next.js 15', 'Python', 'FastAPI', 'WebSockets', 'Gemini Live', 'pgvector'],
      liveUrl: 'https://kinetix-ai.vercel.app',
      githubUrl: 'https://github.com/arnav-yadav/kinetix-ai',
      featured: false,
      imageAlt: 'Kinetix AI conversational voice interface',
      accentColor: 'emerald',
    },
    {
      id: 'veloce',
      title: 'Veloce — Sub-Second Headless E-Commerce Architecture',
      category: 'frontend',
      categoryLabel: 'UI/UX & Extreme Performance',
      tagline: 'Next-generation luxury fashion storefront with predictive prefetching and sub-0.5s checkout flow.',
      metrics: '+34% Mobile Conversion • 0.42s LCP • 100/100 Core Web Vitals',
      problem: 'Shopify Liquid theme sluggishness and heavy JavaScript bloated bundle size to 1.8MB, dropping mobile checkout conversion rate significantly.',
      solution: 'Architected headless Next.js App Router store using Shopify Storefront GraphQL, edge caching with Upstash Redis, and predictive hover prefetching.',
      tags: ['Next.js 15', 'Shopify Storefront API', 'Stripe', 'Redis Edge', 'Framer Motion'],
      liveUrl: 'https://veloce-storefront.vercel.app',
      githubUrl: 'https://github.com/arnav-yadav/veloce-commerce',
      featured: false,
      imageAlt: 'Veloce luxury e-commerce storefront',
      accentColor: 'amber',
    },
  ];

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
              <Sparkles size={12} /> Selected Case Studies
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Proven Architecture in Production.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Every project is treated as an engineering study: from rigorous performance benchmarking and zero layout shifts to real-time client value generation.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#121216]/80 border border-white/[0.08] backdrop-blur-md self-start md:self-auto">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'fullstack', label: 'Full-Stack Apps' },
              { id: 'frontend', label: 'Performance & UI' },
              { id: 'ai', label: 'AI & Systems' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl bg-[#121216]/70 backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/40 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_35px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                {/* Glow highlight */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/25 transition-all duration-500" />

                <div className="space-y-6 relative z-10">
                  {/* Top Bar: Category & Live Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                      <Terminal size={13} /> {project.categoryLabel}
                    </span>
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold">
                        ⭐ Flagship Architecture
                      </span>
                    )}
                  </div>

                  {/* Project Title & Tagline */}
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Metrics Pill */}
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-mono text-cyan-300 flex items-center gap-2">
                    <Activity size={14} className="text-cyan-400 shrink-0" />
                    <span className="truncate">{project.metrics}</span>
                  </div>

                  {/* Problem & Solution Breakdown */}
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#090b10] border border-white/5 space-y-1">
                      <strong className="text-rose-400 uppercase tracking-wider font-mono text-[10px] block">
                        The Challenge
                      </strong>
                      <p className="text-slate-400 leading-relaxed">{project.problem}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#090b10] border border-white/5 space-y-1">
                      <strong className="text-emerald-400 uppercase tracking-wider font-mono text-[10px] block">
                        The Architectural Solution
                      </strong>
                      <p className="text-slate-300 leading-relaxed">{project.solution}</p>
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-400 bg-white/[0.03] border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8 relative z-10">
                  <div className="flex items-center gap-3">
                    {project.id === 'hw' ? (
                      <Link
                        href="/tasks"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition group/btn"
                      >
                        <span>Launch Live App</span>
                        <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </Link>
                    ) : (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition group/btn"
                      >
                        <span>Live Deployment</span>
                        <ExternalLink size={14} />
                      </a>
                    )}

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition"
                      aria-label="View source on GitHub"
                    >
                      <Github size={14} />
                      <span className="hidden sm:inline">Source</span>
                    </a>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">Production Ready</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
