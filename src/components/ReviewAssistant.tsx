
import React, { useState, useEffect } from 'react';
import { Bot, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewAssistantProps {
  reviewText: string;
  onSuggestionAccept: (suggestion: string) => void;
}

export const ReviewAssistant: React.FC<ReviewAssistantProps> = ({
  reviewText,
  onSuggestionAccept
}) => {
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const getAIPrompt = (text: string): string => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lastSentence = sentences[sentences.length - 1]?.trim().toLowerCase() || '';
    
    if (!lastSentence) return '';

    // Hotel-specific prompts based on content
    if (lastSentence.includes('room') || lastSentence.includes('suite')) {
      return "Tell us more about the room! What was the size like? How was the bed comfort? Any special amenities?";
    }
    
    if (lastSentence.includes('staff') || lastSentence.includes('service')) {
      return "Great! Can you share a specific example of the service you received? What made it stand out?";
    }
    
    if (lastSentence.includes('location') || lastSentence.includes('area')) {
      return "What nearby attractions or conveniences made the location special? How was transportation access?";
    }
    
    if (lastSentence.includes('breakfast') || lastSentence.includes('food') || lastSentence.includes('restaurant')) {
      return "Sounds delicious! What specific dishes did you try? How was the variety and quality?";
    }
    
    if (lastSentence.includes('pool') || lastSentence.includes('spa') || lastSentence.includes('gym')) {
      return "Tell us more about the facilities! What were the hours? How crowded was it? Any standout features?";
    }
    
    if (lastSentence.includes('clean') || lastSentence.includes('dirty')) {
      return "Cleanliness details help other travelers! Which areas impressed you most or needed attention?";
    }
    
    if (lastSentence.includes('noise') || lastSentence.includes('quiet') || lastSentence.includes('loud')) {
      return "Sound levels matter to guests! Was it during day or night? What was the source of the noise/quiet?";
    }
    
    if (lastSentence.includes('price') || lastSentence.includes('value') || lastSentence.includes('expensive') || lastSentence.includes('cheap')) {
      return "Value insights are helpful! What did you get for the price? Any hidden fees or great deals?";
    }
    
    if (lastSentence.includes('recommend') || lastSentence.includes('return')) {
      return "What would make you recommend this hotel to others? What type of traveler would enjoy it most?";
    }
    
    // General prompts for common patterns
    if (lastSentence.includes('good') || lastSentence.includes('great') || lastSentence.includes('excellent')) {
      return "That's wonderful! Can you share what specifically made it good? Examples help other travelers know what to expect.";
    }
    
    if (lastSentence.includes('bad') || lastSentence.includes('terrible') || lastSentence.includes('disappointing')) {
      return "Sorry to hear that! What specifically went wrong? This helps others and the hotel improve.";
    }
    
    if (lastSentence.includes('check-in') || lastSentence.includes('arrival')) {
      return "How was the check-in process? Any wait times or special touches that stood out?";
    }
    
    // Default prompts based on sentence length and content
    if (lastSentence.length < 30) {
      return "Can you add more detail to help other travelers? What specific aspects stood out to you?";
    }
    
    return "What happened next? Any other details that would help fellow travelers?";
  };

  useEffect(() => {
    if (reviewText.trim()) {
      const prompt = getAIPrompt(reviewText);
      if (prompt && prompt !== currentPrompt) {
        setCurrentPrompt(prompt);
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
    }
  }, [reviewText, currentPrompt]);

  const handleAcceptSuggestion = () => {
    onSuggestionAccept(currentPrompt);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentPrompt) return null;

  return (
    <Card className="mt-4 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">AI Writing Assistant</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">{currentPrompt}</p>
            <div className="flex gap-2">
              <button
                onClick={handleAcceptSuggestion}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Use this prompt
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
