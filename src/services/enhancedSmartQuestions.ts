import { questionBank, getQuestionsByCategory, getAllCategories } from './questionBank';
import { detectTopicFromText, getLastSentence } from '../utils/topicDetection';
import { findLeastSimilarQuestion } from '../utils/textSimilarity';
import { 
  analyzeReviewContent, 
  isTopicWellCovered, 
  getUncoveredCategories, 
  getLightlyCoveredCategories,
  CoveredTopic 
} from '../utils/contentAnalysis';

interface QuestionState {
  [categoryName: string]: number[]; // Array of question indices already shown for each category
}

export class EnhancedSmartQuestionSelector {
  private questionState: QuestionState = {};
  private lastAnalyzedContent: string = '';
  private coveredTopics: CoveredTopic[] = [];

  getSmartQuestion(reviewText: string): string {
    // Re-analyze content if it has changed (handles deletions/modifications)
    if (reviewText !== this.lastAnalyzedContent) {
      console.log('Content changed, re-analyzing...');
      this.coveredTopics = analyzeReviewContent(reviewText);
      this.lastAnalyzedContent = reviewText;
      
      // If content was significantly reduced, reset some question state
      if (reviewText.length < this.lastAnalyzedContent.length * 0.5) {
        console.log('Significant content reduction detected, resetting question state');
        this.questionState = {};
      }
    }

    // Get the last completed sentence for immediate context
    const lastSentence = getLastSentence(reviewText);
    
    if (!lastSentence) {
      return this.getQuestionFromUncoveredCategory();
    }
    
    // Detect the topics of the last sentence (now returns an array)
    const detectedTopics = detectTopicFromText(lastSentence);
    
    if (detectedTopics.length > 0) {
      // Check each detected topic to find one that's not well-covered
      for (const topic of detectedTopics) {
        const isWellCovered = isTopicWellCovered(topic, this.coveredTopics);
        
        if (!isWellCovered) {
          // Topic is relevant and not well-covered, get a question from it
          const question = this.getQuestionFromCategory(topic, lastSentence);
          if (question) {
            console.log(`Selected question from detected but not well-covered topic: ${topic}`);
            return question;
          }
        } else {
          console.log(`Topic ${topic} is already well-covered, checking other detected topics`);
        }
      }
      
      console.log('All detected topics are well-covered, looking for uncovered topics');
    }
    
    // Either no topics detected, all topics well-covered, or no available questions
    // Prioritize questions from completely uncovered categories
    return this.getQuestionFromUncoveredCategory();
  }
  
  private getQuestionFromCategory(categoryName: string, lastSentence: string): string | null {
    const questions = getQuestionsByCategory(categoryName);
    
    if (questions.length === 0) {
      return null;
    }
    
    // Initialize question state for this category if not exists
    if (!this.questionState[categoryName]) {
      this.questionState[categoryName] = [];
    }
    
    const usedIndices = this.questionState[categoryName];
    
    // If all questions have been used, reset and start over
    if (usedIndices.length >= questions.length) {
      this.questionState[categoryName] = [];
    }
    
    // Find the least similar question that hasn't been used yet
    const selectedQuestion = findLeastSimilarQuestion(
      lastSentence, 
      questions, 
      this.questionState[categoryName]
    );
    
    if (!selectedQuestion) {
      return null;
    }
    
    // Mark this question index as used
    this.questionState[categoryName].push(selectedQuestion.index);
    
    console.log(`Selected question from ${categoryName}: "${selectedQuestion.question}" (similarity: ${selectedQuestion.score.toFixed(3)})`);
    
    return selectedQuestion.question;
  }
  
  private getQuestionFromUncoveredCategory(): string {
    const allCategories = getAllCategories();
    
    // Priority 1: Completely uncovered categories
    const uncoveredCategories = getUncoveredCategories(allCategories, this.coveredTopics);
    
    if (uncoveredCategories.length > 0) {
      const randomCategory = uncoveredCategories[Math.floor(Math.random() * uncoveredCategories.length)];
      console.log(`Selecting from completely uncovered category: ${randomCategory}`);
      
      const question = this.getQuestionFromCategory(randomCategory, '');
      if (question) {
        return question;
      }
    }
    
    // Priority 2: Lightly covered categories (mentioned but not well-covered)
    const lightlyCoveredCategories = getLightlyCoveredCategories(allCategories, this.coveredTopics);
    
    if (lightlyCoveredCategories.length > 0) {
      const randomCategory = lightlyCoveredCategories[Math.floor(Math.random() * lightlyCoveredCategories.length)];
      console.log(`Selecting from lightly covered category: ${randomCategory}`);
      
      const question = this.getQuestionFromCategory(randomCategory, '');
      if (question) {
        return question;
      }
    }
    
    // Priority 3: Any category with available questions
    for (const category of allCategories) {
      const questions = getQuestionsByCategory(category);
      const usedIndices = this.questionState[category] || [];
      
      // If this category still has unused questions
      if (usedIndices.length < questions.length) {
        console.log(`Selecting from any category with available questions: ${category}`);
        const question = this.getQuestionFromCategory(category, '');
        if (question) {
          return question;
        }
      }
    }
    
    // Priority 4: Reset all and start over
    console.log('All questions exhausted, resetting...');
    this.reset();
    
    // Try again with the first category
    if (allCategories.length > 0) {
      const firstCategory = allCategories[0];
      const question = this.getQuestionFromCategory(firstCategory, '');
      if (question) {
        return question;
      }
    }
    
    // Final fallback
    return "What else would you like to share about your experience?";
  }
  
  reset(): void {
    this.questionState = {};
    this.lastAnalyzedContent = '';
    this.coveredTopics = [];
  }
  
  // Method to get current analysis for debugging
  getCurrentAnalysis(): { coveredTopics: CoveredTopic[], questionState: QuestionState } {
    return {
      coveredTopics: this.coveredTopics,
      questionState: this.questionState
    };
  }
}
