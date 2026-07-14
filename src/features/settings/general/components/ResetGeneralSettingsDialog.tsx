import {
  AlertTriangle,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
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
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border/60 p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle size={22} />
            </span>

            <div>
              <h2
                id="reset-settings-title"
                className="text-lg font-bold text-foreground"
              >
                Reset School Settings?
              </h2>

              <p
                id="reset-settings-description"
                className="mt-1 text-sm leading-6 text-muted-foreground"
              >
                This operation permanently removes
                the current school profile and
                gallery content.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={isPending}
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-destructive/15 bg-destructive/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-destructive">
              This action will remove
            </p>

            <ul className="mt-3 space-y-2 text-sm text-foreground">
              <li>• School profile information</li>
              <li>• The currently uploaded logo</li>
              <li>• All school gallery images</li>
            </ul>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-foreground">
              Type{" "}
              <span className="rounded-md bg-muted px-2 py-1 font-mono text-destructive">
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
                "h-11 w-full rounded-xl border bg-background px-4",
                "font-mono text-sm font-semibold text-foreground",
                "outline-none transition",
                "focus:border-destructive/50 focus:ring-4 focus:ring-destructive/10",
                isConfirmed
                  ? "border-destructive/50"
                  : "border-border",
              ].join(" ")}
            />

            {confirmation.length > 0 &&
            !isConfirmed ? (
              <p className="mt-2 text-[11px] font-semibold text-destructive">
                The confirmation value does not
                match.
              </p>
            ) : null}
          </label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-border/60 bg-muted/10 p-5">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-10 rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground transition hover:bg-muted disabled:opacity-50"
          >
            Keep Settings
          </button>

          <button
            type="button"
            disabled={
              !isConfirmed || isPending
            }
            onClick={onConfirm}
            className="flex h-10 items-center gap-2 rounded-xl bg-destructive px-5 text-xs font-bold text-destructive-foreground transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
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