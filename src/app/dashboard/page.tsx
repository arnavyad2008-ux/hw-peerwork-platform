'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { PostGigModal } from '@/components/gigs/PostGigModal';
import { WalletModal } from '@/components/dashboard/WalletModal';
import { 
  Briefcase, 
  Clock, 
  Coins, 
  SendHorizontal, 
  CheckCircle2, 
  ArrowUpRight, 
  PlusCircle, 
  Users, 
  ShieldCheck, 
  Wallet,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, gigs, proposals, orders } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'orders' | 'my_gigs' | 'my_proposals' | 'wallet'>('orders');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Filter items for current user
  const myOrders = orders.filter(
    (o) => o.client_id === currentUser.id || o.freelancer_id === currentUser.id
  );
  const myPostedGigs = gigs.filter((g) => g.client_id === currentUser.id);
  const mySubmittedProposals = proposals.filter((p) => p.freelancer_id === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Student Hub & Activity
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-campus-100 dark:bg-campus-900/40 text-campus-700 dark:text-campus-300 font-bold capitalize">
              {currentUser.role} View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {currentUser.full_name} • {currentUser.college_name} ({currentUser.year})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition shadow-sm"
          >
            <Wallet size={15} />
            <span>₹{currentUser.wallet_balance.toLocaleString('en-IN')}</span>
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700 shadow-md shadow-campus-600/25 active:scale-95 transition"
          >
            <PlusCircle size={15} />
            <span>Post a Task</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Projects
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {myOrders.filter((o) => o.status === 'active' || o.status === 'delivered').length}
          </p>
          <span className="text-[11px] text-campus-600 dark:text-campus-400 font-medium">
            In collaboration workspace
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Freelance Earned
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{currentUser.total_earned.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">
            Direct peer payouts
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            My Posted Tasks
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {myPostedGigs.length}
          </p>
          <span className="text-[11px] text-slate-400">
            Campus tasks created
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Peer Reputation
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-500">
            ⭐ {currentUser.rating_average.toFixed(1)}
          </p>
          <span className="text-[11px] text-slate-400">
            From {currentUser.rating_count} reviews
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold gap-2 sm:gap-6 overflow-x-auto">
        {[
          { id: 'orders', label: `Active Projects (${myOrders.length})` },
          { id: 'my_gigs', label: `My Posted Tasks (${myPostedGigs.length})` },
          { id: 'my_proposals', label: `Submitted Proposals (${mySubmittedProposals.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-1 border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-campus-600 text-campus-600 dark:text-campus-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Orders (Collaboration Space) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.length > 0 ? (
            myOrders.map((order) => {
              const isClient = order.client_id === currentUser.id;
              const otherPerson = isClient ? order.freelancer : order.client;

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={order.status === 'completed' ? 'success' : order.status === 'delivered' ? 'warning' : 'primary'}>
                        {order.status === 'completed' ? 'Completed' : order.status === 'delivered' ? 'Deliverable Submitted' : 'In Progress'}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Role: {isClient ? 'Client' : 'Freelancer'}
                      </span>
                    </div>

                    <Link href={`/orders/${order.id}`}>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-campus-600 dark:hover:text-campus-400 transition">
                        {order.gig?.title || 'Campus Micro-Task'}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Collaborating with: <strong>{otherPerson?.full_name}</strong> ({otherPerson?.college_name})</span>
                      <span>•</span>
                      <span>{order.messages?.length || 0} messages</span>
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                        Escrow Secured
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700 transition shadow-sm"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <Briefcase size={28} className="text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No active orders yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Apply to tasks on the board or post a new micro-task to start collaborating with peers.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Posted Tasks */}
      {activeTab === 'my_gigs' && (
        <div className="space-y-4">
          {myPostedGigs.length > 0 ? (
            myPostedGigs.map((gig) => {
              const gigProposals = proposals.filter((p) => p.gig_id === gig.id);

              return (
                <div
                  key={gig.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">{gig.category.toUpperCase()}</Badge>
                      <span className="text-xs text-slate-400">
                        Status: <strong className="capitalize text-slate-700 dark:text-slate-300">{gig.status}</strong>
                      </span>
                    </div>

                    <Link href={`/gigs/${gig.id}`}>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-campus-600 transition">
                        {gig.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500">
                      Budget: ₹{gig.budget} • Turnaround: {gig.turnaround_time} • {gigProposals.length} Proposals received
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/gigs/${gig.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700 transition"
                    >
                      <Users size={14} />
                      <span>Review Proposals ({gigProposals.length})</span>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <PlusCircle size={28} className="text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">You haven&apos;t posted any tasks yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need help with coding assignments, React apps, Figma mockups, or thesis formatting?
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700"
              >
                Post Your First Task
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Submitted Proposals */}
      {activeTab === 'my_proposals' && (
        <div className="space-y-4">
          {mySubmittedProposals.length > 0 ? (
            mySubmittedProposals.map((prop) => {
              const targetGig = gigs.find((g) => g.id === prop.gig_id);

              return (
                <div
                  key={prop.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-campus-600 dark:text-campus-400 uppercase tracking-wider">
                      Proposed Bid: ₹{prop.bid_amount} • {prop.estimated_days} Days Delivery
                    </span>
                    <Badge variant={prop.status === 'accepted' ? 'success' : prop.status === 'rejected' ? 'secondary' : 'warning'}>
                      {prop.status.toUpperCase()}
                    </Badge>
                  </div>

                  <Link href={`/gigs/${prop.gig_id}`}>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-campus-600 transition">
                      {targetGig?.title || 'Target Task'}
                    </h3>
                  </Link>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold block mb-0.5">Your Submitted Pitch:</span>
                    {prop.cover_message}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <SendHorizontal size={28} className="text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No proposals submitted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Browse open tasks on the board and apply to earn money completing peer projects.
              </p>
              <Link
                href="/tasks"
                className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700"
              >
                Browse Open Tasks
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <PostGigModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  );
}
