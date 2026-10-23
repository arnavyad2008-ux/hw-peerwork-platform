'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Modal } from '../ui/Modal';
import { StarRating } from '../ui/StarRating';
import { Star, CheckCircle2, Sparkles } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  revieweeId: string;
  revieweeName: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  orderId,
  revieweeId,
  revieweeName,
}: ReviewModalProps) {
  const { submitReview } = useMarketplace();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitReview({
      order_id: orderId,
      reviewee_id: revieweeId,
      rating,
      comment,
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setComment('');
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Peer Review & Rating"
      subtitle={`Rate your collaboration with ${revieweeName}`}
      maxWidth="md"
    >
      {submitted ? (
        <div className="py-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Review Submitted!
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {revieweeName}&apos;s campus reputation score has been updated.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Star Rating
            </p>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                size={28}
                interactive
                onRatingChange={(r) => setRating(r)}
              />
            </div>
            <span className="text-xs font-bold text-amber-500 mt-1 inline-block">
              {rating === 5 ? '⭐ Exceptional Peer Work!' : rating === 4 ? 'Good Quality' : 'Average Work'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Feedback / Comment *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Mention what you liked: communication, turnaround speed, code quality, or design precision..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-campus-600 hover:bg-campus-700 transition"
            >
              <Sparkles size={14} />
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
