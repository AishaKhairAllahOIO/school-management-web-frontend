import { useState } from "react";

import type { AcademicTerm, CreateAcademicTermPayload } from "../../types/academic-settings.types";
import { BaseDialog, DialogActions, DialogField, dialogInputClass } from "./BaseDialog";

type Props = {
  value: AcademicTerm | null;
  academicYearId: string;
  onClose: () => void;
  onSave: (payload: CreateAcademicTermPayload) => void;
};

export function AcademicTermDialog({ value, academicYearId, onClose, onSave }: Props) {
  const [startDate, setStartDate] = useState(value?.startDate ?? "");
  const [endDate, setEndDate] = useState(value?.endDate ?? "");
  const [order, setOrder] = useState(value?.order ?? 1);
  const [isCurrent, setIsCurrent] = useState(value?.isCurrent ?? false);
  const [isFinalTerm, setIsFinalTerm] = useState(value?.isFinalTerm ?? false);

  const canSave = Boolean(startDate && endDate && order > 0);

  return (
    <BaseDialog title={value ? "Edit Academic Term" : "Add Academic Term"} onClose={onClose}>
      <DialogField label="Start Date">
        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={dialogInputClass} />
      </DialogField>
      <DialogField label="End Date">
        <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={dialogInputClass} />
      </DialogField>
      <DialogField label="Order">
        <input type="number" min={1} value={order} onChange={(event) => setOrder(Number(event.target.value))} className={dialogInputClass} />
      </DialogField>
      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <input type="checkbox" checked={isCurrent} onChange={(event) => setIsCurrent(event.target.checked)} />
          Current
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <input type="checkbox" checked={isFinalTerm} onChange={(event) => setIsFinalTerm(event.target.checked)} />
          Final term
        </label>
      </div>
      <DialogActions
        onClose={onClose}
        disabled={!canSave}
        onSave={() => onSave({ academicYearId, startDate, endDate, order, isCurrent, isFinalTerm })}
      />
    </BaseDialog>
  );
}
