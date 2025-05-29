
import React, { useState } from 'react';
import { Camera, X, Plus } from 'lucide-react';

interface PhotoUploadProps {
  onPhotosChange: (photos: File[]) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosChange }) => {
  const [showBlockedMessage, setShowBlockedMessage] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Clear the input value to reset it
    event.target.value = '';
    
    // Show the blocked message
    setShowBlockedMessage(true);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowBlockedMessage(false);
    }, 3000);
  };

  if (showBlockedMessage) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
        <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
          <Camera size={20} className="text-gray-400" />
        </div>
        <p className="text-base font-medium text-gray-900">Stop it! This isn't a demo about photo upload.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block bg-gray-50 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-200 hover:border-gray-300">
        <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
          <Camera size={20} className="text-gray-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Click to add photos</h3>
        <p className="text-sm text-gray-500">or drag and drop</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};
