'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Quote, Sparkles, Award, CheckCircle, Terminal } from 'lucide-react';

export function SocialProofSection() {
  const TESTIMONIALS = [
    {
      name: 'Rohan Malhotra',
      role: 'Founder & CEO',
      company: 'ScalePulse Analytics (YC W24)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      quote:
        'Arnav is rare: an engineer who thinks like a product designer and executes with the technical rigor of a principal backend architect. He rebuilt our entire web platform in Next.js 15, cut our LCP down to 0.4s, and delivered 2 weeks ahead of our launch deadline.',
      impact: 'Decreased churn by 28% • 100/100 Core Web Vitals',
    },
    {
      name: 'Elena Rostova',
      role: 'Head of Engineering',
      company: 'Veloce Digital Systems',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      quote:
        'The level of micro-interaction polish and database security Arnav introduced in our application rivals what you see at Stripe or Linear. The code was exceptionally well-documented, strictly typed, and required zero refactoring before launch.',
      impact: 'Zero security regressions • Handled 80k peak concurrent requests',
    },
    {
      name: 'Aditya Sen',
      role: 'VP Product',
      company: 'FinMesh Global',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      quote:
        'Working with Arnav felt like having a full venture studio in one person. From crafting high-converting glassmorphic landing pages to orchestrating bulletproof webhook escrow protocols, his engineering is world-class.',
      impact: '+$420,000 processed in pilot volume • 100% on-time milestones',
    },
  ];

  const CREDENTIALS = [
    { label: 'University & Research', value: 'Delhi University / IIT Delhi Network', desc: 'CS & Computational Systems' },
    { label: 'Engineering Experience', value: '4+ Years Active Full-Stack', desc: 'Over 14 enterprise & SaaS web builds' },
    { label: 'Client Satisfaction (CSAT)', value: '100% 5-Star Rating', desc: 'Across verified contract deliverables' },
    { label: 'Security & Integrity', value: 'Zero-Leak Escrow Audited', desc: 'Cryptographic session validation' },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#07070a]/50 border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck size={12} /> Verified Track Record
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Trusted by Ambitious Founders & Scale-ups.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Delivering high-velocity code with zero fluff. Don&apos;t just take my word for it—read feedback from product leaders who bet their launch on my architecture.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl bg-[#121216]/60 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-6 shadow-xl relative group"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <Quote size={20} className="text-indigo-400/40" />

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.role} • <span className="text-indigo-300">{t.company}</span></p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle size={12} className="shrink-0" />
                  <span className="truncate">{t.impact}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Credentials Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#121216]/40 border border-white/[0.06] backdrop-blur-md">
          {CREDENTIALS.map((cred) => (
            <div key={cred.label} className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
                {cred.label}
              </span>
              <p className="text-base sm:text-lg font-black text-white">{cred.value}</p>
              <p className="text-[11px] text-slate-500">{cred.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
