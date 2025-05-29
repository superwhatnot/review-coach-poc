
import { questionBank, getQuestionsByCategory } from './questionBank';
import { detectTopicFromText, getLastSentence } from '../utils/topicDetection';
import { findLeastSimilarQuestion } from '../utils/textSimilarity';

interface QuestionState {
  [categoryName: string]: number[]; // Array of question indices already shown for each category
}

const fallbackMessages = [
  "Say more",
  "Tell us more!",
  "Keep going!",
  "What else?",
  "Share more details",
  "Continue your story",
  "Add more insights",
  "We'd love to hear more"
];

export class SmartQuestionSelector {
  private questionState: QuestionState = {};
  private fallbackIndex = 0;

  getSmartQuestion(reviewText: string): string {
    // Get the last completed sentence
    const lastSentence = getLastSentence(reviewText);
    
    if (!lastSentence) {
      return this.getFallbackMessage();
    }
    
    // Detect the topic of the last sentence
    const detectedTopic = detectTopicFromText(lastSentence);
    
    if (!detectedTopic) {
      return this.getFallbackMessage();
    }
    
    // Get questions for the detected topic
    const questions = getQuestionsByCategory(detectedTopic);
    
    if (questions.length === 0) {
      return this.getFallbackMessage();
    }
    
    // Initialize question state for this category if not exists
    if (!this.questionState[detectedTopic]) {
      this.questionState[detectedTopic] = [];
    }
    
    const usedIndices = this.questionState[detectedTopic];
    
    // If all questions have been used, reset and start over
    if (usedIndices.length >= questions.length) {
      this.questionState[detectedTopic] = [];
    }
    
    // Find the least similar question that hasn't been used yet
    const selectedQuestion = findLeastSimilarQuestion(
      lastSentence, 
      questions, 
      this.questionState[detectedTopic]
    );
    
    if (!selectedQuestion) {
      return this.getFallbackMessage();
    }
    
    // Mark this question index as used
    this.questionState[detectedTopic].push(selectedQuestion.index);
    
    console.log(`Detected topic: ${detectedTopic}, Selected question: "${selectedQuestion.question}" (similarity: ${selectedQuestion.score.toFixed(3)})`);
    
    return selectedQuestion.question;
  }
  
  private getFallbackMessage(): string {
    const message = fallbackMessages[this.fallbackIndex % fallbackMessages.length];
    this.fallbackIndex++;
    return message;
  }
  
  reset(): void {
    this.questionState = {};
    this.fallbackIndex = 0;
  }
}
