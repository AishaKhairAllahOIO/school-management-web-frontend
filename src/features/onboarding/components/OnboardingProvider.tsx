import  type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import CustomTooltip from '../CustomTooltip';
import { ONBOARDING_STEPS } from '../onboardingSteps';
import { useOnboardingStore } from '../store/onboardingStore';

interface OnboardingProviderProps {
  children: ReactNode;
}

const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { isCompleted, isRunning, startOnboarding, completeOnboarding } = useOnboardingStore();

  useEffect(() => {
    if (!isCompleted) {
      startOnboarding();
    }
  }, [isCompleted, startOnboarding]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      completeOnboarding();
    }
  };

  return (
    <>
      <Joyride
        key={isRunning ? 'running' : 'stopped'} // ✅ هذا هو الحل السحري لإعادة التشغيل عند الضغط
        callback={handleJoyrideCallback}
        continuous={true}
        hideCloseButton={true}
        run={isRunning}
        scrollToFirstStep={true}
        showProgress={false}
        showSkipButton={true}
        steps={ONBOARDING_STEPS as Step[]}
        tooltipComponent={CustomTooltip}
        disableBeacon={true} 
        styles={{
          options: {
            arrowColor: 'rgb(var(--background))',
            backgroundColor: 'rgb(var(--background))',
            overlayColor: 'rgba(10, 9, 28, 0.6)', 
            primaryColor: 'rgb(var(--primary))',
            textColor: 'rgb(var(--foreground))',
            zIndex: 1000,
            spotlightShadow: '0 0 0 4px rgba(255, 255, 255, 0.1) inset, 0 0 20px rgba(103, 58, 244, 0.3)',
          },
          spotlight: {
            borderRadius: 28,
            backgroundColor: 'transparent', 
          },
        }}
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