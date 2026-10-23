'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { UserRole } from '@/types';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { registerUser } = useMarketplace();

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('IIT Delhi');
  const [branch, setBranch] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');
  const [role, setRole] = useState<UserRole>('both');
  const [skillsInput, setSkillsInput] = useState('React, Next.js, TypeScript, Python');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const collegesList = [
    'KIET Group of Institutions',
    'IIT Delhi',
    'Delhi University (DU - North Campus)',
    'Delhi University (DU - South Campus)',
    'DTU (Delhi Technological University)',
    'NSUT Delhi',
    'BITS Pilani',
    'IIT Bombay',
    'IIIT Delhi',
    'IIT Madras',
    'NIT Trichy',
    'Other University / College',
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your full name and student email.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const parsedSkills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      registerUser({
        full_name: fullName,
        email,
        password,
        college_name: collegeName,
        branch,
        year,
        role,
        skills: parsedSkills,
      });

      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 300);
    } catch (err) {
      setError('Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="max-w-md w-full glass rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 border border-white/10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center text-white mx-auto shadow-lg p-1">
            <img src="/logo.png" alt="hw logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black lowercase tracking-tighter text-white">
            join hw
          </h2>
          <p className="text-xs text-slate-400">
            Student peer-freelancing exchange &amp; Nav Coins campus network
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded-full font-bold ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
            1. Account Credentials
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2.5 py-1 rounded-full font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>
            2. Campus Profile
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 text-rose-300 text-xs border border-rose-800/60">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Basic Identity */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Arnav Yadav"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Student Email (.edu / .ac.in or personal) *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="yourname@iitd.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Password *
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition"
            >
              <span>Continue to Campus Verification</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* Step 2: Campus Details & Role */}
        {step === 2 && (
          <form onSubmit={handleComplete} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                College / University *
              </label>
              <select
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0d111a] text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {collegesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Branch / Major *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Year of Study *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0d111a] text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgrad">Postgraduate / PhD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Your Skills (comma-separated for AI Match Engine)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, Next.js, Python, Figma"
                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Primary Campus Role *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'freelancer', label: 'Freelancer', desc: 'Earn money' },
                  { id: 'client', label: 'Client', desc: 'Hire peers' },
                  { id: 'both', label: 'Both', desc: 'Recommended' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      role === r.id
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-bold'
                        : 'border-white/10 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <p className="text-xs font-bold">{r.label}</p>
                    <p className="text-[10px] opacity-80">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>Includes ₹2,500 starter wallet balance + 25,000 Nav Coins!</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
              >
                {loading ? 'Provisioning Account...' : 'Complete & Enter hw'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-2 border-t border-white/10 text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
