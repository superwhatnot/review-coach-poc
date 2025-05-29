
import { detectTopicFromText } from './topicDetection';

export interface CoveredTopic {
  category: string;
  score: number;
  examples: string[]; // Sentences that mentioned this topic
}

export const analyzeReviewContent = (reviewText: string): CoveredTopic[] => {
  if (!reviewText.trim()) {
    return [];
  }

  console.log('Analyzing full review content for covered topics...');
  
  // Split into sentences and analyze each one
  const sentences = reviewText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10); // Filter out very short fragments

  const topicCoverage: { [category: string]: CoveredTopic } = {};

  sentences.forEach(sentence => {
    const detectedTopic = detectTopicFromText(sentence);
    if (detectedTopic) {
      if (!topicCoverage[detectedTopic]) {
        topicCoverage[detectedTopic] = {
          category: detectedTopic,
          score: 0,
          examples: []
        };
      }
      
      topicCoverage[detectedTopic].score += 1;
      topicCoverage[detectedTopic].examples.push(sentence);
    }
  });

  const coveredTopics = Object.values(topicCoverage);
  
  console.log('Content analysis results:', coveredTopics.map(t => 
    `${t.category}: ${t.score} mentions`
  ));

  return coveredTopics;
};

export const isTopicWellCovered = (topic: string, coveredTopics: CoveredTopic[]): boolean => {
  const coverage = coveredTopics.find(ct => ct.category === topic);
  // Consider a topic well-covered if it has 2+ mentions
  return coverage ? coverage.score >= 2 : false;
};

export const getUncoveredCategories = (allCategories: string[], coveredTopics: CoveredTopic[]): string[] => {
  const coveredCategoryNames = new Set(coveredTopics.map(ct => ct.category));
  return allCategories.filter(category => !coveredCategoryNames.has(category));
};

export const getLightlyCoveredCategories = (allCategories: string[], coveredTopics: CoveredTopic[]): string[] => {
  // Categories mentioned but not well-covered (score < 2)
  return allCategories.filter(category => {
    const coverage = coveredTopics.find(ct => ct.category === category);
    return coverage && coverage.score < 2;
  });
};
