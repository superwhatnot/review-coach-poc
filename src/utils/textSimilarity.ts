
// Simple semantic similarity utility for comparing user input with questions

interface SimilarityResult {
  score: number;
  question: string;
  index: number;
}

// Common synonyms and related terms for hotel reviews
const synonymGroups = [
  ['clean', 'dirty', 'cleanliness', 'hygiene', 'sanitary', 'spotless', 'messy', 'tidy'],
  ['room', 'suite', 'bedroom', 'accommodation', 'space'],
  ['bathroom', 'shower', 'toilet', 'washroom', 'restroom'],
  ['staff', 'service', 'employee', 'personnel', 'team'],
  ['location', 'area', 'neighborhood', 'vicinity', 'position'],
  ['noise', 'loud', 'quiet', 'sound', 'noisy', 'peaceful'],
  ['good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic'],
  ['bad', 'terrible', 'awful', 'disappointing', 'poor', 'horrible'],
  ['expensive', 'cheap', 'costly', 'affordable', 'pricey', 'budget'],
  ['comfortable', 'cozy', 'spacious', 'cramped', 'tight', 'roomy']
];

function getWordTokens(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function areSynonyms(word1: string, word2: string): boolean {
  return synonymGroups.some(group => 
    group.includes(word1) && group.includes(word2)
  );
}

function calculateWordOverlap(userTokens: string[], questionTokens: string[]): number {
  let overlapScore = 0;
  
  for (const userWord of userTokens) {
    for (const questionWord of questionTokens) {
      if (userWord === questionWord) {
        overlapScore += 3; // Exact match gets high score
      } else if (areSynonyms(userWord, questionWord)) {
        overlapScore += 2; // Synonym match gets medium score
      } else if (userWord.includes(questionWord) || questionWord.includes(userWord)) {
        overlapScore += 1; // Partial match gets low score
      }
    }
  }
  
  return overlapScore;
}

function calculateContextualSimilarity(userText: string, question: string): number {
  const userTokens = getWordTokens(userText);
  const questionTokens = getWordTokens(question);
  
  if (userTokens.length === 0 || questionTokens.length === 0) {
    return 0;
  }
  
  const overlapScore = calculateWordOverlap(userTokens, questionTokens);
  
  // Normalize by the length of both texts
  const maxPossibleScore = Math.max(userTokens.length, questionTokens.length) * 3;
  const normalizedScore = overlapScore / maxPossibleScore;
  
  return Math.min(normalizedScore, 1); // Cap at 1.0
}

export function findLeastSimilarQuestion(
  userText: string, 
  questions: string[], 
  excludeIndices: number[] = []
): SimilarityResult | null {
  if (questions.length === 0) return null;
  
  const availableQuestions = questions
    .map((question, index) => ({ question, index }))
    .filter(({ index }) => !excludeIndices.includes(index));
  
  if (availableQuestions.length === 0) return null;
  
  console.log(`Calculating similarity for user text: "${userText}"`);
  
  const similarities = availableQuestions.map(({ question, index }) => {
    const score = calculateContextualSimilarity(userText, question);
    console.log(`Question "${question}" similarity score: ${score.toFixed(3)}`);
    return { score, question, index };
  });
  
  // Sort by similarity score (ascending - we want the LEAST similar)
  similarities.sort((a, b) => a.score - b.score);
  
  const leastSimilar = similarities[0];
  console.log(`Selected least similar question: "${leastSimilar.question}" (score: ${leastSimilar.score.toFixed(3)})`);
  
  return leastSimilar;
}

export function calculateSimilarity(text1: string, text2: string): number {
  return calculateContextualSimilarity(text1, text2);
}
