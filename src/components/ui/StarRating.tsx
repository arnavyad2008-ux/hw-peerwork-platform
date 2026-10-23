import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showText?: boolean;
  reviewCount?: number;
}

export function StarRating({
  rating,
  totalStars = 5,
  size = 16,
  interactive = false,
  onRatingChange,
  showText = false,
  reviewCount,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: totalStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(displayRating);

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`p-0.5 transition-transform ${
                interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
              }`}
            >
              <Star
                size={size}
                className={
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                    : 'text-slate-300 dark:text-slate-700'
                }
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="font-normal text-slate-400 dark:text-slate-500 ml-1">
              ({reviewCount})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
