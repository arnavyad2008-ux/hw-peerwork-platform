'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Code2, Cpu, GraduationCap, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export function AboutSection() {
  const PRINCIPLES = [
    {
      title: 'Obsession with Performance',
      desc: 'Sub-second LCP is not a vanity metric—it directly dictates customer retention, conversion velocity, and SEO ranking. I profile every bundle to avoid hydration tax.',
    },
    {
      title: 'Design as an Engineering Discipline',
      desc: 'Typography scales, 4px grid spacing, optical alignments, and fluid micro-interactions are treated with the exact same rigor as distributed transaction isolation.',
    },
    {
      title: 'Zero Technical Debt Tolerance',
      desc: 'Strict TypeScript interfaces, self-documenting architectures, modular components, and automated CI tests ensure your code remains maintainable years after launch.',
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bio & Engineering Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
              <Sparkles size={12} /> The Architect Behind the Code
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Bridging Rigorous Engineering with High-End Product Design.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-400 leading-relaxed">
              <p>
                I am a senior frontend architect and full-stack software engineer based in New Delhi, India. Over the past 4+ years, I have built and scaled applications ranging from high-concurrency micro-escrow platforms to distributed telemetry observability suites.
              </p>
              <p>
                My philosophy is simple: <strong className="text-white">software should feel immediate, tactile, and indisputably premium</strong>. When a user interacts with a platform I built, there is zero perceptible lag, zero cumulative layout shift, and every transition feels intentionally authored rather than exported.
              </p>
              <p>
                Whether you are a founder preparing for a Series A launch or an enterprise engineering team untangling frontend performance bottlenecks, I partner with you to ship production-grade code that scales.
              </p>
            </div>

            {/* Core Principles */}
            <div className="grid grid-cols-1 gap-4 pt-4">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.title}
                  className="p-5 rounded-2xl bg-[#121216]/50 border border-white/[0.06] hover:border-indigo-500/30 transition text-left space-y-1"
                >
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Spec Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#121216]/70 backdrop-blur-2xl border border-white/[0.08] p-8 shadow-2xl overflow-hidden space-y-6">
              {/* Background ambient orb */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl" />

              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-indigo-500/40 p-1 flex items-center justify-center shadow-lg">
                  <img src="/logo.png" alt="Arnav Yadav" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Arnav Yadav</h3>
                  <p className="text-xs text-indigo-400 font-mono">Senior Frontend Architect</p>
                  <p className="text-[11px] text-slate-500">New Delhi • Available Worldwide</p>
                </div>
              </div>

              {/* Spec Checklist */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Primary Stack</span>
                  <span className="text-white font-bold">Next.js 15 / React 19 / TS</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Database & Realtime</span>
                  <span className="text-cyan-400 font-bold">PostgreSQL / Supabase / Redis</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Design Language</span>
                  <span className="text-indigo-400 font-bold">Linear / Stripe / Vercel</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">AI / LLM Tooling</span>
                  <span className="text-emerald-400 font-bold">Gemini API / WebSockets</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400">Contract Engagement</span>
                  <span className="text-amber-400 font-bold">Fixed Sprint / Retainer</span>
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-2">
                <a
                  href="#contact"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  <span>Inquire for Upcoming Sprint</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
