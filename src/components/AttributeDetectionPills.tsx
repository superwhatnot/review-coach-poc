
import React from 'react';
import { Check } from 'lucide-react';
import { getAllCategories } from '../services/questionBank';
import { analyzeReviewContent } from '../utils/contentAnalysis';

interface AttributeDetectionPillsProps {
  reviewText: string;
}

export const AttributeDetectionPills: React.FC<AttributeDetectionPillsProps> = ({ reviewText }) => {
  const allCategories = getAllCategories();
  const coveredTopics = analyzeReviewContent(reviewText);
  const detectedCategoryNames = new Set(coveredTopics.map(topic => topic.category));

  const formatCategoryName = (category: string): string => {
    switch (category) {
      case 'NOISE':
        return 'Noise level';
      default:
        return category.charAt(0) + category.slice(1).toLowerCase();
    }
  };

  return (
    <div className="flex items-center text-sm text-gray-600 mb-3">
      <span className="mr-2">Suggestions</span>
      {allCategories.map((category, index) => {
        const isDetected = detectedCategoryNames.has(category);
        
        return (
          <React.Fragment key={category}>
            <div className={`flex items-center ${isDetected ? 'text-green-600' : 'text-gray-600'}`}>
              {isDetected && <Check size={16} className="mr-1" />}
              <span>{formatCategoryName(category)}</span>
            </div>
            {index < allCategories.length - 1 && (
              <span className="mx-2 text-gray-400">|</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
