'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Modal } from '../ui/Modal';
import { GigCategory } from '@/types';
import { 
  Sparkles, 
  Coins, 
  Clock, 
  Plus, 
  X, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface PostGigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostGigModal({ isOpen, onClose }: PostGigModalProps) {
  const { postGig, currentUser } = useMarketplace();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GigCategory>('web_dev');
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'Next.js']);
  const [budget, setBudget] = useState<number>(2500);
  const [turnaroundTime, setTurnaroundTime] = useState('3 Days');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const deadlineDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      postGig({
        title,
        description,
        category,
        required_skills: skills,
        budget: Number(budget),
        currency: 'INR',
        deadline: deadlineDate,
        turnaround_time: turnaroundTime,
      });

      // Reset
      setTitle('');
      setDescription('');
      setSkills(['React', 'Next.js']);
      setStep(1);
      setError('');
      onClose();
    } catch (err) {
      setError('Failed to post task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post a Campus Micro-Task"
      subtitle="Hire talented peers from top universities with secure campus escrow"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s
                    ? 'bg-campus-600 text-white ring-4 ring-campus-100 dark:ring-campus-900/50'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {step > s ? <Check size={14} /> : s}
              </div>
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Step {step} of 3: {step === 1 ? 'Task Basics' : step === 2 ? 'Details & Skills' : 'Budget & Timeline'}
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-900">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Task Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Build a Responsive Portfolio or Debug PyTorch CNN model"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'web_dev', label: 'Web Dev' },
                  { id: 'coding', label: 'Coding / Python' },
                  { id: 'design', label: 'UI/UX Design' },
                  { id: 'video_editing', label: 'Video & Reels' },
                  { id: 'writing', label: 'LaTeX & Writing' },
                  { id: 'tutoring', label: 'Tutoring / Help' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id as GigCategory)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                      category === c.id
                        ? 'bg-campus-50 dark:bg-campus-950/50 border-campus-500 text-campus-700 dark:text-campus-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!title.trim()) {
                    setError('Please provide a title for the task');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-campus-600 hover:bg-campus-700 transition"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Description & Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Requirements & Scope *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Clearly describe what needs to be completed, inputs/datasets available, and expected deliverable format..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Required Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Next.js, Figma, PyTorch, LaTeX"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-campus-100 dark:bg-campus-900/40 text-campus-700 dark:text-campus-300 font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-campus-900 dark:hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!description.trim()) {
                    setError('Please provide a description of the task');
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-campus-600 hover:bg-campus-700 transition"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Timeline */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Task Budget (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="300"
                    step="100"
                    required
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-campus-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Recommended campus micro-task: ₹1,000 - ₹5,000</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Turnaround Time *
                </label>
                <select
                  value={turnaroundTime}
                  onChange={(e) => setTurnaroundTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-campus-500"
                >
                  <option value="24 Hours">24 Hours (Urgent)</option>
                  <option value="48 Hours">48 Hours</option>
                  <option value="3 Days">3 Days</option>
                  <option value="5 Days">5 Days</option>
                  <option value="1 Week">1 Week</option>
                </select>
              </div>
            </div>

            {/* Escrow Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <ShieldCheck className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-emerald-800 dark:text-emerald-300">
                <p className="font-bold">PeerWork Campus Escrow Protection</p>
                <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">
                  When you hire a student, the funds are safely held in campus escrow. Money is only released when you inspect and approve their completed deliverable.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-campus-600 to-indigo-600 hover:from-campus-700 hover:to-indigo-700 shadow-md shadow-campus-600/30 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Task to Marketplace'}
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
