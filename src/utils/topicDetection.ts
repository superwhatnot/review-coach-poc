
import { questionBank } from '../services/questionBank';

// Contextual patterns for better topic detection
interface ContextualPattern {
  category: string;
  patterns: {
    words: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
    context?: string[];
    weight: number;
  }[];
}

const contextualPatterns: ContextualPattern[] = [
  {
    category: 'LOCATION',
    patterns: [
      { words: ['train', 'bus', 'subway', 'metro'], context: ['easy', 'convenient', 'accessible', 'close', 'able', 'quick', 'fast'], sentiment: 'positive', weight: 4 },
      { words: ['walking', 'walk'], context: ['easy', 'convenient', 'close', 'short', 'quick'], sentiment: 'positive', weight: 3 },
      { words: ['driving', 'drive'], context: ['easy', 'convenient', 'accessible', 'parking'], sentiment: 'positive', weight: 3 },
      { words: ['location', 'area', 'neighborhood'], context: ['good', 'great', 'perfect', 'convenient'], sentiment: 'positive', weight: 3 },
      { words: ['airport', 'station'], context: ['close', 'near', 'convenient', 'easy'], sentiment: 'positive', weight: 3 },
      { words: ['convenience', 'convenient'], context: ['to', 'downtown', 'city', 'center', 'area'], sentiment: 'positive', weight: 4 },
      { words: ['downtown', 'city center', 'center'], context: ['close', 'near', 'convenient', 'easy', 'to'], sentiment: 'positive', weight: 3 },
      { words: ['getting', 'reach', 'access'], context: ['to', 'from', 'around', 'easy', 'difficult'], weight: 2 },
      { words: ['nearby', 'around', 'close', 'distance'], weight: 2 }
    ]
  },
  {
    category: 'NOISE',
    patterns: [
      { words: ['train', 'traffic', 'cars'], context: ['loud', 'noisy', 'disruptive', 'disturbing', 'annoying'], sentiment: 'negative', weight: 4 },
      { words: ['noise', 'loud', 'noisy'], weight: 4 },
      { words: ['quiet', 'peaceful', 'silent'], sentiment: 'positive', weight: 3 },
      { words: ['sleep', 'sleeping'], context: ['difficult', 'hard', 'disturbed', 'interrupted'], sentiment: 'negative', weight: 3 },
      { words: ['night', 'evening'], context: ['loud', 'noisy', 'disruptive'], sentiment: 'negative', weight: 3 },
      { words: ['construction', 'music', 'party'], context: ['loud', 'disturbing'], sentiment: 'negative', weight: 3 }
    ]
  },
  {
    category: 'CLEANLINESS',
    patterns: [
      { words: ['clean', 'spotless', 'tidy'], sentiment: 'positive', weight: 4 },
      { words: ['dirty', 'messy', 'filthy'], sentiment: 'negative', weight: 4 },
      { words: ['bathroom', 'room', 'bed'], context: ['clean', 'dirty', 'spotless', 'messy'], weight: 3 },
      { words: ['smell', 'odor'], context: ['bad', 'terrible', 'unpleasant'], sentiment: 'negative', weight: 3 },
      { words: ['housekeeping', 'cleaning'], weight: 2 }
    ]
  },
  {
    category: 'ROOMS',
    patterns: [
      { words: ['room', 'bedroom', 'suite'], context: ['spacious', 'comfortable', 'cozy', 'cramped', 'small'], weight: 4 },
      { words: ['bed', 'mattress'], context: ['comfortable', 'soft', 'hard', 'uncomfortable'], weight: 3 },
      { words: ['bathroom', 'shower'], context: ['nice', 'good', 'small', 'cramped'], weight: 3 },
      { words: ['furniture', 'decor', 'design'], weight: 2 },
      { words: ['view', 'window', 'balcony'], weight: 2 }
    ]
  },
  {
    category: 'ATMOSPHERE',
    patterns: [
      { words: ['atmosphere', 'vibe', 'feel'], weight: 4 },
      { words: ['cozy', 'elegant', 'modern', 'classic'], weight: 3 },
      { words: ['lobby', 'reception'], context: ['beautiful', 'nice', 'impressive'], weight: 3 },
      { words: ['impression', 'feeling'], weight: 2 }
    ]
  },
  {
    category: 'SERVICE',
    patterns: [
      { words: ['staff', 'service', 'employee'], weight: 4 },
      { words: ['helpful', 'friendly', 'rude', 'professional'], context: ['staff', 'service'], weight: 3 },
      { words: ['check-in', 'check-out'], weight: 3 },
      { words: ['reception', 'front desk', 'concierge'], weight: 2 }
    ]
  },
  {
    category: 'AMENITIES',
    patterns: [
      { words: ['pool', 'gym', 'spa', 'restaurant', 'bar'], weight: 4 },
      { words: ['shuttle', 'shuttles'], weight: 4 },
      { words: ['parking', 'wifi', 'internet'], weight: 3 },
      { words: ['breakfast'], weight: 3 },
      { words: ['amenities', 'facilities'], weight: 2 }
    ]
  },
  {
    category: 'VALUE',
    patterns: [
      { words: ['price', 'cost', 'expensive', 'cheap'], weight: 4 },
      { words: ['value', 'worth', 'money'], weight: 3 },
      { words: ['budget', 'affordable', 'overpriced'], weight: 3 },
      { words: ['deal', 'fee', 'charge'], weight: 2 }
    ]
  }
];

export const detectTopicFromText = (text: string): string[] => {
  const normalizedText = text.toLowerCase().trim();
  
  if (!normalizedText) return [];
  
  console.log(`Analyzing text for contextual topic detection: "${normalizedText}"`);
  
  const categoryScores: { [key: string]: number } = {};
  
  // Split text into words for analysis
  const words = normalizedText.split(/\s+/);
  
  for (const pattern of contextualPatterns) {
    let score = 0;
    
    for (const patternRule of pattern.patterns) {
      // Check if any pattern words are present
      const hasPatternWord = patternRule.words.some(word => 
        normalizedText.includes(word.toLowerCase())
      );
      
      if (hasPatternWord) {
        let ruleScore = patternRule.weight;
        
        // Boost score if context words are present
        if (patternRule.context) {
          const hasContext = patternRule.context.some(contextWord => 
            normalizedText.includes(contextWord.toLowerCase())
          );
          if (hasContext) {
            ruleScore += 2;
            console.log(`Context boost for ${pattern.category}: found pattern word with context`);
          }
        }
        
        // Apply sentiment multiplier
        if (patternRule.sentiment) {
          const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'nice', 'easy', 'convenient'];
          const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'difficult', 'hard', 'annoying', 'disturbing'];
          
          const hasPositive = positiveWords.some(word => normalizedText.includes(word));
          const hasNegative = negativeWords.some(word => normalizedText.includes(word));
          
          if (patternRule.sentiment === 'positive' && hasPositive) {
            ruleScore += 1;
          } else if (patternRule.sentiment === 'negative' && hasNegative) {
            ruleScore += 1;
          }
        }
        
        score += ruleScore;
        console.log(`Pattern match for ${pattern.category}: +${ruleScore} (total: ${score})`);
      }
    }
    
    if (score > 0) {
      categoryScores[pattern.category] = score;
    }
  }
  
  console.log('Category scores:', categoryScores);
  
  // Return all categories that meet the minimum threshold (score >= 3)
  const detectedCategories = Object.entries(categoryScores)
    .filter(([, score]) => score >= 3)
    .map(([category]) => category);
  
  console.log(`Detected categories: ${detectedCategories.join(', ')}`);
  
  return detectedCategories;
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
