'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, loginUser } = useMarketplace();

  // Public routes: Portfolio homepage, about, showcase, and auth pages
  const privateRoutes = ['/tasks', '/dashboard', '/orders', '/profile'];
  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));

  if (!isPrivate || pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="relative z-10 min-h-[82vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full glass rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center p-2 mx-auto shadow-xl border border-indigo-400/30">
            <img src="/logo.png" alt="hw logo" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-[11px] font-semibold border border-indigo-500/20">
              <Sparkles size={12} /> Exclusively for University Students
            </div>
            <h2 className="text-3xl sm:text-4xl font-black lowercase tracking-tighter text-white">
              hw
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Welcome to the private campus freelancing exchange. Please sign in to browse open client tasks, earn Nav Coins, and hire peers.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition shadow-lg shadow-indigo-600/30"
            >
              <span>Sign In to Access hw</span>
              <ArrowRight size={16} />
            </Link>

            <button
              onClick={() => loginUser('arnav.yadav@iitd.ac.in')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition"
            >
              1-Click Instant Campus Access (Student Demo)
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-white/5">
            <ShieldCheck size={13} className="text-indigo-400" />
            <span>Secured by Campus Escrow Protocol</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
