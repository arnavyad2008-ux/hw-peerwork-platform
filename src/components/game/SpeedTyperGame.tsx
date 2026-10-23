'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '@/lib/store';
import { soundEffects } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Coins, RotateCcw, X, Keyboard, Zap, CheckCircle2 } from 'lucide-react';

const CODE_PROMPTS = [
  'npm run dev',
  'git push origin main',
  'const [state, setState] = useState(true);',
  'export default function Header() { return <nav />; }',
  'SELECT * FROM gigs WHERE status = \'open\';',
  'supabase.auth.signInWithPassword({ email, password });',
  'flex items-center justify-between gap-4',
  'const response = await fetch(\'/api/orders\');',
  'border border-slate-800 rounded-2xl shadow-xl',
  'import { useMarketplace } from \'@/lib/store\';'
];

interface SpeedTyperGameProps {
  onClose: () => void;
}

export function SpeedTyperGame({ onClose }: SpeedTyperGameProps) {
  const { addNavCoins } = useMarketplace();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [promptIndex, setPromptIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [charsTyped, setCharsTyped] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [highWPM, setHighWPM] = useState(65);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('peerwork_typer_high');
    if (saved) setHighWPM(parseInt(saved, 10));
  }, []);

  const startGame = () => {
    setPromptIndex(0);
    setUserInput('');
    setTimeLeft(30);
    setCharsTyped(0);
    setCorrectWords(0);
    setGameState('playing');

    setTimeout(() => inputRef.current?.focus(), 100);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(() => endGame(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    const val = e.target.value;
    setUserInput(val);
    soundEffects.playType();
    setCharsTyped((prev) => prev + 1);

    const currentTarget = CODE_PROMPTS[promptIndex];
    if (val === currentTarget) {
      soundEffects.playCoin();
      setCorrectWords((w) => w + 1);
      setUserInput('');
      setPromptIndex((idx) => (idx + 1) % CODE_PROMPTS.length);
    }
  };

  const endGame = () => {
    setGameState('gameover');
    if (timerRef.current) clearInterval(timerRef.current);
    soundEffects.playWin();

    const wpm = Math.round((charsTyped / 5) * 2); // 30s multiplied to 60s
    if (wpm > highWPM) {
      setHighWPM(wpm);
      localStorage.setItem('peerwork_typer_high', wpm.toString());
    }

    const navEarned = Math.max(wpm * 25, 200); // e.g. 60 WPM = 1,500 Nav Coins
    addNavCoins(navEarned, `Speed Typer WPM: ${wpm}`);

    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const currentTarget = CODE_PROMPTS[promptIndex];
  const currentWpm = Math.round((charsTyped / 5) * (60 / Math.max(30 - timeLeft, 1)));

  return (
    <div className="relative w-full bg-slate-950 rounded-3xl border-2 border-campus-500/40 p-5 shadow-2xl flex flex-col space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">⚡</span>
          <div>
            <h3 className="text-base font-black text-white">Hackathon Speed Typer</h3>
            <p className="text-[11px] text-slate-400">Type syntax with speed and earn Nav Coins per WPM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy size={14} /> Best: {highWPM} WPM
          </span>
          <span className="text-indigo-400 flex items-center gap-1 font-mono">
            ⏳ {timeLeft}s
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="min-h-[260px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
        {gameState === 'idle' ? (
          <div className="my-auto text-center space-y-3">
            <Keyboard size={40} className="text-indigo-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-black text-white">30s Code Speed Sprint</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Real syntax snippets from React, Next.js, and SQL. Hit high WPM to earn Nav Coins (100k = ₹1)!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-campus-600 hover:bg-campus-500 transition shadow-lg"
            >
              START TYPING TEST
            </button>
          </div>
        ) : gameState === 'playing' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>WPM: <strong className="text-white text-sm font-black">{currentWpm}</strong></span>
              <span>Lines Completed: <strong className="text-emerald-400 text-sm font-black">{correctWords}</strong></span>
            </div>

            {/* Target Snippet */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm sm:text-base tracking-wide text-slate-300">
              {currentTarget.split('').map((char, i) => {
                let color = 'text-slate-500';
                if (i < userInput.length) {
                  color = userInput[i] === char ? 'text-emerald-400 font-bold' : 'text-rose-500 bg-rose-950/60 font-bold';
                }
                return <span key={i} className={color}>{char}</span>;
              })}
            </div>

            {/* Typing Input */}
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type snippet here..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border-2 border-campus-500 text-sm font-mono text-white focus:outline-none focus:ring-4 focus:ring-campus-500/20 shadow-inner"
            />
          </div>
        ) : (
          <div className="my-auto text-center space-y-3">
            <h4 className="text-2xl font-black text-white">Sprint Finished!</h4>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <div>
                <span className="text-slate-400 text-[10px]">Your Speed</span>
                <p className="text-xl font-black text-amber-400">{Math.round((charsTyped / 5) * 2)} WPM</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Reward</span>
                <p className="text-xl font-black text-amber-400">+{Math.max(Math.round((charsTyped / 5) * 2) * 25, 200).toLocaleString()} NC</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-500 transition shadow"
            >
              <RotateCcw size={14} className="inline mr-1.5" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
