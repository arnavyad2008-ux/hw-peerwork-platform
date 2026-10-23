'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  ExternalLink, 
  RotateCcw, 
  Coins, 
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Milestone, MilestoneStatus, UserProfile } from '@/types';
import { 
  fundMilestone, 
  submitDeliverable, 
  approveMilestone, 
  requestRevision 
} from '@/lib/milestoneActions';

interface MilestoneEscrowTrackerProps {
  initialMilestones: Milestone[];
  currentUser: UserProfile;
  clientId: string;
  freelancerId: string;
  onUpdateWallet?: (amount: number, type: 'credit' | 'debit') => void;
}

export function MilestoneEscrowTracker({
  initialMilestones,
  currentUser,
  clientId,
  freelancerId,
  onUpdateWallet,
}: MilestoneEscrowTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(initialMilestones[0]?.id || '');
  
  // Submission drawer state
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  // Revision modal state
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  // Notification feedback
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const isClient = currentUser.id === clientId;
  const isFreelancer = currentUser.id === freelancerId;

  const currentMilestone = milestones.find((m) => m.id === activeMilestoneId) || milestones[0];

  // Calculate overall escrow progress
  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / Math.max(milestones.length, 1)) * 100);
  const totalLockedAmount = milestones
    .filter((m) => m.status === 'in_progress' || m.status === 'submitted_for_review')
    .reduce((acc, m) => acc + m.amount, 0);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Handlers
  const handleFund = (milestone: Milestone) => {
    const res = fundMilestone(milestone, currentUser.wallet_balance);
    if (!res.success) {
      showNotification(`❌ ${res.message}`);
      return;
    }

    setMilestones((prev) =>
      prev.map((m) => (m.id === milestone.id ? res.milestone! : m))
    );
    if (onUpdateWallet) onUpdateWallet(milestone.amount, 'debit');
    showNotification(`🔒 ${res.message}`);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMilestone) return;

    const res = submitDeliverable(currentMilestone, proofUrl, proofNotes);
    if (!res.success) {
      showNotification(`❌ ${res.message}`);
      return;
    }

    setMilestones((prev) =>
      prev.map((m) => (m.id === currentMilestone.id ? res.milestone! : m))
    );
    setIsSubmittingProof(false);
    setProofUrl('');
    setProofNotes('');
    showNotification(`🚀 ${res.message}`);
  };

  const handleApprove = (milestone: Milestone) => {
    const res = approveMilestone(milestone, freelancerId);
    if (!res.success) {
      showNotification(`❌ ${res.message}`);
      return;
    }

    setMilestones((prev) =>
      prev.map((m) => (m.id === milestone.id ? res.milestone! : m))
    );

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    showNotification(`🎉 ${res.message}`);
  };

  const handleRequestRevisionSubmit = () => {
    if (!currentMilestone) return;

    const res = requestRevision(currentMilestone, revisionFeedback);
    if (!res.success) {
      showNotification(`❌ ${res.message}`);
      return;
    }

    setMilestones((prev) =>
      prev.map((m) => (m.id === currentMilestone.id ? res.milestone! : m))
    );
    setIsRevisionModalOpen(false);
    setRevisionFeedback('');
    showNotification(`🔄 ${res.message}`);
  };

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} /> Completed & Released
          </span>
        );
      case 'submitted_for_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse">
            <Clock size={12} /> Under Client Review
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <Lock size={12} /> In Progress (Escrow Funded)
          </span>
        );
      case 'pending_approval':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-white/5">
            <Clock size={12} /> Pending Deposit
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-[#121216]/80 backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Action Notification Toast */}
      <AnimatePresence>
        {actionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs font-semibold text-white shadow-2xl flex items-center gap-2"
          >
            <Sparkles size={14} className="text-indigo-400" />
            <span>{actionNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Overall Escrow Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Milestone Escrow State Machine
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Automated milestone verification and zero-trust fund release protocol.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono">
            <span className="text-slate-400">Held in Escrow: </span>
            <strong className="text-cyan-300">₹{totalLockedAmount.toLocaleString('en-IN')}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 font-mono">
            {progressPercent}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>Delivery Pipeline ({completedCount}/{milestones.length} Milestones)</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
          />
        </div>
      </div>

      {/* Milestones Horizontal Step Nav */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {milestones.map((m, idx) => {
          const isActive = m.id === currentMilestone?.id;
          return (
            <div
              key={m.id}
              onClick={() => setActiveMilestoneId(m.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition text-left space-y-2 ${
                isActive
                  ? 'bg-indigo-950/40 border-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-slate-400 uppercase">
                  Phase {idx + 1}
                </span>
                <span className="font-bold text-white font-mono">₹{m.amount.toLocaleString('en-IN')}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-200 truncate">{m.title}</h4>
              <div>{getStatusBadge(m.status)}</div>
            </div>
          );
        })}
      </div>

      {/* Active Milestone Detailed Workspace Card */}
      {currentMilestone && (
        <div className="p-6 rounded-2xl bg-[#0a0a0d] border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">{currentMilestone.title}</h4>
                {getStatusBadge(currentMilestone.status)}
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                {currentMilestone.description || 'Milestone scope and deliverable objectives defined by contract.'}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-500 uppercase font-mono block">Milestone Escrow</span>
              <span className="text-xl font-black text-white font-mono">
                ₹{currentMilestone.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Submission Proof / Deliverable State */}
          {currentMilestone.deliverable_url && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-xs">
              <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                Submitted Deliverable Proof
              </span>
              <a
                href={currentMilestone.deliverable_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-white underline font-mono break-all"
              >
                <ExternalLink size={13} />
                {currentMilestone.deliverable_url}
              </a>
              {currentMilestone.submission_notes && (
                <p className="text-slate-300 pt-1 border-t border-cyan-500/20">
                  <strong>Notes:</strong> {currentMilestone.submission_notes}
                </p>
              )}
            </div>
          )}

          {/* Revision Feedback Notice (if previously requested) */}
          {currentMilestone.revision_feedback && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <AlertCircle size={14} />
                <span>Revision Requested by Client</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentMilestone.revision_feedback}
              </p>
            </div>
          )}

          {/* State Machine Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Clock size={13} />
              <span>Deadline: {new Date(currentMilestone.deadline).toLocaleDateString()}</span>
            </div>

            {/* Contextual Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Client Action: Deposit funds to start */}
              {isClient && currentMilestone.status === 'pending_approval' && (
                <button
                  onClick={() => handleFund(currentMilestone)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow transition flex items-center gap-1.5"
                >
                  <Lock size={13} />
                  <span>Fund Milestone (₹{currentMilestone.amount})</span>
                </button>
              )}

              {/* Freelancer Action: Submit deliverable */}
              {isFreelancer && currentMilestone.status === 'in_progress' && (
                <button
                  onClick={() => setIsSubmittingProof(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow transition flex items-center gap-1.5"
                >
                  <Upload size={13} />
                  <span>Submit Deliverable Proof</span>
                </button>
              )}

              {/* Client Actions: Under Review (Approve or Request Revision) */}
              {isClient && currentMilestone.status === 'submitted_for_review' && (
                <>
                  <button
                    onClick={() => setIsRevisionModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Request Revision</span>
                  </button>
                  <button
                    onClick={() => handleApprove(currentMilestone)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} />
                    <span>Approve & Release Funds</span>
                  </button>
                </>
              )}

              {currentMilestone.status === 'completed' && (
                <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Settlement Complete
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deliverable Submission Drawer */}
      <AnimatePresence>
        {isSubmittingProof && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Upload size={15} className="text-cyan-400" /> Submit Milestone Deliverable
              </h4>
              <button
                onClick={() => setIsSubmittingProof(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deliverable Artifact Link (GitHub PR, Figma, Drive, or Live URL)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/org/repo/pull/4"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes for Client Review
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain what was implemented, how to run or test, and any edge case handling..."
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmittingProof(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow"
                >
                  Send for Client Verification
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revision Request Modal */}
      <AnimatePresence>
        {isRevisionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#0e0e13] border border-amber-500/40 space-y-4 text-white shadow-2xl"
            >
              <div className="space-y-1">
                <h4 className="text-base font-bold text-amber-300 flex items-center gap-1.5">
                  <RotateCcw size={16} /> Request Milestone Revision
                </h4>
                <p className="text-xs text-slate-400">
                  Provide constructive, specific feedback so the freelancer can address exact requirements.
                </p>
              </div>

              <textarea
                rows={4}
                required
                placeholder="Specify the adjustments needed (e.g., please adjust padding on mobile viewport and fix edge case in payment form)..."
                value={revisionFeedback}
                onChange={(e) => setRevisionFeedback(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestRevisionSubmit}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow"
                >
                  Transmit Revision Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
