'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Order, Milestone, Message } from '@/types';
import { useMarketplace } from '@/lib/store';
import { 
  ShieldCheck, 
  Clock, 
  Coins, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ArrowLeft,
  Star,
  PackageCheck,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ReviewModal } from './ReviewModal';
import { MilestoneEscrowTracker } from '../milestones/MilestoneEscrowTracker';
import { RealtimeChatRoom } from '../chat/RealtimeChatRoom';
import confetti from 'canvas-confetti';

interface OrderWorkspaceProps {
  order: Order;
}

export function OrderWorkspace({ order }: OrderWorkspaceProps) {
  const { 
    currentUser, 
    sendOrderMessage, 
    submitDeliverable, 
    approveOrder 
  } = useMarketplace();

  const [messageText, setMessageText] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [deliverableNote, setDeliverableNote] = useState('');
  const [deliverableLinkTitle, setDeliverableLinkTitle] = useState('GitHub Repo / Drive');
  const [deliverableLinkUrl, setDeliverableLinkUrl] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const isClient = currentUser.id === order.client_id;
  const isFreelancer = currentUser.id === order.freelancer_id;
  const otherUser = isClient ? (order.freelancer || currentUser) : (order.client || currentUser);

  const initialMilestones: Milestone[] = useMemo(() => {
    const halfAmount = Math.round(order.amount / 2);
    const remainder = order.amount - halfAmount;
    return [
      {
        id: `ms_${order.id}_1`,
        gig_id: order.gig_id,
        order_id: order.id,
        order_index: 1,
        title: 'Phase 1: Architecture & Core Implementation',
        description: 'Initial codebase setup, database schema validation, and baseline prototype delivery.',
        amount: halfAmount,
        deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        status: order.status === 'completed' ? 'completed' : 'in_progress',
        created_at: order.created_at,
        updated_at: order.created_at,
      },
      {
        id: `ms_${order.id}_2`,
        gig_id: order.gig_id,
        order_id: order.id,
        order_index: 2,
        title: 'Phase 2: Final Testing, Polish & Production Assets',
        description: 'Complete deliverable verification, documentation, unit tests, and handover.',
        amount: remainder,
        deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
        status: order.status === 'completed' ? 'completed' : order.status === 'delivered' ? 'submitted_for_review' : 'pending_approval',
        deliverable_url: order.deliverable_links?.[0]?.url,
        submission_notes: order.deliverable_note,
        created_at: order.created_at,
        updated_at: order.created_at,
      },
    ];
  }, [order]);

  const initialMessages: Message[] = useMemo(() => {
    return (order.messages || []).map((m) => ({
      id: m.id,
      conversation_id: order.id,
      sender_id: m.sender_id,
      sender: m.sender,
      content: m.message,
      attachment_url: m.attachment_url,
      attachment_name: m.attachment_name,
      is_read: true,
      created_at: m.created_at,
    }));
  }, [order.messages, order.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendOrderMessage(order.id, messageText);
    setMessageText('');
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableNote.trim()) return;

    submitDeliverable(order.id, deliverableNote, [
      {
        title: deliverableLinkTitle || 'Deliverable Asset',
        url: deliverableLinkUrl || 'https://github.com/campus-peerwork/deliverable',
      }
    ]);

    setIsSubmitModalOpen(false);
  };

  const handleApprove = () => {
    approveOrder(order.id);
    
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }

    setIsReviewModalOpen(true);
  };

  // Milestone stages
  const milestones = [
    { title: 'Task Hired', desc: 'Escrow Locked', done: true },
    { title: 'In Progress', desc: 'Active Dev', done: true },
    { title: 'Deliverable', desc: order.status === 'delivered' || order.status === 'completed' ? 'Submitted' : 'Pending', done: order.status === 'delivered' || order.status === 'completed' },
    { title: 'Completed', desc: order.status === 'completed' ? 'Paid & Reviewed' : 'Awaiting Approval', done: order.status === 'completed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <span className="text-xs font-mono text-slate-400">Order ID: #{order.id}</span>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={order.status === 'completed' ? 'success' : order.status === 'delivered' ? 'warning' : 'primary'}>
                {order.status === 'completed' ? 'Completed & Paid' : order.status === 'delivered' ? 'Deliverable Submitted' : 'In Progress'}
              </Badge>
              <span className="text-xs text-slate-500">
                Created on {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {order.gig?.title || 'Campus Micro-Task'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {order.gig?.description}
            </p>
          </div>

          {/* Escrow & Price pill */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Escrow Value
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{order.amount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck size={16} />
              <span>Campus Escrow Protected</span>
            </div>
          </div>
        </div>

        {/* Milestone Bar */}
        <div className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition ${
                  m.done
                    ? 'bg-campus-50/60 dark:bg-campus-950/30 border-campus-300 dark:border-campus-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      m.done
                        ? 'bg-campus-600 text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {m.done ? <CheckCircle2 size={12} /> : idx + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {m.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-7">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deliverable Showcase & Action Box */}
      <div className="bg-gradient-to-r from-campus-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PackageCheck size={20} className="text-campus-400" />
              <h3 className="text-lg font-bold">
                Project Deliverable & Escrow Release
              </h3>
            </div>

            {order.status === 'delivered' ? (
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Freelancer&apos;s Submission Note:</strong> {order.deliverable_note}
                </p>
                {order.deliverable_links && order.deliverable_links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {order.deliverable_links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition"
                      >
                        <ExternalLink size={13} />
                        <span>{link.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : order.status === 'completed' ? (
              <p className="text-xs text-emerald-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 size={15} /> Deliverable accepted! Payment of ₹{order.amount} was released to the freelancer.
              </p>
            ) : (
              <p className="text-xs text-slate-300 max-w-xl">
                Freelancer is currently working on the task. Once submitted, client can review code, assets, or documents before releasing funds.
              </p>
            )}
          </div>

          {/* Action Buttons based on roles */}
          <div className="flex items-center gap-3 shrink-0">
            {order.status === 'active' && isFreelancer && (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md active:scale-95 transition"
              >
                Submit Deliverable
              </button>
            )}

            {order.status === 'delivered' && isClient && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 active:scale-95 transition"
              >
                <Sparkles size={16} />
                <span>Approve & Release Payment</span>
              </button>
            )}

            {order.status === 'completed' && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 transition"
              >
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>Leave Review</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Module 3: Milestone & Escrow Workflow State Machine Tracker */}
      <MilestoneEscrowTracker
        initialMilestones={initialMilestones}
        currentUser={currentUser}
        clientId={order.client_id}
        freelancerId={order.freelancer_id}
      />

      {/* Two Column Workspace: Realtime Encrypted Chat & Participant Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 2: Realtime Client-Freelancer Communication (2 cols) */}
        <div className="lg:col-span-2">
          <RealtimeChatRoom
            conversationId={order.id}
            currentUser={currentUser}
            otherUser={otherUser}
            gigTitle={order.gig?.title}
            initialMessages={initialMessages}
          />
        </div>

        {/* Sidebar: Student Participants & Order Info (1 col) */}
        <div className="space-y-5">
          {/* Client Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Client
            </span>
            <div className="flex items-center gap-3">
              <img
                src={order.client?.avatar_url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'}
                alt={order.client?.full_name || 'Client'}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-campus-200 dark:ring-campus-900"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {order.client?.full_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {order.client?.college_name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {order.client?.branch} • {order.client?.year}
                </p>
              </div>
            </div>
          </div>

          {/* Freelancer Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Hired Freelancer
            </span>
            <div className="flex items-center gap-3">
              <img
                src={order.freelancer?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
                alt={order.freelancer?.full_name || 'Freelancer'}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-900"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {order.freelancer?.full_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {order.freelancer?.college_name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {order.freelancer?.branch} • {order.freelancer?.year}
                </p>
              </div>
            </div>
            {order.freelancer?.skills && (
              <div className="flex flex-wrap gap-1 pt-2">
                {order.freelancer.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Escrow Guarantee Infobox */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck size={16} /> Campus Escrow Guarantee
            </div>
            <p className="text-emerald-700 dark:text-emerald-400 text-[11px] leading-relaxed">
              Your ₹{order.amount} payment is held securely by PeerWork Escrow. Freelancers are protected from non-payment, and clients are protected from incomplete submissions.
            </p>
          </div>
        </div>
      </div>

      {/* Freelancer Submit Deliverable Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Submit Task Deliverable
            </h3>
            <form onSubmit={handleSubmitDeliverable} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Deliverable Summary & Instructions *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize what was completed, how to run or test, and links provided..."
                  value={deliverableNote}
                  onChange={(e) => setDeliverableNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-campus-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Link Title
                </label>
                <input
                  type="text"
                  value={deliverableLinkTitle}
                  onChange={(e) => setDeliverableLinkTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-campus-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  URL / Asset Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/... or Google Drive URL"
                  value={deliverableLinkUrl}
                  onChange={(e) => setDeliverableLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-campus-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700"
                >
                  Submit for Client Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Rating Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        orderId={order.id}
        revieweeId={isClient ? order.freelancer_id : order.client_id}
        revieweeName={isClient ? (order.freelancer?.full_name || 'Freelancer') : (order.client?.full_name || 'Client')}
      />
    </div>
  );
}
