
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AttributeDetectionPills } from './AttributeDetectionPills';
import { WritingAssistant, MinimizedWritingAssistant } from './WritingAssistant';

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
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [isWritingAssistantMinimized, setIsWritingAssistantMinimized] = useState(false);

  const handleFocus = () => {
    setIsTextareaFocused(true);
    setHasBeenFocused(true);
  };

  const handleBlur = () => {
    setIsTextareaFocused(false);
  };

  const handleHelpMeWriteClick = () => {
    setIsWritingAssistantMinimized(false);
  };

  const handleWritingAssistantMinimize = () => {
    setIsWritingAssistantMinimized(true);
  };

  const isAtTitleCharacterLimit = title.length >= 120;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Write your review</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <AttributeDetectionPills 
            reviewText={attributeDetectionText} 
            isVisible={hasBeenFocused}
          />
          
          <div className="relative">
            <Textarea
              id="review"
              placeholder="The pillows are the fluffiest I've ever felt..."
              value={review}
              onChange={(e) => onReviewChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="min-h-40 text-base mt-3 pr-20"
            />
            
            {/* Character count inside textarea - bottom right */}
            {isTextareaFocused && review.length < 200 && (
              <div className="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none">
                {review.length}/200 min
              </div>
            )}
          </div>
          
          {/* Writing Assistant - fixed height container to prevent layout shift */}
          <div className="min-h-[40px] py-2 flex items-start">
            {!isWritingAssistantMinimized ? (
              <WritingAssistant
                reviewText={review}
                isEnabled={writingCoachEnabled}
                getSmartQuestion={getSmartQuestion}
                isMinimized={isWritingAssistantMinimized}
                onMinimize={handleWritingAssistantMinimize}
                onRestore={handleHelpMeWriteClick}
              />
            ) : (
              <MinimizedWritingAssistant
                isMinimized={isWritingAssistantMinimized}
                onHelpMeWriteClick={handleHelpMeWriteClick}
              />
            )}
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
            {isAtTitleCharacterLimit && (
              <p className="text-sm text-gray-500">
                120/120 max characters
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
