'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin, Twitter, Sparkles, Heart } from 'lucide-react';

export function PortfolioFooter() {
  const [delhiTime, setDelhiTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setDelhiTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-white/[0.06] bg-[#07070a] text-slate-400 text-xs py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center p-1">
                <img src="/logo.png" alt="Arnav Yadav Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-base font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Arnav Yadav
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Senior Frontend Architect & Full-Stack Engineer. Building high-performance, conversion-engineered digital products with Next.js, TypeScript, and modern design systems.
            </p>

            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Select Q2/Q3 Projects</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-white transition">Services & Capabilities</a></li>
              <li><a href="#work" className="hover:text-white transition">Featured Case Studies</a></li>
              <li><a href="#process" className="hover:text-white transition">The 4-Week Process</a></li>
              <li><a href="#about" className="hover:text-white transition">About & Background</a></li>
              <li><a href="#contact" className="hover:text-white transition">Initiate Contact</a></li>
            </ul>
          </div>

          {/* Products & Projects */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Shipped Ecosystems
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/tasks" className="hover:text-indigo-300 transition flex items-center gap-1 text-slate-300">
                  <span>hw Campus Exchange</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link href="/arcade" className="hover:text-indigo-300 transition flex items-center gap-1 text-slate-300">
                  <span>Nav Coins Arcade (6 Games)</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Apex Observability (Private)</span>
              </li>
              <li>
                <span className="text-slate-500">Kinetix Voice AI Engine</span>
              </li>
            </ul>
          </div>

          {/* Local Status & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Operating Base
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-slate-300">New Delhi, India (IST)</p>
              <p className="text-indigo-400">{delhiTime ? `${delhiTime} IST` : 'Syncing local time...'}</p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://github.com/arnav-yadav" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition">
                  <Github size={16} />
                </a>
                <a href="https://linkedin.com/in/arnav-yadav" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition">
                  <Linkedin size={16} />
                </a>
                <a href="https://twitter.com/arnavyadav" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition">
                  <Twitter size={16} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} Arnav Yadav. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Built with Next.js 15, React 19, Tailwind CSS & Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
