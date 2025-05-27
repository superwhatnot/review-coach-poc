
import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { PhotoUpload } from './PhotoUpload';
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

  const ratingCategories = [
    { key: 'serviceRating', label: 'Service', icon: '🤝' },
    { key: 'cleanlinessRating', label: 'Cleanliness', icon: '🧹' },
    { key: 'valueRating', label: 'Value', icon: '💰' },
    { key: 'locationRating', label: 'Location', icon: '📍' }
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Write a Review</h1>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span>The Grand Hotel & Spa</span>
        </div>
      </div>

      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Overall Rating
            <span className="text-red-500">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <StarRating
              rating={formData.overallRating}
              onRatingChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
              size={32}
            />
            <span className="text-lg font-medium text-gray-700">
              {formData.overallRating > 0 && (
                <span className="ml-2">
                  {formData.overallRating === 1 && "Terrible"}
                  {formData.overallRating === 2 && "Poor"}
                  {formData.overallRating === 3 && "Average"}
                  {formData.overallRating === 4 && "Very Good"}
                  {formData.overallRating === 5 && "Excellent"}
                </span>
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Category Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Different Aspects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ratingCategories.map(({ key, label, icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-medium">{label}</span>
                </div>
                <StarRating
                  rating={formData[key as keyof ReviewFormData] as number}
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, [key]: rating }))}
                  size={20}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Details */}
      <Card>
        <CardHeader>
          <CardTitle>Tell Us About Your Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Review Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Summarize your visit or highlight an interesting detail"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="review" className="text-base font-medium">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="review"
              placeholder="Tell people about your experience: what you liked, what you didn't like, and anything else you think would be helpful to know."
              value={formData.review}
              onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              className="mt-2 min-h-32"
              rows={6}
            />
            <p className="text-sm text-gray-500 mt-2">
              Minimum 10 characters. Current: {formData.review.length}
            </p>
          </div>

          <div>
            <Label htmlFor="visitDate" className="text-base font-medium flex items-center gap-2">
              <Calendar size={16} />
              Date of Visit
            </Label>
            <Input
              id="visitDate"
              type="month"
              value={formData.visitDate}
              onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
              className="mt-2 max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Add Photos</CardTitle>
          <p className="text-gray-600">Help other travelers by sharing photos of your experience</p>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button 
          type="submit" 
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 text-lg font-medium"
        >
          Submit Review
        </Button>
      </div>
    </form>
  );
};
