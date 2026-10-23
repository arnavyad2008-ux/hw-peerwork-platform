'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { 
  Briefcase, 
  PlusCircle, 
  Wallet, 
  Sun, 
  Moon, 
  GraduationCap, 
  ShieldCheck, 
  LayoutDashboard, 
  Gamepad2,
  Menu,
  X,
  Sparkles,
  LogOut
} from 'lucide-react';
import { PersonaSwitcher } from './PersonaSwitcher';
import { PostGigModal } from '../gigs/PostGigModal';
import { WalletModal } from '../dashboard/WalletModal';
import { CampusArcadeModal } from '../game/CampusArcadeModal';
import { LiveCampusTicker } from '../game/LiveCampusTicker';
import { PortfolioNavbar } from '../portfolio/PortfolioNavbar';

export function Navbar() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/portfolio') {
    return <PortfolioNavbar />;
  }
  const { currentUser, isAuthenticated, logoutUser, theme, toggleTheme } = useMarketplace();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Briefcase },
    { href: '/tasks', label: 'Task Board', icon: Briefcase },
    { href: '/arcade', label: 'Nav Arcade', icon: Gamepad2 },
    { href: '/dashboard', label: 'Workspace', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: GraduationCap },
  ];

  return (
    <>
      {/* Live Campus Activity Ticker */}
      <LiveCampusTicker onOpenArcade={() => setIsArcadeOpen(true)} />

      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/95 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-lg group-hover:border-indigo-400/80 transition-all flex items-center justify-center p-1">
                  <img
                    src="/logo.png"
                    alt="hw logo"
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-black text-2xl tracking-tighter lowercase text-white group-hover:text-indigo-300 transition-colors">
                    hw
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                </div>
              </Link>

              {/* Desktop Nav Items */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon size={14} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Nav Utilities */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* Nav Coins Pill */}
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm transition group"
                title="Your Nav Coins balance (100,000 Nav Coins = ₹1)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>{(currentUser.nav_coins || 0).toLocaleString()} Nav</span>
              </button>

              {/* Wallet INR Pill */}
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition shadow-sm"
              >
                <Wallet size={13} className="text-indigo-400" />
                <span>₹{currentUser.wallet_balance.toLocaleString('en-IN')}</span>
              </button>

              {/* Post a Gig CTA */}
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
              >
                <PlusCircle size={14} />
                <span>Post Task</span>
              </button>

              {/* Persona Switcher for Instant Testing */}
              <PersonaSwitcher />

              {/* User Avatar */}
              <Link href="/profile" className="flex items-center gap-2 pl-1 group">
                <div className="relative">
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-indigo-500 transition"
                  />
                  {currentUser.verified_student && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-[#090d16]">
                      <ShieldCheck size={9} />
                    </div>
                  )}
                </div>
              </Link>

              {isAuthenticated && (
                <button
                  onClick={logoutUser}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut size={15} />
                </button>
              )}
            </div>

            {/* Mobile menu hamburger button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsArcadeOpen(true)}
                className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500 text-xs font-bold"
              >
                🎮
              </button>
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                <Wallet size={13} />
                <span>₹{currentUser.wallet_balance}</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#07090e] px-4 py-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <PersonaSwitcher />
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsArcadeOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-amber-400 bg-amber-500/10"
              >
                <Gamepad2 size={18} />
                Campus Arcade (Nav Coins)
              </button>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPostModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
            >
              <PlusCircle size={16} />
              Post a Task
            </button>
          </div>
        )}
      </header>

      {/* Modals */}
      <PostGigModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      <CampusArcadeModal isOpen={isArcadeOpen} onClose={() => setIsArcadeOpen(false)} />
    </>
  );
}
