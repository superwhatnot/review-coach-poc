
import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { PhotoUpload } from './PhotoUpload';
import { ReviewAssistant } from './ReviewAssistant';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormData {
  overallRating: number;
  serviceRating: number;
  cleanlinessRating: number;
  valueRating: number;
  locationRating: number;
  title: string;
  review: string;
  visitDate: string;
  photos: File[];
}

export const ReviewForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ReviewFormData>({
    overallRating: 0,
    serviceRating: 0,
    cleanlinessRating: 0,
    valueRating: 0,
    locationRating: 0,
    title: '',
    review: '',
    visitDate: '',
    photos: []
  });

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

  const handleAISuggestion = (suggestion: string) => {
    const currentText = formData.review;
    const newText = currentText + (currentText ? '\n\n' : '') + suggestion;
    setFormData(prev => ({ ...prev, review: newText }));
  };

  const ratingCategories = [
    { key: 'serviceRating', label: 'Service' },
    { key: 'cleanlinessRating', label: 'Cleanliness' },
    { key: 'valueRating', label: 'Value' },
    { key: 'locationRating', label: 'Location' }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Bonoo Indian Tapas Hampstead</h1>
            <p className="text-gray-600 mb-2">London, England</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Indian Restaurant</span>
              <span>•</span>
              <span>Hampstead</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate your experience</h2>
            
            {/* Overall Rating */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Overall rating</h3>
                  <p className="text-sm text-gray-600">How was your overall experience?</p>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={formData.overallRating}
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
                    size={28}
                  />
                  {formData.overallRating > 0 && (
                    <span className="text-sm font-medium text-gray-700 min-w-20">
                      {formData.overallRating === 1 && "Terrible"}
                      {formData.overallRating === 2 && "Poor"}
                      {formData.overallRating === 3 && "Average"}
                      {formData.overallRating === 4 && "Very Good"}
                      {formData.overallRating === 5 && "Excellent"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Category Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratingCategories.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-900">{label}</span>
                  <StarRating
                    rating={formData[key as keyof ReviewFormData] as number}
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, [key]: rating }))}
                    size={20}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Write your review</h2>
          
          <div>
            <Label htmlFor="title" className="text-base font-medium text-gray-900 mb-2 block">
              Give your review a title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Amazing food and great service!"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-base"
            />
            <p className="text-sm text-gray-500 mt-1">
              Keep it short and sweet
            </p>
          </div>

          <div>
            <Label htmlFor="review" className="text-base font-medium text-gray-900 mb-2 block">
              Tell us about your experience
            </Label>
            <Textarea
              id="review"
              placeholder="What did you like or dislike? How was the service? What would you tell other diners?"
              value={formData.review}
              onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              className="min-h-32 text-base resize-none"
              rows={6}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                Minimum 100 characters
              </p>
              <p className="text-sm text-gray-500">
                {formData.review.length}/5000
              </p>
            </div>

            {/* AI Review Assistant */}
            <ReviewAssistant
              reviewText={formData.review}
              onSuggestionAccept={handleAISuggestion}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="visitDate" className="text-base font-medium text-gray-900 mb-2 block">
                When did you visit?
              </Label>
              <Input
                id="visitDate"
                type="month"
                value={formData.visitDate}
                onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                className="text-base"
              />
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Add photos</h2>
          <p className="text-gray-600">Help travelers by sharing photos of your experience</p>
          <PhotoUpload
            onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
          />
        </div>

        {/* Submit Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              <p>By posting, you agree to TripAdvisor's Terms of Use and Privacy Policy.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" type="button" size="lg">
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                Post review
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
