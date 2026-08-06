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
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { setupSteps } from "../config/setupSteps";
import type {
  OnboardingSectionId,
  SetupStep,
} from "../types/onboarding.types";
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
  side: "left" | "right" | "top" | "bottom";
};

type SectionStyle = {
  dot: string;
  text: string;
  soft: string;
  border: string;
  glow: string;
};

const primarySectionStyle: SectionStyle = {
  dot: "bg-primary",
  text: "text-primary",
  soft: "bg-primary/[0.075]",
  border: "border-primary/20",
  glow: "hsl(var(--primary) / .20)",
};

const sectionStyles: Record<OnboardingSectionId, SectionStyle> = {
  settings: primarySectionStyle,
  administration: primarySectionStyle,
  "academic-setup": primarySectionStyle,
  people: primarySectionStyle,
  teaching: primarySectionStyle,
  scheduling: primarySectionStyle,
  finance: primarySectionStyle,
  attendance: primarySectionStyle,
  communications: primarySectionStyle,
  reports: primarySectionStyle,
  system: primarySectionStyle,
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
  const gap = 24;
  const safeHeight = Math.min(height || 380, window.innerHeight - margin * 2);

  if (!rect || window.innerWidth < 760) {
    return {
      left: Math.max(margin, (window.innerWidth - width) / 2),
      top: Math.max(margin, window.innerHeight - safeHeight - margin),
      side: "bottom",
    };
  }

  const roomRight = window.innerWidth - (rect.left + rect.width);
  const roomLeft = rect.left;
  const roomBelow = window.innerHeight - (rect.top + rect.height);
  const roomAbove = rect.top;

  if (roomRight >= width + gap) {
    return {
      left: rect.left + rect.width + gap,
      top: Math.min(
        Math.max(margin, rect.top + rect.height / 2 - safeHeight / 2),
        window.innerHeight - safeHeight - margin,
      ),
      side: "right",
    };
  }

  if (roomLeft >= width + gap) {
    return {
      left: rect.left - width - gap,
      top: Math.min(
        Math.max(margin, rect.top + rect.height / 2 - safeHeight / 2),
        window.innerHeight - safeHeight - margin,
      ),
      side: "left",
    };
  }

  if (roomBelow >= safeHeight + gap) {
    return {
      left: Math.min(
        Math.max(margin, rect.left + rect.width / 2 - width / 2),
        window.innerWidth - width - margin,
      ),
      top: rect.top + rect.height + gap,
      side: "bottom",
    };
  }

  if (roomAbove >= safeHeight + gap) {
    return {
      left: Math.min(
        Math.max(margin, rect.left + rect.width / 2 - width / 2),
        window.innerWidth - width - margin,
      ),
      top: rect.top - safeHeight - gap,
      side: "top",
    };
  }

  return {
    left: Math.max(margin, window.innerWidth - width - margin),
    top: Math.max(margin, window.innerHeight - safeHeight - margin),
    side: "bottom",
  };
}

