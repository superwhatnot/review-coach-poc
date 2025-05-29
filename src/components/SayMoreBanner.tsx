
import React from 'react';
import { X } from 'lucide-react';

interface SayMoreBannerProps {
  message: string;
  onDismiss: () => void;
}

export const SayMoreBanner: React.FC<SayMoreBannerProps> = ({ message, onDismiss }) => {
  return (
    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 flex items-start justify-between text-sm gap-2">
      <span className="text-blue-700 font-medium flex-1 leading-relaxed">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-blue-500 hover:text-blue-700 p-1 flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
};
