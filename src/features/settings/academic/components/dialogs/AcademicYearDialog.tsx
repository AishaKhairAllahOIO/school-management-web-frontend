import { useState } from "react";

import type { AcademicYear, CreateAcademicYearPayload } from "../../types/academic-settings.types";
import { BaseDialog, DialogActions, DialogField, dialogInputClass } from "./BaseDialog";

type Props = {
  value: AcademicYear | null;
  onClose: () => void;
  onSave: (payload: CreateAcademicYearPayload) => void;
};

export function AcademicYearDialog({ value, onClose, onSave }: Props) {
  const [startDate, setStartDate] = useState(value?.startDate ?? "");
  const [endDate, setEndDate] = useState(value?.endDate ?? "");
  const [isCurrent, setIsCurrent] = useState(value?.isCurrent ?? false);

  const canSave = Boolean(startDate && endDate);

  return (
    <BaseDialog title={value ? "Edit Academic Year" : "Add Academic Year"} onClose={onClose}>
      <DialogField label="Start Date">
        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={dialogInputClass} />
      </DialogField>
      <DialogField label="End Date">
        <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={dialogInputClass} />
      </DialogField>
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <input type="checkbox" checked={isCurrent} onChange={(event) => setIsCurrent(event.target.checked)} />
        Current academic year
      </label>
      <DialogActions onClose={onClose} disabled={!canSave} onSave={() => onSave({ startDate, endDate, isCurrent })} />
    </BaseDialog>
  );
}
