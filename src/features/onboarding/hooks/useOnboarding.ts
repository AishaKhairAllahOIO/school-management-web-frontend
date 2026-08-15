import {
  useCallback,
  useEffect,
  useState,
} from "react";

export interface OnboardingTargetCoords {
  top: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export const useOnboarding = (
  isRunning: boolean,
  targetId: string | null,
) => {
  const [coords, setCoords] =
    useState<OnboardingTargetCoords | null>(null);

  const updatePosition = useCallback(() => {
    if (!isRunning || !targetId) {
      setCoords(null);
      return;
    }

    const element =
      document.querySelector<HTMLElement>(targetId);

    if (!element) {
      setCoords(null);
      return;
    }

    const rect =
      element.getBoundingClientRect();

    setCoords({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      centerX:
        rect.left + rect.width / 2,
      centerY:
        rect.top + rect.height / 2,
    });
  }, [isRunning, targetId]);

  useEffect(() => {
    if (!isRunning || !targetId) {
      setCoords(null);
      return;
    }

    let frameId: number | null = null;

    const scheduleUpdate = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId =
        requestAnimationFrame(() => {
          updatePosition();
          frameId = null;
        });
    };

    updatePosition();

    window.addEventListener(
      "resize",
      scheduleUpdate,
    );

    window.addEventListener(
      "scroll",
      scheduleUpdate,
      true,
    );

    const observer =
      new MutationObserver(() => {
        scheduleUpdate();
      });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener(
        "resize",
        scheduleUpdate,
      );

      window.removeEventListener(
        "scroll",
        scheduleUpdate,
        true,
      );

      observer.disconnect();

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [
    isRunning,
    targetId,
    updatePosition,
  ]);

  return coords;
};