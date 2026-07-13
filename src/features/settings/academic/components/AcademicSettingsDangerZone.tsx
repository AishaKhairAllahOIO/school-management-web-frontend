import {
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

import {
  useDeleteAcademicSettings,
} from "../hooks/useAcademicSettings";

import {
  ResetAcademicSettingsDialog,
} from "./ResetAcademicSettingsDialog";

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
      <section className="rounded-3xl border border-destructive/20 bg-destructive/[0.03] p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle
                size={20}
              />
            </span>

            <div>
              <h2 className="text-base font-bold text-foreground">
                Danger Zone
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
                Reset the active academic
                configuration and schedule. The
                server may block this operation
                when student enrollments depend
                on it.
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
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-destructive/25 bg-card px-5 text-xs font-bold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={15} />
            Reset Academic Settings
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