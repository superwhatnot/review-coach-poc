
import React, { useState } from 'react';
import { CircleRating } from './CircleRating';
import { PhotoUpload } from './PhotoUpload';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormData {
  overallRating: number;
  title: string;
  review: string;
  visitDate: string;
  tripType: string;
  photos: File[];
}

export const ReviewForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ReviewFormData>({
    overallRating: 0,
    title: '',
    review: '',
    visitDate: '',
    tripType: '',
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

  const tripTypes = [
    'Business',
    'Couples',
    'Family',
    'Friends',
    'Solo'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hotel Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop&crop=center" 
              alt="Hotel" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Club Hotel Marina Beach</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Marina di Orosei, Orosei, Province of Nuoro, Sardinia, Italy</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <div key={star} className="w-3 h-3 bg-green-500 rounded-full mr-0.5"></div>
                  ))}
                </div>
                <span className="text-gray-600">4.0 star hotel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Rate your stay</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">How would you rate your experience?</h3>
                </div>
                <div className="flex items-center gap-3">
                  <CircleRating
                    rating={formData.overallRating}
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
                    size={32}
                  />
                  {formData.overallRating > 0 && (
                    <span className="text-lg font-medium text-gray-700 min-w-24">
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
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tell us about your trip</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="visitDate" className="text-base font-medium text-gray-900 mb-2 block">
                  Date of stay
                </Label>
                <Input
                  id="visitDate"
                  type="month"
                  value={formData.visitDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                  className="text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="tripType" className="text-base font-medium text-gray-900 mb-2 block">
                  Trip type
                </Label>
                <select
                  id="tripType"
                  value={formData.tripType}
                  onChange={(e) => setFormData(prev => ({ ...prev, tripType: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select trip type</option>
                  {tripTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Content */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Write your review</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-medium text-gray-900 mb-2 block">
                  Title of your review
                </Label>
                <Input
                  id="title"
                  placeholder="Summarize your visit or highlight an interesting detail"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-base"
                />
              </div>

              <div>
                <Label htmlFor="review" className="text-base font-medium text-gray-900 mb-2 block">
                  Your review
                </Label>
                <Textarea
                  id="review"
                  placeholder="Tell people about your experience: describe the location, room, service, food, entertainment, and more"
                  value={formData.review}
                  onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                  className="min-h-40 text-base resize-none"
                  rows={8}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Minimum 200 characters recommended
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.review.length}/5000
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Add photos</h2>
            <p className="text-gray-600 mb-4">Travelers love photos! Add up to 10 photos to your review.</p>
            <PhotoUpload
              onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
            />
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600 max-w-md">
                <p className="mb-2">
                  <strong>A few reminders:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Your review should be about your own experience</li>
                  <li>Please check your spelling and grammar</li>
                  <li>Reviews must be at least 200 characters</li>
                  <li>Don't include personal details like email addresses</li>
                </ul>
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
                  Submit review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
