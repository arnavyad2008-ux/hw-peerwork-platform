'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store';
import { soundEffects } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Coins, RotateCcw, X, Sparkles, CheckCircle2 } from 'lucide-react';

const TECH_CARDS = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Python', icon: '🐍' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Tailwind', icon: '🌊' },
  { name: 'Supabase', icon: '⚡' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'Terminal', icon: '💻' },
];

interface CardItem {
  id: number;
  name: string;
  icon: string;
  flipped: boolean;
  matched: boolean;
}

interface MemoryMatchGameProps {
  onClose: () => void;
}

export function MemoryMatchGame({ onClose }: MemoryMatchGameProps) {
  const { addNavCoins } = useMarketplace();

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bestMoves, setBestMoves] = useState(14);

  useEffect(() => {
    const saved = localStorage.getItem('peerwork_memory_best');
    if (saved) setBestMoves(parseInt(saved, 10));
    resetGame();
  }, []);

  const resetGame = () => {
    const paired = [...TECH_CARDS, ...TECH_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        name: item.name,
        icon: item.icon,
        flipped: false,
        matched: false,
      }));

    setCards(paired);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setIsCompleted(false);
  };

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || selectedCards.length === 2) {
      return;
    }

    soundEffects.playFlip();

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newSelected;

      if (cards[first].name === cards[second].name) {
        // Matched!
        soundEffects.playCoin();
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setSelectedCards([]);
        setMatches((prev) => {
          const next = prev + 1;
          if (next === TECH_CARDS.length) {
            handleWin(moves + 1);
          }
          return next;
        });
      } else {
        // Not matched - flip back after 750ms
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setSelectedCards([]);
        }, 750);
      }
    }
  };

  const handleWin = (finalMoves: number) => {
    setIsCompleted(true);
    soundEffects.playWin();

    if (finalMoves < bestMoves) {
      setBestMoves(finalMoves);
      localStorage.setItem('peerwork_memory_best', finalMoves.toString());
    }

    const navEarned = 1000;
    addNavCoins(navEarned, `Tech Memory Match: Solved in ${finalMoves} moves`);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch (e) {}
  };

  return (
    <div className="relative w-full bg-slate-950 rounded-3xl border-2 border-campus-500/40 p-5 shadow-2xl flex flex-col space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-spin">🧩</span>
          <div>
            <h3 className="text-base font-black text-white">Tech Stack Memory Match</h3>
            <p className="text-[11px] text-slate-400">Match 8 tech pairs in minimal moves for 1,000 Nav Coins</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy size={14} /> Best: {bestMoves} moves
          </span>
          <span className="text-slate-300">Moves: {moves}</span>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2.5 p-3 bg-slate-900 rounded-2xl border border-slate-800">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => handleCardClick(i)}
            className={`h-16 sm:h-20 rounded-xl font-bold flex flex-col items-center justify-center transition-all duration-300 transform ${
              card.flipped || card.matched
                ? 'bg-gradient-to-tr from-campus-900 via-indigo-900 to-purple-900 border-2 border-campus-400 scale-95 shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:scale-105'
            }`}
          >
            {card.flipped || card.matched ? (
              <>
                <span className="text-2xl">{card.icon}</span>
                <span className="text-[10px] text-slate-200 mt-1">{card.name}</span>
              </>
            ) : (
              <span className="text-slate-500 text-lg font-black">?</span>
            )}
          </button>
        ))}
      </div>

      {/* Win Banner */}
      {isCompleted && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
          <h4 className="text-base font-black text-emerald-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={18} /> Grid Completed in {moves} moves!
          </h4>
          <p className="text-xs text-slate-300">
            Awarded <strong className="text-amber-400 font-bold">+1,000 NC</strong> directly to your Nav Coins vault.
          </p>
          <button
            onClick={resetGame}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition shadow"
          >
            <RotateCcw size={12} className="inline mr-1" /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}
