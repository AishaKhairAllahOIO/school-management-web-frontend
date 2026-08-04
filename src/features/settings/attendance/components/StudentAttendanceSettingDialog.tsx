import { useEffect, useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  BaseDialog,
  DialogActions,
  DialogField,
  dialogInputClass,
} from "@/features/settings/academic/components/dialogs/BaseDialog";
import type { AcademicTerm } from "@/features/settings/academic/types/academic-settings.types";

import type {
  CreateStudentAttendanceSettingPayload,
  StudentAttendanceSetting,
} from "../types/student-attendance.types";

type Props = {
  value: StudentAttendanceSetting | "new";
  terms: AcademicTerm[];
  usedSemesterIds: string[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateStudentAttendanceSettingPayload) => void;
};

export function StudentAttendanceSettingDialog({
  value,
  terms,
  usedSemesterIds,
  isPending,
  onClose,
  onSubmit,
}: Props) {
  const isEditing = value !== "new";
  const [semesterId, setSemesterId] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [requiredPercentage, setRequiredPercentage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setSemesterId(isEditing ? value.semesterId : "");
    setWorkingDays(isEditing ? String(value.workingDays) : "");
    setRequiredPercentage(
      isEditing ? String(value.requiredAttendancePercentage) : "",
    );
    setErrors({});
  }, [isEditing, value]);

  const availableTerms = useMemo(
    () =>
      terms.filter(
        (term) =>
          term.id === semesterId || !usedSemesterIds.includes(term.id),
      ),
    [semesterId, terms, usedSemesterIds],
  );

  function handleSave() {
    const nextErrors: Record<string, string> = {};
    const days = Number(workingDays);
    const percentage = Number(requiredPercentage);

    if (!semesterId) nextErrors.semesterId = "Select a semester.";
    if (!Number.isInteger(days) || days < 1 || days > 366) {
      nextErrors.workingDays = "Enter a value between 1 and 366.";
    }
    if (!Number.isFinite(percentage) || percentage < 1 || percentage > 100) {
      nextErrors.requiredPercentage = "Enter a percentage between 1 and 100.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      semesterId,
      workingDays: days,
      requiredAttendancePercentage: percentage,
    });
  }

  return (
    <BaseDialog
      title={isEditing ? "Edit attendance setting" : "Add attendance setting"}
      description="Define the semester attendance threshold and total instructional days."
      onClose={onClose}
    >
      <DialogField label="Semester">
        <Select value={semesterId} onValueChange={setSemesterId}>
          <SelectTrigger className="h-11 rounded-[13px] px-3.5">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {availableTerms.map((term) => (
              <SelectItem key={term.id} value={term.id}>
                {formatTermName(term.semesterName)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.semesterId ? <FieldError>{errors.semesterId}</FieldError> : null}
      </DialogField>

      <div className="grid gap-4 sm:grid-cols-2">
        <DialogField label="Working Days">
          <input
            type="number"
            min={1}
            max={366}
            value={workingDays}
            onChange={(event) => setWorkingDays(event.target.value)}
            placeholder="e.g. 90"
            className={dialogInputClass}
          />
          {errors.workingDays ? <FieldError>{errors.workingDays}</FieldError> : null}
        </DialogField>

        <DialogField label="Required Attendance">
          <div className="relative">
            <input
              type="number"
              min={1}
              max={100}
              value={requiredPercentage}
              onChange={(event) => setRequiredPercentage(event.target.value)}
              placeholder="e.g. 80"
              className={`${dialogInputClass} pr-10`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-[13px] text-muted-foreground">
              %
            </span>
          </div>
          {errors.requiredPercentage ? (
            <FieldError>{errors.requiredPercentage}</FieldError>
          ) : null}
        </DialogField>
      </div>

      <div className="rounded-[15px] border border-primary/10 bg-primary/[0.035] px-4 py-3">
        <p className="text-[12px] leading-5 text-muted-foreground">
          Allowed absence days are calculated by the server from the working days
          and required attendance percentage.
        </p>
      </div>

      <DialogActions
        onClose={onClose}
        onSave={handleSave}
        disabled={isPending}
      />
    </BaseDialog>
  );
}

function FieldError({ children }: { children: string }) {
  return <p className="mt-1.5 text-[11px] text-destructive">{children}</p>;
}

export function formatTermName(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
