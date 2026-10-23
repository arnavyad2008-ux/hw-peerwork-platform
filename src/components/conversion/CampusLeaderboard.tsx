'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { 
  Trophy, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Crown, 
  Star, 
  GraduationCap 
} from 'lucide-react';

export function CampusLeaderboard() {
  const { allUsers, currentUser } = useMarketplace();

  // Sort freelancers by Pro status first, then total_earned + rating
  const rankedPeers = [...allUsers].sort((a, b) => {
    const proDiff = (b.is_pro ? 1 : 0) - (a.is_pro ? 1 : 0);
    if (proDiff !== 0) return proDiff;
    return b.total_earned - a.total_earned;
  });

  return (
    <div className="rounded-2xl bg-[#121216]/80 backdrop-blur-md border border-white/10 p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Institutional Status &amp; Velocity Leaderboard
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-0.5">
            Top-Ranked Campus Developers &amp; Verified Peers
          </h3>
        </div>
        <span className="text-[11px] px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
          Pinned to Top of Client Search Results
        </span>
      </div>

      <div className="space-y-3">
        {rankedPeers.map((peer, index) => {
          const isMe = peer.id === currentUser.id;
          const badgeLabel =
            peer.institutional_badge ||
            `Verified ${peer.college_name.split(' ')[0]} Developer`;
          const streak = peer.streak_days || 12 - index * 2;
          const responseMins = peer.avg_response_mins || index + 2;

          return (
            <div
              key={peer.id}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isMe
                  ? 'bg-indigo-950/35 border-indigo-500/50 shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Rank Medal */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    index === 0
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : index === 1
                      ? 'bg-slate-300 text-slate-950'
                      : index === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{index + 1}
                </div>

                <div className="relative shrink-0">
                  <img
                    src={peer.avatar_url}
                    alt={peer.full_name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  {peer.is_pro && (
                    <span
                      title="Pro Commission Shield Active"
                      className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow"
                    >
                      <Crown size={11} />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      {peer.full_name} {isMe && <span className="text-indigo-400 text-xs">(You)</span>}
                    </h4>

                    {/* Institutional Status Badge */}
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
                      <ShieldCheck size={11} className="text-indigo-400" />
                      {badgeLabel}
                    </span>

                    {peer.is_pro && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold">
                        <Crown size={10} /> 0% Fee Elite
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <GraduationCap size={12} className="text-slate-500" />
                      {peer.college_name}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Flame size={12} /> {streak}d Responder Streak
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Zap size={12} /> ~{responseMins}m reply
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Metrics */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                <span className="text-sm font-black text-emerald-400">
                  ₹{peer.total_earned.toLocaleString('en-IN')} earned
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star size={12} className="fill-amber-400" />
                  <span>{peer.rating_average.toFixed(2)}</span>
                  <span className="text-slate-500 font-normal">({peer.rating_count})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
