'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { useMarketplace } from '@/lib/store';
import { StarRating } from '../ui/StarRating';
import { 
  GraduationCap, 
  ShieldCheck, 
  Plus, 
  X, 
  ExternalLink, 
  Edit3, 
  Check
} from 'lucide-react';

interface StudentProfileCardProps {
  user: UserProfile;
  isEditable?: boolean;
}

export function StudentProfileCard({ user, isEditable = false }: StudentProfileCardProps) {
  const { updateCurrentUserProfile } = useMarketplace();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [fullNameText, setFullNameText] = useState(user.full_name || '');
  const [collegeText, setCollegeText] = useState(user.college_name || '');
  const [branchText, setBranchText] = useState(user.branch || '');
  const [yearText, setYearText] = useState(user.year || '');
  const [bioText, setBioText] = useState(user.bio || '');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    setFullNameText(user.full_name || '');
    setCollegeText(user.college_name || '');
    setBranchText(user.branch || '');
    setYearText(user.year || '');
    setBioText(user.bio || '');
  }, [user]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const updated = [...(user.skills || []), newSkill.trim()];
    updateCurrentUserProfile({ skills: updated });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = (user.skills || []).filter((s) => s !== skillToRemove);
    updateCurrentUserProfile({ skills: updated });
  };

  const handleSaveProfile = () => {
    updateCurrentUserProfile({
      full_name: fullNameText.trim() || user.full_name,
      college_name: collegeText.trim() || user.college_name,
      branch: branchText.trim() || user.branch,
      year: yearText.trim() || user.year,
      bio: bioText,
    });
    setIsEditing(false);
  };

  const handleAddPortfolioLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    const formattedUrl = newLinkUrl.startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`;
    const updatedLinks = [...(user.portfolio_links || []), { title: newLinkTitle.trim(), url: formattedUrl }];
    updateCurrentUserProfile({ portfolio_links: updatedLinks });
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemovePortfolioLink = (idx: number) => {
    const updatedLinks = (user.portfolio_links || []).filter((_, i) => i !== idx);
    updateCurrentUserProfile({ portfolio_links: updatedLinks });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Top Banner / Avatar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-campus-100 dark:ring-campus-900/60 shadow"
            />
            {user.verified_student && (
              <span className="absolute -bottom-1 -right-1 bg-campus-600 text-white rounded-full p-1 border-2 border-white dark:border-slate-900 shadow">
                <ShieldCheck size={14} />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {user.full_name}
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                Verified Student
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <GraduationCap size={15} className="text-campus-600" />
                {user.college_name}
              </span>
              <span>•</span>
              <span>{user.branch}</span>
              <span>•</span>
              <span className="font-semibold text-campus-600 dark:text-campus-400">{user.year}</span>
            </div>

            <div className="mt-2">
              <StarRating
                rating={user.rating_average}
                showText
                reviewCount={user.rating_count}
                size={14}
              />
            </div>
          </div>
        </div>

        {/* Role Tag & Earnings */}
        <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-campus-100 dark:bg-campus-900/40 text-campus-700 dark:text-campus-300 font-bold capitalize">
            Role: {user.role}
          </span>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Total Earned</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{user.total_earned.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Bio & Identity Edit Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            About &amp; Campus Details
          </h3>
          {isEditable && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-campus-600 dark:text-campus-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Edit3 size={12} /> {isEditing ? 'Cancel' : 'Edit Profile Details'}
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullNameText}
                  onChange={(e) => setFullNameText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">College / University</label>
                <input
                  type="text"
                  value={collegeText}
                  onChange={(e) => setCollegeText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Branch / Major</label>
                <input
                  type="text"
                  value={branchText}
                  onChange={(e) => setBranchText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Year</label>
                <input
                  type="text"
                  value={yearText}
                  onChange={(e) => setYearText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Bio</label>
              <textarea
                rows={3}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-lg bg-campus-600 hover:bg-campus-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Check size={12} /> Save Changes
            </button>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {user.bio || 'Passionate university student actively building and freelancing for peer projects.'}
          </p>
        )}
      </div>

      {/* Skills Section */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Skills &amp; Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.skills && user.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {skill}
              {isEditable && (
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}

          {isEditable && (
            <form onSubmit={handleAddSkill} className="inline-flex items-center gap-1">
              <input
                type="text"
                placeholder="+ Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-28 px-2.5 py-1 rounded-full text-xs border border-dashed border-slate-300 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-campus-500"
              />
              {newSkill.trim() && (
                <button
                  type="submit"
                  className="p-1 rounded-full bg-campus-600 text-white"
                >
                  <Plus size={12} />
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Portfolio Links */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Portfolio &amp; Verified Links
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {user.portfolio_links && user.portfolio_links.map((link, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-campus-600 dark:text-campus-400 border border-slate-200/80 dark:border-slate-700"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <span>{link.title}</span>
                <ExternalLink size={12} />
              </a>
              {isEditable && (
                <button
                  type="button"
                  onClick={() => handleRemovePortfolioLink(idx)}
                  className="text-slate-400 hover:text-rose-500 ml-1"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        {isEditable && (
          <form onSubmit={handleAddPortfolioLink} className="flex flex-wrap items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Link Title (e.g. GitHub)"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200"
            />
            <input
              type="text"
              placeholder="https://github.com/..."
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1"
            >
              <Plus size={12} /> Add Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
