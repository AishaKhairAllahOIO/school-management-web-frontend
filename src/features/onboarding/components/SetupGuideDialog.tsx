import { ArrowLeft, ArrowRight, Check, Sparkles, X } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { setupSteps } from "../config/setupSteps";

type SetupGuideDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visitedStepIds: string[];
  onVisitStep: (stepId: string) => void;
  onComplete: () => void;
};

type Rect = { top: number; left: number; width: number; height: number };

function getStepSelector(path: string) {
  return `a[href="${path}"]`;
}

export function SetupGuideDialog({
  open,
  onOpenChange,
  visitedStepIds,
  onVisitStep,
  onComplete,
}: SetupGuideDialogProps) {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const step = setupSteps[index];
  const StepIcon = step.icon;

  useEffect(() => {
    if (!open) {
      setStarted(false);
      setIndex(0);
      setRect(null);
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !started || !step) return;

    function updateRect() {
      const element = window.document.querySelector<HTMLElement>(getStepSelector(step.path));
      if (!element) {
        setRect(null);
        return;
      }
      const next = element.getBoundingClientRect();
      setRect({ top: next.top, left: next.left, width: next.width, height: next.height });
    }

    const frame = window.requestAnimationFrame(updateRect);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [open, started, step]);

  if (!open) return null;

  function startTour() {
    setStarted(true);
    navigate(setupSteps[0].path);
    onVisitStep(setupSteps[0].id);
  }

  function moveTo(nextIndex: number) {
    if (nextIndex < 0) return;
    if (nextIndex >= setupSteps.length) {
      onComplete();
      return;
    }
    const nextStep = setupSteps[nextIndex];
    setIndex(nextIndex);
    navigate(nextStep.path);
    onVisitStep(nextStep.id);
  }

  if (!started) {
    return createPortal(
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-[3px]">
        <div className="w-full max-w-[620px] overflow-hidden rounded-[30px] border border-primary/15 bg-card shadow-[0_30px_100px_rgba(35,24,78,0.24)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/[0.14] via-card to-info/[0.10] px-6 py-8 sm:px-9 sm:py-10">
            <div className="absolute -end-10 -top-12 h-36 w-36 rounded-full bg-warning/15 blur-3xl" />
            <button type="button" onClick={() => onOpenChange(false)} className="absolute end-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-background/70" aria-label="Close guide">
              <X className="h-4 w-4" />
            </button>
            <span className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-primary/15 bg-card text-primary shadow-sm">
              <Sparkles className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-[26px] font-semibold tracking-[-0.035em] text-foreground">Welcome to School Management System</h2>
            <p className="mt-2 max-w-lg text-[13px] leading-6 text-muted-foreground">
              We will highlight the essential areas one by one. Each cloud points to the exact place you should configure, and you can restart this guide later from Profile → Help.
            </p>
          </div>
          <div className="grid gap-2 p-5 sm:grid-cols-2 sm:p-7">
            {setupSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center gap-3 rounded-[17px] border border-border/55 bg-muted/[0.18] p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-primary/[0.08] text-primary"><Icon className="h-4 w-4" /></span>
                  <span className="text-[11.5px] font-medium text-foreground/85">{item.title}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-border/45 px-5 py-4 sm:flex-row sm:justify-between sm:px-7">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Maybe later</Button>
            <Button onClick={startTour}>Start guided tour <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Button>
          </div>
        </div>
      </div>,
      window.document.body,
    );
  }

  const cloudWidth = Math.min(360, window.innerWidth - 32);
  const preferredLeft = rect ? Math.min(Math.max(16, rect.left + rect.width + 18), window.innerWidth - cloudWidth - 16) : 16;
  const preferredTop = rect ? Math.min(Math.max(16, rect.top), window.innerHeight - 260) : 90;

  return createPortal(
    <div className="fixed inset-0 z-[130]">
      <div className="absolute inset-0 bg-foreground/55 backdrop-blur-[1px]" />

      {rect ? (
        <>
          <div
            className="pointer-events-none fixed rounded-[18px] ring-4 ring-white shadow-[0_0_0_9999px_rgba(18,14,34,0.56),0_16px_60px_rgba(0,0,0,0.22)] transition-all duration-300"
            style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
          />
          <div
            className="fixed h-4 w-4 rotate-45 border-s border-t border-primary/15 bg-card"
            style={{ top: preferredTop + 28, left: Math.max(20, preferredLeft - 8) }}
          />
        </>
      ) : null}

      <aside
        className="fixed rounded-[24px] border border-primary/15 bg-card p-5 shadow-[0_24px_80px_rgba(25,17,58,0.28)]"
        style={{ top: preferredTop, left: preferredLeft, width: cloudWidth }}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary">
            <StepIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Step {index + 1} of {setupSteps.length}</span>
              {visitedStepIds.includes(step.id) ? <Check className="h-4 w-4 text-success" /> : null}
            </div>
            <h3 className="mt-1.5 text-[16px] font-semibold tracking-[-0.02em] text-foreground">{step.title}</h3>
            <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">{step.description}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/45 pt-4">
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Exit tour</Button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" disabled={index === 0} onClick={() => moveTo(index - 1)}><ArrowLeft className="h-4 w-4 rtl:rotate-180" /></Button>
            <Button type="button" size="sm" onClick={() => moveTo(index + 1)}>
              {index === setupSteps.length - 1 ? "Finish" : "Next"}
              {index < setupSteps.length - 1 ? <ArrowRight className="h-4 w-4 rtl:rotate-180" /> : <Check className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>
    </div>,
    window.document.body,
  );
}
