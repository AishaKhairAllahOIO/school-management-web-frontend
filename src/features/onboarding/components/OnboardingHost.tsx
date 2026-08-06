import { Lightbulb, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { featureTips } from "../config/setupSteps";
import {
  ONBOARDING_RESTART_EVENT,
  onboardingStorage,
} from "../storage/onboarding.storage";
import { SetupGuideDialog } from "./SetupGuideDialog";

export function OnboardingHost() {
  const location = useLocation();
  const userId = useAuthStore((state) => state.user?.id);
  const initialState = useMemo(() => onboardingStorage.get(userId), [userId]);

  const [guideOpen, setGuideOpen] = useState(() => !initialState.completed);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    function restartGuide() {
      onboardingStorage.reset(userId);
      const nextState = onboardingStorage.get(userId);
      setState(nextState);
      setGuideOpen(true);
    }

    window.addEventListener(ONBOARDING_RESTART_EVENT, restartGuide);
    return () => window.removeEventListener(ONBOARDING_RESTART_EVENT, restartGuide);
  }, [userId]);

  const activeTip = featureTips.find(
    (tip) =>
      location.pathname.startsWith(tip.pathPrefix) &&
      !state.dismissedTipIds.includes(tip.id),
  );

  function updateState(nextState: typeof state) {
    setState(nextState);
    onboardingStorage.set(userId, nextState);
  }

  function visitStep(stepId: string) {
    if (state.visitedStepIds.includes(stepId)) return;
    updateState({ ...state, visitedStepIds: [...state.visitedStepIds, stepId] });
  }

  function completeGuide() {
    updateState({ ...state, completed: true });
    setGuideOpen(false);
  }

  function dismissTip(tipId: string) {
    updateState({ ...state, dismissedTipIds: [...state.dismissedTipIds, tipId] });
  }

  return (
    <>
      <SetupGuideDialog
        open={guideOpen}
        onOpenChange={setGuideOpen}
        visitedStepIds={state.visitedStepIds}
        onVisitStep={visitStep}
        onComplete={completeGuide}
      />

      {activeTip && !guideOpen ? (
        <aside className="fixed bottom-4 end-4 z-[70] w-[min(360px,calc(100vw-2rem))] rounded-[20px] border border-warning/20 bg-card p-4 shadow-[0_18px_55px_rgba(40,30,80,0.16)]">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-warning/[0.11] text-warning">
              <Lightbulb className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-foreground/90">{activeTip.title}</p>
              <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">{activeTip.description}</p>
            </div>
            <button type="button" onClick={() => dismissTip(activeTip.id)} aria-label="Dismiss tip" className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
