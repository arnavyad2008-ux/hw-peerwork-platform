'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, TrendingUp, CheckCircle2, Trophy, Coins } from 'lucide-react';

const CAMPUS_EVENTS = [
  { icon: Zap, text: 'Rohit M. (DTU) earned 2,500 Nav Coins in Hackathon Speed Typer', color: 'text-amber-400' },
  { icon: CheckCircle2, text: 'Ananya S. (NSUT) submitted Hackathon Figma UI Kit • Under review', color: 'text-indigo-400' },
  { icon: Coins, text: 'Priya S. (SRCC) released ₹3,500 campus escrow for Financial Dashboard', color: 'text-indigo-300' },
  { icon: Trophy, text: 'Exchange Rate active: 100,000 Nav Coins = ₹1 (Direct UPI payout)', color: 'text-amber-300' },
  { icon: Sparkles, text: 'Arnav Y. (IIT Delhi) verified 5.0 ⭐ on hw milestone delivery', color: 'text-indigo-400' },
  { icon: TrendingUp, text: 'Over ₹1,42,000 in student micro-freelance payouts completed this month', color: 'text-slate-300' }
];

export function LiveCampusTicker({ onOpenArcade }: { onOpenArcade?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAMPUS_EVENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const event = CAMPUS_EVENTS[currentIndex];
  const Icon = event.icon;

  return (
    <div className="w-full bg-[#04060a]/90 border-b border-white/5 px-4 py-2 text-xs flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-extrabold text-[10px] uppercase tracking-wider shrink-0 border border-indigo-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          Live Campus Feed
        </div>

        <div className="flex items-center gap-2 truncate text-slate-300 transition-all duration-500">
          <Icon size={14} className={`${event.color} shrink-0`} />
          <span className="truncate">{event.text}</span>
        </div>
      </div>

      {onOpenArcade && (
        <button
          onClick={onOpenArcade}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 shrink-0 transition"
        >
          <Trophy size={12} />
          <span>Earn Nav Coins</span>
        </button>
      )}
    </div>
  );
}
