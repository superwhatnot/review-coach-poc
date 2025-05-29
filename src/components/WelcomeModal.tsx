
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
            Welcome to the AI-Assisted Review Coach demo.
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
            {`Use the form as you normally would — I won't give any instructions.
If you have feedback, Slack me (Raja). We're building this for real, and this is a pretty close representation of what the final version could look like.
I put it together in a few hours using Lovable (cost: $25) to help tighten the spec and give us something interactive for UXR.`}
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
