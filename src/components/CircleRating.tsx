
import React, { useState } from 'react';

interface CircleRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  onHoverChange?: (hoverRating: number) => void;
  size?: number;
  className?: string;
}

export const CircleRating: React.FC<CircleRatingProps> = ({
  rating,
  onRatingChange,
  onHoverChange,
  size = 40,
  className = ""
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (circle: number) => {
    setHoverRating(circle);
    onHoverChange?.(circle);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
    onHoverChange?.(0);
  };

  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((circle) => (
        <button
          key={circle}
          type="button"
          className="transition-transform hover:scale-105 focus:outline-none p-1"
          onMouseEnter={() => handleMouseEnter(circle)}
          onMouseLeave={handleMouseLeave}
          onClick={() => onRatingChange(circle)}
        >
          <div
            className={`rounded-full transition-colors ${
              circle <= (hoverRating || rating)
                ? 'bg-green-500'
                : 'bg-white border-2 border-green-500'
            }`}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  );
};
