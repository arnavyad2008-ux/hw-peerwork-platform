'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '@/lib/store';
import { soundEffects } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Coins, RotateCcw, X, Play, ArrowUp } from 'lucide-react';

interface FlappyDevGameProps {
  onClose: () => void;
}

export function FlappyDevGame({ onClose }: FlappyDevGameProps) {
  const { addNavCoins, currentUser } = useMarketplace();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [birdY, setBirdY] = useState(150);
  const [velocity, setVelocity] = useState(0);
  const [score, setScore] = useState(0);
  const [navEarned, setNavEarned] = useState(0);
  const [highScore, setHighScore] = useState(12);

  // Pipes: array of { x, topHeight, bottomHeight, passed }
  const [pipes, setPipes] = useState<{ x: number; topHeight: number; bottomHeight: number; passed?: boolean }[]>([]);

  const frameRef = useRef<number | null>(null);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('peerwork_flappy_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const jump = () => {
    if (gameState === 'playing') {
      soundEffects.playJump();
      setVelocity(-7.5);
    } else if (gameState === 'idle' || gameState === 'gameover') {
      startGame();
    }
  };

  const startGame = () => {
    setBirdY(150);
    setVelocity(-6);
    setScore(0);
    setNavEarned(0);
    setPipes([
      { x: 380, topHeight: 90, bottomHeight: 130 },
      { x: 580, topHeight: 120, bottomHeight: 100 },
    ]);
    setGameState('playing');
  };

  // Main Physics & Collision Loop (Harder: Higher gravity, tighter gap)
  useEffect(() => {
    if (gameState !== 'playing') return;

    let birdPos = birdY;
    let birdVel = velocity;
    let currentPipes = [...pipes];
    let currentScore = score;
    let currentCoins = navEarned;

    const gravity = 0.46; // Faster drop for authentic reflex test

    const gameLoop = () => {
      // Update Bird
      birdVel += gravity;
      birdPos += birdVel;

      // Floor / Ceiling bounds (Height is 340px)
      if (birdPos > 310 || birdPos < 0) {
        handleGameOver(currentScore, currentCoins);
        return;
      }

      // Update Pipes (Faster speed)
      const pipeSpeed = 3.2;
      currentPipes = currentPipes.map((p) => ({ ...p, x: p.x - pipeSpeed }));

      // Remove offscreen pipe & spawn new
      if (currentPipes.length > 0 && currentPipes[0].x < -60) {
        currentPipes.shift();
        const top = Math.floor(Math.random() * 120) + 40;
        const bottom = 320 - top - 98; // Tighter 98px gap (harder)
        currentPipes.push({
          x: currentPipes[currentPipes.length - 1].x + 195,
          topHeight: top,
          bottomHeight: bottom,
        });
      }

      // Check passing pipe
      currentPipes.forEach((p) => {
        if (!p.passed && p.x < 50) {
          p.passed = true;
          currentScore += 1;
          const coinReward = 40; // Nav Coins
          currentCoins += coinReward;
          soundEffects.playCoin();
          setScore(currentScore);
          setNavEarned(currentCoins);
        }

        // Collision Check (Bird X is around 60px, size 24px)
        const birdLeft = 55;
        const birdRight = 79;
        const birdTop = birdPos;
        const birdBottom = birdPos + 24;

        const pipeLeft = p.x;
        const pipeRight = p.x + 50;

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < p.topHeight || birdBottom > 320 - p.bottomHeight) {
            handleGameOver(currentScore, currentCoins);
            return;
          }
        }
      });

      setBirdY(birdPos);
      setVelocity(birdVel);
      setPipes(currentPipes);

      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gameState, velocity, birdY, pipes, score, navEarned]);

  const handleGameOver = (finalScore: number, finalNav: number) => {
    setGameState('gameover');
    soundEffects.playHit();

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('peerwork_flappy_high', finalScore.toString());
    }

    if (finalNav > 0) {
      addNavCoins(finalNav, `Flappy Dev Score: ${finalScore} pipes`);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  return (
    <div className="relative w-full bg-slate-950 rounded-3xl border-2 border-campus-500/40 p-5 shadow-2xl flex flex-col space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-bounce">🚀</span>
          <div>
            <h3 className="text-base font-black text-white">Flappy Dev: Cloud Deploy</h3>
            <p className="text-[11px] text-slate-400">Fly through server firewalls & collect Nav Coins</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy size={14} /> Best: {highScore}
          </span>
          <span className="text-indigo-300 flex items-center gap-1">
            <Coins size={14} /> Nav: +{navEarned}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Canvas / Sky Stage */}
      <div
        onClick={jump}
        className="relative w-full h-[320px] bg-gradient-to-b from-[#0a1128] via-[#0c1838] to-[#040817] rounded-2xl overflow-hidden cursor-pointer border border-slate-800"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Live Score Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl font-black text-white drop-shadow-lg z-20">
          {score}
        </div>

        {/* The Bird (Developer Rocket / Drone) */}
        <div
          style={{
            top: `${birdY}px`,
            left: '60px',
            transform: `rotate(${Math.min(Math.max(velocity * 4, -25), 45)}deg)`,
          }}
          className="absolute w-8 h-8 flex items-center justify-center text-2xl transition-transform duration-75 z-20 pointer-events-none drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
        >
          🚀
        </div>

        {/* Server Pipes */}
        {pipes.map((pipe, idx) => (
          <React.Fragment key={idx}>
            {/* Top Pipe */}
            <div
              style={{
                left: `${pipe.x}px`,
                height: `${pipe.topHeight}px`,
                width: '50px',
              }}
              className="absolute top-0 bg-gradient-to-b from-indigo-700 to-campus-600 border-2 border-indigo-400 rounded-b-xl shadow-lg flex flex-col justify-end items-center pb-1 text-[10px] text-white font-mono font-bold"
            >
              404
            </div>

            {/* Bottom Pipe */}
            <div
              style={{
                left: `${pipe.x}px`,
                height: `${pipe.bottomHeight}px`,
                width: '50px',
              }}
              className="absolute bottom-0 bg-gradient-to-t from-indigo-700 to-campus-600 border-2 border-indigo-400 rounded-t-xl shadow-lg flex flex-col justify-start items-center pt-1 text-[10px] text-white font-mono font-bold"
            >
              FIREWALL
            </div>
          </React.Fragment>
        ))}

        {/* IDLE Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 space-y-3 z-30">
            <span className="text-4xl animate-bounce">🚀</span>
            <h4 className="text-xl font-black text-white">Click or Space to Flap</h4>
            <p className="text-xs text-slate-300 max-w-xs">
              Dodge server firewalls! Each passed gate rewards +40 Nav Coins.
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:scale-105 transition shadow-lg"
            >
              LAUNCH RUNNER
            </button>
          </div>
        )}

        {/* GAMEOVER Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 space-y-3 z-30">
            <h4 className="text-2xl font-black text-rose-400">Server Crashed!</h4>
            <p className="text-xs text-slate-300">
              Pipes Cleared: <strong className="text-white text-base">{score}</strong> • Earned: <strong className="text-amber-400 text-base">+{navEarned.toLocaleString()} NC</strong>
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={startGame}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-500 transition shadow"
              >
                <RotateCcw size={14} /> Retry
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-slate-400">
        Tip: Press or tap anywhere on the game screen to fly upward.
      </div>
    </div>
  );
}
