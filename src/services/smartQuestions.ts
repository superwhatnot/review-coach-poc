import { questionBank, getQuestionsByCategory, getAllCategories } from './questionBank';
import { detectTopicFromText, getLastSentence } from '../utils/topicDetection';
import { findLeastSimilarQuestion } from '../utils/textSimilarity';

interface QuestionState {
  [categoryName: string]: number[]; // Array of question indices already shown for each category
}

export class SmartQuestionSelector {
  private questionState: QuestionState = {};
  private categoriesWithShownQuestions: Set<string> = new Set();

  getSmartQuestion(reviewText: string): string {
    // Get the last completed sentence
    const lastSentence = getLastSentence(reviewText);
    
    if (!lastSentence) {
      return this.getQuestionFromUnvisitedCategory();
    }
    
    // Detect the topics of the last sentence (now returns an array)
    const detectedTopics = detectTopicFromText(lastSentence);
    
    if (detectedTopics.length > 0) {
      // Try to get a question from the first detected topic
      const firstTopic = detectedTopics[0];
      const question = this.getQuestionFromCategory(firstTopic, lastSentence);
      if (question) {
        this.categoriesWithShownQuestions.add(firstTopic);
        return question;
      }
    }
    
    // No topic detected or no available questions from detected topic
    // Get a question from a category we haven't shown questions from yet
    return this.getQuestionFromUnvisitedCategory();
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
    
    console.log(`Detected topic: ${categoryName}, Selected question: "${selectedQuestion.question}" (similarity: ${selectedQuestion.score.toFixed(3)})`);
    
    return selectedQuestion.question;
  }
  
  private getQuestionFromUnvisitedCategory(): string {
    const allCategories = getAllCategories();
    
    // Find categories that haven't had questions shown yet
    const unvisitedCategories = allCategories.filter(category => 
      !this.categoriesWithShownQuestions.has(category)
    );
    
    console.log('Unvisited categories:', unvisitedCategories);
    console.log('Categories with shown questions:', Array.from(this.categoriesWithShownQuestions));
    
    // If we have unvisited categories, pick one at random
    if (unvisitedCategories.length > 0) {
      const randomCategory = unvisitedCategories[Math.floor(Math.random() * unvisitedCategories.length)];
      console.log(`Selecting from unvisited category: ${randomCategory}`);
      
      const question = this.getQuestionFromCategory(randomCategory, '');
      if (question) {
        this.categoriesWithShownQuestions.add(randomCategory);
        return question;
      }
    }
    
    // If all categories have been visited, pick from any category with available questions
    for (const category of allCategories) {
      const questions = getQuestionsByCategory(category);
      const usedIndices = this.questionState[category] || [];
      
      // If this category still has unused questions
      if (usedIndices.length < questions.length) {
        console.log(`Selecting from visited category with available questions: ${category}`);
        const question = this.getQuestionFromCategory(category, '');
        if (question) {
          return question;
        }
      }
    }
    
    // If we've exhausted all questions from all categories, reset and start over
    console.log('All questions exhausted, resetting...');
    this.reset();
    
    // Try again with the first category
    if (allCategories.length > 0) {
      const firstCategory = allCategories[0];
      const question = this.getQuestionFromCategory(firstCategory, '');
      if (question) {
        this.categoriesWithShownQuestions.add(firstCategory);
        return question;
      }
    }
    
    // Final fallback - get any available question from any category
    for (const category of allCategories) {
      const questions = getQuestionsByCategory(category);
      if (questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex];
      }
    }
    
    // This should never happen if question bank is properly configured
    return "What else would you like to share about your experience?";
  }
  
  reset(): void {
    this.questionState = {};
    this.categoriesWithShownQuestions.clear();
  }
}
