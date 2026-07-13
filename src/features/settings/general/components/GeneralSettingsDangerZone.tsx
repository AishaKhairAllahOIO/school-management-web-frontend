import {
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

import { useDeleteGeneralSettings } from "../hooks/useGeneralSettings";

import { ResetGeneralSettingsDialog } from "./ResetGeneralSettingsDialog";

type GeneralSettingsDangerZoneProps = {
  schoolName: string;
  shortName: string;
  isInitialized: boolean;
};

export function GeneralSettingsDangerZone({
  schoolName,
  shortName,
  isInitialized,
}: GeneralSettingsDangerZoneProps) {
  const [dialogOpen, setDialogOpen] =
    useState(false);

  const deleteMutation =
    useDeleteGeneralSettings();

  if (!isInitialized) {
    return (
      <section className="rounded-3xl border border-border/60 bg-muted/10 p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <RotateCcw size={20} />
          </span>

          <div>
            <h2 className="text-base font-bold text-foreground">
              School settings are not initialized
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Complete the form and save it to
              initialize the school profile.
            </p>
          </div>
        </div>
      </section>
    );
  }

  function handleConfirm() {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setDialogOpen(false);
      },
    });
  }

  return (
    <>
      <section className="rounded-3xl border border-destructive/20 bg-destructive/[0.03] p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle size={20} />
            </span>

            <div>
              <h2 className="text-base font-bold text-foreground">
                Danger Zone
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
                Permanently reset the school
                profile, logo and all gallery
                images. This action cannot be
                undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() =>
              setDialogOpen(true)
            }
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-destructive/25 bg-card px-5 text-xs font-bold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={15} />
            Reset School Settings
          </button>
        </div>
      </section>

      <ResetGeneralSettingsDialog
        open={dialogOpen}
        schoolName={schoolName}
        shortName={shortName}
        isPending={
          deleteMutation.isPending
        }
        onClose={() => {
          if (!deleteMutation.isPending) {
            setDialogOpen(false);
          }
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}