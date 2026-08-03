import {
  AlertCircle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

import {
  Button,
} from "@/shared/ui/button";

type LoadingProps = {
  cards?: number;
  variant?: "cards" | "rows";
};

export function CommunicationLoading({
  cards = 6,
  variant = "cards",
}: LoadingProps) {
  if (variant === "rows") {
    return (
      <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card">
        <div className="h-12 animate-pulse border-b border-border/50 bg-muted/25" />

        {Array.from({ length: cards }).map(
          (_, index) => (
            <div
              key={index}
              className="flex min-h-[78px] animate-pulse items-center gap-4 border-b border-border/40 px-5 last:border-b-0"
            >
              <div className="h-10 w-10 rounded-[14px] bg-muted/65" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-44 rounded bg-muted/65" />
                <div className="h-3 w-3/5 rounded bg-muted/40" />
              </div>
              <div className="h-8 w-20 rounded-xl bg-muted/45" />
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: cards }).map(
        (_, index) => (
          <div
            key={index}
            className="min-h-[220px] animate-pulse overflow-hidden rounded-[20px] border border-border/60 bg-card"
          >
            <div className="h-[3px] bg-muted" />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-[14px] bg-muted/65" />
                <div className="h-6 w-20 rounded-full bg-muted/40" />
              </div>
              <div className="h-4 w-2/3 rounded bg-muted/65" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted/40" />
                <div className="h-3 w-4/5 rounded bg-muted/40" />
              </div>
              <div className="mt-5 h-10 rounded-xl bg-muted/25" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

type ErrorProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

export function CommunicationError({
  title,
  description,
  onRetry,
}: ErrorProps) {
  return (
    <div className="rounded-[20px] border border-destructive/20 bg-card p-6 shadow-[0_8px_26px_rgba(30,20,70,0.04)]">
      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-destructive/[0.08] text-destructive">
        <AlertCircle className="h-[18px] w-[18px]" />
      </span>
      <h3 className="mt-4 text-[16px] font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1 max-w-xl text-[12.5px] leading-5 text-muted-foreground">
        {description}
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="mt-5 h-10 rounded-[12px] border-border/70 bg-transparent text-[12px] font-medium"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

type EmptyProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  toneClassName?: string;
};

export function CommunicationEmpty({
  icon: Icon,
  title,
  description,
  toneClassName = "bg-primary/[0.08] text-primary",
}: EmptyProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[20px] border border-dashed border-border/70 bg-card px-6 py-10 text-center">
      <span className={`flex h-14 w-14 items-center justify-center rounded-[18px] ${toneClassName}`}>
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 text-[16px] font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-[12.5px] leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
