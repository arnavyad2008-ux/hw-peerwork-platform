'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Proposal, Gig } from '@/types';
import { useMarketplace } from '@/lib/store';
import { StarRating } from '../ui/StarRating';
import { 
  ShieldCheck, 
  Clock, 
  Coins, 
  CheckCircle2, 
  Sparkles, 
  UserCheck,
  ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicantListProps {
  gig: Gig;
  proposals: Proposal[];
  onHired?: (orderId: string) => void;
}

export function ApplicantList({ gig, proposals, onHired }: ApplicantListProps) {
  const { acceptProposal } = useMarketplace();
  const [hiringId, setHiringId] = useState<string | null>(null);

  const handleHire = (proposalId: string) => {
    setHiringId(proposalId);
    const order = acceptProposal(proposalId);
    
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch (e) {}

    setTimeout(() => {
      setHiringId(null);
      if (order && onHired) {
        onHired(order.id);
      }
    }, 1200);
  };

  return (
    <div className="space-y-3">
      {proposals.length === 0 ? (
        <div className="text-center py-8 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
          No student applications received yet. Your task is live on the board!
        </div>
      ) : (
        proposals.map((prop) => {
          const isHired = prop.status === 'accepted';
          const isRejected = prop.status === 'rejected';

          return (
            <div
              key={prop.id}
              className={`p-4 sm:p-5 rounded-2xl border transition ${
                isHired
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Applicant Bio & Info */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={prop.freelancer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={prop.freelancer?.full_name || 'Freelancer'}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                    />
                    {prop.freelancer?.verified_student && (
                      <span className="absolute -bottom-0.5 -right-0.5 text-campus-600 bg-white dark:bg-slate-900 rounded-full">
                        <ShieldCheck size={14} />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {prop.freelancer?.full_name}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-campus-100 dark:bg-campus-900/40 text-campus-700 dark:text-campus-300 font-semibold">
                        {prop.freelancer?.year}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {prop.freelancer?.college_name} • {prop.freelancer?.branch}
                    </p>
                    <div className="mt-1">
                      <StarRating
                        rating={prop.freelancer?.rating_average || 5.0}
                        showText
                        reviewCount={prop.freelancer?.rating_count || 1}
                        size={12}
                      />
                    </div>
                  </div>
                </div>

                {/* Bid details & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ₹{prop.bid_amount.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                      <Clock size={11} /> {prop.estimated_days} Days delivery
                    </p>
                  </div>

                  {isHired ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm">
                      <CheckCircle2 size={13} /> Hired
                    </span>
                  ) : isRejected ? (
                    <span className="text-xs text-slate-400 font-medium">
                      Not Selected
                    </span>
                  ) : gig.status === 'open' ? (
                    <button
                      onClick={() => handleHire(prop.id)}
                      disabled={hiringId === prop.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700 active:scale-95 transition shadow-md shadow-campus-600/25 disabled:opacity-50"
                    >
                      <UserCheck size={14} />
                      <span>{hiringId === prop.id ? 'Locking Escrow...' : 'Hire Peer'}</span>
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Pitch message */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/40 p-3 rounded-xl">
                <span className="font-semibold text-slate-900 dark:text-white block text-[11px] mb-1">
                  Applicant Pitch:
                </span>
                {prop.cover_message}
              </div>

              {/* Freelancer skills tags */}
              {prop.freelancer?.skills && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {prop.freelancer.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
