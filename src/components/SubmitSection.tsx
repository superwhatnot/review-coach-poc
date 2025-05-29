
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitSectionProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({ onSubmit }) => {
  return (
    <div className="bg-white rounded-lg border p-4">
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
            Save Draft
          </Button>
          <Button 
            type="submit" 
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8"
            onClick={onSubmit}
          >
            Submit review
          </Button>
        </div>
      </div>
    </div>
  );
};
