import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';
import { ONBOARDING_STEPS } from '../utils/onboardingSteps';
import { CustomTooltip } from './CustomTooltip';
import { useOnboarding } from '../hooks/useOnboarding';
import { useLayoutStore } from '@/app/layout/store/layoutStore';
import { useLocale } from '@/app/providers/locale';

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { isCompleted, isRunning, completeOnboarding } = useOnboardingStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isSidebarCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const expandSidebar = useLayoutStore((state) => state.expandSidebar);
  const { direction } = useLocale();
  const isRtl = direction === 'rtl';

  // حالة لتخزين إحداثيات النافذة ومكان المؤشر
  const [adjustedPosition, setAdjustedPosition] = useState<{ 
    top: number; 
    left: number; 
    isOnRightSide: boolean; // يحدد هل النافذة على يمين العنصر أم يساره
  } | null>(null);

  useEffect(() => {
    if (isRunning) {
      setCurrentStepIndex(0);
      if (isSidebarCollapsed) {
        expandSidebar();
      }
    }
  }, [isRunning, isSidebarCollapsed, expandSidebar]);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const isCenter = currentStep?.placement === 'center';
  const targetCoords = useOnboarding(isRunning && !isCenter, isCenter ? null : currentStep?.target || null);

  useEffect(() => {
    if (!targetCoords || isCenter) {
      setAdjustedPosition(null);
      return;
    }

    const preferSide = isRtl ? 'left' : 'right';
    const elementEdge = isRtl ? targetCoords.left : targetCoords.left + targetCoords.width;
    const gap = 18; // مسافة بين العنصر والنافذة
    const tooltipWidth = 300 + gap + 10; // عرض النافذة + الهامش
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let finalLeft: number;
    let finalTop: number = targetCoords.top + targetCoords.height / 2;
    let isOnRightSide = false;

    // 1. تعديل الموقع العمودي (منع الغرق)
    if (finalTop + 150 > screenHeight) finalTop = screenHeight - 150;
    if (finalTop - 150 < 0) finalTop = 150;

    // 2. تحديد الموقع الأفقي بدقة
    if (preferSide === 'right') {
      // هل هناك مساحة كافية على يمين العنصر؟
      if (elementEdge + tooltipWidth <= screenWidth) {
        finalLeft = elementEdge + gap;
        isOnRightSide = true; // النافذة على يمين العنصر
      } else {
        // نضطر لوضعها يسار العنصر
        finalLeft = targetCoords.left - tooltipWidth - gap;
        isOnRightSide = false; // النافذة على يسار العنصر
      }
    } else { // RTL
      if (elementEdge - tooltipWidth >= 0) {
        finalLeft = elementEdge - tooltipWidth - gap;
        isOnRightSide = false;
      } else {
        finalLeft = targetCoords.left + targetCoords.width + gap;
        isOnRightSide = true;
      }
    }

    setAdjustedPosition({ top: finalTop, left: finalLeft, isOnRightSide });
  }, [targetCoords, isCenter, isRtl]);

  const handleNext = () => {
    if (currentStepIndex === ONBOARDING_STEPS.length - 1) {
      completeOnboarding();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  const handleExit = () => completeOnboarding();

  if (!isRunning || isCompleted) return <>{children}</>;

  return (
    <>
      <div className="fixed inset-0 z-[999] bg-[rgba(10,9,28,0.5)] transition-opacity duration-300 pointer-events-none" />

      {!isCenter && targetCoords && (
        <div
          className="fixed z-[1000] pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: targetCoords.top - 4,
            left: targetCoords.left - 4,
            width: targetCoords.width + 8,
            height: targetCoords.height + 8,
            borderRadius: '17px',
            backgroundColor: 'transparent',
            boxShadow: '0 0 0 1.5px rgba(255, 255, 255, 0.8)',
          }}
        />
      )}

      {((!isCenter && adjustedPosition) || isCenter) && (
        <div
          className={isCenter ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001]" : "fixed z-[1001]"}
          style={
            !isCenter && adjustedPosition
              ? {
                  top: adjustedPosition.top,
                  left: adjustedPosition.left,
                  transform: 'translateY(-50%)', // توسيط عمودي تام
                }
              : undefined
          }
        >
          
          {/* ✅ المؤشر (السهم) المحسن والدقيق */}
          {!isCenter && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[rgb(var(--background))] border border-[rgb(var(--border))] z-[1002]"
              style={{
                // تدوير المربع 45 درجة ليصبح مثلثاً
                transform: 'translateY(-50%) rotate(45deg)',
                // تحديد مكان السهم بناءً على isOnRightSide
                [adjustedPosition!.isOnRightSide ? 'left' : 'right']: -8,
                // إخفاء الحدود الداخلية ليظهر شكل السهم فقط
                borderRight: adjustedPosition!.isOnRightSide ? 'none' : '1px solid rgb(var(--border))',
                borderTop: adjustedPosition!.isOnRightSide ? '1px solid rgb(var(--border))' : 'none',
                borderLeft: adjustedPosition!.isOnRightSide ? '1px solid rgb(var(--border))' : 'none',
                borderBottom: adjustedPosition!.isOnRightSide ? 'none' : '1px solid rgb(var(--border))',
              }}
            />
          )}

          <CustomTooltip
            step={currentStep}
            totalSteps={ONBOARDING_STEPS.length}
            onNext={handleNext}
            onBack={handleBack}
            onExit={handleExit}
            isFirst={currentStepIndex === 0}
            isLast={currentStepIndex === ONBOARDING_STEPS.length - 1}
          />
        </div>
      )}

      {children}
    </>
  );
};