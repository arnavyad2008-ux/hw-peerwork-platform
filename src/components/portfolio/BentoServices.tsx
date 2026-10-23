'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  Layers, 
  Zap, 
  Terminal, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  Code2, 
  Gauge, 
  Bot, 
  Workflow, 
  CheckCircle2 
} from 'lucide-react';

export function BentoServices() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={12} /> Core Competencies
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Architected for Speed. Built to Scale.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            I don&apos;t just build websites—I engineer high-converting digital products, resilient distributed backends, and pixel-precise frontends that leave competitors in the rearview mirror.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Bento Item 1: Full-Stack Web Apps (Spans 2 columns) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="md:col-span-2 rounded-3xl bg-[#121216]/60 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between"
          >
            {/* Ambient card spotlight */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl group-hover:bg-indigo-500/25 transition-all duration-500" />

            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Layers size={24} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                  01 / Enterprise Frontends & Full-Stack Apps
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Full-Stack Next.js & Distributed Web Apps
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                  End-to-end architecture leveraging Next.js 15 App Router, Server Components, TypeScript, and Supabase/PostgreSQL. Built with strict Row Level Security (RLS), real-time WebSockets, and type-safe data pipelines ready for high concurrency.
                </p>
              </div>

              {/* Code / Visual Preview */}
              <div className="p-4 rounded-2xl bg-[#0a0a0d] border border-white/5 font-mono text-xs text-slate-300 space-y-1.5 shadow-inner">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-[11px] text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2">app/api/orders/escrow/route.ts</span>
                </div>
                <p className="text-indigo-400">// Zero-trust state verification with PostgreSQL RLS</p>
                <p><span className="text-cyan-400">export async function</span> <span className="text-amber-300">POST</span>(req: Request) &#123;</p>
                <p className="pl-4">const &#123; orderId, milestone &#125; = await req.json();</p>
                <p className="pl-4 text-emerald-400">await supabase.rpc(&apos;release_milestone_escrow&apos;, &#123; orderId &#125;);</p>
                <p className="pl-4">return NextResponse.json(&#123; success: true, latency: &apos;14ms&apos; &#125;);</p>
                <p>&#125;</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5 mt-6">
              {['Next.js 15', 'TypeScript', 'Supabase', 'Server Actions', 'PostgreSQL RLS', 'Realtime Channels'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.03] border border-white/[0.06]">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bento Item 2: High-Performance Landing Pages (1 column) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-[#121216]/60 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between"
          >
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500" />

            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Gauge size={24} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  02 / Conversion & Design Systems
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  High-Conversion Landing Experiences
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Design systems inspired by Linear and Stripe. Engineered for 100/100 Core Web Vitals, zero layout shifts, dynamic micro-interactions, and high conversion velocity.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <span className="text-slate-400">Lighthouse Performance</span>
                  <span className="font-mono font-bold text-emerald-400">100 / 100</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <span className="text-slate-400">Largest Contentful Paint</span>
                  <span className="font-mono font-bold text-cyan-400">0.42s</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <span className="text-slate-400">Cumulative Layout Shift</span>
                  <span className="font-mono font-bold text-indigo-400">0.000</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5 mt-6">
              {['Framer Motion', 'Tailwind CSS', 'Micro-interactions', 'SEO JSON-LD'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.03] border border-white/[0.06]">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bento Item 3: API & Cloud Architecture (1 column) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-[#121216]/60 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Database size={24} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  03 / Cloud Infrastructure
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  API Integration & Escrow Protocols
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Fault-tolerant payment gateways (Stripe, Razorpay, UPI), idempotent webhook handlers, Redis token buckets for rate limiting, and bulletproof micro-escrow smart contracts.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Idempotent webhook reconciliation with replay safety</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Sub-millisecond Upstash Redis caching & session mesh</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Automated database migrations with zero downtime</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5 mt-6">
              {['Stripe & UPI', 'Redis', 'Webhooks', 'Docker', 'PostgreSQL'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.03] border border-white/[0.06]">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bento Item 4: AI Systems & Automations (Spans 2 columns) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="md:col-span-2 rounded-3xl bg-[#121216]/60 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between"
          >
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />

            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot size={24} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  04 / Autonomous Systems & LLM Workflows
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  AI Integration & Autonomous Workflow Orchestration
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                  Implementation of production LLM pipelines (Gemini API, OpenAI, Claude), vector similarity search (pgvector), sub-300ms bidirectional audio streaming with WebSockets, and autonomous multi-agent task execution.
                </p>
              </div>

              {/* Architecture Diagram Pill Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Workflow size={14} className="text-emerald-400" /> Agent Swarms
                  </span>
                  <p className="text-[11px] text-slate-400">Self-correcting code analysis and deterministic background task runners.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap size={14} className="text-cyan-400" /> Realtime Audio / VAD
                  </span>
                  <p className="text-[11px] text-slate-400">Sub-300ms speech-to-speech turnaround using Gemini Live API WebSocket stream.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Database size={14} className="text-indigo-400" /> pgvector RAG
                  </span>
                  <p className="text-[11px] text-slate-400">Hierarchical semantic search with hybrid lexical ranking over millions of chunks.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5 mt-6">
              {['Gemini API', 'pgvector', 'WebSockets', 'Autonomous Agents', 'LangGraph', 'FastAPI'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.03] border border-white/[0.06]">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
