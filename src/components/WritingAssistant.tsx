
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

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
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [lastProcessedText, setLastProcessedText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cachedSuggestionRef = useRef<string>('');

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

  // Pre-generate suggestion asynchronously without causing re-renders
  const preGenerateSuggestion = (text: string) => {
    if (generationTimeoutRef.current) {
      clearTimeout(generationTimeoutRef.current);
    }
    
    generationTimeoutRef.current = setTimeout(() => {
      const suggestion = getSmartQuestion(text);
      if (suggestion && suggestion.trim()) {
        // Cache the suggestion without updating state immediately
        cachedSuggestionRef.current = suggestion;
      }
    }, 0);
  };

  // Effect to handle showing the prompt after sentence completion
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
      setShowPrompt(false);
      setLastProcessedText('');
      cachedSuggestionRef.current = '';
      return;
    }

    // Pre-generate suggestion for any substantial text change
    if (text !== lastProcessedText && text.length > 10) {
      preGenerateSuggestion(text);
    }

    // Only trigger auto-show if we just completed a sentence and it's new content
    if (endsWithCompletedSentence(text) && text !== lastProcessedText) {
      // Start 2-second timer to show prompt
      timeoutRef.current = setTimeout(() => {
        if (cachedSuggestionRef.current) {
          setCurrentSuggestion(cachedSuggestionRef.current);
          setShowPrompt(true);
          setLastProcessedText(text);
        }
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    };
  }, [reviewText, isEnabled, lastProcessedText, isMinimized]);

  // When restored from minimized state, show the prompt
  useEffect(() => {
    if (!isMinimized && currentSuggestion) {
      setShowPrompt(true);
    }
  }, [isMinimized, currentSuggestion]);

  const handleHelpMeWriteClick = () => {
    // Use cached suggestion first, or generate immediately as fallback
    let suggestion = cachedSuggestionRef.current;
    if (!suggestion && reviewText.trim()) {
      suggestion = getSmartQuestion(reviewText);
      cachedSuggestionRef.current = suggestion;
    }
    
    if (suggestion) {
      setCurrentSuggestion(suggestion);
      setShowPrompt(true);
    }
    onRestore();
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPrompt(false);
    onMinimize();
  };

  if (!isEnabled) return null;

  // If minimized, don't render anything here (it will be rendered in the character count area)
  if (isMinimized) {
    return null;
  }

  // Show dynamic prompt as simple light grey text with fade-in animation
  if (showPrompt && currentSuggestion) {
    return (
      <div 
        key={currentSuggestion}
        className="py-2 animate-fade-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">
            {currentSuggestion}
          </span>
          {isHovered && (
            <button
              onClick={handleCollapse}
              className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0 ml-2"
            >
              <X size={14} />
            </button>
          )}
        </div>
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
      className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
    >
      Help me write
      <ArrowRight size={14} />
    </button>
  );
};
