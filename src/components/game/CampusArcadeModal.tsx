'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '@/lib/store';
import { 
  Gamepad2, 
  Trophy, 
  Coins, 
  X, 
  Zap, 
  Flame, 
  ArrowLeft, 
  Sparkles,
  Bug,
  Rocket,
  Keyboard,
  Puzzle,
  Coffee,
  ShieldCheck
} from 'lucide-react';
import { FlappyDevGame } from './FlappyDevGame';
import { SpeedTyperGame } from './SpeedTyperGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { CoffeeRushGame } from './CoffeeRushGame';
import { CyberSnakeGame } from './CyberSnakeGame';
import { soundEffects } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

export type ArcadeGameType = 
  | 'menu'
  | 'bug_blitz'
  | 'flappy_dev'
  | 'speed_typer'
  | 'memory_match'
  | 'coffee_rush'
  | 'cyber_snake';

interface CampusArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGame?: ArcadeGameType;
}

export function CampusArcadeModal({ isOpen, onClose, initialGame = 'menu' }: CampusArcadeModalProps) {
  const { currentUser, addNavCoins } = useMarketplace();
  const [selectedGame, setSelectedGame] = useState<ArcadeGameType>(initialGame);

  // Bug Blitz Internal State
  const [bugScore, setBugScore] = useState(0);
  const [bugCoins, setBugCoins] = useState(0);
  const [bugTime, setBugTime] = useState(30);
  const [bugState, setBugState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [activeBugs, setActiveBugs] = useState<{ id: number; x: number; y: number; pts: number; nav: number; emoji: string }[]>([]);

  const bugCoinsRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount or modal close
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnerRef.current) clearInterval(spawnerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Bug Blitz Game Runner (Tuned Harder: Fast Decay, precise clicks, high Nav Coin yield)
  const startBugBlitz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnerRef.current) clearInterval(spawnerRef.current);

    setBugScore(0);
    setBugCoins(0);
    bugCoinsRef.current = 0;
    setBugTime(25);
    setActiveBugs([]);
    setBugState('playing');

    timerRef.current = setInterval(() => {
      setBugTime((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (spawnerRef.current) clearInterval(spawnerRef.current);
          setTimeout(() => endBugBlitz(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnerRef.current = setInterval(() => {
      const items = [
        { emoji: '🐛', pts: 50, nav: 120 },
        { emoji: '🚀', pts: 80, nav: 180 },
        { emoji: '☕', pts: 40, nav: 90 },
        { emoji: '💎', pts: 150, nav: 350 },
      ];
      const pick = items[Math.floor(Math.random() * items.length)];
      setActiveBugs((prev) => [
        ...prev.slice(-4), // Fewer simultaneous targets for harder focus
        {
          id: Date.now() + Math.random(),
          x: Math.floor(Math.random() * 75) + 12,
          y: Math.floor(Math.random() * 60) + 15,
          pts: pick.pts,
          nav: pick.nav,
          emoji: pick.emoji,
        }
      ]);
    }, 550);
  };

  const clickBug = (id: number, pts: number, nav: number) => {
    soundEffects.playCoin();
    setBugScore((s) => s + pts);
    bugCoinsRef.current += nav;
    setBugCoins(bugCoinsRef.current);
    setActiveBugs((prev) => prev.filter((b) => b.id !== id));
  };

  const endBugBlitz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnerRef.current) clearInterval(spawnerRef.current);
    setBugState('gameover');
    soundEffects.playWin();

    const finalCoins = bugCoinsRef.current;
    if (finalCoins > 0) {
      addNavCoins(finalCoins, 'Bug Bounty Blitz Score');
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const GAMES = [
    {
      id: 'bug_blitz' as ArcadeGameType,
      title: 'Bug Bounty Blitz',
      category: 'Reflex & Precision',
      desc: 'Rapidly squish runtime bugs & merge PRs in 25 seconds. High speed, high precision.',
      icon: '🐛',
      badge: 'Up to 1,500 Nav',
      color: 'from-indigo-600 to-slate-800',
    },
    {
      id: 'flappy_dev' as ArcadeGameType,
      title: 'Flappy Dev: Cloud Deploy',
      category: 'Endless Flight',
      desc: 'Fly your developer rocket through firewall pipes. Hard physics: crash and you reboot.',
      icon: '🚀',
      badge: '+40 Nav / server',
      color: 'from-slate-800 to-indigo-900',
    },
    {
      id: 'speed_typer' as ArcadeGameType,
      title: 'Hackathon Speed Typer',
      category: 'Syntax Sprint',
      desc: 'Type real React, SQL, and Next.js syntax snippets. Earn Nav Coins proportional to WPM.',
      icon: '⚡',
      badge: 'Up to 2,000 Nav',
      color: 'from-indigo-900 to-slate-900',
    },
    {
      id: 'memory_match' as ArcadeGameType,
      title: 'Tech Stack Memory Match',
      category: 'Memory Puzzle',
      desc: 'Match 8 pairs of tech logos in under 18 moves for an instant bonus grant.',
      icon: '🧩',
      badge: '+1,000 Nav Bonus',
      color: 'from-slate-900 to-indigo-950',
    },
    {
      id: 'coffee_rush' as ArcadeGameType,
      title: 'Midnight Coffee Rush',
      category: 'Clicker Tycoon',
      desc: 'Brew coffee for your team! Trigger 5x Fever Mode and trade espresso cups for Nav Coins.',
      icon: '☕',
      badge: 'Up to 2,500 Nav',
      color: 'from-amber-950/70 to-slate-900',
    },
    {
      id: 'cyber_snake' as ArcadeGameType,
      title: 'Campus LAN Cyber Snake',
      category: 'Retro Arcade',
      desc: 'Retro grid snake eating RAM chips. Speed ramps up with every bit consumed.',
      icon: '🐍',
      badge: '+50 Nav / RAM chip',
      color: 'from-slate-900 to-indigo-900',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6">
        {selectedGame === 'flappy_dev' ? (
          <FlappyDevGame onClose={() => setSelectedGame('menu')} />
        ) : selectedGame === 'speed_typer' ? (
          <SpeedTyperGame onClose={() => setSelectedGame('menu')} />
        ) : selectedGame === 'memory_match' ? (
          <MemoryMatchGame onClose={() => setSelectedGame('menu')} />
        ) : selectedGame === 'coffee_rush' ? (
          <CoffeeRushGame onClose={() => setSelectedGame('menu')} />
        ) : selectedGame === 'cyber_snake' ? (
          <CyberSnakeGame onClose={() => setSelectedGame('menu')} />
        ) : selectedGame === 'bug_blitz' ? (
          <div className="bg-slate-950 border-2 border-campus-500/40 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 select-none text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedGame('menu')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-bold text-base">Bug Bounty Blitz (25s)</h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-amber-400">Score: {bugScore}</span>
                <span className="text-indigo-300">Nav: +{bugCoins}</span>
                <span className="text-slate-400 font-mono">⏳ {bugTime}s</span>
              </div>
            </div>

            <div className="relative h-[300px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              {bugState === 'idle' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                  <span className="text-4xl">🐛</span>
                  <h4 className="text-xl font-bold">25s Bug Squashing Sprint</h4>
                  <p className="text-xs text-slate-400">Squish runtime bugs & merge PRs before time runs out!</p>
                  <p className="text-[11px] text-amber-400/80">Rewards: Nav Coins (100,000 Nav Coins = ₹1)</p>
                  <button
                    onClick={startBugBlitz}
                    className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
                  >
                    START SPRINT
                  </button>
                </div>
              ) : bugState === 'playing' ? (
                activeBugs.map((bug) => (
                  <button
                    key={bug.id}
                    onClick={() => clickBug(bug.id, bug.pts, bug.nav)}
                    style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
                    className="absolute p-2.5 rounded-2xl bg-slate-800 hover:scale-125 border border-slate-700 shadow-xl transition-transform"
                  >
                    <span className="text-2xl">{bug.emoji}</span>
                  </button>
                ))
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 text-center">
                  <h4 className="text-2xl font-black text-white">Sprint Finished!</h4>
                  <p className="text-xs text-slate-300">
                    Earned <strong className="text-amber-400 text-sm font-bold">+{bugCoins.toLocaleString()} Nav Coins</strong> added to your profile!
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={startBugBlitz}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setSelectedGame('menu')}
                      className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
                    >
                      Game Menu
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ARCADE MAIN MENU (6 GAMES) */
          <div className="bg-slate-950 border-2 border-campus-500/50 rounded-3xl p-6 shadow-2xl text-white space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-campus-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                  <Gamepad2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-campus-300">
                      Campus Code Arcade Hub
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      6 Addictive Games
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Play addictive micro-games to mine Nav Coins (100,000 NC = ₹1 INR)!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Coins size={14} className="text-amber-400" />
                  <span>{(currentUser.nav_coins || 0).toLocaleString()} NC</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Games Grid (6 Games) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
              {GAMES.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-campus-500 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl p-2 rounded-xl bg-slate-800/80 group-hover:scale-110 transition-transform">
                        {game.icon}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {game.badge}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white group-hover:text-campus-400 transition-colors">
                      {game.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {game.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-500 font-medium">{game.category}</span>
                    <span className="font-bold text-campus-400 group-hover:translate-x-1 transition-transform">
                      Play Now ➔
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Leaderboard snippet */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-400" />
                <span>Weekly Campus Leaderboard: <strong>IIT Delhi (#1)</strong> • <strong>DTU (#2)</strong></span>
              </span>
              <span className="text-emerald-400 font-bold">100% Free Campus Entertainment</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
