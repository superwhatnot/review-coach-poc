
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SayMoreBanner } from './SayMoreBanner';
import { AttributeDetectionPills } from './AttributeDetectionPills';

interface ReviewContentSectionProps {
  review: string;
  title: string;
  onReviewChange: (review: string) => void;
  onTitleChange: (title: string) => void;
  showSayMore: boolean;
  sayMoreMessage: string;
  onDismissSayMore: () => void;
  attributeDetectionText: string;
}

export const ReviewContentSection: React.FC<ReviewContentSectionProps> = ({
  review,
  title,
  onReviewChange,
  onTitleChange,
  showSayMore,
  sayMoreMessage,
  onDismissSayMore,
  attributeDetectionText
}) => {
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="text-xl font-semibold mb-4">Write your review</h2>
      
      <div className="space-y-4">
        <div>
          <AttributeDetectionPills 
            reviewText={attributeDetectionText} 
            isVisible={isTextareaFocused}
          />
          
          <Textarea
            id="review"
            placeholder="Tell people about your experience: describe the location, room, service, food, entertainment, and more"
            value={review}
            onChange={(e) => onReviewChange(e.target.value)}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
            className="min-h-40 text-base mt-3"
          />
          
          {showSayMore && (
            <SayMoreBanner
              message={sayMoreMessage}
              onDismiss={onDismissSayMore}
            />
          )}
          
          <div className="flex justify-end items-center mt-2">
            <p className="text-sm text-gray-500">
              {review.length}/200 min characters
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="title" className="text-base font-medium text-gray-900 mb-2 block">
            Title of your review
          </Label>
          <Input
            id="title"
            placeholder="Summarize your visit or highlight an interesting detail"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-base"
          />
        </div>
      </div>
    </div>
  );
};
