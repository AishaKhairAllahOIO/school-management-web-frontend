import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  X,
} from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { setupSteps } from "../config/setupSteps";
import type { SetupStep } from "../types/onboarding.types";
import "../styles/onboarding.css";

type SetupGuideDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visitedStepIds: string[];
  onVisitStep: (stepId: string) => void;
  onComplete: () => void;
};

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type CardPosition = {
  left: number;
  top: number;
};

function findVisibleTarget(step: SetupStep): HTMLElement | null {
  for (const selector of step.targetSelectors) {
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );

    const visible = candidates.find((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    });

    if (visible) return visible;
  }

  return null;
}

function toRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function computeCardPosition(
  rect: Rect | null,
  width: number,
  height: number,
): CardPosition {
  const margin = 16;
  const gap = 16;
  const safeHeight = Math.min(height, window.innerHeight - margin * 2);

  if (!rect || window.innerWidth < 760) {
    return {
      left: Math.max(margin, (window.innerWidth - width) / 2),
      top: Math.max(margin, window.innerHeight - safeHeight - margin),
    };
  }

  const roomRight = window.innerWidth - (rect.left + rect.width);
  const roomLeft = rect.left;
  const roomBelow = window.innerHeight - (rect.top + rect.height);

  if (roomRight >= width + gap) {
    return {
      left: rect.left + rect.width + gap,
      top: Math.min(
        Math.max(margin, rect.top),
        window.innerHeight - safeHeight - margin,
      ),
    };
  }

  if (roomLeft >= width + gap) {
    return {
      left: rect.left - width - gap,
      top: Math.min(
        Math.max(margin, rect.top),
        window.innerHeight - safeHeight - margin,
      ),
    };
  }

  if (roomBelow >= safeHeight + gap) {
    return {
      left: Math.min(
        Math.max(margin, rect.left),
        window.innerWidth - width - margin,
      ),
      top: rect.top + rect.height + gap,
    };
  }

  return {
    left: Math.max(margin, window.innerWidth - width - margin),
    top: Math.max(margin, window.innerHeight - safeHeight - margin),
  };
}

