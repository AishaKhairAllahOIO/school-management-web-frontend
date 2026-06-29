import { useState } from "react";

import type { AcademicStage, AcademicStageType, CreateAcademicStagePayload } from "../../types/academic-settings.types";
import { academicStageLabels } from "../../utils/academic-settings.utils";
import { BaseDialog, DialogActions, DialogField, dialogInputClass } from "./BaseDialog";

type Props = {
  value: AcademicStage | null;
  onClose: () => void;
  onSave: (payload: CreateAcademicStagePayload) => void;
};

const stageTypes: AcademicStageType[] = ["primary", "middle", "secondary"];

export function AcademicStageDialog({ value, onClose, onSave }: Props) {
  const [type, setType] = useState<AcademicStageType>(value?.type ?? "primary");

  return (
    <BaseDialog title={value ? "Edit Academic Stage" : "Add Academic Stage"} onClose={onClose}>
      <DialogField label="Stage Type">
        <select value={type} onChange={(event) => setType(event.target.value as AcademicStageType)} className={dialogInputClass}>
          {stageTypes.map((item) => (
            <option key={item} value={item}>
              {academicStageLabels[item]}
            </option>
          ))}
        </select>
      </DialogField>
      <DialogActions onClose={onClose} onSave={() => onSave({ type })} />
    </BaseDialog>
  );
}
