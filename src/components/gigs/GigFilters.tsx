'use client';

import React from 'react';
import { GigCategory, GigStatus } from '@/types';
import { 
  Search, 
  Filter, 
  Code2, 
  Globe, 
  Palette, 
  FileText, 
  Film, 
  BookOpen, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface GigFiltersProps {
  selectedCategory: GigCategory | 'all';
  onSelectCategory: (category: GigCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: GigStatus | 'all';
  onStatusChange: (status: GigStatus | 'all') => void;
  maxBudget: number;
  onMaxBudgetChange: (val: number) => void;
  availableCount: number;
}

const CATEGORIES: { id: GigCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Tasks', icon: Sparkles },
  { id: 'web_dev', label: 'Web & Fullstack', icon: Globe },
  { id: 'coding', label: 'Python & AI Scripts', icon: Code2 },
  { id: 'design', label: 'UI/UX & Graphics', icon: Palette },
  { id: 'video_editing', label: 'Video & Reels', icon: Film },
  { id: 'writing', label: 'LaTeX & Writing', icon: FileText },
  { id: 'tutoring', label: 'Assignment & Tutoring', icon: BookOpen },
];

export function GigFilters({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  maxBudget,
  onMaxBudgetChange,
  availableCount,
}: GigFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar + Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by skill (e.g. Next.js, Python, Figma, LaTeX)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500 transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as GigStatus | 'all')}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-campus-500 shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open (Accepting Proposals)</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Budget quick slider info */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Up to:</span>
            <span className="font-bold text-slate-900 dark:text-white">₹{maxBudget.toLocaleString('en-IN')}</span>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={maxBudget}
              onChange={(e) => onMaxBudgetChange(Number(e.target.value))}
              className="w-20 accent-campus-600 cursor-pointer ml-1"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-campus-600 text-white shadow-md shadow-campus-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-campus-300 dark:hover:border-campus-700'
              }`}
            >
              <Icon size={14} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing <strong className="text-slate-900 dark:text-white">{availableCount}</strong> student tasks</span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-campus-600 dark:text-campus-400 hover:underline"
          >
            Clear category filter
          </button>
        )}
      </div>
    </div>
  );
}
