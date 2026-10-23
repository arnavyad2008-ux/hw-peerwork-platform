'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useMarketplace } from '@/lib/store';
import { Zap, ShieldCheck, Coins, TrendingUp, Sparkles, X, ChevronUp } from 'lucide-react';

interface PulseEvent {
  id: string;
  actor: string;
  college: string;
  action: string;
  highlight: string;
  type: 'gig_claim' | 'elite_unlock' | 'payout' | 'streak';
  timestamp: string;
}

const INITIAL_PULSE_EVENTS: PulseEvent[] = [
  {
    id: 'pulse_1',
    actor: 'Rudra Pratap',
    college: 'KIET',
    action: 'just claimed a Next.js gig for',
    highlight: '₹4,000',
    type: 'gig_claim',
    timestamp: 'Just now',
  },
  {
    id: 'pulse_2',
    actor: 'Ananya Sharma',
    college: 'NSUT Delhi',
    action: 'unlocked',
    highlight: 'Elite Status & 0% Fee Shield',
    type: 'elite_unlock',
    timestamp: '18s ago',
  },
  {
    id: 'pulse_3',
    actor: 'Kabir Verma',
    college: 'BITS Pilani',
    action: 'received instant escrow payout of',
    highlight: '₹2,500 (0% Fee)',
    type: 'payout',
    timestamp: '42s ago',
  },
  {
    id: 'pulse_4',
    actor: 'Arnav Yadav',
    college: 'IIT Delhi',
    action: 'hit a fast-responder milestone:',
    highlight: '14-Day Streak ⚡',
    type: 'streak',
    timestamp: '1m ago',
  },
  {
    id: 'pulse_5',
    actor: 'Aarav Gupta',
    college: 'KIET',
    action: 'completed a Python automation task for',
    highlight: '₹3,200',
    type: 'gig_claim',
    timestamp: '2m ago',
  },
];

export function LiveCampusPulseTicker() {
  const { gigs, orders } = useMarketplace();
  const [events, setEvents] = useState<PulseEvent[]>(INITIAL_PULSE_EVENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Rotate active pulse notification every 5.5 seconds
  useEffect(() => {
    if (isMinimized) return;
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
        setIsVisible(true);
      }, 350);
    }, 5500);

    return () => clearInterval(interval);
  }, [events.length, isMinimized]);

  // Subscribe to Supabase Realtime postgres_changes on gigs & proposals
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('campus-pulse-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'gigs' },
        (payload) => {
          const newGig = payload.new as { title?: string; budget?: number };
          const liveEvent: PulseEvent = {
            id: `rt_${Date.now()}`,
            actor: 'Campus Client',
            college: 'Verified University',
            action: `posted "${(newGig.title || 'New Task').slice(0, 28)}..." for`,
            highlight: `₹${(newGig.budget || 2500).toLocaleString('en-IN')}`,
            type: 'gig_claim',
            timestamp: 'Live now',
          };
          setEvents((prev) => [liveEvent, ...prev.slice(0, 8)]);
          setCurrentIndex(0);
          setIsVisible(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // React to local state additions dynamically
  useEffect(() => {
    if (gigs.length > 6) {
      const latest = gigs[0];
      if (latest) {
        const liveEvent: PulseEvent = {
          id: `local_${latest.id}`,
          actor: latest.client?.full_name || 'Verified Student',
          college: latest.client?.college_name?.split(' ')[0] || 'Campus',
          action: `just posted "${latest.title.slice(0, 24)}..." for`,
          highlight: `₹${latest.budget.toLocaleString('en-IN')}`,
          type: 'gig_claim',
          timestamp: 'Just now',
        };
        setEvents((prev) => {
          if (prev.some((e) => e.id === liveEvent.id)) return prev;
          return [liveEvent, ...prev];
        });
      }
    }
  }, [gigs, orders]);

  const activeEvent = events[currentIndex] || INITIAL_PULSE_EVENTS[0];

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#121216]/90 backdrop-blur-md border border-indigo-500/30 text-xs font-bold text-indigo-300 shadow-2xl hover:border-indigo-400 transition"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Live Campus Pulse</span>
        <ChevronUp size={13} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs sm:max-w-sm pointer-events-auto">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={activeEvent.id + currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="rounded-2xl bg-[#121216]/85 backdrop-blur-md border border-indigo-500/30 p-3.5 shadow-2xl shadow-indigo-950/50 flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
              {activeEvent.type === 'gig_claim' && <Coins size={17} className="text-emerald-400" />}
              {activeEvent.type === 'elite_unlock' && <Sparkles size={17} className="text-amber-400" />}
              {activeEvent.type === 'payout' && <TrendingUp size={17} className="text-indigo-400" />}
              {activeEvent.type === 'streak' && <Zap size={17} className="text-cyan-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Campus Pulse • {activeEvent.college}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500">{activeEvent.timestamp}</span>
                  <button
                    onClick={() => setIsMinimized(true)}
                    title="Minimize Pulse Feed"
                    className="text-slate-500 hover:text-slate-300 p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-snug mt-1">
                <strong className="text-white">{activeEvent.actor}</strong>{' '}
                {activeEvent.action}{' '}
                <span className="font-extrabold text-emerald-400">{activeEvent.highlight}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
