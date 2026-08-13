import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ScheduleGenerationDialog({
  open,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[460px] overflow-hidden rounded-[24px] border border-border/55 bg-card shadow-[0_28px_90px_rgba(15,10,40,0.22)]">
        <header className="flex items-start justify-between gap-4 border-b border-border/45 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-amber-50 text-amber-600">
              <AlertTriangle size={18} />
            </span>

            <div>
              <h2 className="text-[15px] font-semibold">
                Regenerate schedule?
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                The current schedule for the current academic
                period will be regenerated.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[11px] border border-border/60 bg-background text-muted-foreground hover:bg-muted/45 disabled:opacity-50"
          >
            <X size={15} />
          </button>
        </header>

        <div className="p-5">
          <p className="text-[12px] leading-5 text-muted-foreground">
            The scheduling engine will create a new valid timetable
            using the current academic year and current term.
          </p>

          <div className="mt-5 flex justify-end gap-2.5 border-t border-border/45 pt-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-9 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 hover:bg-muted/45 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={14} />
              )}

              {isSubmitting
                ? "Regenerating..."
                : "Regenerate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}