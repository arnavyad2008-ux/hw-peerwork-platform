'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Crown, 
  Zap, 
  TrendingUp, 
  Check, 
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ZeroFeeVelocityCard() {
  const { currentUser, upgradeToPro } = useMarketplace();
  const [monthlyVolume, setMonthlyVolume] = useState<number>(5000);
  const [justUpgraded, setJustUpgraded] = useState(false);

  const feeLostPerMonth = Math.round(monthlyVolume * 0.1); // 10% platform commission on Free tier
  const annualLoss = feeLostPerMonth * 12;

  const handleActivateShield = () => {
    upgradeToPro();
    setJustUpgraded(true);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  return (
    <div className="rounded-2xl bg-[#121216]/85 backdrop-blur-md border border-indigo-500/30 p-6 shadow-2xl space-y-5 relative overflow-hidden">
      {/* Ambient Cyber Accent */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <ShieldAlert size={13} className="text-rose-400" />
            <span>Zero-Fee Velocity • Commission Shield</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Stop giving away{' '}
            <span className="text-rose-400 underline decoration-rose-500/60">
              ₹{feeLostPerMonth.toLocaleString('en-IN')}
            </span>{' '}
            of your gig money to platform fees.{' '}
            <span className="text-indigo-400">Keep 100% with Pro.</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Standard accounts lose <strong className="text-rose-300">10% on every completed gig</strong> (that&apos;s{' '}
            <strong className="text-rose-300">₹{annualLoss.toLocaleString('en-IN')}/year</strong> drained from your work).
            Activate the <strong>hw Pro Commission Shield</strong> to lock in <strong>0% platform fees</strong>, instant priority
            ranking on client task boards, and a verified Institutional Elite badge.
          </p>
        </div>

        {/* Interactive Loss Aversion Slider & Tier Comparison */}
        <div className="w-full lg:w-80 shrink-0 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-semibold">Your Monthly Gig Earnings:</span>
              <span className="font-black text-white">₹{monthlyVolume.toLocaleString('en-IN')}/mo</span>
            </div>
            <input
              type="range"
              min={2000}
              max={40000}
              step={1000}
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/40">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">Free Tier (10% Fee)</span>
              <span className="text-sm font-black text-rose-300">-₹{feeLostPerMonth.toLocaleString('en-IN')} lost</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-700/40">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Pro Shield (0% Fee)</span>
              <span className="text-sm font-black text-emerald-300">Keep 100% (₹0 fee)</span>
            </div>
          </div>

          {currentUser.is_pro ? (
            <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
              <ShieldCheck size={16} />
              <span>{justUpgraded ? '0% Commission Shield Activated!' : 'Pro Commission Shield Active (0% Fee)'}</span>
            </div>
          ) : (
            <button
              onClick={handleActivateShield}
              className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Crown size={15} />
              <span>Activate 0% Commission Shield (₹199/mo)</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Perks Strip */}
      <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Check size={14} className="text-emerald-400 shrink-0" />
          <span><strong>0% Platform Cut:</strong> Keep every rupee of your campus escrow payouts</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-amber-400 shrink-0" />
          <span><strong>Pinned Leaderboard Status:</strong> Rank #1 above free applicants</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-400 shrink-0" />
          <span><strong>+15% AI Match Velocity:</strong> Instant client alert when you bid</span>
        </div>
      </div>
    </div>
  );
}
