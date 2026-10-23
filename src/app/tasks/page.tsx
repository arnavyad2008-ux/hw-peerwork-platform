'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store';
import { Gig, GigCategory, GigStatus } from '@/types';
import { SmartTaskBoard } from '@/components/marketplace/SmartTaskBoard';
import { ApplyGigModal } from '@/components/gigs/ApplyGigModal';
import { PostGigModal } from '@/components/gigs/PostGigModal';

export default function TasksPage() {
  const { gigs, currentUser } = useMarketplace();

  const [selectedGigForApply, setSelectedGigForApply] = useState<Gig | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handleApplyClick = (gig: Gig) => {
    setSelectedGigForApply(gig);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Smart Task Board Component with Intelligent Skill Matching */}
      <SmartTaskBoard
        gigs={gigs}
        currentUser={currentUser}
        onSelectGig={handleApplyClick}
        onOpenPostGig={() => setIsPostModalOpen(true)}
      />

      {/* Modals */}
      {selectedGigForApply && (
        <ApplyGigModal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSelectedGigForApply(null);
          }}
          gig={selectedGigForApply}
        />
      )}

      <PostGigModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
}
