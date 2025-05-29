
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

interface WritingAssistantProps {
  reviewText: string;
  isEnabled: boolean;
  getSmartQuestion: (text: string) => string;
  isMinimized: boolean;
  onMinimize: () => void;
  onRestore: () => void;
}

export const WritingAssistant: React.FC<WritingAssistantProps> = ({
  reviewText,
  isEnabled,
  getSmartQuestion,
  isMinimized,
  onMinimize,
  onRestore
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  // When restored from minimized state, show the banner
  useEffect(() => {
    if (!isMinimized && currentSuggestion) {
      setShowBanner(true);
    }
  }, [isMinimized, currentSuggestion]);

  const handleHelpMeWriteClick = () => {
    if (!isExpanded) {
      // If not expanded, expand and get a fresh suggestion if needed
      if (!currentSuggestion) {
        const suggestion = getSmartQuestion(reviewText);
        setCurrentSuggestion(suggestion);
      }
      setIsExpanded(true);
      onRestore();
    }
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setShowBanner(false);
    onMinimize();
  };

  if (!isEnabled) return null;

  // If minimized, don't render anything here (it will be rendered in the character count area)
  if (isMinimized) {
    return null;
  }

  // Show banner (either collapsed or expanded)
  if (showBanner || isExpanded) {
    return (
      <div className="border border-gray-200 bg-gray-50 rounded overflow-hidden">
        {!isExpanded ? (
          // Collapsed banner state - very thin
          <div className="px-3 py-1 flex items-center justify-between">
            <button
              onClick={handleHelpMeWriteClick}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm"
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
          <div className="p-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentSuggestion}
                </p>
              </div>
              <button
                onClick={handleCollapse}
                className="text-gray-500 hover:text-gray-700 p-1 flex-shrink-0"
              >
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// Export a component for the minimized state to be used in the character count line
export const MinimizedWritingAssistant: React.FC<{
  isMinimized: boolean;
  onHelpMeWriteClick: () => void;
}> = ({ isMinimized, onHelpMeWriteClick }) => {
  if (!isMinimized) return null;
  
  return (
    <button
      onClick={onHelpMeWriteClick}
      className="text-sm text-gray-400 hover:text-gray-600 underline"
    >
      Help me write
    </button>
  );
};
