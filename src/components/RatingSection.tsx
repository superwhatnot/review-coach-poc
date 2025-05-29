
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">How would you rate your experience?</h2>
        
        <div className="flex items-center justify-between">
          <CircleRating
            rating={rating}
            onRatingChange={onRatingChange}
            onHoverChange={setHoverRating}
            size={32}
          />
          {shouldShowLabel && (
            <span className="text-lg font-medium text-gray-700 min-w-24">
              {getRatingLabel(displayRating)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