function connectorPath(target: Rect, card: Rect) {
  const targetCenter = {
    x: target.left + target.width / 2,
    y: target.top + target.height / 2,
  };
  const cardCenter = {
    x: card.left + card.width / 2,
    y: card.top + card.height / 2,
  };

  const horizontal = Math.abs(cardCenter.x - targetCenter.x) > Math.abs(cardCenter.y - targetCenter.y);

  const start = horizontal
    ? {
        x: cardCenter.x > targetCenter.x ? target.left + target.width : target.left,
        y: targetCenter.y,
      }
    : {
        x: targetCenter.x,
        y: cardCenter.y > targetCenter.y ? target.top + target.height : target.top,
      };

  const end = horizontal
    ? {
        x: cardCenter.x > targetCenter.x ? card.left : card.left + card.width,
        y: cardCenter.y,
      }
    : {
        x: cardCenter.x,
        y: cardCenter.y > targetCenter.y ? card.top : card.top + card.height,
      };

  if (horizontal) {
    const bend = Math.max(38, Math.abs(end.x - start.x) * 0.46);
    const control1X = start.x + (end.x > start.x ? bend : -bend);
    const control2X = end.x - (end.x > start.x ? bend : -bend);
    return `M ${start.x} ${start.y} C ${control1X} ${start.y}, ${control2X} ${end.y}, ${end.x} ${end.y}`;
  }

  const bend = Math.max(38, Math.abs(end.y - start.y) * 0.46);
  const control1Y = start.y + (end.y > start.y ? bend : -bend);
  const control2Y = end.y - (end.y > start.y ? bend : -bend);
  return `M ${start.x} ${start.y} C ${start.x} ${control1Y}, ${end.x} ${control2Y}, ${end.x} ${end.y}`;
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
  const cardRef = useRef<HTMLElement>(null);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [cardRect, setCardRect] = useState<Rect | null>(null);

  const step = setupSteps[index];
  const StepIcon = step.icon;
  const style = sectionStyles[step.sectionId];

  const sections = useMemo(() => {
    const result: Array<{
      id: OnboardingSectionId;
      title: string;
      firstIndex: number;
      count: number;
    }> = [];

    setupSteps.forEach((item, stepIndex) => {
      const existing = result.find((section) => section.id === item.sectionId);
      if (existing) existing.count += 1;
      else {
        result.push({
          id: item.sectionId,
          title: item.sectionTitle,
          firstIndex: stepIndex,
          count: 1,
        });
      }
    });

    return result;
  }, []);

  const activeSectionIndex = sections.findIndex(
    (section) => section.id === step.sectionId,
  );

  useEffect(() => {
    if (!open) {
      setStarted(false);
      setFinished(false);
      setIndex(0);
      setTargetRect(null);
      setCardRect(null);
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !started || !step) return;

    let cancelled = false;
    let interval = 0;

    function updateTarget() {
      if (cancelled) return;
      const element = findVisibleTarget(step);
      if (!element) {
        setTargetRect(null);
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      setTargetRect(toRect(element));
    }

    const firstFrame = window.requestAnimationFrame(updateTarget);
    interval = window.setInterval(updateTarget, 280);
    window.addEventListener("resize", updateTarget);
    window.addEventListener("scroll", updateTarget, true);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.clearInterval(interval);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("scroll", updateTarget, true);
    };
  }, [open, started, step, location.pathname]);

  useLayoutEffect(() => {
    if (!open || !started || !cardRef.current) return;

    const element = cardRef.current;
    const update = () => setCardRect(toRect(element));
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [open, started, index, targetRect]);

  if (!open) return null;

  function visit(nextIndex: number) {
    const nextStep = setupSteps[nextIndex];
    setIndex(nextIndex);
    setTargetRect(null);
    setCardRect(null);

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
      setCardRect(null);
      return;
    }
    visit(nextIndex);
  }

  if (!started) {
    return createPortal(
      <div className="fixed inset-0 z-[140] flex items-center justify-center overflow-y-auto bg-foreground/45 p-4 backdrop-blur-[5px]">
        <section className="onboarding-welcome-enter relative my-auto w-full max-w-[520px] overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_28px_90px_rgba(28,20,70,0.22)]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute end-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-[12px] border border-border/60 bg-background/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close guide"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-[13px] border border-primary/15 bg-primary/[0.08] text-primary">
              <Compass className="h-[18px] w-[18px]" />
            </span>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Getting started
            </p>
            <h2 className="mt-2 max-w-[430px] text-[25px] font-semibold leading-[1.18] tracking-[-0.035em] text-foreground sm:text-[28px]">
              Find your way around the system.
            </h2>
            <p className="mt-3 max-w-[440px] text-[12.5px] leading-[1.7] text-muted-foreground">
              Follow the recommended path from setup to daily work. Each step highlights one main area and explains when to use it.
            </p>

            <div className="mt-5 rounded-[15px] border border-primary/15 bg-primary/[0.045] px-4 py-3">
              <p className="text-[11.5px] font-medium text-foreground">
                Start with Settings, create staff accounts in Users, then prepare Academics before adding students.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Maybe later
              </Button>
              <Button onClick={startTour} className="rounded-[13px] px-5">
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
      <div className="fixed inset-0 z-[140] flex items-center justify-center bg-foreground/48 p-4 backdrop-blur-[5px]">
        <section className="onboarding-welcome-enter w-full max-w-[500px] rounded-[22px] border border-border/70 bg-card p-6 text-center shadow-[0_28px_90px_rgba(28,20,70,0.25)] sm:p-7">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-primary/20 bg-primary/[0.08] text-primary">
            <Check className="h-7 w-7" />
          </span>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Guide complete
          </p>
          <h2 className="mt-2 text-[29px] font-semibold tracking-[-0.04em] text-foreground">
            You are ready to use the main areas.
          </h2>
          <p className="mx-auto mt-4 max-w-[470px] text-[13px] leading-6 text-muted-foreground">
            Begin with Settings, add the required users, and prepare Academics before enrolling students. You can restart this guide from the profile menu whenever needed.
          </p>
          <Button
            type="button"
            onClick={onComplete}
            className="mt-7 rounded-[13px] px-6"
          >
            Continue to the system
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </section>
      </div>,
      document.body,
    );
  }

  const cardWidth = Math.min(350, window.innerWidth - 24);
  const estimatedCardHeight = cardRect?.height ?? 330;
  const position = computeCardPosition(targetRect, cardWidth, estimatedCardHeight);
  const progress = ((index + 1) / setupSteps.length) * 100;
  const path = targetRect && cardRect ? connectorPath(targetRect, cardRect) : null;

  return createPortal(
    <div className="fixed inset-0 z-[140] overflow-hidden">
      <div className="absolute inset-0 bg-foreground/58 backdrop-blur-[2px]" />

      {targetRect ? (
        <>
          <div
            className="pointer-events-none fixed rounded-[18px] transition-all duration-300"
            style={{
              top: Math.max(5, targetRect.top - 7),
              left: Math.max(5, targetRect.left - 7),
              width: Math.min(window.innerWidth - 10, targetRect.width + 14),
              height: Math.min(window.innerHeight - 10, targetRect.height + 14),
              boxShadow: `0 0 0 9999px rgba(15,23,42,.58), 0 0 0 3px rgba(255,255,255,.96), 0 0 0 8px ${style.glow}, 0 18px 55px rgba(0,0,0,.22)`,
            }}
          />
          <span
            className={`onboarding-focus-dot pointer-events-none fixed h-3.5 w-3.5 rounded-full ${style.dot}`}
            style={{
              top: Math.max(8, targetRect.top - 10),
              left: Math.max(8, targetRect.left + targetRect.width - 3),
              boxShadow: `0 0 0 7px ${style.glow}`,
            }}
          />
        </>
      ) : null}

      {path ? (
        <svg className="pointer-events-none fixed inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <path
            d={path}
            fill="none"
            stroke="rgba(255,255,255,.86)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="onboarding-connector"
          />
        </svg>
      ) : null}

      <aside
        key={step.id}
        ref={cardRef}
        className="onboarding-card-enter fixed max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[20px] border border-border/70 bg-card shadow-[0_28px_90px_rgba(14,10,36,0.34)]"
        style={{
          top: position.top,
          left: position.left,
          width: cardWidth,
        }}
      >
        <div className="h-1 bg-muted/55">
          <div
            className="h-full rounded-e-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4 sm:p-[18px]">
          <div className="flex items-start gap-3.5">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] border ${style.soft} ${style.text} ${style.border}`}
            >
              <StepIcon className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${style.text}`}>
                  {step.sectionTitle}
                </span>
                <span className="text-[10.5px] font-semibold text-muted-foreground">
                  {index + 1} / {setupSteps.length}
                </span>
              </div>

              <h3 className="mt-1.5 text-[16px] font-semibold tracking-[-0.025em] text-foreground">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="mt-3.5 text-[12px] leading-[1.65] text-muted-foreground">
            {step.description}
          </p>

          {step.outcome ? (
            <div className="mt-4 flex items-start gap-2.5 rounded-[16px] border border-success/15 bg-success/[0.055] px-3.5 py-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <p className="text-[11.5px] leading-5 text-foreground/80">
                {step.outcome}
              </p>
            </div>
          ) : null}

          <div className="mt-4 border-t border-border/55 pt-4">
            <div className="flex items-center gap-1.5 overflow-hidden">
              {sections.map((section, sectionIndex) => {
                const isPast = sectionIndex < activeSectionIndex;
                const isActive = sectionIndex === activeSectionIndex;
                const sectionStyle = sectionStyles[section.id];

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => visit(section.firstIndex)}
                    title={section.title}
                    aria-label={`Go to ${section.title}`}
                    className="group flex min-w-0 flex-1 items-center justify-center py-1"
                  >
                    <span
                      className={[
                        "h-1.5 w-full rounded-full transition-all duration-300",
                        isActive
                          ? sectionStyle.dot
                          : isPast
                            ? "bg-foreground/35"
                            : "bg-muted",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="truncate text-[10.5px] font-medium text-muted-foreground">
                {sections[activeSectionIndex]?.title}
              </p>
              <p className="text-[10px] text-muted-foreground/75">
                {activeSectionIndex + 1} of {sections.length} chapters
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[11px] px-2.5 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Exit guide
            </button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => moveTo(index - 1)}
                disabled={index === 0}
                className="h-9 rounded-[11px] px-3"
                aria-label="Previous step"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button
                type="button"
                onClick={() => moveTo(index + 1)}
                className="h-9 rounded-[11px] px-4"
              >
                {index === setupSteps.length - 1 ? "Finish" : "Next"}
                {index === setupSteps.length - 1 ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => onOpenChange(false)}
        aria-label="Close guide"
        className="fixed end-4 top-4 flex h-10 w-10 items-center justify-center rounded-[13px] border border-white/20 bg-background/85 text-muted-foreground shadow-lg backdrop-blur transition-colors hover:bg-background hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>,
    document.body,
  );
}
