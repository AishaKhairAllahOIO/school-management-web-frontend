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
    <div className="mb-4 flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-[18px] font-semibold tracking-[-0.018em] text-foreground">
          {title}
        </h2>

        <p className="mt-1 max-w-2xl text-[12px] font-normal leading-5 text-muted-foreground">
          {description}
        </p>

        {children}
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={[
            "inline-flex h-[38px] shrink-0",
            "items-center justify-center gap-1.5",
            "rounded-[12px] border",
            "border-primary/25 bg-card px-3.5",
            "text-[12px] font-medium text-primary",
            "transition-all duration-200",
            "hover:border-primary/40",
            "hover:bg-primary/[0.055]",
            "focus-visible:outline-none",
            "focus-visible:ring-4",
            "focus-visible:ring-primary/10",
          ].join(" ")}
        >
          <Plus size={14} strokeWidth={1.8} />

          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}