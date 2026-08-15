import React from "react";
import type { OnboardingStep } from "../utils/onboardingSteps";

interface CustomTooltipProps {
  step: OnboardingStep;
  totalSteps: number;
  currentIndex: number;

  onNext: () => void;
  onBack: () => void;
  onExit: () => void;

  isFirst: boolean;
  isLast: boolean;
}

export const CustomTooltip: React.FC<
  CustomTooltipProps
> = ({
  step,
  totalSteps,
  currentIndex,
  onNext,
  onBack,
  onExit,
  isFirst,
  isLast,
}) => {
  const Icon = step.icon;

  return (
    <div
      className="
        relative
        w-[min(300px,calc(100vw-32px))]
        overflow-hidden
        rounded-[22px]
        border
        border-[rgb(var(--border))]
        bg-[rgb(var(--background))]
        p-5
        shadow-[0_24px_70px_rgba(0,0,0,0.18)]
        backdrop-blur-xl
      "
    >
      {/* subtle decorative glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -end-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-[rgb(var(--primary)/0.08)]
          blur-2xl
        "
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[rgb(var(--primary))]
            "
          >
            STEP {currentIndex} OF {totalSteps}
          </span>

          <button
            type="button"
            onClick={onExit}
            aria-label="Close onboarding"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              text-[rgb(var(--muted-foreground))]
              transition
              hover:bg-[rgb(var(--muted))]
              hover:text-[rgb(var(--foreground))]
            "
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Icon */}
        <div
          className="
            mb-3
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-[14px]
            bg-[rgb(var(--primary)/0.10)]
            text-[rgb(var(--primary))]
          "
        >
          <Icon
            size={18}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <h3
          className="
            mb-1
            text-[15px]
            font-semibold
            tracking-[-0.01em]
            text-[rgb(var(--foreground))]
          "
        >
          {step.title}
        </h3>

        <p
          className="
            mb-5
            text-[12px]
            leading-[1.7]
            text-[rgb(var(--muted-foreground))]
          "
        >
          {step.content}
        </p>

        {/* Footer */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-[rgb(var(--border))]
            pt-3.5
          "
        >
          <button
            type="button"
            onClick={onExit}
            className="
              text-[11px]
              font-medium
              text-[rgb(var(--muted-foreground))]
              transition
              hover:text-[rgb(var(--foreground))]
            "
          >
            Exit tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Previous step"
                className="
                  flex
                  h-[34px]
                  w-[34px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[rgb(var(--border))]
                  text-[rgb(var(--muted-foreground))]
                  transition
                  hover:bg-[rgb(var(--muted))]
                  hover:text-[rgb(var(--foreground))]
                "
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={onNext}
              className="
                h-[34px]
                rounded-full
                bg-[rgb(var(--primary))]
                px-4
                text-[12px]
                font-semibold
                text-[rgb(var(--primary-foreground))]
                shadow-[0_7px_20px_rgb(var(--primary)/0.20)]
                transition-all
                hover:-translate-y-0.5
                hover:shadow-[0_9px_24px_rgb(var(--primary)/0.25)]
                active:translate-y-0
              "
            >
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};