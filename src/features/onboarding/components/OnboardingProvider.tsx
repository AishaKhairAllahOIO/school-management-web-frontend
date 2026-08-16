import React, { useEffect, useMemo, useRef, useState } from "react";

import type { ReactNode } from "react";

import {
  DESKTOP_ONBOARDING_STEPS,
  MOBILE_ONBOARDING_STEPS,
} from "../utils/onboardingSteps";

import { useOnboardingStore } from "../store/onboardingStore";

import { CustomTooltip } from "./CustomTooltip";

import { useOnboarding } from "../hooks/useOnboarding";

import { useLayoutStore } from "@/app/layout/store/layoutStore";

import { useLocale } from "@/app/providers/locale";

interface OnboardingProviderProps {
  children: ReactNode;
}

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipPosition {
  top: number;
  left: number;
  placement: TooltipPlacement;
  arrowOffset: number;
}

const TOOLTIP_WIDTH = 300;
const TOOLTIP_HEIGHT = 230;

const GAP = 18;
const SCREEN_PADDING = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
}) => {
  const { isCompleted, isRunning, completeOnboarding } = useOnboardingStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);

  /*
   * نستخدم ref حتى لا تعود الجولة للخطوة
   * الأولى عندما يتغير isSidebarCollapsed.
   */
  const wasRunningRef = useRef(false);

  const isSidebarCollapsed = useLayoutStore(
    (state) => state.isSidebarCollapsed,
  );

  const expandSidebar = useLayoutStore((state) => state.expandSidebar);

  const { direction } = useLocale();

  const isRtl = direction === "rtl";

  /* ---------------------------------------------------------------------- */
  /* Responsive detection                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const updateDeviceType = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateDeviceType();

    mediaQuery.addEventListener("change", updateDeviceType);

    return () => {
      mediaQuery.removeEventListener("change", updateDeviceType);
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Current steps                                                           */
  /* ---------------------------------------------------------------------- */

  const steps = useMemo(
    () => (isMobile ? MOBILE_ONBOARDING_STEPS : DESKTOP_ONBOARDING_STEPS),
    [isMobile],
  );

  const currentStep = steps[currentStepIndex];

  const isCenter = currentStep?.placement === "center";

  /*
   * Center steps don't need a target.
   */
  const targetCoords = useOnboarding(
    isRunning && !isCenter && Boolean(currentStep?.target),
    isCenter ? null : (currentStep?.target ?? null),
  );

  /* ---------------------------------------------------------------------- */
  /* Start onboarding                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (isRunning && !wasRunningRef.current) {
      setCurrentStepIndex(0);
    }

    wasRunningRef.current = isRunning;
  }, [isRunning]);

  /* ---------------------------------------------------------------------- */
  /* Desktop sidebar behavior                                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    /*
     * لا نفتح Sidebar على الجوال.
     */
    if (!isRunning || isMobile || isCompleted) {
      return;
    }

    /*
     * فقط Desktop.
     */
    if (isSidebarCollapsed) {
      expandSidebar();
    }
  }, [isRunning, isMobile, isCompleted, isSidebarCollapsed, expandSidebar]);

  /* ---------------------------------------------------------------------- */
  /* Tooltip positioning                                                     */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    /*
     * Center dialog.
     */
    if (!isRunning || isCenter || !targetCoords) {
      setTooltipPosition(null);
      return;
    }

    const viewportWidth = window.innerWidth;

    const viewportHeight = window.innerHeight;

    const preferredPlacement = currentStep?.placement ?? "right";

    const targetCenterX = targetCoords.centerX;

    const targetCenterY = targetCoords.centerY;

    const spaceRight = viewportWidth - targetCoords.left - targetCoords.width;

    const spaceLeft = targetCoords.left;

    const spaceTop = targetCoords.top;

    const spaceBottom = viewportHeight - targetCoords.top - targetCoords.height;

    let placement: TooltipPlacement =
      preferredPlacement === "center" ? "bottom" : preferredPlacement;
    /* ------------------------------------------------------------------ */
    /* RIGHT                                                               */
    /* ------------------------------------------------------------------ */

    if (preferredPlacement === "right") {
      /*
       * LTR:
       * right -> left fallback
       *
       * RTL:
       * left -> right fallback
       */
      const preferredSpace = isRtl ? spaceLeft : spaceRight;

      const fallbackSpace = isRtl ? spaceRight : spaceLeft;

      if (preferredSpace >= TOOLTIP_WIDTH + GAP) {
        placement = isRtl ? "left" : "right";
      } else if (fallbackSpace >= TOOLTIP_WIDTH + GAP) {
        placement = isRtl ? "right" : "left";
      } else if (spaceBottom >= TOOLTIP_HEIGHT + GAP) {
        placement = "bottom";
      } else {
        placement = "top";
      }
    }

    /* ------------------------------------------------------------------ */
    /* LEFT                                                                */
    /* ------------------------------------------------------------------ */

    if (preferredPlacement === "left") {
      const preferredSpace = isRtl ? spaceRight : spaceLeft;

      const fallbackSpace = isRtl ? spaceLeft : spaceRight;

      if (preferredSpace >= TOOLTIP_WIDTH + GAP) {
        placement = isRtl ? "right" : "left";
      } else if (fallbackSpace >= TOOLTIP_WIDTH + GAP) {
        placement = isRtl ? "left" : "right";
      } else if (spaceBottom >= TOOLTIP_HEIGHT + GAP) {
        placement = "bottom";
      } else {
        placement = "top";
      }
    }

    /* ------------------------------------------------------------------ */
    /* BOTTOM                                                              */
    /* ------------------------------------------------------------------ */

    if (preferredPlacement === "bottom") {
      if (spaceBottom >= TOOLTIP_HEIGHT + GAP) {
        placement = "bottom";
      } else if (spaceTop >= TOOLTIP_HEIGHT + GAP) {
        placement = "top";
      } else {
        placement = spaceRight >= TOOLTIP_WIDTH + GAP ? "right" : "left";
      }
    }

    /* ------------------------------------------------------------------ */
    /* TOP                                                                 */
    /* ------------------------------------------------------------------ */

    if (preferredPlacement === "top") {
      if (spaceTop >= TOOLTIP_HEIGHT + GAP) {
        placement = "top";
      } else if (spaceBottom >= TOOLTIP_HEIGHT + GAP) {
        placement = "bottom";
      } else {
        placement = spaceRight >= TOOLTIP_WIDTH + GAP ? "right" : "left";
      }
    }

    let left = 0;
    let top = 0;
    let arrowOffset = 0;

    /* ------------------------------------------------------------------ */
    /* Tooltip on RIGHT                                                    */
    /* ------------------------------------------------------------------ */

    if (placement === "right") {
      left = targetCoords.left + targetCoords.width + GAP;

      top = targetCenterY - TOOLTIP_HEIGHT / 2;

      top = clamp(
        top,
        SCREEN_PADDING,
        Math.max(
          SCREEN_PADDING,
          viewportHeight - TOOLTIP_HEIGHT - SCREEN_PADDING,
        ),
      );

      /*
       * IMPORTANT:
       * arrowOffset is calculated from the
       * REAL target center.
       */
      arrowOffset = targetCenterY - top;

      arrowOffset = clamp(arrowOffset, 16, TOOLTIP_HEIGHT - 16);
    }

    /* ------------------------------------------------------------------ */
    /* Tooltip on LEFT                                                     */
    /* ------------------------------------------------------------------ */

    if (placement === "left") {
      left = targetCoords.left - TOOLTIP_WIDTH - GAP;

      top = targetCenterY - TOOLTIP_HEIGHT / 2;

      top = clamp(
        top,
        SCREEN_PADDING,
        Math.max(
          SCREEN_PADDING,
          viewportHeight - TOOLTIP_HEIGHT - SCREEN_PADDING,
        ),
      );

      arrowOffset = targetCenterY - top;

      arrowOffset = clamp(arrowOffset, 16, TOOLTIP_HEIGHT - 16);
    }

    /* ------------------------------------------------------------------ */
    /* Tooltip BELOW target                                                */
    /* ------------------------------------------------------------------ */

    if (placement === "bottom") {
      left = targetCenterX - TOOLTIP_WIDTH / 2;

      top = targetCoords.top + targetCoords.height + GAP;

      left = clamp(
        left,
        SCREEN_PADDING,
        Math.max(
          SCREEN_PADDING,
          viewportWidth - TOOLTIP_WIDTH - SCREEN_PADDING,
        ),
      );

      top = clamp(
        top,
        SCREEN_PADDING,
        Math.max(
          SCREEN_PADDING,
          viewportHeight - TOOLTIP_HEIGHT - SCREEN_PADDING,
        ),
      );

      arrowOffset = targetCenterX - left;

      if (isMobile && currentStep?.mobileArrowOffset) {
        arrowOffset += currentStep.mobileArrowOffset;
      }

      arrowOffset = clamp(arrowOffset, 16, TOOLTIP_WIDTH - 16);
    }

    /* ------------------------------------------------------------------ */
    /* Tooltip ABOVE target                                                */
    /* ------------------------------------------------------------------ */

    if (placement === "top") {
      left = targetCenterX - TOOLTIP_WIDTH / 2;

      top = targetCoords.top - TOOLTIP_HEIGHT - GAP;

      left = clamp(
        left,
        SCREEN_PADDING,
        Math.max(
          SCREEN_PADDING,
          viewportWidth - TOOLTIP_WIDTH - SCREEN_PADDING,
        ),
      );

      top = clamp(
        top,
        SCREEN_PADDING,
        Math.max(
          SCREEN_PADDING,
          viewportHeight - TOOLTIP_HEIGHT - SCREEN_PADDING,
        ),
      );

      arrowOffset = targetCenterX - left;

      arrowOffset = clamp(arrowOffset, 16, TOOLTIP_WIDTH - 16);
    }

    setTooltipPosition({
      top,
      left,
      placement,
      arrowOffset,
    });
  }, [isRunning, isCenter, targetCoords, currentStep, isRtl]);

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                              */
  /* ---------------------------------------------------------------------- */

  const handleNext = () => {
    if (currentStepIndex >= steps.length - 1) {
      completeOnboarding();
      return;
    }

    setCurrentStepIndex((previous) => previous + 1);
  };

  const handleBack = () => {
    setCurrentStepIndex((previous) => Math.max(0, previous - 1));
  };

  const handleExit = () => {
    completeOnboarding();
  };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  if (!isRunning || isCompleted || !currentStep) {
    return <>{children}</>;
  }

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Overlay                                                           */}
      {/* ---------------------------------------------------------------- */}

      <div
        className="
          fixed
          inset-0
          z-[999]
          bg-[rgba(10,9,28,0.48)]
          transition-opacity
          duration-300
          pointer-events-none
        "
      />

      {/* ---------------------------------------------------------------- */}
      {/* Target highlight                                                  */}
      {/* ---------------------------------------------------------------- */}

      {!isCenter && targetCoords && (
        <div
          className="
              pointer-events-none
              fixed
              z-[1000]
              transition-all
              duration-200
              ease-out
            "
          style={{
            top: targetCoords.top - 4,
            left: targetCoords.left - 4,
            width: targetCoords.width + 8,
            height: targetCoords.height + 8,
            borderRadius: "16px",
            background: "transparent",
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.92), 0 0 0 5px rgba(255,255,255,0.06)",
          }}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Center dialog                                                     */}
      {/* ---------------------------------------------------------------- */}

      {isCenter && (
        <div
          className="
            fixed
            inset-0
            z-[1001]
            flex
            items-center
            justify-center
            px-4
          "
        >
          <CustomTooltip
            step={currentStep}
            totalSteps={steps.length}
            currentIndex={currentStepIndex + 1}
            onNext={handleNext}
            onBack={handleBack}
            onExit={handleExit}
            isFirst={currentStepIndex === 0}
            isLast={currentStepIndex === steps.length - 1}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Anchored tooltip                                                  */}
      {/* ---------------------------------------------------------------- */}

      {!isCenter && tooltipPosition && (
        <div
          className="
              fixed
              z-[1001]
            "
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* -------------------------------------------------------- */}
          {/* Arrow                                                     */}
          {/* -------------------------------------------------------- */}

          <div
            aria-hidden="true"
            className="
                pointer-events-none
                absolute
                z-[-1]
                h-4
                w-4
                rotate-45
                border
                border-[rgb(var(--border))]
                bg-[rgb(var(--background))]
              "
            style={(() => {
              const { placement, arrowOffset } = tooltipPosition;

              if (placement === "right") {
                return {
                  left: -8,
                  top: arrowOffset - 8,
                  borderRight: "none",
                  borderTop: "none",
                };
              }

              if (placement === "left") {
                return {
                  right: -8,
                  top: arrowOffset - 8,
                  borderLeft: "none",
                  borderBottom: "none",
                };
              }

              if (placement === "bottom") {
                return {
                  left: arrowOffset - 8,
                  top: -8,
                  borderRight: "none",
                  borderBottom: "none",
                };
              }

              return {
                left: arrowOffset - 8,
                bottom: -8,
                borderLeft: "none",
                borderTop: "none",
              };
            })()}
          />

          <CustomTooltip
            step={currentStep}
            totalSteps={steps.length}
            currentIndex={currentStepIndex + 1}
            onNext={handleNext}
            onBack={handleBack}
            onExit={handleExit}
            isFirst={currentStepIndex === 0}
            isLast={currentStepIndex === steps.length - 1}
          />
        </div>
      )}

      {children}
    </>
  );
};
