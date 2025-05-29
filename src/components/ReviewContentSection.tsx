
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AttributeDetectionPills } from './AttributeDetectionPills';
import { WritingAssistant } from './WritingAssistant';

interface ReviewContentSectionProps {
  review: string;
  title: string;
  onReviewChange: (review: string) => void;
  onTitleChange: (title: string) => void;
  attributeDetectionText: string;
  writingCoachEnabled: boolean;
  onWritingCoachToggle: (enabled: boolean) => void;
  getSmartQuestion: (text: string) => string;
}

export const ReviewContentSection: React.FC<ReviewContentSectionProps> = ({
  review,
  title,
  onReviewChange,
  onTitleChange,
  attributeDetectionText,
  writingCoachEnabled,
  onWritingCoachToggle,
  getSmartQuestion
}) => {
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const handleSuggestionUse = (suggestion: string) => {
    // Add a space and the suggestion to the current review
    const newReview = review.trim() + (review.trim() ? ' ' : '') + suggestion;
    onReviewChange(newReview);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Write your review</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <AttributeDetectionPills 
            reviewText={attributeDetectionText} 
            isVisible={isTextareaFocused}
          />
          
          <Textarea
            id="review"
            placeholder="The pillows are the fluffiest I've ever felt..."
            value={review}
            onChange={(e) => onReviewChange(e.target.value)}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
            className="min-h-40 text-base mt-3"
          />
          
          <WritingAssistant
            reviewText={review}
            isEnabled={writingCoachEnabled}
            onSuggestionUse={handleSuggestionUse}
            getSmartQuestion={getSmartQuestion}
          />
          
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
            placeholder="Give us the gist of your experience"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-base"
            maxLength={120}
          />
          <div className="flex justify-end items-center mt-2">
            <p className="text-sm text-gray-500">
              {title.length}/120 max characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
