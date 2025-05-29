
import React, { useState, useEffect } from 'react';
import { PhotoUpload } from './PhotoUpload';
import { useToast } from '@/hooks/use-toast';
import { HotelHeader } from './HotelHeader';
import { RatingSection } from './RatingSection';
import { ReviewContentSection } from './ReviewContentSection';
import { SubmitSection } from './SubmitSection';
import { EnhancedSmartQuestionSelector } from '../services/enhancedSmartQuestions';

interface ReviewFormData {
  overallRating: number;
  title: string;
  review: string;
  photos: File[];
}

export const ReviewForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ReviewFormData>({
    overallRating: 0,
    title: '',
    review: '',
    photos: []
  });
  const [questionSelector] = useState(() => new EnhancedSmartQuestionSelector());
  const [attributeDetectionText, setAttributeDetectionText] = useState('');
  const [writingCoachEnabled, setWritingCoachEnabled] = useState(true);

  // Function to check if text ends with a completed sentence
  const endsWithCompletedSentence = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return false;
    
    if (!/[.!?]$/.test(trimmed)) return false;
    
    const lastPunctuationIndex = Math.max(
      trimmed.lastIndexOf('.', trimmed.length - 2),
      trimmed.lastIndexOf('!', trimmed.length - 2),
      trimmed.lastIndexOf('?', trimmed.length - 2)
    );
    
    const lastSentence = lastPunctuationIndex >= 0 
      ? trimmed.substring(lastPunctuationIndex + 1, trimmed.length - 1).trim()
      : trimmed.substring(0, trimmed.length - 1).trim();
    
    const words = lastSentence.split(/\s+/).filter(word => word.length > 0);
    return words.length >= 2;
  };

  // Update attribute detection when sentences are completed or content is deleted
  useEffect(() => {
    const text = formData.review.trim();
    
    if (text.length === 0) {
      questionSelector.reset();
      setAttributeDetectionText('');
      return;
    }

    // Update attribute detection if sentence completed or text was significantly modified
    if (endsWithCompletedSentence(text) || Math.abs(text.length - attributeDetectionText.length) > 10) {
      setAttributeDetectionText(text);
    }
  }, [formData.review, questionSelector, attributeDetectionText.length]);

  const getSmartQuestion = (text: string): string => {
    return questionSelector.getSmartQuestion(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.overallRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide an overall rating for your experience.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.review.trim()) {
      toast({
        title: "Review Content Required",
        description: "Please provide both a title and review text.",
        variant: "destructive"
      });
      return;
    }

    console.log('Review submitted:', formData);
    toast({
      title: "Review Submitted!",
      description: "Thank you for sharing your experience. Your review will be published soon.",
    });
  };

  return (
    <div>
      <HotelHeader />

      <form onSubmit={handleSubmit}>
        <RatingSection
          rating={formData.overallRating}
          onRatingChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
        />

        <ReviewContentSection
          review={formData.review}
          title={formData.title}
          onReviewChange={(review) => setFormData(prev => ({ ...prev, review }))}
          onTitleChange={(title) => setFormData(prev => ({ ...prev, title }))}
          attributeDetectionText={attributeDetectionText}
          writingCoachEnabled={writingCoachEnabled}
          onWritingCoachToggle={setWritingCoachEnabled}
          getSmartQuestion={getSmartQuestion}
        />

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Add some photos</h2>
          <PhotoUpload
            onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
          />
        </div>

        <SubmitSection onSubmit={handleSubmit} />
      </form>
    </div>
  );
};
