
import React, { useState } from 'react';
import { CircleRating } from './CircleRating';

interface RatingSectionProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingSection: React.FC<RatingSectionProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return "Terrible";
      case 2: return "Poor";
      case 3: return "Average";
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  const displayRating = hoverRating || rating;
  const shouldShowLabel = hoverRating > 0 || rating > 0;

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="text-xl font-semibold mb-4">How would you rate your experience?</h2>
      
      <div className="flex items-center gap-4">
        <CircleRating
          rating={rating}
          onRatingChange={onRatingChange}
          onHoverChange={setHoverRating}
          size={40}
        />
        {shouldShowLabel && (
          <span className="text-lg text-gray-700">
            {getRatingLabel(displayRating)}
          </span>
        )}
      </div>
    </div>
  );
};
