
import React from 'react';

export const HotelHeader: React.FC = () => {
  return (
    <div className="pb-6 mb-6 border-b border-gray-200">
      <div className="flex items-start gap-4">
        <a 
          href="https://www.tripadvisor.com/Hotel_Review-g13163089-d1147500-Reviews-Club_Hotel_Marina_Beach-Marina_di_Orosei_Orosei_Province_of_Nuoro_Sardinia.html"
          target="_blank"
          rel="noopener noreferrer"
          className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/c5cbe866-b60d-4e19-956b-1c8c607c83e8.png" 
            alt="Club Hotel Marina Beach" 
            className="w-full h-full object-cover rounded-lg"
          />
        </a>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Club Hotel Marina Beach</h1>
          <div className="text-sm text-gray-600">
            <div>Marina di Orosei, Orosei, Province of Nuoro</div>
            <div>Sardinia, Italy</div>
          </div>
        </div>
      </div>
    </div>
  );
};
