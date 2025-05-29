
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Welcome to a demo of the AI assisted review coach
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-4 leading-relaxed">
            I won't provide any guidance. Just use the form as you normally would. Slack me (Raja) with any feedback you have. We're building this forreal and it's a fairly realistic representation of what we'll get. I built it in Lovable in a few hours with just $25 with the goal of tightening my spec and creating something interactive that can be used in UXR.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button onClick={onClose} className="px-8 py-2">
            Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
