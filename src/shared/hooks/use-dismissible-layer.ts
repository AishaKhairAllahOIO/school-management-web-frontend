import {
  useEffect,
  useRef,
  type RefObject,
} from "react";

type UseDismissibleLayerOptions = {
  ref: RefObject<HTMLElement | null>;
  enabled: boolean;
  onDismiss: () => void;
};

export function useDismissibleLayer({
  ref,
  enabled,
  onDismiss,
}: UseDismissibleLayerOptions) {
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handlePointerDown(
      event: PointerEvent,
    ) {
      const element = ref.current;
      const target = event.target;

      if (
        !element ||
        !(target instanceof Node) ||
        element.contains(target)
      ) {
        return;
      }

      onDismissRef.current();
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key !== "Escape") {
        return;
      }

      onDismissRef.current();
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
      true,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
        true,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [enabled, ref]);
}