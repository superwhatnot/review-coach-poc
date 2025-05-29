
import { questionBank } from '../services/questionBank';

export const detectTopicFromText = (text: string): string | null => {
  const normalizedText = text.toLowerCase().trim();
  
  if (!normalizedText) return null;
  
  console.log(`Analyzing text for topic detection: "${normalizedText}"`);
  
  // Score each category based on keyword matches
  const categoryScores: { [key: string]: number } = {};
  
  for (const category of questionBank) {
    let score = 0;
    
    for (const keyword of category.keywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Exact word match gets higher score
      const exactWordRegex = new RegExp(`\\b${keywordLower}\\b`, 'gi');
      const exactMatches = (normalizedText.match(exactWordRegex) || []).length;
      score += exactMatches * 3;
      
      // Partial match gets lower score
      if (normalizedText.includes(keywordLower)) {
        score += 1;
      }
      
      if (exactMatches > 0 || normalizedText.includes(keywordLower)) {
        console.log(`Keyword "${keyword}" matched in category ${category.name}, score: ${score}`);
      }
    }
    
    if (score > 0) {
      categoryScores[category.name] = score;
    }
  }
  
  console.log('Category scores:', categoryScores);
  
  // Return the category with the highest score
  const sortedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a);
  
  const detectedCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : null;
  console.log(`Detected category: ${detectedCategory}`);
  
  return detectedCategory;
};

export const getLastSentence = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return '';
  
  // Find the last sentence by splitting from the end
  const lastPunctuationIndex = Math.max(
    trimmed.lastIndexOf('.', trimmed.length - 2),
    trimmed.lastIndexOf('!', trimmed.length - 2),
    trimmed.lastIndexOf('?', trimmed.length - 2)
  );
  
  // Get the last sentence (everything after the last punctuation, or the whole text if no previous punctuation)
  const lastSentence = lastPunctuationIndex >= 0 
    ? trimmed.substring(lastPunctuationIndex + 1, trimmed.length - 1).trim()
    : trimmed.substring(0, trimmed.length - 1).trim();
  
  console.log(`Extracted last sentence: "${lastSentence}"`);
  
  return lastSentence;
};
