
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircleRating } from './CircleRating';

interface RatingSectionProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingSection: React.FC<RatingSectionProps> = ({ rating, onRatingChange }) => {
  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return "Terrible";
      case 2: return "Poor";
      case 3: return "Average";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">How would you rate your experience?</h2>
        
        <div className="flex items-center justify-between">
          <CircleRating
            rating={rating}
            onRatingChange={onRatingChange}
            size={32}
          />
          {rating > 0 && (
            <span className="text-lg font-medium text-gray-700 min-w-24">
              {getRatingLabel(rating)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
