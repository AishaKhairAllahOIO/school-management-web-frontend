import {
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

import { useDeleteAcademicSettings } from "../hooks/useAcademicSettings";

import { ResetAcademicSettingsDialog } from "./ResetAcademicSettingsDialog";

export function AcademicSettingsDangerZone() {
  const [dialogOpen, setDialogOpen] =
    useState(false);

  const deleteMutation =
    useDeleteAcademicSettings();

  function handleConfirm() {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setDialogOpen(false);
      },
    });
  }

  return (
    <>
      <section className="rounded-[24px] border border-destructive/15 bg-destructive/[0.025] p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-destructive/[0.08] text-destructive">
              <AlertTriangle
                size={19}
                strokeWidth={1.75}
              />
            </span>

            <div>
              <h2 className="text-sm font-medium text-foreground">
                Reset Academic Configuration
              </h2>

              <p className="mt-1 max-w-2xl text-xs font-normal leading-5 text-muted-foreground">
                Remove the active year, semester
                and daily calendar configuration.
                Existing academic records remain
                separate.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={
              deleteMutation.isPending
            }
            onClick={() =>
              setDialogOpen(true)
            }
            className={[
              "inline-flex h-10 shrink-0",
              "items-center justify-center gap-2",
              "rounded-xl border",
              "border-destructive/20",
              "bg-card px-5",
              "text-xs font-medium",
              "text-destructive",
              "transition-colors",
              "hover:bg-destructive/[0.07]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50",
            ].join(" ")}
          >
            <RotateCcw
              size={15}
              strokeWidth={1.75}
            />

            Reset Configuration
          </button>
        </div>
      </section>

      <ResetAcademicSettingsDialog
        open={dialogOpen}
        isPending={
          deleteMutation.isPending
        }
        onClose={() => {
          if (
            !deleteMutation.isPending
          ) {
            setDialogOpen(false);
          }
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}