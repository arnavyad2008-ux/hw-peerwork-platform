'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Users, Check, ChevronDown, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function PersonaSwitcher() {
  const { currentUser, allUsers, switchUser } = useMarketplace();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition shadow-sm"
        title="Switch between student profiles for testing"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden sm:inline text-slate-400">Viewing as:</span>
        <span className="font-semibold text-white max-w-[100px] truncate">
          {currentUser.full_name}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-2 z-50">
            <div className="px-3 py-2 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Switch Student Persona
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  <Sparkles size={10} /> Demo Switcher
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Experience the marketplace as different students (clients vs freelancers).
              </p>
            </div>

            <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
              {allUsers.map((user) => {
                const isSelected = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
                      isSelected
                        ? 'bg-indigo-950/40 border border-indigo-700/50'
                        : 'hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white truncate">
                            {user.full_name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 capitalize">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {user.college_name} • {user.branch}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={16} className="text-indigo-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
