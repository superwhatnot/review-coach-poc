
import { questionBank, getQuestionsByCategory } from './questionBank';
import { detectTopicFromText, getLastSentence } from '../utils/topicDetection';

interface QuestionState {
  [categoryName: string]: number; // Index of last question shown for each category
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
    
    // Get the next question for this category
    const currentIndex = this.questionState[detectedTopic] || 0;
    const question = questions[currentIndex % questions.length];
    
    // Update the index for next time
    this.questionState[detectedTopic] = currentIndex + 1;
    
    console.log(`Detected topic: ${detectedTopic}, Selected question: "${question}"`);
    
    return question;
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
