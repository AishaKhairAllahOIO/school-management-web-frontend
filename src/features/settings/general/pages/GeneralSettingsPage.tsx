import {
  Building2,
  RefreshCw,
} from "lucide-react";

import { GeneralSettingsForm } from "@/features/settings/general/components/GeneralSettingsForm";
import { useGeneralSettings } from "@/features/settings/general/hooks/useGeneralSettings";

export function GeneralSettingsPage() {
  const settingsQuery =
    useGeneralSettings();

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = settingsQuery;

  if (isLoading) {
    return <GeneralSettingsLoading />;
  }

  if (isError || !data) {
    return (
      <section
        className={[
          "rounded-[24px]",
          "border border-destructive/15",
          "bg-card",
          "p-6",
          "shadow-[0_10px_32px_rgba(30,20,70,0.045)]",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-11 w-11",
            "items-center justify-center",
            "rounded-[15px]",
            "bg-destructive/[0.08]",
            "text-destructive",
          ].join(" ")}
        >
          <Building2
            className="h-5 w-5"
            strokeWidth={1.75}
          />
        </span>

        <h2 className="mt-4 text-lg font-semibold text-foreground">
          School information could not be loaded
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          The general school settings are currently
          unavailable. Check the connection and try
          again.
        </p>

        <button
          type="button"
          disabled={isFetching}
          onClick={() => {
            void settingsQuery.refetch();
          }}
          className={[
            "mt-5 inline-flex h-10",
            "items-center justify-center gap-2",
            "rounded-xl",
            "border border-border/70",
            "bg-card px-4",
            "text-sm font-medium",
            "text-foreground",
            "transition-colors",
            "hover:bg-muted/55",
            "disabled:cursor-not-allowed",
            "disabled:opacity-50",
          ].join(" ")}
        >
          <RefreshCw
            className={[
              "h-4 w-4",
              isFetching
                ? "animate-spin"
                : "",
            ].join(" ")}
            strokeWidth={1.8}
          />

          {isFetching
            ? "Trying again..."
            : "Try again"}
        </button>
      </section>
    );
  }

  return (
    <GeneralSettingsForm
      initialData={data}
    />
  );
}

function SkeletonLine({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-muted/55",
        className,
      ].join(" ")}
    />
  );
}

function FieldSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <SkeletonLine className="h-3 w-24" />
      <SkeletonLine className="mt-2 h-12 w-full rounded-[16px]" />
    </div>
  );
}

function CardHeadingSkeleton() {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      <SkeletonLine className="h-10 w-10 shrink-0 rounded-[15px]" />

      <div className="min-w-0 flex-1 pt-0.5">
        <SkeletonLine className="h-4 w-36" />
        <SkeletonLine className="mt-2 h-3 w-64 max-w-full" />
      </div>
    </div>
  );
}

function GeneralSettingsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {[0, 1].map((card) => (
          <section
            key={card}
            className="min-h-[390px] rounded-[24px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)]"
          >
            <CardHeadingSkeleton />
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
              {card === 0 ? (
                <div className="sm:col-span-2">
                  <SkeletonLine className="h-3 w-20" />
                  <SkeletonLine className="mt-2 h-[140px] w-full rounded-[14px]" />
                </div>
              ) : (
                <>
                  <FieldSkeleton />
                  <FieldSkeleton />
                </>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="min-h-[390px] rounded-[24px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
          <CardHeadingSkeleton />
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton className="sm:col-span-2" />
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
        </section>

        <section className="min-h-[390px] overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
          <div className="p-5">
            <CardHeadingSkeleton />
          </div>
          <SkeletonLine className="h-[300px] w-full rounded-none" />
        </section>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="rounded-[24px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
          <CardHeadingSkeleton />
          <SkeletonLine className="h-[210px] w-full rounded-[16px]" />
          <SkeletonLine className="mt-3 h-10 w-full rounded-full" />
        </section>

        <section className="rounded-[24px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
          <CardHeadingSkeleton />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {[0, 1, 2, 3, 4].map((item) => (
              <div key={item}>
                <SkeletonLine className="aspect-square w-full rounded-[14px]" />
                <SkeletonLine className="mt-2 h-9 w-full rounded-[11px]" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-3 rounded-t-[22px] border-t border-border/45 bg-card/80 p-4">
        <SkeletonLine className="h-11 w-28 rounded-full" />
        <SkeletonLine className="h-11 w-36 rounded-full" />
      </div>
    </div>
  );
}
