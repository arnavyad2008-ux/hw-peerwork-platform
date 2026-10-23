'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  Code2, 
  Zap, 
  ShieldCheck, 
  TrendingUp,
  Cpu,
  Layers,
  Database
} from 'lucide-react';

export function HeroSection({ onBookCall }: { onBookCall?: () => void }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const METRICS = [
    { label: 'Production Apps Deployed', value: '14+', desc: 'Next.js & Supabase full-stack stacks' },
    { label: 'Median Core Web Vitals LCP', value: '0.48s', desc: 'Top 1% sub-second performance' },
    { label: 'Client Revenue Engineered', value: '$2.4M+', desc: 'Through conversion-focused UX' },
    { label: 'Lighthouse Performance', value: '100/100', desc: 'Zero layout shift, optimized bundles' },
  ];

  const TECH_STACK = [
    { name: 'Next.js 15 (App Router)', icon: '▲' },
    { name: 'TypeScript', icon: 'TS' },
    { name: 'React 19', icon: '⚛' },
    { name: 'Tailwind CSS', icon: '≋' },
    { name: 'Framer Motion', icon: '✦' },
    { name: 'Supabase / PostgreSQL', icon: '⚡' },
    { name: 'Node.js & Go', icon: '⬢' },
    { name: 'Redis Caching', icon: '◆' },
    { name: 'Docker & CI/CD', icon: '🐳' },
    { name: 'Vercel Edge', icon: '▲' },
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden">
      {/* Ambient Radial Mesh Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-10 w-[450px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Availability Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#121216]/80 backdrop-blur-md border border-white/[0.08] shadow-[0_0_20px_rgba(99,102,241,0.2)] text-slate-300 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for Select Client Projects & Contract Roles</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-400 font-mono text-[11px]">Q2/Q3 2026</span>
            </div>
          </motion.div>

          {/* Primary Hero Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.06]"
          >
            Engineering{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              World-Class Web Apps
            </span>{' '}
            & Scalable Digital Products.
          </motion.h1>

          {/* Subheadline with Precise Technical Positioning */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            I am <strong className="text-slate-200 font-semibold">Arnav Yadav</strong>—a Senior Frontend Architect & Full-Stack Engineer. I partner with venture-backed startups and ambitious founders to build high-converting, sub-second web platforms with the visual polish of Stripe, Linear, and Vercel.
          </motion.p>

          {/* Dual CTAs & Micro-Interactions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.a
              href="#work"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-[0_0_35px_rgba(99,102,241,0.45)] transition-all border border-white/10 group"
            >
              <span>Explore Selected Work</span>
              <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 bg-[#121216]/90 hover:bg-[#181820] border border-white/10 hover:border-white/20 shadow-lg transition"
            >
              <span>Get in Touch / Book Call</span>
              <ArrowRight size={16} className="text-indigo-400" />
            </motion.a>
          </motion.div>

          {/* Key Social Proof Metric Badges */}
          <motion.div
            variants={itemVariants}
            className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-2xl bg-[#121216]/40 backdrop-blur-md border border-white/[0.06] hover:border-indigo-500/30 transition text-left space-y-1 group"
              >
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {metric.value}
                </span>
                <p className="text-xs font-bold text-slate-300 leading-snug">{metric.label}</p>
                <p className="text-[10px] text-slate-500 leading-snug">{metric.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tech Stack Marquee / Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/[0.06]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold shrink-0">
              Tech Stack & Tooling:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-300 bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition"
                >
                  <span className="text-indigo-400 font-mono text-[10px]">{tech.icon}</span>
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
