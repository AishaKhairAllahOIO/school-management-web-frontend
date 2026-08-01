import {
  AlertTriangle,
  Loader2,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  type ReactNode,
} from "react";

type ConfirmActionDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel?: string;
  tone?: "danger" | "restore" | "neutral";
  isPending?: boolean;
  details?: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmActionDialog({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel = "Please wait...",
  tone = "danger",
  isPending = false,
  details,
  onClose,
  onConfirm,
}: ConfirmActionDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isPending, onClose]);

  if (!open) {
    return null;
  }

  const isRestore = tone === "restore";
  const Icon = isRestore ? RotateCcw : AlertTriangle;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-action-dialog-title"
      aria-describedby="user-action-dialog-description"
      className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <section
        className="w-full max-w-[430px] overflow-hidden rounded-[24px] border border-border/55 bg-card shadow-[0_28px_90px_rgba(15,10,40,0.22)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border/45 px-5 py-4">
          <div className="flex min-w-0 items-start gap-3.5">
            <span
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px]",
                isRestore
                  ? "bg-emerald-500/[0.09] text-emerald-600"
                  : tone === "danger"
                    ? "bg-destructive/[0.08] text-destructive"
                    : "bg-primary/[0.08] text-primary",
              ].join(" ")}
            >
              <Icon size={20} strokeWidth={1.8} />
            </span>

            <div className="min-w-0 pt-0.5">
              <h2
                id="user-action-dialog-title"
                className="text-[16px] font-semibold tracking-[-0.015em] text-foreground"
              >
                {title}
              </h2>

              <p
                id="user-action-dialog-description"
                className="mt-1 text-[11px] leading-5 text-muted-foreground"
              >
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={isPending}
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border border-border/60 bg-background text-muted-foreground transition hover:bg-muted/45 hover:text-foreground disabled:opacity-50"
          >
            <X size={15} />
          </button>
        </header>

        {details ? (
          <div className="px-5 pt-4">
            <div className="rounded-[16px] border border-border/50 bg-muted/[0.12] px-4 py-3 text-[11px] leading-5 text-foreground/80">
              {details}
            </div>
          </div>
        ) : null}

        <footer className="flex flex-col-reverse gap-2.5 px-5 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-9 rounded-full border border-border/65 bg-background px-4 text-[11px] font-medium text-foreground/75 transition hover:bg-muted/45 hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={[
              "inline-flex h-9 items-center justify-center gap-2 rounded-full px-4",
              "text-[11px] font-medium text-white transition",
              "disabled:cursor-not-allowed disabled:opacity-60",
              isRestore
                ? "bg-emerald-600 hover:bg-emerald-600/90"
                : tone === "danger"
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90",
            ].join(" ")}
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isRestore ? (
              <RotateCcw size={14} />
            ) : (
              <Trash2 size={14} />
            )}

            {isPending ? pendingLabel : confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}
