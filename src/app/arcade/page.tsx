'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CampusArcadeModal, ArcadeGameType } from '@/components/game/CampusArcadeModal';
import { useMarketplace } from '@/lib/store';
import { 
  Gamepad2, 
  Trophy, 
  Coins, 
  Sparkles, 
  Flame, 
  ArrowLeft, 
  Zap, 
  ShieldCheck,
  Play
} from 'lucide-react';

export default function ArcadePage() {
  const { currentUser } = useMarketplace();
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<ArcadeGameType>('menu');

  const openSpecificGame = (game: ArcadeGameType) => {
    setSelectedGame(game);
    setIsArcadeOpen(true);
  };

  const ARCADE_GAMES = [
    {
      id: 'bug_blitz' as ArcadeGameType,
      title: 'Bug Bounty Blitz',
      category: 'Reflex & Precision',
      emoji: '🐛',
      desc: '25-second sprint! Click bugs, merge PRs, and dodge scope creep hazards.',
      reward: 'Up to 1,500 Nav Coins',
      difficulty: 'Medium',
    },
    {
      id: 'flappy_dev' as ArcadeGameType,
      title: 'Flappy Dev: Cloud Deploy',
      category: 'Endless Flight',
      emoji: '🚀',
      desc: 'Navigate your developer rocket through server firewall pipes without crashing.',
      reward: '+40 Nav Coins / server',
      difficulty: 'Hard',
    },
    {
      id: 'speed_typer' as ArcadeGameType,
      title: 'Hackathon Speed Typer',
      category: 'Syntax Sprint',
      emoji: '⚡',
      desc: 'Type real React, SQL, and Next.js snippets. Proportional payout per WPM.',
      reward: 'Up to 2,000 Nav Coins',
      difficulty: 'Medium',
    },
    {
      id: 'memory_match' as ArcadeGameType,
      title: 'Tech Stack Memory Match',
      category: 'Memory Puzzle',
      emoji: '🧩',
      desc: 'Flip and match 8 pairs of tech stack icons (React, Next.js, Python, Supabase).',
      reward: '+1,000 Nav Coins',
      difficulty: 'Easy',
    },
    {
      id: 'coffee_rush' as ArcadeGameType,
      title: 'Midnight Coffee Rush',
      category: 'Clicker Tycoon',
      emoji: '☕',
      desc: 'Tap rush clicker! Brew coffee for campus developers, trigger 5x Fever Mode, and cash out.',
      reward: '60 cups = 1,200 Nav Coins',
      difficulty: 'Addictive',
    },
    {
      id: 'cyber_snake' as ArcadeGameType,
      title: 'Campus LAN Cyber Snake',
      category: 'Retro Arcade',
      desc: 'Classic retro grid snake! Eat RAM chips and milestone tokens while dodging firewalls.',
      reward: '+50 Nav Coins / RAM chip',
      difficulty: 'Classic',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
      >
        <ArrowLeft size={14} /> Back to Overview
      </Link>

      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl glass text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-white/10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-xs border border-indigo-500/20 w-fit">
            <Gamepad2 size={16} /> hw • Nav Coins Arcade
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Play, Compete & Earn Nav Coins
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Take a high-focus break from assignments. Test your reflexes, speed, and memory across 6 tuned games. 
            Earn Nav Coins to convert to real cash (<strong>100,000 Nav Coins = ₹1</strong>) in your campus escrow wallet.
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-indigo-300">
            <span>⭐ Player: {currentUser.full_name}</span>
            <span>•</span>
            <span>🪙 Nav Coins: {(currentUser.nav_coins || 0).toLocaleString()}</span>
            <span>•</span>
            <span>💰 INR Wallet: ₹{currentUser.wallet_balance}</span>
          </div>
        </div>

        <button
          onClick={() => openSpecificGame('menu')}
          className="px-8 py-4 rounded-2xl text-xs sm:text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition shrink-0"
        >
          LAUNCH NAV ARCADE
        </button>
      </div>

      {/* 6 Games Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Select a Game to Play
          </h2>
          <span className="text-xs text-slate-500">6 games available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARCADE_GAMES.map((game) => (
            <div
              key={game.id}
              className="glass rounded-3xl p-6 transition flex flex-col justify-between space-y-4 group hover:border-indigo-500/50"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {game.emoji}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {game.reward}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {game.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {game.category} • {game.difficulty}
                </span>

                <button
                  onClick={() => openSpecificGame(game.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition active:scale-95"
                >
                  <Play size={13} className="fill-white" />
                  <span>Launch</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Campus Leaderboard */}
      <div className="glass rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            <h3 className="text-lg font-bold">Inter-College Nav Coin Masters</h3>
          </div>
          <span className="text-xs text-slate-400">100k Nav Coins = ₹1 INR</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { rank: '🥇 1st', name: 'Arnav Yadav', college: 'IIT Delhi', points: '142,500 Nav', cash: 'Worth ₹1.42' },
            { rank: '🥈 2nd', name: 'Rohit Mehta', college: 'DTU', points: '115,000 Nav', cash: 'Worth ₹1.15' },
            { rank: '🥉 3rd', name: 'Ananya Sharma', college: 'NSUT', points: '98,000 Nav', cash: 'Near ₹1 Goal' },
            { rank: '4th', name: 'Kabir Verma', college: 'BITS Pilani', points: '84,000 Nav', cash: 'Near ₹1 Goal' },
          ].map((entry, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">{entry.rank}</span>
                <span className="text-xs font-black text-amber-300">{entry.points}</span>
              </div>
              <p className="font-bold text-sm text-slate-100">{entry.name}</p>
              <p className="text-xs text-slate-400">{entry.college}</p>
              <span className="text-[10px] text-slate-500 block pt-1">{entry.cash}</span>
            </div>
          ))}
        </div>
      </div>

      <CampusArcadeModal
        isOpen={isArcadeOpen}
        onClose={() => setIsArcadeOpen(false)}
        initialGame={selectedGame}
      />
    </div>
  );
}
