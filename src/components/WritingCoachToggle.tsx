
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';

interface WritingCoachToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const WritingCoachToggle: React.FC<WritingCoachToggleProps> = ({
  enabled,
  onToggle
}) => {
  return (
    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
      <HelpCircle className="w-4 h-4 text-gray-600" />
      <div className="flex-1">
        <Label htmlFor="writing-coach" className="text-sm font-medium text-gray-700">
          Writing Coach
        </Label>
        <p className="text-xs text-gray-500 mt-0.5">
          Get helpful suggestions while writing your review
        </p>
      </div>
      <Switch
        id="writing-coach"
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
};
