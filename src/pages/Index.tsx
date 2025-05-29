
import React, { useState, useEffect } from 'react';
import { ReviewForm } from '@/components/ReviewForm';
import { WelcomeModal } from '@/components/WelcomeModal';

const Index = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />
      <div className="max-w-2xl mx-auto">
        <ReviewForm />
      </div>
    </div>
  );
};

export default Index;
