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
};

export function GeneralSettingsDangerZone({
  schoolName,
  shortName,
}: GeneralSettingsDangerZoneProps) {
  const [dialogOpen, setDialogOpen] =
    useState(false);

  const deleteMutation =
    useDeleteGeneralSettings();

  function handleConfirm() {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setDialogOpen(false);
      },
    });
  }

  return (
    <>
      <section
        className={[
          "rounded-[24px]",
          "border border-destructive/10",
          "bg-destructive/[0.025]",
          "p-5 sm:p-6",
          "transition duration-300",
          "hover:border-destructive/15",
          "hover:bg-destructive/[0.035]",
        ].join(" ")}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span
              className={[
                "flex h-10 w-10 shrink-0",
                "items-center justify-center",
                "rounded-[15px]",
                "bg-destructive/[0.08]",
                "text-destructive",
              ].join(" ")}
            >
              <AlertTriangle
                size={18}
                strokeWidth={1.75}
              />
            </span>

            <div className="pt-0.5">
              <h2 className="text-[15px] font-semibold text-foreground">
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
            className={[
              "flex h-10 shrink-0",
              "items-center justify-center gap-2",
              "rounded-full",
              "bg-card px-5",
              "text-xs font-semibold",
              "text-destructive",
              "shadow-[0_6px_20px_rgba(100,20,20,0.06)]",
              "transition duration-200",
              "hover:-translate-y-0.5",
              "hover:bg-destructive/[0.07]",
              "hover:shadow-[0_10px_24px_rgba(100,20,20,0.09)]",
              "disabled:cursor-not-allowed",
              "disabled:translate-y-0",
              "disabled:opacity-50",
            ].join(" ")}
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