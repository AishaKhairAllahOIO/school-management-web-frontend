import { useState } from "react";

import { DatePicker } from "@/shared/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type {
  AcademicTerm,
  CreateAcademicTermPayload,
} from "../../types/academic-settings.types";
import {
  BaseDialog,
  DialogActions,
  DialogCheckbox,
  DialogField,
} from "./BaseDialog";

type Props = {
  value: AcademicTerm | null;
  academicYearId: string;
  onClose: () => void;
  onSave: (payload: CreateAcademicTermPayload) => void;
};

const semesterOptions = [
  "First_Term",
  "Second_Term",
  "Third_Term",
] as const;

export function AcademicTermDialog({
  value,
  academicYearId,
  onClose,
  onSave,
}: Props) {
  const [semesterName, setSemesterName] =
    useState(value?.semesterName ?? "First_Term");
  const [startDate, setStartDate] =
    useState(value?.startDate ?? "");
  const [endDate, setEndDate] =
    useState(value?.endDate ?? "");
  const [isCurrent, setIsCurrent] =
    useState(value?.isCurrent ?? false);
  const [isFinalTerm, setIsFinalTerm] =
    useState(value?.isFinalTerm ?? false);

  const canSave = Boolean(
    academicYearId &&
      semesterName &&
      startDate &&
      endDate,
  );

  return (
    <BaseDialog
      title={value ? "Edit Academic Term" : "Add Academic Term"}
      description="Configure the term name, dates and current status."
      onClose={onClose}
    >
      <DialogField label="Semester Name">
        <Select
          value={semesterName}
          onValueChange={(value) =>
            setSemesterName(
              value as (typeof semesterOptions)[number],
            )
          }
        >
          <SelectTrigger className="h-11 rounded-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {semesterOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DialogField>

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

      <div className="grid gap-2.5 sm:grid-cols-2">
        <DialogCheckbox
          checked={isCurrent}
          onChange={setIsCurrent}
          label="Current term"
        />

        <DialogCheckbox
          checked={isFinalTerm}
          onChange={setIsFinalTerm}
          label="Final term"
        />
      </div>

      <DialogActions
        onClose={onClose}
        disabled={!canSave}
        onSave={() =>
          onSave({
            academicYearId: Number(academicYearId),
            semesterName,
            startDate,
            endDate,
            isCurrent,
            isFinalTerm,
          })
        }
      />
    </BaseDialog>
  );
}
