
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface WritingAssistantProps {
  reviewText: string;
  isEnabled: boolean;
  getSmartQuestion: (text: string) => string;
}

export const WritingAssistant: React.FC<WritingAssistantProps> = ({
  reviewText,
  isEnabled,
  getSmartQuestion
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  // Effect to handle showing the banner after sentence completion
  useEffect(() => {
    if (!isEnabled || isMinimized) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const text = reviewText.trim();
    
    // Reset if text is empty
    if (text.length === 0) {
      setShowBanner(false);
      setIsExpanded(false);
      setLastProcessedText('');
      return;
    }

    // Only trigger if we just completed a sentence and it's new content
    if (endsWithCompletedSentence(text) && text !== lastProcessedText) {
      // Start 2-second timer to show banner
      timeoutRef.current = setTimeout(() => {
        const suggestion = getSmartQuestion(text);
        if (suggestion && suggestion.trim()) {
          setCurrentSuggestion(suggestion);
          setShowBanner(true);
          setLastProcessedText(text);
        }
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [reviewText, isEnabled, getSmartQuestion, lastProcessedText, isMinimized]);

  const handleHelpMeWriteClick = () => {
    if (!isExpanded) {
      // If not expanded, expand and get a fresh suggestion if needed
      if (!currentSuggestion) {
        const suggestion = getSmartQuestion(reviewText);
        setCurrentSuggestion(suggestion);
      }
      setIsExpanded(true);
    }
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setShowBanner(false);
    setIsMinimized(true);
  };

  const handleGetAnother = () => {
    const newSuggestion = getSmartQuestion(reviewText);
    if (newSuggestion) {
      setCurrentSuggestion(newSuggestion);
    }
  };

  if (!isEnabled) return null;

  // Minimized state - just a muted text link
  if (isMinimized && !showBanner) {
    return (
      <div className="mt-2">
        <button
          onClick={handleHelpMeWriteClick}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Help me write
        </button>
      </div>
    );
  }

  // Show banner (either collapsed or expanded)
  if (showBanner || isExpanded) {
    return (
      <div className="mt-3 border border-blue-200 bg-blue-50 rounded-lg overflow-hidden">
        {!isExpanded ? (
          // Collapsed banner state
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={handleHelpMeWriteClick}
              className="text-blue-700 hover:text-blue-800 font-medium text-sm"
            >
              Help me write
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              ×
            </button>
          </div>
        ) : (
          // Expanded state with prompt
          <div className="p-4">
            <div className="flex items-start gap-3">
              <button
                onClick={handleCollapse}
                className="mt-1 text-gray-500 hover:text-gray-700 p-1"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {currentSuggestion}
                </p>
                <button
                  onClick={handleGetAnother}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw size={12} />
                  Get another suggestion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