export function SetupGuideDialog({
  open,
  onOpenChange,
  visitedStepIds: _visitedStepIds,
  onVisitStep,
  onComplete,
}: SetupGuideDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  const step = setupSteps[index];
  const StepIcon = step.icon;

  useEffect(() => {
    if (!open) {
      setStarted(false);
      setFinished(false);
      setIndex(0);
      setTargetRect(null);
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !started || finished || !step) return;

    let cancelled = false;

    function updateTarget() {
      if (cancelled) return;

      const element = findVisibleTarget(step);

      if (!element) {
        setTargetRect(null);
        return;
      }

      const currentRect = element.getBoundingClientRect();
      const outsideViewport =
        currentRect.top < 8 ||
        currentRect.bottom > window.innerHeight - 8;

      if (outsideViewport) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }

      setTargetRect(toRect(element));
    }

    const firstFrame = window.requestAnimationFrame(updateTarget);
    const interval = window.setInterval(updateTarget, 240);

    window.addEventListener("resize", updateTarget);
    window.addEventListener("scroll", updateTarget, true);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.clearInterval(interval);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("scroll", updateTarget, true);
    };
  }, [open, started, finished, step, location.pathname]);

  if (!open) return null;

  function visit(nextIndex: number) {
    const nextStep = setupSteps[nextIndex];

    setIndex(nextIndex);
    setTargetRect(null);

    if (location.pathname !== nextStep.path) {
      navigate(nextStep.path);
    }

    onVisitStep(nextStep.id);
  }

  function startTour() {
    setStarted(true);
    visit(0);
  }

  function moveTo(nextIndex: number) {
    if (nextIndex < 0) return;

    if (nextIndex >= setupSteps.length) {
      setFinished(true);
      setTargetRect(null);
      return;
    }

    visit(nextIndex);
  }

  if (!started) {
    return createPortal(
      <div className="fixed inset-0 z-[140] flex items-center justify-center overflow-y-auto bg-foreground/48 p-4 backdrop-blur-[3px]">
        <section className="onboarding-welcome-enter relative my-auto w-full max-w-[430px] overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-[0_26px_80px_rgba(25,20,60,0.24)]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute end-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close guide"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-primary/15 bg-primary/[0.07] text-primary">
              <Compass className="h-[18px] w-[18px]" />
            </span>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.17em] text-primary">
              Getting started
            </p>

            <h2 className="mt-2 text-[24px] font-semibold leading-[1.2] tracking-[-0.035em] text-foreground">
              A quick guide to the main areas.
            </h2>

            <p className="mt-3 text-[12.5px] leading-[1.7] text-muted-foreground">
              Follow the main navigation from initial setup to daily school work. Each step explains one area and when it becomes useful.
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Maybe later
              </Button>

              <Button onClick={startTour} className="rounded-[12px] px-5">
                Start guide
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </section>
      </div>,
      document.body,
    );
  }

  if (finished) {
    return createPortal(
      <div className="fixed inset-0 z-[140] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-[3px]">
        <section className="onboarding-welcome-enter w-full max-w-[430px] rounded-[20px] border border-success/20 bg-card p-6 text-center shadow-[0_26px_80px_rgba(20,70,45,0.22)]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-success/25 bg-success/[0.11] text-success">
            <Check className="h-8 w-8" strokeWidth={2.4} />
          </span>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.17em] text-success">
            Guide complete
          </p>

          <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.04em] text-foreground">
            You are ready to continue.
          </h2>

          <p className="mx-auto mt-3 max-w-[360px] text-[12.5px] leading-6 text-muted-foreground">
            You now know where to set up the system, manage users, organize school work and find your account tools.
          </p>

          <Button
            type="button"
            onClick={onComplete}
            className="mt-7 rounded-[12px] bg-success px-6 text-success-foreground hover:bg-success/90"
          >
            Done
            <Check className="h-4 w-4" />
          </Button>
        </section>
      </div>,
      document.body,
    );
  }

  const cardWidth = Math.min(310, window.innerWidth - 24);
  const estimatedCardHeight = 245;
  const position = computeCardPosition(
    targetRect,
    cardWidth,
    estimatedCardHeight,
  );
  const isLastStep = index === setupSteps.length - 1;

  return createPortal(
    <div className="fixed inset-0 z-[140] overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1.5px]" />

      {targetRect ? (
        <div
          className="pointer-events-none fixed rounded-[14px] border-2 border-white transition-all duration-300 ease-out"
          style={{
            top: Math.max(4, targetRect.top - 4),
            left: Math.max(4, targetRect.left - 4),
            width: Math.min(window.innerWidth - 8, targetRect.width + 8),
            height: Math.min(window.innerHeight - 8, targetRect.height + 8),
            boxShadow:
              "0 0 0 2px hsl(var(--primary) / .28), 0 0 0 9999px rgba(15,23,42,.70), 0 12px 34px rgba(0,0,0,.24)",
          }}
        />
      ) : null}

      <aside
        key={step.id}
        className="onboarding-card-enter fixed max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[17px] border border-border/70 bg-card shadow-[0_24px_70px_rgba(10,8,28,0.34)]"
        style={{
          top: position.top,
          left: position.left,
          width: cardWidth,
        }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-primary/[0.08] text-primary">
              <StepIcon className="h-[17px] w-[17px]" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Step {index + 1} of {setupSteps.length}
                </span>

                {isLastStep ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/[0.12] text-success">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </div>

              <h3 className="mt-1 text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="mt-3 text-[11.5px] leading-[1.6] text-muted-foreground">
            {step.description}
          </p>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className={[
                "h-full rounded-full transition-[width,background-color] duration-500",
                isLastStep ? "bg-success" : "bg-primary",
              ].join(" ")}
              style={{
                width: `${((index + 1) / setupSteps.length) * 100}%`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/55 pt-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[9px] px-2 py-1.5 text-[10.5px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Exit guide
            </button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => moveTo(index - 1)}
                disabled={index === 0}
                className="h-8 rounded-[9px] px-2.5"
                aria-label="Previous step"
              >
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
              </Button>

              <Button
                type="button"
                onClick={() => moveTo(index + 1)}
                className={[
                  "h-8 rounded-[9px] px-3.5 text-[11px]",
                  isLastStep
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "",
                ].join(" ")}
              >
                {isLastStep ? "Finish" : "Next"}
                {isLastStep ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
