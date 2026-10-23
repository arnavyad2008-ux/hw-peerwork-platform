'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Video, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [selectedTopic, setSelectedTopic] = useState('15-Min System Architecture Discovery');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 3:30 PM IST');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const TOPICS = [
    { id: 'disc', title: '15-Min Discovery & Scope Call', desc: 'Discuss your project vision, timeline, and tech feasibility.' },
    { id: 'arch', title: '30-Min Architecture Deep Dive', desc: 'Codebase review, Next.js scaling, or database bottleneck diagnosis.' },
    { id: 'retain', title: 'Fractional CTO / Lead Engineer Retainer', desc: 'Dedicated advisory, sprint delivery, and engineering leadership.' },
  ];

  const TIMESLOTS = [
    'Tomorrow, 2:00 PM IST',
    'Tomorrow, 4:30 PM IST',
    'Friday, 11:00 AM IST',
    'Friday, 3:00 PM IST',
    'Monday, 5:00 PM IST',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsBooked(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const handleReset = () => {
    setIsBooked(false);
    setName('');
    setEmail('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl rounded-3xl bg-[#0e0e13] border border-white/10 shadow-[0_0_60px_rgba(99,102,241,0.2)] p-6 sm:p-8 z-10 overflow-hidden text-slate-200"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {!isBooked ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                    <Sparkles size={12} /> Direct Calendar Access
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Schedule a Discovery Session
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Meet directly with Arnav Yadav to review your architecture, scope deliverables, and map out sprint velocity.
                  </p>
                </div>

                {/* Topic selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Select Meeting Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {TOPICS.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.title)}
                        className={`p-3 rounded-2xl border cursor-pointer transition text-left ${
                          selectedTopic === topic.title
                            ? 'bg-indigo-950/40 border-indigo-500/80 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/15 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{topic.title}</span>
                          <Video size={14} className={selectedTopic === topic.title ? 'text-indigo-400' : 'text-slate-500'} />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{topic.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slot Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Clock size={13} className="text-indigo-400" /> Choose Available Window
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TIMESLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedDate(slot)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          selectedDate === slot
                            ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                            : 'bg-white/[0.03] text-slate-300 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@scaleup.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2 transition"
                >
                  <Calendar size={16} />
                  <span>Confirm Discovery Call ({selectedDate.split(',')[0]})</span>
                  <ArrowRight size={14} />
                </motion.button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-white">Call Confirmed!</h4>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                    A calendar invitation and Google Meet link have been prepared for <strong className="text-white">{email}</strong>.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-left space-y-1.5 max-w-sm mx-auto">
                  <p className="text-slate-400"><strong>Topic:</strong> {selectedTopic}</p>
                  <p className="text-slate-400"><strong>Time:</strong> {selectedDate}</p>
                  <p className="text-slate-400"><strong>Host:</strong> Arnav Yadav (Senior Architect)</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
