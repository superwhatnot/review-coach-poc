
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Topics covered</h3>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => {
          const isDetected = detectedCategoryNames.has(category);
          
          return (
            <Badge
              key={category}
              variant={isDetected ? "default" : "outline"}
              className={`text-xs px-2 py-1 ${
                isDetected 
                  ? "bg-green-100 text-green-800 border-green-300" 
                  : "bg-gray-50 text-gray-400 border-gray-200"
              }`}
            >
              {formatCategoryName(category)}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
