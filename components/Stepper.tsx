import React from 'react';
import type { Step } from '../types';
import { StepId } from '../constants';
import { CheckCircleIcon, DotIcon } from './IconComponents';

interface StepperProps {
  steps: Step[];
  currentStepId: StepId;
  isStepCompleted: (stepId: StepId) => boolean;
  onStepClick: (stepId: StepId) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStepId, isStepCompleted, onStepClick }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4">
        {steps.map((step) => {
          const isCompleted = isStepCompleted(step.id);
          const isCurrent = step.id === currentStepId;

          return (
            <li key={step.name}>
              <button
                onClick={() => onStepClick(step.id)}
                className={`group flex items-start w-full text-left p-2 rounded-lg transition-colors ${isCurrent ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              >
                <span className="flex-shrink-0 flex items-center h-10">
                  {isCompleted ? (
                    <CheckCircleIcon className="h-8 w-8 text-[#D49929]" />
                  ) : (
                    <div className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${isCurrent ? 'border-[#D49929] bg-[#D49929]' : 'border-gray-500 group-hover:border-gray-400'}`}>
                      <DotIcon className={`h-3 w-3 ${isCurrent ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`} />
                    </div>
                  )}
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className={`text-sm font-semibold ${isCurrent ? 'text-[#EAC16A]' : 'text-gray-200'}`}>{step.name}</span>
                  <span className="text-sm text-gray-400">{step.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Stepper;