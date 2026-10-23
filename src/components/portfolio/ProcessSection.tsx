'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Code2, Rocket, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function ProcessSection() {
  const STEPS = [
    {
      num: '01',
      title: 'Architecture & System Discovery',
      timeline: 'Days 1 - 3',
      desc: 'We map out your product requirements, database schemas, edge-case states, and technical constraints into a crystal-clear architecture document before a single line of code is written.',
      deliverables: ['Schema ERD Diagram', 'API Spec Contract', 'Core User Flow Mapping'],
    },
    {
      num: '02',
      title: 'Interactive Prototyping & Design',
      timeline: 'Days 4 - 7',
      desc: 'High-fidelity Figma & interactive code prototypes in Next.js. We lock in typography, micro-interactions, dark-mode surfaces, and mobile ergonomics until it feels flawless.',
      deliverables: ['Interactive Click-Through Prototype', 'Component Design System', 'Responsive Breakpoint Verification'],
    },
    {
      num: '03',
      title: 'Production Engineering & QA',
      timeline: 'Weeks 2 - 3',
      desc: 'Iterative sprint builds with daily GitHub previews. Strict TypeScript, unit/integration testing, Supabase RLS security, and sub-second Core Web Vitals optimization.',
      deliverables: ['Complete Next.js App Router codebase', 'Type-Safe Database Migrations', '100/100 Lighthouse Performance'],
    },
    {
      num: '04',
      title: 'Zero-Downtime Deployment & Handover',
      timeline: 'Week 4',
      desc: 'Production deployment to Vercel/AWS, domain setup, automated CI/CD pipelines, Loom walkthroughs, and a clean handover of all repositories and credentials.',
      deliverables: ['Vercel Production Launch', 'Architectural Documentation & Loom', '30-Day Post-Launch Warranty Support'],
    },
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={12} /> The Engagement Model
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            From Concept to Production in 4 Sprints.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Predictable delivery without surprise delays or scope creep. Clear weekly milestones, continuous git branches, and absolute accountability.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl bg-[#121216]/60 backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-6 shadow-xl relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    {step.num}
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-400">
                    {step.timeline}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                  Key Deliverables
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {step.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 size={12} className="text-indigo-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
