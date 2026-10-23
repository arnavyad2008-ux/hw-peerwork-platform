'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { ApplicantList } from '@/components/dashboard/ApplicantList';
import { ApplyGigModal } from '@/components/gigs/ApplyGigModal';
import { 
  ArrowLeft, 
  Clock, 
  Coins, 
  ShieldCheck, 
  GraduationCap, 
  Calendar, 
  SendHorizontal, 
  CheckCircle2, 
  Users,
  AlertCircle 
} from 'lucide-react';

export default function GigDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { gigs, proposals, currentUser } = useMarketplace();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const gigId = params?.id as string;
  const gig = gigs.find((g) => g.id === gigId);

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Task Not Found</h2>
        <p className="text-sm text-slate-500">The task may have been removed or completed.</p>
        <Link href="/tasks" className="inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-campus-600 text-white">
          Back to Task Board
        </Link>
      </div>
    );
  }

  const isClient = currentUser.id === gig.client_id;
  const gigProposals = proposals.filter((p) => p.gig_id === gig.id);
  const myProposal = proposals.find((p) => p.gig_id === gig.id && p.freelancer_id === currentUser.id);

  const handleHireComplete = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft size={14} /> Back to Task Board
      </Link>

      {/* Task Header Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="md">
                {gig.category.toUpperCase().replace('_', ' ')}
              </Badge>
              {gig.status === 'open' ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Open for Proposals
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-semibold border border-amber-200 dark:border-amber-800 capitalize">
                  {gig.status.replace('_', ' ')}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {gig.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock size={14} /> Turnaround: <strong className="text-slate-700 dark:text-slate-300">{gig.turnaround_time}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Posted {new Date(gig.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {gigProposals.length} Applications
              </span>
            </div>
          </div>

          {/* Budget Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shrink-0 text-left sm:text-right space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Task Budget
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{gig.budget.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center sm:justify-end gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck size={14} />
              <span>Campus Escrow Protected</span>
            </div>

            {/* Apply Button (if not client and gig is open) */}
            {!isClient && gig.status === 'open' && (
              <div className="pt-2">
                {myProposal ? (
                  <div className="p-2 rounded-xl bg-campus-50 dark:bg-campus-950/40 text-campus-700 dark:text-campus-300 text-xs font-semibold text-center border border-campus-200 dark:border-campus-800">
                    <CheckCircle2 size={14} className="inline mr-1" />
                    Application Submitted (₹{myProposal.bid_amount})
                  </div>
                ) : (
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700 shadow-md shadow-campus-600/25 active:scale-95 transition"
                  >
                    Submit Proposal
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Requirements & Description */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Task Scope & Requirements
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {gig.description}
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {gig.required_skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Client Profile Box */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Posted by Student Client
          </h3>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <img
                src={gig.client?.avatar_url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'}
                alt={gig.client?.full_name || 'Client'}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {gig.client?.full_name}
                  </h4>
                  {gig.client?.verified_student && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-100 dark:bg-campus-900/40 text-campus-700 dark:text-campus-300 font-semibold flex items-center gap-1">
                      <ShieldCheck size={11} /> Verified Student
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {gig.client?.college_name} • {gig.client?.branch} ({gig.client?.year})
                </p>
                <div className="mt-1">
                  <StarRating
                    rating={gig.client?.rating_average || 5.0}
                    showText
                    reviewCount={gig.client?.rating_count || 1}
                    size={12}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Proposal Management Section */}
      {isClient && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Review Student Proposals ({gigProposals.length})
              </h2>
              <p className="text-xs text-slate-500">
                Inspect applicant pitch messages, university credentials, and hire your peer.
              </p>
            </div>
          </div>

          <ApplicantList
            gig={gig}
            proposals={gigProposals}
            onHired={handleHireComplete}
          />
        </section>
      )}

      {/* Apply Modal */}
      <ApplyGigModal
        gig={gig}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
