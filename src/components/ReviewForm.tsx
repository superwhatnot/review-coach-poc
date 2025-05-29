
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
  const [messageIndex, setMessageIndex] = useState(0);
  const [lastSentenceCount, setLastSentenceCount] = useState(0);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Check for sentence completion and cycle messages
  useEffect(() => {
    const text = formData.review.trim();
    if (text.length > 0 && !bannerDismissed) {
      // Count completed sentences (ending with punctuation)
      const completedSentences = (text.match(/[.!?]/g) || []).length;
      
      // Check if we just completed a new sentence
      if (completedSentences > lastSentenceCount) {
        setLastSentenceCount(completedSentences);
        setMessageIndex(completedSentences - 1); // Use 0-based index
        setShowSayMore(true);
        
        console.log(`New sentence completed! Count: ${completedSentences}, Message: "${encouragingMessages[completedSentences - 1]}"`);
      }
    } else {
      setShowSayMore(false);
      setLastSentenceCount(0);
      setMessageIndex(0);
    }
  }, [formData.review, lastSentenceCount, bannerDismissed]);

  const handleDismissSayMore = () => {
    setShowSayMore(false);
    setBannerDismissed(true);
  };

  const getCurrentMessage = () => {
    return encouragingMessages[messageIndex % encouragingMessages.length];
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
