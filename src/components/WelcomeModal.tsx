
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
      <DialogContent className="sm:max-w-2xl bg-black border-4 border-green-400 rounded-none shadow-2xl shadow-green-400/20">
        <div className="relative p-8 bg-gradient-to-b from-black to-gray-900">
          {/* Retro grid pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,255,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.3)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-3xl font-mono font-bold text-green-400 text-center mb-8 tracking-wider animate-pulse">
              ★ WELCOME TO THE AI-ASSISTED REVIEW COACH DEMO ★
            </DialogTitle>
            <DialogDescription className="text-green-300 font-mono text-center leading-relaxed whitespace-pre-line text-lg tracking-wide">
              {`USE THE FORM AS YOU NORMALLY WOULD — I WON'T GIVE ANY INSTRUCTIONS.

IF YOU HAVE FEEDBACK, SLACK ME (RAJA). WE'RE BUILDING THIS FOR REAL, AND THIS IS A PRETTY CLOSE REPRESENTATION OF WHAT THE FINAL VERSION COULD LOOK LIKE.

I PUT IT TOGETHER IN A FEW HOURS USING LOVABLE (COST: $25) TO HELP TIGHTEN THE SPEC AND GIVE US SOMETHING INTERACTIVE FOR UXR.`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center mt-12 relative z-10">
            <Button 
              onClick={onClose} 
              className="px-12 py-4 text-xl font-mono font-bold bg-green-500 hover:bg-green-400 text-black border-2 border-green-300 rounded-none shadow-lg hover:shadow-green-400/50 transition-all duration-200 hover:scale-105 tracking-wider"
            >
              ► START GAME ◄
            </Button>
          </div>
          
          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-400"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-400"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-400"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-400"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
