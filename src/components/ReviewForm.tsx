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

  // Function to check if we're in the middle of editing an existing sentence
  const isEditingExistingSentence = (newText: string, oldText: string): boolean => {
    // Check if text was deleted (character removal)
    if (newText.length < oldText.length) {
      return true;
    }
    
    // Check if text was added within an existing sentence (not at the end)
    const newTrimmed = newText.trim();
    const oldTrimmed = oldText.trim();
    
    if (newTrimmed.length > oldTrimmed.length) {
      // Find where the new text was inserted
      let insertionPoint = -1;
      for (let i = 0; i < Math.min(newTrimmed.length, oldTrimmed.length); i++) {
        if (newTrimmed[i] !== oldTrimmed[i]) {
          insertionPoint = i;
          break;
        }
      }
      
      // If insertion happened before the end of the old text, it's editing within a sentence
      if (insertionPoint >= 0 && insertionPoint < oldTrimmed.length) {
        return true;
      }
    }
    
    return false;
  };

  // Update attribute detection when sentences are completed, text is removed, or editing within sentences
  useEffect(() => {
    const currentText = formData.review.trim();
    const previousText = attributeDetectionText.trim();
    
    console.log('Review text changed:', {
      currentLength: currentText.length,
      previousLength: previousText.length,
      endsWithSentence: endsWithCompletedSentence(currentText),
      isEditing: isEditingExistingSentence(currentText, previousText)
    });
    
    if (currentText.length === 0) {
      questionSelector.reset();
      setAttributeDetectionText('');
      return;
    }

    // Trigger attribute detection if:
    // 1. A sentence was completed
    // 2. Text was removed (character deletion)
    // 3. Text was added within an existing sentence
    const shouldUpdateDetection = 
      endsWithCompletedSentence(currentText) ||
      isEditingExistingSentence(currentText, previousText);

    if (shouldUpdateDetection) {
      console.log('Updating attribute detection text');
      setAttributeDetectionText(currentText);
    }
  }, [formData.review, questionSelector]);

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
