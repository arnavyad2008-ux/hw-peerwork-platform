'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Cpu, 
  Terminal, 
  Coins, 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { Gig, UserProfile, GigCategory } from '@/types';
import { calculateSkillMatch, rankGigsForStudent } from '@/lib/skillMatcher';

interface SmartTaskBoardProps {
  gigs: Gig[];
  currentUser: UserProfile;
  onSelectGig: (gig: Gig) => void;
  onOpenPostGig: () => void;
}

export function SmartTaskBoard({
  gigs,
  currentUser,
  onSelectGig,
  onOpenPostGig,
}: SmartTaskBoardProps) {
  const [feedMode, setFeedMode] = useState<'recommended' | 'all'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minBudget, setMinBudget] = useState<number>(0);

  // Compute intelligent matches with memoization for < 50ms render latency
  const rankedGigs = useMemo(() => {
    return rankGigsForStudent(gigs, currentUser);
  }, [gigs, currentUser]);

  const filteredGigs = useMemo(() => {
    let source = feedMode === 'recommended' ? rankedGigs : gigs.map((g) => ({ ...g, match: calculateSkillMatch(currentUser, g) }));

    return source.filter((gig) => {
      // Search
      const matchesSearch = 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.required_skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory = selectedCategory === 'all' || gig.category === selectedCategory;

      // Budget
      const matchesBudget = gig.budget >= minBudget;

      return matchesSearch && matchesCategory && matchesBudget;
    });
  }, [rankedGigs, gigs, feedMode, searchQuery, selectedCategory, minBudget, currentUser]);

  const CATEGORIES = [
    { id: 'all', label: 'All Fields' },
    { id: 'coding', label: 'Coding & Scripts' },
    { id: 'web_dev', label: 'Web Dev & Full-Stack' },
    { id: 'design', label: 'UI/UX & Graphics' },
    { id: 'writing', label: 'Technical Writing' },
    { id: 'tutoring', label: 'Peer Tutoring' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Control Deck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#121216]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            <Sparkles size={12} /> AI Skill-Matching Engine v2.4
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Campus Micro-Task Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Verified gigs posted by student peers across Delhi University, IITs, and engineering colleges. Escrow guaranteed.
          </p>
        </div>

        {/* Post Gig CTA */}
        <button
          onClick={onOpenPostGig}
          className="self-start md:self-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-[0_0_25px_rgba(99,102,241,0.35)] transition active:scale-95 shrink-0"
        >
          Post a Task (Client)
        </button>
      </div>

      {/* Feed Mode Toggle & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Toggle Recommended vs All */}
        <div className="p-1 rounded-2xl bg-slate-900 border border-white/5 flex items-center self-start">
          <button
            onClick={() => setFeedMode('recommended')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              feedMode === 'recommended'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>Recommended for You</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
              {currentUser.skills.length} Skills
            </span>
          </button>

          <button
            onClick={() => setFeedMode('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              feedMode === 'all'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>All Open Gigs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
              {gigs.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by keywords, React, Python, UI/UX..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0a0a0d] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition ${
              selectedCategory === cat.id
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 font-bold'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:border-white/15'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gigs Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredGigs.length === 0 ? (
            <div className="col-span-2 text-center py-16 space-y-3 rounded-3xl bg-[#121216]/40 border border-white/5 p-8">
              <Terminal size={32} className="text-slate-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No Matching Gigs Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No active tasks match your current filter parameters. Try switching to &quot;All Open Gigs&quot; or resetting the category.
              </p>
            </div>
          ) : (
            filteredGigs.map((gig) => {
              const match = gig.match;
              const isHighMatch = match.score >= 80;

              return (
                <motion.article
                  layout
                  key={gig.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  onClick={() => onSelectGig(gig)}
                  className="p-6 sm:p-7 rounded-3xl bg-[#121216]/70 backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-5 cursor-pointer shadow-xl relative group"
                >
                  <div className="space-y-4">
                    {/* Top Header: Match score & Category */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Match Score Badge */}
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                            isHighMatch
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : match.score >= 50
                              ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                              : 'bg-slate-500/10 text-slate-400 border-white/5'
                          }`}
                        >
                          <Zap size={11} className={isHighMatch ? 'text-emerald-400 fill-emerald-400' : ''} />
                          <span>{match.score}% Compatibility</span>
                        </div>

                        {match.academicAffinity && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-cyan-300 font-mono">
                            <GraduationCap size={12} /> Branch Fit
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                        {gig.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {gig.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {gig.description}
                      </p>
                    </div>

                    {/* Required Skills & Match Breakdown */}
                    <div className="space-y-2 pt-1">
                      <div className="flex flex-wrap gap-1.5">
                        {gig.required_skills.map((skill) => {
                          const isMatched = match.matchedSkills.includes(skill);
                          return (
                            <span
                              key={skill}
                              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono border transition ${
                                isMatched
                                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-semibold'
                                  : 'bg-white/[0.02] text-slate-400 border-white/5'
                              }`}
                            >
                              {isMatched ? '✓ ' : ''}{skill}
                            </span>
                          );
                        })}
                      </div>

                      {match.missingSkills.length > 0 && isHighMatch && (
                        <p className="text-[10px] text-slate-500 font-mono">
                          Missing: <span className="text-slate-400">{match.missingSkills.join(', ')}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer: Budget, Client, Action */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Fixed Escrow</span>
                      <span className="text-lg font-black text-white font-mono">
                        ₹{gig.budget.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock size={12} /> {gig.turnaround_time}
                      </span>
                      <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 group-hover:bg-indigo-500 shadow transition flex items-center gap-1.5">
                        <span>Inspect & Bid</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
