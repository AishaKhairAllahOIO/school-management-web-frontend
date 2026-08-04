import {
  type CSSProperties,
  type RefObject,
  useLayoutEffect,
  useState,
} from "react";

type AnchoredMenuOptions = {
  isOpen: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  desktopMatchTrigger?: boolean;
  desktopBreakpoint?: number;
  preferredWidth?: number;
  viewportMargin?: number;
  gap?: number;
};

export function useAnchoredTopbarMenu({
  isOpen,
  triggerRef,
  desktopMatchTrigger = false,
  desktopBreakpoint = 1024,
  preferredWidth = 320,
  viewportMargin = 12,
  gap = 10,
}: AnchoredMenuOptions): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>({
    visibility: "hidden",
  });

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    let frameId = 0;

    const updatePosition = () => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        const trigger = triggerRef.current;

        if (!trigger) {
          return;
        }

        const rect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const availableWidth = Math.max(
          0,
          viewportWidth - viewportMargin * 2,
        );

        const shouldMatchTrigger =
          desktopMatchTrigger &&
          viewportWidth >= desktopBreakpoint;

        const width = shouldMatchTrigger
          ? rect.width
          : Math.min(preferredWidth, availableWidth);

        const unclampedLeft = rect.right - width;
        const maxLeft = Math.max(
          viewportMargin,
          viewportWidth - viewportMargin - width,
        );
        const left = Math.min(
          Math.max(viewportMargin, unclampedLeft),
          maxLeft,
        );

        setStyle({
          position: "fixed",
          top: Math.round(rect.bottom + gap),
          left: Math.round(left),
          width: Math.round(width),
          visibility: "visible",
        });
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [
    desktopBreakpoint,
    desktopMatchTrigger,
    gap,
    isOpen,
    preferredWidth,
    triggerRef,
    viewportMargin,
  ]);

  return style;
}
