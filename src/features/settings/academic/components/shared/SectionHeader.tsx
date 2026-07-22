import { Plus } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-[22px] font-semibold tracking-[-0.025em] text-foreground">
          {title}
        </h2>

        <p className="mt-1.5 max-w-2xl text-[13px] font-normal leading-5 text-muted-foreground">
          {description}
        </p>

        {children}
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={[
            "inline-flex h-11 shrink-0",
            "items-center justify-center gap-2",
            "rounded-[14px] border",
            "border-primary/25 bg-card px-4",
            "text-[13px] font-medium text-primary",
            "transition-all duration-200",
            "hover:border-primary/40",
            "hover:bg-primary/[0.055]",
            "focus-visible:outline-none",
            "focus-visible:ring-4",
            "focus-visible:ring-primary/10",
          ].join(" ")}
        >
          <Plus
            size={16}
            strokeWidth={1.8}
          />

          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}