import { AlertCircle, RefreshCw } from "lucide-react";

type Props = {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function ScheduleErrorState({
  message = "The schedule could not be loaded.",
  onRetry,
  isRetrying = false,
}: Props) {
  return (
    <section className="rounded-[26px] border border-destructive/15 bg-card p-8 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
      <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-destructive/[0.08] text-destructive">
          <AlertCircle size={21} />
        </span>

        <h2 className="mt-4 text-sm font-semibold text-foreground">
          Unable to load schedule
        </h2>

        <p className="mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
          {message}
        </p>

        <button
          type="button"
          disabled={isRetrying}
          onClick={onRetry}
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={
              isRetrying
                ? "animate-spin"
                : undefined
            }
          />

          {isRetrying
            ? "Retrying..."
            : "Try again"}
        </button>
      </div>
    </section>
  );
}