
import React, { useState, useEffect } from 'react';
import { PhotoUpload } from './PhotoUpload';
import { useToast } from '@/hooks/use-toast';
import { HotelHeader } from './HotelHeader';
import { RatingSection } from './RatingSection';
import { ReviewContentSection } from './ReviewContentSection';
import { SubmitSection } from './SubmitSection';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewFormData {
  overallRating: number;
  title: string;
  review: string;
  photos: File[];
}

const encouragingMessages = [
  "Say more",
  "Tell us more!",
  "Keep going!",
  "What else?",
  "Share more details",
  "Continue your story",
  "Add more insights",
  "We'd love to hear more"
];

export const ReviewForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ReviewFormData>({
    overallRating: 0,
    title: '',
    review: '',
    photos: []
  });
  const [showSayMore, setShowSayMore] = useState(false);
  const [sayMoreDismissed, setSayMoreDismissed] = useState(false);
  const [sentenceCount, setSentenceCount] = useState(0);

  // Check for sentence completion (punctuation marks)
  useEffect(() => {
    const text = formData.review.trim();
    if (text.length > 0 && !sayMoreDismissed) {
      const sentences = text.split(/[.!?]/).filter(sentence => sentence.trim().length > 0);
      const currentSentenceCount = sentences.length;
      
      const lastChar = text[text.length - 1];
      const hasSentenceEnding = /[.!?]/.test(lastChar);
      
      if (hasSentenceEnding && !showSayMore) {
        setSentenceCount(currentSentenceCount);
        setShowSayMore(true);
      }
    } else {
      setShowSayMore(false);
    }
  }, [formData.review, sayMoreDismissed]);

  const handleDismissSayMore = () => {
    setShowSayMore(false);
    setSayMoreDismissed(true);
  };

  const getCurrentMessage = () => {
    return encouragingMessages[sentenceCount % encouragingMessages.length];
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
    <div className="max-w-4xl mx-auto">
      <HotelHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <RatingSection
          rating={formData.overallRating}
          onRatingChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
        />

        <ReviewContentSection
          review={formData.review}
          title={formData.title}
          onReviewChange={(review) => setFormData(prev => ({ ...prev, review }))}
          onTitleChange={(title) => setFormData(prev => ({ ...prev, title }))}
          showSayMore={showSayMore}
          sayMoreMessage={getCurrentMessage()}
          onDismissSayMore={handleDismissSayMore}
        />

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add some photos</h2>
            <PhotoUpload
              onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
            />
          </CardContent>
        </Card>

        <SubmitSection onSubmit={handleSubmit} />
      </form>
    </div>
  );
};
