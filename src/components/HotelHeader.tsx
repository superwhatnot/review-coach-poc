
import React from 'react';
import { MapPin } from 'lucide-react';

export const HotelHeader: React.FC = () => {
  return (
    <div className="pb-6 mb-6 border-b border-gray-200">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop&crop=center" 
            alt="Hotel" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Club Hotel Marina Beach</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Marina di Orosei, Orosei, Province of Nuoro, Sardinia, Italy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
