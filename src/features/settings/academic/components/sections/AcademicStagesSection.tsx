import { useState } from "react";

import {
  useCreateAcademicStage,
  useDeleteAcademicStage,
  useUpdateAcademicStage,
} from "../../hooks/useAcademicSettings";
import type { AcademicStage } from "../../types/academic-settings.types";
import { academicStageLabels, formatDateTime } from "../../utils/academic-settings.utils";
import { AcademicStageDialog } from "../dialogs/AcademicStageDialog";
import { ActionMenu } from "../shared/ActionMenu";
import { EntityTable, EntityTd, EntityTh } from "../shared/EntityTable";
import { SectionHeader } from "../shared/SectionHeader";

type Props = {
  academicStages: AcademicStage[];
};

export function AcademicStagesSection({ academicStages }: Props) {
  const [dialogValue, setDialogValue] = useState<AcademicStage | "new" | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const createStage = useCreateAcademicStage();
  const updateStage = useUpdateAcademicStage();
  const deleteStage = useDeleteAcademicStage();

  return (
    <>
      <SectionHeader
        title="Academic Stages"
        description="Manage the academic stages used to organize grades."
        actionLabel="Add Stage"
        onAction={() => setDialogValue("new")}
      />

      <EntityTable>
        <thead>
          <tr>
            <EntityTh>Stage</EntityTh>
            <EntityTh>Created At</EntityTh>
            <EntityTh>Updated At</EntityTh>
            <EntityTh align="right">Actions</EntityTh>
          </tr>
        </thead>
        <tbody>
          {academicStages.map((stage) => (
            <tr key={stage.id}>
              <EntityTd strong>{academicStageLabels[stage.type]}</EntityTd>
              <EntityTd>{formatDateTime(stage.createdAt)}</EntityTd>
              <EntityTd>{formatDateTime(stage.updatedAt)}</EntityTd>
              <EntityTd align="right">
                <ActionMenu
                  isOpen={openMenuId === stage.id}
                  onOpenChange={(open) => setOpenMenuId(open ? stage.id : null)}
                  onEdit={() => {
                    setDialogValue(stage);
                    setOpenMenuId(null);
                  }}
                  onDelete={() => {
                    deleteStage.mutate(stage.id);
                    setOpenMenuId(null);
                  }}
                />
              </EntityTd>
            </tr>
          ))}
        </tbody>
      </EntityTable>

      {dialogValue && (
        <AcademicStageDialog
          value={dialogValue === "new" ? null : dialogValue}
          onClose={() => setDialogValue(null)}
          onSave={(payload) => {
            if (dialogValue === "new") createStage.mutate(payload);
            else updateStage.mutate({ id: dialogValue.id, payload });
            setDialogValue(null);
          }}
        />
      )}
    </>
  );
}
