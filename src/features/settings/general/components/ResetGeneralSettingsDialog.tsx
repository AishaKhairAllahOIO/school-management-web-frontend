import {
  AlertTriangle,
  Check,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type ResetGeneralSettingsDialogProps = {
  open: boolean;
  schoolName: string;
  shortName: string;
  isPending: boolean;

  onClose: () => void;
  onConfirm: () => void;
};

export function ResetGeneralSettingsDialog({
  open,
  schoolName,
  shortName,
  isPending,
  onClose,
  onConfirm,
}: ResetGeneralSettingsDialogProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [confirmation, setConfirmation] =
    useState("");

  const confirmationValue =
    shortName.trim() ||
    schoolName.trim() ||
    "RESET";

  const isConfirmed =
    confirmation.trim() ===
    confirmationValue;

  useEffect(() => {
    if (!open) {
      setConfirmation("");

      return;
    }

    const timeoutId = window.setTimeout(
      () => {
        inputRef.current?.focus();
      },
      50,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !isPending
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, isPending, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-settings-title"
      aria-describedby="reset-settings-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isPending
        ) {
          onClose();
        }
      }}
    >
      <div
        className={[
          "w-full max-w-lg",
          "overflow-hidden rounded-[28px]",
          "border border-border/45",
          "bg-card",
          "shadow-[0_28px_80px_rgba(20,15,45,0.2)]",
        ].join(" ")}
      >
        <header className="flex items-start justify-between px-6 pb-5 pt-6">
          <div className="flex items-start gap-4">
            <span
              className={[
                "flex h-12 w-12 shrink-0",
                "items-center justify-center",
                "rounded-[18px]",
                "bg-destructive/[0.08]",
                "text-destructive",
              ].join(" ")}
            >
              <AlertTriangle
                size={22}
                strokeWidth={1.75}
              />
            </span>

            <div className="pt-0.5">
              <h2
                id="reset-settings-title"
                className="text-lg font-semibold text-foreground"
              >
                Reset School Settings?
              </h2>

              <p
                id="reset-settings-description"
                className="mt-1.5 text-sm leading-6 text-muted-foreground"
              >
                This permanently removes the school
                profile, logo and gallery content.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={isPending}
            onClick={onClose}
            className={[
              "flex h-9 w-9 shrink-0",
              "items-center justify-center",
              "rounded-full",
              "bg-muted/55",
              "text-muted-foreground",
              "transition duration-200",
              "hover:bg-muted",
              "hover:text-foreground",
              "disabled:opacity-50",
            ].join(" ")}
          >
            <X size={16} />
          </button>
        </header>

        <div className="space-y-5 px-6 pb-6">
          <div
            className={[
              "rounded-[20px]",
              "bg-destructive/[0.035]",
              "p-4",
            ].join(" ")}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-destructive">
              This action will remove
            </p>

            <ul className="mt-3 space-y-2.5">
              <li className="flex items-center gap-2.5 text-sm text-foreground/80">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/[0.08] text-destructive">
                  <Check size={12} />
                </span>

                School profile information
              </li>

              <li className="flex items-center gap-2.5 text-sm text-foreground/80">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/[0.08] text-destructive">
                  <Check size={12} />
                </span>

                The currently uploaded logo
              </li>

              <li className="flex items-center gap-2.5 text-sm text-foreground/80">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/[0.08] text-destructive">
                  <Check size={12} />
                </span>

                All school gallery images
              </li>
            </ul>
          </div>

          <label className="block">
            <span className="mb-2.5 block text-xs font-semibold text-foreground/80">
              Type{" "}
              <span className="rounded-full bg-muted/65 px-2.5 py-1 font-mono text-[11px] text-destructive">
                {confirmationValue}
              </span>{" "}
              to confirm
            </span>

            <input
              ref={inputRef}
              value={confirmation}
              disabled={isPending}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) =>
                setConfirmation(
                  event.target.value,
                )
              }
              className={[
                "h-12 w-full",
                "rounded-[16px]",
                "border border-transparent",
                "bg-muted/[0.4]",
                "px-4",
                "font-mono text-sm font-semibold",
                "text-foreground",
                "outline-none transition duration-200",
                "hover:bg-muted/55",
                "focus:bg-background",
                "focus:ring-4",
                "focus:ring-destructive/[0.07]",
                isConfirmed
                  ? [
                      "border-destructive/30",
                      "bg-destructive/[0.025]",
                    ].join(" ")
                  : "focus:border-destructive/25",
              ].join(" ")}
            />

            {confirmation.length > 0 &&
            !isConfirmed ? (
              <p className="mt-2 px-1 text-[11px] font-medium text-destructive">
                The confirmation value does not
                match.
              </p>
            ) : null}
          </label>
        </div>

        <footer
          className={[
            "flex flex-col-reverse gap-3",
            "bg-muted/[0.2]",
            "px-6 py-5",
            "sm:flex-row sm:justify-end",
          ].join(" ")}
        >
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className={[
              "h-10 rounded-full",
              "bg-card px-5",
              "text-xs font-semibold",
              "text-foreground/75",
              "shadow-[0_5px_16px_rgba(30,20,70,0.04)]",
              "transition duration-200",
              "hover:bg-muted",
              "hover:text-foreground",
              "disabled:opacity-50",
            ].join(" ")}
          >
            Keep Settings
          </button>

          <button
            type="button"
            disabled={
              !isConfirmed || isPending
            }
            onClick={onConfirm}
            className={[
              "flex h-10 items-center",
              "justify-center gap-2",
              "rounded-full",
              "bg-destructive px-5",
              "text-xs font-semibold",
              "text-destructive-foreground",
              "shadow-[0_8px_20px_rgba(180,35,35,0.15)]",
              "transition duration-200",
              "hover:-translate-y-0.5",
              "hover:bg-destructive/90",
              "disabled:cursor-not-allowed",
              "disabled:translate-y-0",
              "disabled:opacity-50",
            ].join(" ")}
          >
            {isPending ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <RotateCcw size={15} />
            )}

            {isPending
              ? "Resetting..."
              : "Reset Settings"}
          </button>
        </footer>
      </div>
    </div>
  );
}