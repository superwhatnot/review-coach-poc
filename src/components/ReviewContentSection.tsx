
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SayMoreBanner } from './SayMoreBanner';

interface ReviewContentSectionProps {
  review: string;
  title: string;
  onReviewChange: (review: string) => void;
  onTitleChange: (title: string) => void;
  showSayMore: boolean;
  sayMoreMessage: string;
  onDismissSayMore: () => void;
}

export const ReviewContentSection: React.FC<ReviewContentSectionProps> = ({
  review,
  title,
  onReviewChange,
  onTitleChange,
  showSayMore,
  sayMoreMessage,
  onDismissSayMore
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Write your review</h2>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="review" className="text-base font-medium text-gray-900 mb-2 block">
              Your review
            </Label>
            <Textarea
              id="review"
              placeholder="Tell people about your experience: describe the location, room, service, food, entertainment, and more"
              value={review}
              onChange={(e) => onReviewChange(e.target.value)}
              className="min-h-40 text-base"
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
      </CardContent>
    </Card>
  );
};
