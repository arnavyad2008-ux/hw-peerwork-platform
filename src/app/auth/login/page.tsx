'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { allUsers, loginUser } = useMarketplace();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loginUser(email, password);
    setTimeout(() => {
      setLoading(false);
      router.push('/tasks');
    }, 300);
  };

  const handleQuickDemo = (userEmail: string) => {
    loginUser(userEmail);
    router.push('/tasks');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="max-w-md w-full glass rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 border border-white/10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center text-white mx-auto shadow-lg p-1">
            <img src="/logo.png" alt="hw logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black lowercase tracking-tighter text-white">
            sign in to hw
          </h2>
          <p className="text-xs text-slate-400">
            Enter your university email to access the live task board and Nav Coins arcade
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Student Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="arnav.yadav@iitd.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Campus Exchange'}
          </button>
        </form>

        {/* Instant Demo Accounts */}
        <div className="pt-3 border-t border-white/10 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Or 1-Click Instant Sign In (Verified Campus Peers):
          </span>
          <div className="grid grid-cols-2 gap-2">
            {allUsers.slice(0, 4).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickDemo(user.email)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-500/40 text-left transition group"
              >
                <div className="flex items-center gap-1.5">
                  <img src={user.avatar_url} alt={user.full_name} className="w-5 h-5 rounded-full object-cover" />
                  <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                    {user.full_name}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-1">
                  {user.college_name.split(' ')[0]} • ₹{user.wallet_balance.toLocaleString('en-IN')}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-400">
          New student?{' '}
          <Link href="/auth/signup" className="text-indigo-400 font-bold hover:underline">
            Create an Account (+₹2,500 Starter Credit)
          </Link>
        </div>
      </div>
    </div>
  );
}
