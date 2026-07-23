import {
  UserRoundSearch,
} from "lucide-react";

type StaffEmptyStateProps = {
  title?: string;

  description?: string;

  actionLabel?: string;

  onAction?: () => void;
};

export function StaffEmptyState({
  title = "Staff profile not found",
  description = "The requested staff profile does not exist or may have been removed.",
  actionLabel = "Back to staff",
  onAction,
}: StaffEmptyStateProps) {
  return (
    <section
      className={[
        "rounded-[28px]",
        "border border-border/70",
        "bg-card",
        "px-6 py-14",
        "text-center",
        "shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <span
        className={[
          "mx-auto flex h-16 w-16",
          "items-center justify-center",
          "rounded-[22px]",
          "bg-primary/[0.07]",
          "text-primary",
        ].join(" ")}
      >
        <UserRoundSearch className="h-7 w-7" />
      </span>

      <h2
        className={[
          "mt-5 text-xl font-semibold",
          "tracking-[-0.025em]",
          "text-foreground",
        ].join(" ")}
      >
        {title}
      </h2>

      <p
        className={[
          "mx-auto mt-2 max-w-md",
          "text-sm leading-6",
          "text-muted-foreground",
        ].join(" ")}
      >
        {description}
      </p>

      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={[
            "primary-gradient",
            "mt-6 inline-flex h-11",
            "items-center justify-center",
            "rounded-xl px-5",
            "text-sm font-semibold",
            "text-primary-foreground",
            "shadow-[var(--shadow-auth-button)]",
            "transition-transform",
            "hover:-translate-y-0.5",
          ].join(" ")}
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}