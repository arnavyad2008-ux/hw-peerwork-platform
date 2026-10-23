'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store';
import { soundEffects } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Coins, RotateCcw, X, Coffee, Zap, Sparkles, Flame } from 'lucide-react';

interface CoffeeRushGameProps {
  onClose: () => void;
}

export function CoffeeRushGame({ onClose }: CoffeeRushGameProps) {
  const { addNavCoins } = useMarketplace();

  const [cupsBrewed, setCupsBrewed] = useState(0);
  const [feverEnergy, setFeverEnergy] = useState(0);
  const [isFeverMode, setIsFeverMode] = useState(false);
  const [perTapPower, setPerTapPower] = useState(1);
  const [coinsCashedOut, setCoinsCashedOut] = useState(0);
  const [highScore, setHighScore] = useState(250);

  // Upgrades
  const [doubleShotBought, setDoubleShotBought] = useState(false);
  const [redBullBought, setRedBullBought] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('peerwork_coffee_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Fever Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFeverMode) {
      soundEffects.playPowerup();
      timer = setTimeout(() => {
        setIsFeverMode(false);
        setFeverEnergy(0);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [isFeverMode]);

  const handleTap = () => {
    soundEffects.playTap();
    const multiplier = isFeverMode ? 5 : 1;
    const gained = perTapPower * multiplier;

    setCupsBrewed((prev) => {
      const next = prev + gained;
      if (next > highScore) {
        setHighScore(next);
        localStorage.setItem('peerwork_coffee_high', next.toString());
      }
      return next;
    });

    if (!isFeverMode) {
      setFeverEnergy((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          setIsFeverMode(true);
          return 100;
        }
        return next;
      });
    }
  };

  const cashOutMoney = () => {
    if (cupsBrewed < 60) return;
    const exchange = Math.floor(cupsBrewed / 60) * 1200; // 60 cups = 1,200 Nav Coins
    soundEffects.playCoin();
    addNavCoins(exchange, `Midnight Barista Cashout: ${cupsBrewed} cups`);
    setCoinsCashedOut((prev) => prev + exchange);
    setCupsBrewed(0);

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const buyUpgrade = (cost: number, bonus: number, type: 'double' | 'redbull') => {
    if (cupsBrewed < cost) return;
    setCupsBrewed((c) => c - cost);
    setPerTapPower((p) => p + bonus);
    soundEffects.playPowerup();

    if (type === 'double') setDoubleShotBought(true);
    if (type === 'redbull') setRedBullBought(true);
  };

  return (
    <div className="relative w-full bg-slate-950 rounded-3xl border-2 border-campus-500/40 p-5 shadow-2xl flex flex-col space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">☕</span>
          <div>
            <h3 className="text-base font-black text-white">Midnight Coffee Rush</h3>
            <p className="text-[11px] text-slate-400">Tap to brew coffee for student devs & earn Nav Coins</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy size={14} /> Record: {highScore} cups
          </span>
          <span className="text-amber-400 flex items-center gap-1">
            <Coins size={14} /> Earned: {coinsCashedOut.toLocaleString()} NC
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Fever Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-amber-400 flex items-center gap-1">
            <Flame size={13} /> {isFeverMode ? '🔥 5x FEVER MODE ACTIVE!' : 'Fever Rush Meter'}
          </span>
          <span className="text-slate-400">{isFeverMode ? 'BURNING!' : `${feverEnergy}%`}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            style={{ width: `${feverEnergy}%` }}
            className={`h-full transition-all duration-150 ${
              isFeverMode ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 animate-pulse' : 'bg-campus-600'
            }`}
          />
        </div>
      </div>

      {/* Main Coffee Tapper */}
      <div className="py-6 flex flex-col items-center justify-center space-y-3 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Total Brewed
        </span>
        <p className="text-4xl font-black text-white tracking-tight">
          {cupsBrewed} <span className="text-lg font-bold text-amber-400">cups</span>
        </p>

        {/* Big Tap Button */}
        <button
          onClick={handleTap}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition-transform active:scale-90 shadow-2xl border-4 ${
            isFeverMode
              ? 'bg-gradient-to-tr from-amber-500 to-rose-600 border-amber-300 animate-bounce'
              : 'bg-gradient-to-tr from-campus-600 to-indigo-600 border-campus-400 hover:scale-105'
          }`}
        >
          ☕
        </button>

        <span className="text-[11px] text-slate-400 font-medium">
          Tap fast! (+{perTapPower * (isFeverMode ? 5 : 1)} per tap)
        </span>
      </div>

      {/* Upgrades & Cashout */}
      <div className="grid grid-cols-3 gap-2.5 text-xs">
        <button
          onClick={() => buyUpgrade(40, 2, 'double')}
          disabled={doubleShotBought || cupsBrewed < 40}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left disabled:opacity-40 hover:border-campus-500 transition"
        >
          <span className="font-bold text-slate-200 block">Double Shot</span>
          <span className="text-[10px] text-amber-400">+2 / tap</span>
          <span className="text-[10px] text-slate-500 block">{doubleShotBought ? 'Unlocked' : 'Cost: 40 cups'}</span>
        </button>

        <button
          onClick={() => buyUpgrade(100, 5, 'redbull')}
          disabled={redBullBought || cupsBrewed < 100}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left disabled:opacity-40 hover:border-campus-500 transition"
        >
          <span className="font-bold text-slate-200 block">Red Bull Boost</span>
          <span className="text-[10px] text-amber-400">+5 / tap</span>
          <span className="text-[10px] text-slate-500 block">{redBullBought ? 'Unlocked' : 'Cost: 100 cups'}</span>
        </button>

        <button
          onClick={cashOutMoney}
          disabled={cupsBrewed < 60}
          className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-left disabled:opacity-40 hover:bg-amber-900/50 transition"
        >
          <span className="font-bold text-amber-300 block flex items-center gap-1">
            <Coins size={12} /> Claim NC
          </span>
          <span className="text-[10px] text-amber-400">60 cups = 1,200 NC</span>
          <span className="text-[10px] text-slate-400 block">Direct to Nav Coins</span>
        </button>
      </div>
    </div>
  );
}
