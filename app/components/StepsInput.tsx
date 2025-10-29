'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Sparkles } from 'lucide-react';

interface StepsInputProps {
  steps: string[];
  onStepsChange: (steps: string[]) => void;
  disabled?: boolean;
}

export function StepsInput({ steps, onStepsChange, disabled = false }: StepsInputProps) {
  const [newStep, setNewStep] = useState('');

  const addStep = () => {
    if (newStep.trim()) {
      onStepsChange([...steps, newStep.trim()]);
      setNewStep('');
    }
  };

  const removeStep = (index: number) => {
    onStepsChange(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    onStepsChange(updatedSteps);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addStep();
    }
  };

  return (
    <div className="space-y-3">
      {/* Existing Steps */}
      {steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, index) => (
            <Card key={index} className="p-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <Textarea
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  disabled={disabled}
                  className="flex-1 min-h-[60px] resize-none"
                  placeholder={`Step ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(index)}
                  disabled={disabled}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Step */}
      <Card className="p-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold">
            {steps.length + 1}
          </div>
          <Textarea
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="flex-1 min-h-[60px] resize-none"
            placeholder="Describe the next step to reproduce the bug..."
          />
          <Button
            type="button"
            onClick={addStep}
            disabled={disabled || !newStep.trim()}
            size="sm"
            className="flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {steps.length === 0 && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Add steps one at a time. Press Enter to add each step.
        </p>
      )}
    </div>
  );
}