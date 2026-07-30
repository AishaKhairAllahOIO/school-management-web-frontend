import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type {
  AcademicStage,
  AcademicStageType,
  CreateAcademicStagePayload,
} from "../../types/academic-settings.types";
import { academicStageLabels } from "../../utils/academic-settings.utils";
import {
  BaseDialog,
  DialogActions,
  DialogField,
} from "./BaseDialog";

type Props = {
  value: AcademicStage | null;
  onClose: () => void;
  onSave: (payload: CreateAcademicStagePayload) => void;
};

const stageTypes: AcademicStageType[] = [
  "primary",
  "middle",
  "secondary",
];

export function AcademicStageDialog({
  value,
  onClose,
  onSave,
}: Props) {
  const [type, setType] =
    useState<AcademicStageType>(
      value?.type ?? "primary",
    );

  return (
    <BaseDialog
      title={value ? "Edit Academic Stage" : "Add Academic Stage"}
      description="Choose the educational stage used to organize grade levels."
      onClose={onClose}
    >
      <DialogField label="Stage Type">
        <Select
          value={type}
          onValueChange={(value) =>
            setType(value as AcademicStageType)
          }
        >
          <SelectTrigger className="h-11 rounded-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stageTypes.map((item) => (
              <SelectItem key={item} value={item}>
                {academicStageLabels[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DialogField>

      <DialogActions
        onClose={onClose}
        onSave={() => onSave({ type })}
      />
    </BaseDialog>
  );
}
