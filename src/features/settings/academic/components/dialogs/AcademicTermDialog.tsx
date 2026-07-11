import { useState } from "react";

import type {
  AcademicTerm,
  CreateAcademicTermPayload,
} from "../../types/academic-settings.types";
import {
  BaseDialog,
  DialogActions,
  DialogField,
  dialogInputClass,
} from "./BaseDialog";

type Props = {
  value: AcademicTerm | null;
  academicYearId: string;
  onClose: () => void;
  onSave: (
    payload: CreateAcademicTermPayload,
  ) => void;
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
    useState(
      value?.semesterName ?? "First_Term",
    );

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
      title={
        value
          ? "Edit Academic Term"
          : "Add Academic Term"
      }
      onClose={onClose}
    >
      <DialogField label="Semester Name">
        <select
          value={semesterName}
          onChange={(event) =>
            setSemesterName(event.target.value)
          }
          className={dialogInputClass}
        >
          {semesterOptions.map((option) => (
            <option key={option} value={option}>
              {option.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </DialogField>

      <DialogField label="Start Date">
        <input
          type="date"
          value={startDate}
          onChange={(event) =>
            setStartDate(event.target.value)
          }
          className={dialogInputClass}
        />
      </DialogField>

      <DialogField label="End Date">
        <input
          type="date"
          value={endDate}
          onChange={(event) =>
            setEndDate(event.target.value)
          }
          className={dialogInputClass}
        />
      </DialogField>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isCurrent}
          onChange={(event) =>
            setIsCurrent(event.target.checked)
          }
        />

        <span className="text-sm font-semibold">
          Current term
        </span>
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isFinalTerm}
          onChange={(event) =>
            setIsFinalTerm(event.target.checked)
          }
        />

        <span className="text-sm font-semibold">
          Final term
        </span>
      </label>

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