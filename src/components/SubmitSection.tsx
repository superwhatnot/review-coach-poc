
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface SubmitSectionProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({ onSubmit }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
      alert('Please certify that your review is genuine by checking the checkbox.');
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-start space-x-3">
        <Checkbox 
          id="legal-disclaimer"
          checked={isChecked}
          onCheckedChange={(checked) => setIsChecked(checked === true)}
          className="mt-1"
        />
        <label htmlFor="legal-disclaimer" className="text-xs text-gray-700 leading-tight cursor-pointer">
          I certify that this review is based on my own experience and is my genuine opinion of this hotel, and that I have no personal or business relationship with this establishment, and have not been offered any incentive or payment originating from the establishment to write this review. I understand that Tripadvisor has a zero-tolerance policy on fake reviews.{' '}
          <a 
            href="https://www.tripadvisor.com/help/what_is_considered_fraud#Fraud%20Definition" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Learn more about the consequences of review fraud.
          </a>
        </label>
      </div>
      
      <Button 
        type="submit" 
        onClick={handleSubmit}
        className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-medium rounded-full"
        size="lg"
      >
        Submit review
      </Button>
    </div>
  );
};
