'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowUpRight, 
  Menu, 
  X, 
  Calendar,
  Layers,
  Code2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { BookingModal } from './BookingModal';

export function PortfolioNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Mark */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500/20 via-slate-900 to-cyan-500/20 border border-white/10 flex items-center justify-center p-1 group-hover:border-indigo-400/80 transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)]">
                  <img
                    src="/logo.png"
                    alt="Arnav Yadav Logo"
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                    Arnav Yadav
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 font-mono -mt-1">
                    Frontend Architect
                  </span>
                </div>
              </Link>

              {/* Status Badge */}
              <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for Q2/Q3 Projects</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-[#121216]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.08] shadow-inner">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/tasks"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/20 border border-indigo-500/30 transition ml-1"
                title="Explore live student micro-freelancing exchange"
              >
                <span>hw App</span>
                <ArrowUpRight size={12} />
              </Link>
            </nav>

            {/* CTA & Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsBookingOpen(true)}
                className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all overflow-hidden border border-white/10"
              >
                <Calendar size={14} />
                <span>Book Call</span>
              </motion.button>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="flex md:hidden items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookingOpen(true)}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-indigo-600 shadow"
              >
                Book Call
              </motion.button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.03] border border-white/10"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-white/10 bg-[#0c0c10]/95 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-2xl"
            >
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/tasks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20"
                >
                  <span>hw Micro-Freelancing App</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-lg"
                >
                  <Calendar size={14} />
                  <span>Schedule 15-Min Intro Call</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Booking Calendar Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
