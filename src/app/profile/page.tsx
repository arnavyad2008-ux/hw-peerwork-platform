'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { StudentProfileCard } from '@/components/dashboard/StudentProfileCard';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { WalletModal } from '@/components/dashboard/WalletModal';
import { GamifiedProfileMeter } from '@/components/conversion/GamifiedProfileMeter';
import { ZeroFeeVelocityCard } from '@/components/conversion/ZeroFeeVelocityCard';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Wallet, 
  ShieldCheck, 
  ArrowUpRight, 
  Briefcase 
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, reviews, orders, logoutUser } = useMarketplace();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Reviews where currentUser is reviewee
  const userReviews = reviews.filter((r) => r.reviewee_id === currentUser.id);
  const completedOrders = orders.filter(
    (o) => (o.freelancer_id === currentUser.id || o.client_id === currentUser.id) && o.status === 'completed'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Student Profile & Reputation
          </h1>
          <p className="text-xs text-slate-500">
            Public campus profile visible to university peers and student clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          >
            <Wallet size={15} />
            <span>Wallet: ₹{currentUser.wallet_balance.toLocaleString('en-IN')}</span>
          </button>
          <button
            onClick={logoutUser}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Gamified Profile Investment Meter */}
      <GamifiedProfileMeter />

      {/* Profile Card (Editable) */}
      <StudentProfileCard user={currentUser} isEditable={true} />

      {/* Zero-Fee Velocity Pro Commission Shield */}
      <ZeroFeeVelocityCard />

      {/* Two Columns: Peer Reviews & Completed Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peer Reviews Column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <span>Campus Peer Reviews ({userReviews.length})</span>
            </h3>
            <span className="text-xs font-bold text-amber-500">
              {currentUser.rating_average.toFixed(1)} / 5.0
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userReviews.length > 0 ? (
              userReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.reviewer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                        alt={rev.reviewer?.full_name || 'Peer'}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {rev.reviewer?.full_name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {rev.reviewer?.college_name}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={rev.rating} size={12} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <span className="text-[10px] text-slate-400 block text-right">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No reviews yet. Complete your first task to earn peer ratings!
              </div>
            )}
          </div>
        </div>

        {/* Completed Campus Projects Showcase */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Completed Campus Deliverables ({completedOrders.length})</span>
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {completedOrders.length > 0 ? (
              completedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {ord.gig?.title || 'Deliverable Task'}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{ord.amount}
                    </span>
                  </div>
                  {ord.deliverable_note && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {ord.deliverable_note}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Turnaround: Delivered on time</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck size={12} /> Escrow Approved
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No completed projects in history yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  );
}
