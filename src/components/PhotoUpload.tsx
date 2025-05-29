
import React, { useState } from 'react';
import { Camera, X, Plus } from 'lucide-react';

interface PhotoUploadProps {
  onPhotosChange: (photos: File[]) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosChange }) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPhotos = [...photos, ...files].slice(0, 10); // Limit to 10 photos
    
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, 10));
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setPhotos(newPhotos);
    setPreviews(newPreviews);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {photos.length < 10 && (
            <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <Plus size={20} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 text-center">Add photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
      
      {photos.length === 0 && (
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
      )}
    </div>
  );
};
