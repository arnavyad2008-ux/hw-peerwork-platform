'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store';
import { Modal } from '../ui/Modal';
import { Gig } from '@/types';
import { 
  SendHorizontal, 
  Coins, 
  Clock, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';

interface ApplyGigModalProps {
  gig: Gig | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyGigModal({ gig, isOpen, onClose }: ApplyGigModalProps) {
  const { currentUser, submitProposal, proposals } = useMarketplace();

  const [coverMessage, setCoverMessage] = useState('');
  const [bidAmount, setBidAmount] = useState<number>(gig?.budget || 2000);
  const [estimatedDays, setEstimatedDays] = useState<number>(2);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (gig) {
      setBidAmount(gig.budget);
      setCoverMessage('');
      setSubmitted(false);
      setError('');
    }
  }, [gig]);

  if (!gig) return null;

  // Check if current user already submitted a proposal
  const alreadyApplied = proposals.some(
    (p) => p.gig_id === gig.id && p.freelancer_id === currentUser.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverMessage.trim()) {
      setError('Please provide a short pitch explaining how you can help.');
      return;
    }

    try {
      submitProposal({
        gig_id: gig.id,
        cover_message: coverMessage,
        bid_amount: Number(bidAmount),
        estimated_days: Number(estimatedDays),
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1800);
    } catch (err) {
      setError('Failed to submit application. Try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Proposal to Peer"
      subtitle={`Applying for: ${gig.title}`}
      maxWidth="lg"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Proposal Sent!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            The student client will review your application and college profile. You will receive an update once accepted.
          </p>
        </div>
      ) : alreadyApplied ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-campus-100 dark:bg-campus-900/40 text-campus-600 dark:text-campus-400 mx-auto flex items-center justify-center">
            <CheckCircle2 size={26} />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            You Have Already Applied
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your proposal is under review by {gig.client?.full_name || 'the client'}.
          </p>
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs border border-rose-200">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Freelancer identity banner */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.full_name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentUser.college_name} • {currentUser.branch}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-campus-600 dark:text-campus-400 bg-campus-50 dark:bg-campus-950/40 px-2 py-0.5 rounded-full border border-campus-200 dark:border-campus-800">
              <ShieldCheck size={12} /> Verified Student
            </div>
          </div>

          {/* Bid & Delivery Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Your Bid (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="200"
                  step="50"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-campus-500"
                />
              </div>
              <span className="text-[10px] text-slate-400">Client budget: ₹{gig.budget}</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Estimated Days
              </label>
              <input
                type="number"
                required
                min="1"
                max="30"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-campus-500"
              />
              <span className="text-[10px] text-slate-400">Days to complete work</span>
            </div>
          </div>

          {/* Cover Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Your Pitch & Approach *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Hi! I have worked on similar tasks using React and Tailwind. Here is how I plan to complete your task..."
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700 shadow-md shadow-campus-600/25 active:scale-95 transition"
            >
              <SendHorizontal size={14} />
              <span>Submit Proposal</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
