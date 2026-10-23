'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketplace } from '@/lib/store';
import { 
  ShieldCheck, 
  Github, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Code2, 
  GraduationCap, 
  Crown,
  ArrowRight
} from 'lucide-react';

export function GamifiedProfileMeter() {
  const { currentUser, updateCurrentUserProfile, upgradeToPro } = useMarketplace();
  const [githubInput, setGithubInput] = useState('');
  const [showGithubPrompt, setShowGithubPrompt] = useState(false);

  const milestones = useMemo(() => {
    const hasVerifiedEmail = Boolean(currentUser.verified_student && currentUser.email);
    const hasBioAndBranch = Boolean(currentUser.bio && currentUser.bio.length > 15 && currentUser.branch);
    const hasSkills = Boolean(currentUser.skills && currentUser.skills.length >= 4);
    const hasGithub = Boolean(
      currentUser.portfolio_links &&
        currentUser.portfolio_links.some(
          (l) => l.title.toLowerCase().includes('github') || l.url.toLowerCase().includes('github.com')
        )
    );
    const hasProShield = Boolean(currentUser.is_pro);

    return [
      {
        id: 'verified',
        label: 'Verified Institutional ID',
        points: 20,
        done: hasVerifiedEmail,
        badge: '🎓 Campus Verified',
        hint: 'Verify your university email',
      },
      {
        id: 'academic',
        label: 'Academic Bio & Branch',
        points: 20,
        done: hasBioAndBranch,
        badge: '📘 Domain Specialist',
        hint: 'Complete your campus bio & major',
      },
      {
        id: 'skills',
        label: '4+ Core Technical Skills',
        points: 20,
        done: hasSkills,
        badge: '⚡ Skill Indexed',
        hint: 'Add at least 4 skills for AI matching',
      },
      {
        id: 'github',
        label: 'GitHub / Code Repository Link',
        points: 20,
        done: hasGithub,
        badge: '💻 Proof-of-Work',
        hint: 'Add your GitHub link to unlock +20%',
      },
      {
        id: 'pro',
        label: 'Elite Pro Commission Shield',
        points: 20,
        done: hasProShield,
        badge: '👑 0% Fee Elite',
        hint: 'Unlock Pro Shield for 100% profile power',
      },
    ];
  }, [currentUser]);

  const strengthScore = milestones.reduce((acc, m) => acc + (m.done ? m.points : 0), 0);
  const nextIncomplete = milestones.find((m) => !m.done);

  const handleQuickAddGithub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim()) return;
    const formatted = githubInput.startsWith('http')
      ? githubInput.trim()
      : `https://github.com/${githubInput.trim().replace(/^@/, '')}`;
    const existing = currentUser.portfolio_links || [];
    updateCurrentUserProfile({
      portfolio_links: [...existing, { title: 'GitHub', url: formatted }],
    });
    setGithubInput('');
    setShowGithubPrompt(false);
  };

  const handleQuickUnlockSkill = () => {
    const defaultSkills = ['React', 'Next.js', 'TypeScript', 'Python', 'Tailwind CSS'];
    const merged = Array.from(new Set([...(currentUser.skills || []), ...defaultSkills]));
    updateCurrentUserProfile({ skills: merged });
  };

  return (
    <div className="rounded-2xl bg-[#121216]/75 backdrop-blur-md border border-white/10 p-5 sm:p-6 shadow-xl space-y-4 relative overflow-hidden">
      {/* Subtle top-right cyber glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles size={14} /> Campus Reputation &amp; Profile Investment
            </span>
            {strengthScore === 100 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                MAX VISIBILITY (3.2x)
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Profile Strength: <span className="text-indigo-400">{strengthScore}%</span>
            {nextIncomplete ? (
              <span className="text-xs sm:text-sm font-semibold text-slate-400 ml-2">
                — {nextIncomplete.hint} to unlock {Math.min(100, strengthScore + 20)}%
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-semibold text-emerald-400 ml-2">
                — All Endowment Badges Unlocked! Top-Tier Client Priority Active.
              </span>
            )}
          </h3>
        </div>

        {/* Quick Action CTA for next incomplete milestone */}
        {nextIncomplete && (
          <div className="shrink-0">
            {nextIncomplete.id === 'github' ? (
              <button
                onClick={() => setShowGithubPrompt(!showGithubPrompt)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition"
              >
                <Github size={14} />
                <span>+ Add GitHub (+20%)</span>
              </button>
            ) : nextIncomplete.id === 'pro' ? (
              <button
                onClick={() => upgradeToPro()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/25 transition"
              >
                <Crown size={14} />
                <span>Unlock 100% with Pro Shield</span>
              </button>
            ) : nextIncomplete.id === 'skills' ? (
              <button
                onClick={handleQuickUnlockSkill}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                <Code2 size={14} />
                <span>Auto-Index Core Stack (+20%)</span>
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strengthScore}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400 relative"
        />
      </div>

      {/* Inline GitHub Prompt if active */}
      {showGithubPrompt && (
        <form onSubmit={handleQuickAddGithub} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            required
            placeholder="https://github.com/yourusername"
            value={githubInput}
            onChange={(e) => setGithubInput(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-indigo-500/40 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1"
          >
            <span>Verify &amp; Claim +20%</span>
            <ArrowRight size={13} />
          </button>
        </form>
      )}

      {/* Micro-Badges Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
              m.done
                ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
            }`}
          >
            {m.done ? (
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            ) : (
              <Circle size={15} className="text-slate-600 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[11px] font-bold truncate">{m.badge}</p>
              <p className="text-[10px] opacity-75 truncate">{m.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
