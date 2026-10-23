'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '@/lib/store';
import { soundEffects } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Coins, RotateCcw, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 16;

interface Position {
  x: number;
  y: number;
}

interface CyberSnakeGameProps {
  onClose: () => void;
}

export function CyberSnakeGame({ onClose }: CyberSnakeGameProps) {
  const { addNavCoins } = useMarketplace();

  const [snake, setSnake] = useState<Position[]>([
    { x: 8, y: 8 },
    { x: 8, y: 9 },
  ]);
  const [food, setFood] = useState<Position>({ x: 4, y: 4 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(140);
  const scoreRef = useRef(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  useEffect(() => {
    const saved = localStorage.getItem('peerwork_snake_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnFood = (currentSnake: Position[]): Position => {
    let newFood: Position;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  };

  const startGame = () => {
    const initialSnake = [
      { x: 8, y: 8 },
      { x: 8, y: 9 },
    ];
    setSnake(initialSnake);
    setDirection('UP');
    setFood(spawnFood(initialSnake));
    setScore(0);
    scoreRef.current = 0;
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && directionRef.current !== 'DOWN') {
        setDirection('UP');
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && directionRef.current !== 'UP') {
        setDirection('DOWN');
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && directionRef.current !== 'RIGHT') {
        setDirection('LEFT');
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && directionRef.current !== 'LEFT') {
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = directionRef.current;

        if (currentDir === 'UP') head.y -= 1;
        if (currentDir === 'DOWN') head.y += 1;
        if (currentDir === 'LEFT') head.x -= 1;
        if (currentDir === 'RIGHT') head.x += 1;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          soundEffects.playCoin();
          const isGolden = Math.random() < 0.25;
          const pts = isGolden ? 25 : 10;
          scoreRef.current += pts;
          setScore(scoreRef.current);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, Math.max(75, 130 - Math.floor(score / 20) * 8));

    return () => clearInterval(interval);
  }, [gameState, food, score]);

  const handleGameOver = () => {
    setGameState('gameover');
    soundEffects.playHit();

    const finalScore = scoreRef.current;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('peerwork_snake_high', finalScore.toString());
    }

    if (finalScore > 0) {
      const navWon = Math.round(finalScore * 12); // e.g. 100 score = 1,200 Nav Coins
      addNavCoins(navWon, `Cyber Snake Score: ${finalScore} pts`);
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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">🐍</span>
          <div>
            <h3 className="text-base font-black text-white">Campus LAN Cyber Snake</h3>
            <p className="text-[11px] text-slate-400">Eat RAM packets & earn Nav Coins (100k = ₹1)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy size={14} /> Record: {highScore}
          </span>
          <span className="text-indigo-300 flex items-center gap-1">
            <Coins size={14} /> Nav: +{score * 12}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-slate-900 rounded-2xl border-2 border-slate-800 grid grid-cols-16 grid-rows-16 p-1 overflow-hidden">
        {/* Render Grid cells */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);

          const isHead = snake[0]?.x === x && snake[0]?.y === y;
          const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              className={`w-full h-full rounded-sm transition-colors ${
                isHead
                  ? 'bg-campus-400 shadow-[0_0_8px_#a78bfa]'
                  : isBody
                  ? 'bg-campus-600'
                  : isFood
                  ? 'bg-amber-400 animate-pulse rounded-full shadow-[0_0_8px_#facc15]'
                  : 'bg-transparent'
              }`}
            />
          );
        })}

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 space-y-3 z-30">
            <span className="text-3xl">🐍</span>
            <h4 className="text-lg font-black text-white">Classic Cyber Snake</h4>
            <p className="text-[11px] text-slate-300 max-w-xs">
              Use Arrow keys or WASD. Eat memory packets to grow & earn Nav Coins!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-campus-600 hover:bg-campus-500 shadow-md transition"
            >
              PLAY SNAKE
            </button>
          </div>
        )}

        {/* Gameover Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 space-y-2 z-30">
            <h4 className="text-xl font-black text-rose-400">Connection Terminated!</h4>
            <p className="text-xs text-slate-300">
              Score: <strong className="text-white text-base">{score}</strong> • Earned: <strong className="text-amber-400 font-bold">+{(score * 12).toLocaleString()} NC</strong>
            </p>
            <button
              onClick={startGame}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-500 transition shadow"
            >
              <RotateCcw size={12} className="inline mr-1" /> Retry
            </button>
          </div>
        )}
      </div>

      {/* Touch D-Pad for Mobile or Quick Navigation */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <button
          onClick={() => directionRef.current !== 'DOWN' && setDirection('UP')}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
        >
          <ArrowUp size={16} />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => directionRef.current !== 'RIGHT' && setDirection('LEFT')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => directionRef.current !== 'UP' && setDirection('DOWN')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
          >
            <ArrowDown size={16} />
          </button>
          <button
            onClick={() => directionRef.current !== 'LEFT' && setDirection('RIGHT')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
