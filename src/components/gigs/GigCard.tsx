'use client';

import React from 'react';
import Link from 'next/link';
import { Gig, GigCategory } from '@/types';
import { Badge } from '../ui/Badge';
import { StarRating } from '../ui/StarRating';
import { 
  Code2, 
  Globe, 
  Palette, 
  FileText, 
  Film, 
  BookOpen, 
  Clock, 
  Coins, 
  SendHorizontal,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Trash2
} from 'lucide-react';
import { useMarketplace } from '@/lib/store';

interface GigCardProps {
  gig: Gig;
  onApplyClick?: (gig: Gig) => void;
}

const categoryConfig: Record<GigCategory, { label: string; icon: React.ElementType; color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' }> = {
  coding: { label: 'Coding & Scripts', icon: Code2, color: 'primary' },
  web_dev: { label: 'Web Development', icon: Globe, color: 'info' },
  design: { label: 'UI/UX Design', icon: Palette, color: 'warning' },
  writing: { label: 'Academic & LaTeX', icon: FileText, color: 'secondary' },
  video_editing: { label: 'Video & Reels', icon: Film, color: 'success' },
  tutoring: { label: 'Exam & Tutoring', icon: BookOpen, color: 'primary' },
  other: { label: 'Campus Micro-task', icon: Code2, color: 'secondary' },
};

export function GigCard({ gig, onApplyClick }: GigCardProps) {
  const { deleteGig } = useMarketplace();
  const cat = categoryConfig[gig.category] || categoryConfig.other;
  const CategoryIcon = cat.icon;

  const isCompleted = gig.status === 'completed';
  const isInProgress = gig.status === 'in_progress';

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-campus-300 dark:hover:border-campus-700/60 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top bar: Category + Status/Budget */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={cat.color} size="sm">
            <CategoryIcon size={12} />
            <span>{cat.label}</span>
          </Badge>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Completed
              </span>
            ) : isInProgress ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                In Progress
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Open
              </span>
            )}
            
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              ₹{gig.budget.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/gigs/${gig.id}`}>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-campus-600 dark:group-hover:text-campus-400 transition-colors line-clamp-2">
            {gig.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {gig.description}
        </p>

        {/* Required Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {gig.required_skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {skill}
            </span>
          ))}
          {gig.required_skills.length > 4 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
              +{gig.required_skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info: Client + Action */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        {/* Client snippet */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={gig.client?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={gig.client?.full_name || 'Client'}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            {gig.client?.verified_student && (
              <span className="absolute -bottom-0.5 -right-0.5 text-campus-600 dark:text-campus-400 bg-white dark:bg-slate-900 rounded-full">
                <ShieldCheck size={11} />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {gig.client?.full_name || 'Student Client'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {gig.client?.college_name || 'University'}
            </p>
          </div>
        </div>

        {/* Turnaround / Action */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Clock size={11} /> {gig.turnaround_time || '2-3 Days'}
            </span>
            <span className="text-[10px] text-slate-400">
              {gig.proposals_count || 0} proposals
            </span>
          </div>

          {gig.status === 'open' ? (
            <button
              onClick={() => onApplyClick ? onApplyClick(gig) : null}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-campus-600 hover:bg-campus-700 active:scale-95 transition shadow-sm"
            >
              <span>Apply</span>
              <SendHorizontal size={12} />
            </button>
          ) : (
            <Link
              href={`/gigs/${gig.id}`}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
            >
              Details
            </Link>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteGig(gig.id);
            }}
            title="Delete this task"
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-95"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
