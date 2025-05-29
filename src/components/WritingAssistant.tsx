
import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WritingAssistantProps {
  reviewText: string;
  isEnabled: boolean;
  onSuggestionUse: (suggestion: string) => void;
  getSmartQuestion: (text: string) => string;
}

export const WritingAssistant: React.FC<WritingAssistantProps> = ({
  reviewText,
  isEnabled,
  onSuggestionUse,
  getSmartQuestion
}) => {
  const [showIcon, setShowIcon] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [lastProcessedText, setLastProcessedText] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to check if text ends with a completed sentence
  const endsWithCompletedSentence = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return false;
    
    if (!/[.!?]$/.test(trimmed)) return false;
    
    const lastPunctuationIndex = Math.max(
      trimmed.lastIndexOf('.', trimmed.length - 2),
      trimmed.lastIndexOf('!', trimmed.length - 2),
      trimmed.lastIndexOf('?', trimmed.length - 2)
    );
    
    const lastSentence = lastPunctuationIndex >= 0 
      ? trimmed.substring(lastPunctuationIndex + 1, trimmed.length - 1).trim()
      : trimmed.substring(0, trimmed.length - 1).trim();
    
    const words = lastSentence.split(/\s+/).filter(word => word.length > 0);
    return words.length >= 2;
  };

  // Effect to handle pause detection after sentence completion
  useEffect(() => {
    if (!isEnabled) {
      setShowIcon(false);
      setShowPanel(false);
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const text = reviewText.trim();
    
    // Reset if text is empty
    if (text.length === 0) {
      setShowIcon(false);
      setShowPanel(false);
      setLastProcessedText('');
      return;
    }

    // Only trigger if we just completed a sentence and it's new content
    if (endsWithCompletedSentence(text) && text !== lastProcessedText) {
      // Start 3-second timer
      timeoutRef.current = setTimeout(() => {
        const suggestion = getSmartQuestion(text);
        if (suggestion && suggestion.trim()) {
          setCurrentSuggestion(suggestion);
          setShowIcon(true);
          setLastProcessedText(text);
        }
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [reviewText, isEnabled, getSmartQuestion, lastProcessedText]);

  const handleIconClick = () => {
    setShowPanel(true);
    setShowIcon(false);
  };

  const handleUsePrompt = () => {
    onSuggestionUse(currentSuggestion);
    setShowPanel(false);
  };

  const handleGetAnother = () => {
    const newSuggestion = getSmartQuestion(reviewText);
    if (newSuggestion) {
      setCurrentSuggestion(newSuggestion);
    }
  };

  const handleDismiss = () => {
    setShowPanel(false);
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Subtle help icon */}
      {showIcon && (
        <div className="absolute -right-2 top-2 z-10">
          <button
            onClick={handleIconClick}
            className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse transition-all duration-200 hover:scale-110"
            title="Writing suggestion available"
          >
            <HelpCircle size={14} />
          </button>
        </div>
      )}

      {/* Floating suggestion panel */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/20" 
            onClick={handleDismiss}
          />
          <Card className="relative w-full max-w-md bg-white shadow-xl animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Writing Coach</span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              </div>
              
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                {currentSuggestion}
              </p>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleUsePrompt}
                  size="sm"
                  className="flex-1"
                >
                  Use this prompt
                </Button>
                <Button
                  onClick={handleGetAnother}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <RefreshCw size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
