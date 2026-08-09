import React from 'react';
import type { TooltipRenderProps } from 'react-joyride';

const CustomTooltip: React.FC<TooltipRenderProps> = ({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  isLastStep,
}) => {
  const totalSteps = 12;

  return (
    <div className="bg-[rgb(var(--background))] rounded-[24px] shadow-floating p-5 max-w-[300px] w-full border border-[rgb(var(--border))] relative">
      
      {/* Header: Step Count */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-[rgb(var(--primary))] uppercase tracking-widest">
          STEP {index + 1} OF {totalSteps}
        </span>
        <button 
          {...skipProps} 
          className="text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="w-9 h-9 rounded-full bg-[rgb(var(--secondary))] text-[rgb(var(--primary))] flex items-center justify-center mb-3 mt-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>

      <h3 className="text-[15px] font-semibold text-[rgb(var(--foreground))] mb-0.5">{step.title}</h3>
      <p className="text-[12px] text-[rgb(var(--muted-foreground))] leading-relaxed mb-4">{step.content}</p>

      <div className="flex justify-between items-center pt-3 border-t border-[rgb(var(--border))]">
        <button
          {...closeProps}
          className="text-[12px] font-medium text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors"
        >
          Exit tour
        </button>

        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="w-[34px] h-[34px] flex items-center justify-center rounded-full border border-[rgb(var(--border))] text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] transition-colors text-sm"
            >
              ←
            </button>
          )}
          <button
            {...primaryProps}
            className="px-4 py-1.5 h-[34px] rounded-full primary-gradient text-[rgb(var(--primary-foreground))] text-[12px] font-semibold transition-transform hover:scale-105 shadow-auth-button"
          >
            {isLastStep ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;