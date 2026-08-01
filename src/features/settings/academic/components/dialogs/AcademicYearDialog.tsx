import { useState } from "react";

import { DatePicker } from "@/shared/ui/date-picker";

import type {
  AcademicYear,
  CreateAcademicYearPayload,
} from "../../types/academic-settings.types";
import {
  BaseDialog,
  DialogActions,
  DialogCheckbox,
  DialogField,
} from "./BaseDialog";

type Props = {
  value: AcademicYear | null;
  onClose: () => void;
  onSave: (payload: CreateAcademicYearPayload) => void;
};

export function AcademicYearDialog({
  value,
  onClose,
  onSave,
}: Props) {
  const [startDate, setStartDate] =
    useState(value?.startDate ?? "");
  const [endDate, setEndDate] =
    useState(value?.endDate ?? "");
  const [isCurrent, setIsCurrent] =
    useState(value?.isCurrent ?? false);

  const canSave = Boolean(startDate && endDate);

  return (
    <BaseDialog
      title={value ? "Edit Academic Year" : "Add Academic Year"}
      description="Define the start and end dates for the academic year."
      onClose={onClose}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <DialogField label="Start Date">
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="Select start date"
            max={endDate || undefined}
          />
        </DialogField>

        <DialogField label="End Date">
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder="Select end date"
            min={startDate || undefined}
          />
        </DialogField>
      </div>

      <DialogCheckbox
        checked={isCurrent}
        onChange={setIsCurrent}
        label="Set as current academic year"
      />

      <DialogActions
        onClose={onClose}
        disabled={!canSave}
        onSave={() =>
          onSave({
            startDate,
            endDate,
            isCurrent,
          })
        }
      />
    </BaseDialog>
  );
}
