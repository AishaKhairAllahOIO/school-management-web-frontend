import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";

type Props = {
  open: boolean;
  mode: "generate" | "regenerate";
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function GenerateScheduleDialog({
  open,
  mode,
  isPending,
  onClose,
  onConfirm,
}: Props) {
  if (!open) {
    return null;
  }

  const regenerate =
    mode === "regenerate";

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[5px]"
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
      <div className="w-full max-w-md rounded-[24px] border border-border/55 bg-card p-5 shadow-[0_28px_90px_rgba(15,10,40,0.22)]">
        <div className="flex items-start justify-between">
          <span
            className={[
              "flex h-11 w-11 items-center justify-center rounded-[16px]",
              regenerate
                ? "bg-amber-50 text-amber-600"
                : "bg-primary/[0.09] text-primary",
            ].join(" ")}
          >
            {regenerate ? (
              <RefreshCw
                size={19}
              />
            ) : (
              <AlertTriangle
                size={19}
              />
            )}
          </span>

          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[11px] border border-border/60 text-muted-foreground hover:bg-muted/40 disabled:opacity-50"
          >
            <X size={15} />
          </button>
        </div>

        <h2 className="mt-4 text-[16px] font-semibold">
          {regenerate
            ? "Regenerate schedule?"
            : "Generate schedule?"}
        </h2>

        <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">
          {regenerate
            ? "The current schedule will be deleted and a new schedule will be generated for the current academic year and semester."
            : "The system will generate a schedule for the current academic year and semester in the background."}
        </p>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-border/45 pt-4">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-9 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground disabled:opacity-50"
          >
            {isPending ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : regenerate ? (
              <RefreshCw
                size={14}
              />
            ) : null}

            {isPending
              ? "Processing..."
              : regenerate
                ? "Regenerate"
                : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}