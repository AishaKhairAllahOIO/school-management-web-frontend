import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

type StaffErrorStateProps = {
  title?: string;

  description?: string;

  actionLabel?: string;

  compact?: boolean;

  onRetry?: () => void;
};

export function StaffErrorState({
  title = "Unable to load staff information",
  description = "Something went wrong while loading the requested information. Please try again.",
  actionLabel = "Try again",
  compact = false,
  onRetry,
}: StaffErrorStateProps) {
  return (
    <section
      role="alert"
      className={[
        "rounded-[24px]",
        "border border-destructive/20",
        "bg-destructive/[0.035]",
        compact
          ? "p-5"
          : "px-6 py-10",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-xl",
          "items-start gap-4",
          compact
            ? ""
            : "sm:items-center",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-12 w-12 shrink-0",
            "items-center justify-center",
            "rounded-[16px]",
            "bg-destructive/[0.08]",
            "text-destructive",
          ].join(" ")}
        >
          <AlertTriangle className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className={[
                "mt-4 inline-flex h-10",
                "items-center justify-center gap-2",
                "rounded-xl",
                "border border-destructive/15",
                "bg-card px-4",
                "text-xs font-semibold",
                "text-destructive",
                "shadow-[var(--shadow-card)]",
                "transition",
                "hover:bg-destructive/[0.04]",
              ].join(" ")}
            >
              <RefreshCw className="h-4 w-4" />

              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}