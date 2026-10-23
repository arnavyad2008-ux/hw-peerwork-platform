'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { PortfolioFooter } from '../portfolio/PortfolioFooter';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/portfolio') {
    return <PortfolioFooter />;
  }

  return (
    <footer className="border-t border-white/5 bg-[#04060a] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center p-0.5">
                <img src="/logo.png" alt="hw logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg lowercase tracking-tight text-white">
                hw
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                Verified Campus Exchange
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              The high-end private micro-freelancing ecosystem designed exclusively for university students. 
              Earn Nav Coins (100,000 Nav = ₹1), take on verified peer tasks, and collaborate securely.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck size={14} /> .edu / .ac.in Verified
              </span>
              <span className="flex items-center gap-1 text-indigo-400">
                <Lock size={14} /> Milestone Escrow
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <Sparkles size={14} /> 100k Nav Coins = ₹1 INR
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Explore hw
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/tasks" className="hover:text-white transition">Live Task Board</Link></li>
              <li><Link href="/arcade" className="hover:text-white transition">Nav Coins Arcade (6 Games)</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Order Workspace</Link></li>
              <li><Link href="/profile" className="hover:text-white transition">Student Reputation & Badges</Link></li>
            </ul>
          </div>

          {/* Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Campus Security
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span>Campus Escrow Protocol</span></li>
              <li><span>UPI Zero-Fee Release</span></li>
              <li><span>Anti-Cheating & Quality Rating</span></li>
              <li><span>Private College Mesh</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} hw. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with Next.js, Supabase & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
