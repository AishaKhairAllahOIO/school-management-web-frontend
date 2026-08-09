import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Joyride } from 'react-joyride';
import CustomTooltip from '../CustomTooltip';
import { ONBOARDING_STEPS } from '../onboardingSteps';
import { useOnboardingStore } from '../store/onboardingStore';

interface OnboardingProviderProps {
  children: ReactNode;
}

const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { isCompleted, isRunning, startOnboarding } = useOnboardingStore();

  useEffect(() => {
    if (!isCompleted) {
      startOnboarding();
    }
  }, [isCompleted, startOnboarding]);

  return (
    <>
      <Joyride
        key={isRunning ? 'running' : 'stopped'}
        continuous
        run={isRunning}
        scrollToFirstStep
        steps={ONBOARDING_STEPS}
        tooltipComponent={CustomTooltip}
        locale={{
          last: 'Finish',
          next: 'Next →',
          back: '←',
          skip: 'Exit tour',
        }}
      />

      {children}
    </>
  );
};

export default OnboardingProvider;
