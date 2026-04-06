import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Support' },
  { id: 2, label: 'Format' },
  { id: 3, label: 'Style' },
  { id: 4, label: 'Contenu' },
  { id: 5, label: 'Générer' },
];

export default function StepIndicator({ currentStep, onStepClick }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {STEPS.map((step, i) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => onStepClick(step.id)}
              className="flex items-center gap-1.5 group"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30'
                  : isCompleted
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span className={`text-xs font-medium hidden sm:inline transition-colors ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-6 sm:w-10 h-0.5 rounded-full transition-colors ${
                currentStep > step.id ? 'bg-primary/40' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}