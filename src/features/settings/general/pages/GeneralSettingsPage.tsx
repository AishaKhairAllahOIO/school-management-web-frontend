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

function GeneralSettingsLoading() {
  return (
    <section className="space-y-5">
      <div
        className={[
          "overflow-hidden",
          "rounded-[24px]",
          "border border-border/60",
          "bg-card",
          "shadow-[0_8px_28px_rgba(30,20,70,0.04)]",
        ].join(" ")}
      >
        <div className="p-6">
          <div className="h-7 w-56 animate-pulse rounded-lg bg-muted/70" />

          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-muted/45" />

          <div className="mt-6 h-px bg-border/60" />

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <div
                className={[
                  "rounded-[22px]",
                  "border border-border/60",
                  "p-5",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-[14px] bg-muted/65" />

                  <div>
                    <div className="h-4 w-36 animate-pulse rounded bg-muted/65" />

                    <div className="mt-2 h-3 w-56 animate-pulse rounded bg-muted/40" />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="h-64 animate-pulse rounded-[20px] bg-muted/35" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="h-20 animate-pulse rounded-[18px] bg-muted/30" />

                    <div className="h-20 animate-pulse rounded-[18px] bg-muted/30" />

                    <div className="h-36 animate-pulse rounded-[18px] bg-muted/30 sm:col-span-2" />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="h-72 animate-pulse rounded-[22px] border border-border/60 bg-card" />

                <div className="h-72 animate-pulse rounded-[22px] border border-border/60 bg-card" />
              </div>
            </div>

            <div className="h-[430px] animate-pulse rounded-[22px] border border-border/60 bg-card" />
          </div>
        </div>
      </div>
    </section>
  );
}