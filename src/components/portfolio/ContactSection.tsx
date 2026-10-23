'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Github, 
  Linkedin, 
  Twitter, 
  ArrowRight, 
  ShieldCheck,
  Clock,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookingModal } from './BookingModal';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Full-Stack Web App');
  const [budget, setBudget] = useState('$5k - $10k');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const PROJECT_TYPES = [
    'Full-Stack Web App (Next.js & Supabase)',
    'High-Conversion Landing Page / Design System',
    'API Integration & Cloud Backend Architecture',
    'AI Systems & Voice Agent Engineering',
    'Fractional Lead Engineer / Advisory',
  ];

  const BUDGETS = [
    '$3k - $5k',
    '$5k - $10k',
    '$10k - $25k',
    '$25k+',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 600);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-gradient-to-t from-indigo-600/10 via-cyan-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Quick Meeting Pitch */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                <Sparkles size={12} /> Start a Conversation
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Let&apos;s Build Something Extraordinary.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Have an ambitious product idea, a scaling milestone, or need a top-tier frontend architect to ship fast? Fill out the brief or jump directly on my calendar.
              </p>
            </div>

            {/* Direct Booking Call Card */}
            <div className="p-6 rounded-3xl bg-[#121216]/80 backdrop-blur-xl border border-white/[0.08] space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Prefer a Quick 15-Min Chat?</h4>
                  <p className="text-xs text-slate-400">Skip the email exchange and book directly on my calendar.</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-indigo-400/40 flex items-center justify-center gap-2 transition"
              >
                <span>Schedule Discovery Call</span>
                <ArrowRight size={14} className="text-indigo-400" />
              </motion.button>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                Direct Communication
              </span>
              <div className="space-y-2 text-xs">
                <a
                  href="mailto:arnav.yadav@iitd.ac.in"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-white transition group"
                >
                  <Mail size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="font-mono">arnav.yadav@iitd.ac.in</span>
                </a>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://github.com/arnav-yadav"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 text-slate-400 hover:text-white transition"
                    aria-label="GitHub profile"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://linkedin.com/in/arnav-yadav"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 text-slate-400 hover:text-white transition"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="https://twitter.com/arnavyadav"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 text-slate-400 hover:text-white transition"
                    aria-label="Twitter profile"
                  >
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 font-mono">
              <Clock size={13} className="text-indigo-400" />
              <span>Typical response turnaround: &lt; 4 hours (IST/UTC+5:30)</span>
            </div>
          </div>

          {/* Right Column: Frictionless Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#121216]/70 backdrop-blur-2xl border border-white/[0.08] shadow-2xl relative">
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Project Inquiry Form
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tell me about your product requirements, target timeline, and technical objectives.
                    </p>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#0a0a0d] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@acme.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#0a0a0d] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Project Scope Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Project Scope
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0a0a0d] border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#121216] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Selector Pills */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Estimated Budget Range (USD)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BUDGETS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(b)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            budget === b
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.35)]'
                              : 'bg-[#0a0a0d] text-slate-400 border-white/5 hover:border-white/15 hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Project Overview & Goals *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Briefly describe your vision, required integrations, and ideal launch deadline..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0a0a0d] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition shadow-inner resize-none"
                    />
                  </div>

                  {/* Submit CTA with active tap feedback */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-[0_0_35px_rgba(99,102,241,0.45)] transition flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Transmitting Inquiry...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={15} />
                        Send Project Inquiry
                      </span>
                    )}
                  </motion.button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 size={36} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl sm:text-3xl font-black text-white">Inquiry Received!</h4>
                    <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{name}</strong>. Your project brief has been logged into my priority queue. I will review the architecture and reply to <strong className="text-indigo-300">{email}</strong> within 4 hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090b10] border border-white/5 text-xs text-left max-w-sm mx-auto space-y-1 font-mono">
                    <p className="text-slate-400"><strong>Ticket:</strong> #INQ-{Math.floor(100000 + Math.random() * 900000)}</p>
                    <p className="text-slate-400"><strong>Scope:</strong> {projectType}</p>
                    <p className="text-slate-400"><strong>Budget:</strong> {budget}</p>
                  </div>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
}
