import { CrudPage } from "../../shared/components/CrudPage";
import { useAssessmentComponents, useCreateAssessmentComponent, useDeleteAssessmentComponent, useUpdateAssessmentComponent } from "../hooks/useAssessmentComponents";
import type { AssessmentComponent, CreateAssessmentComponentPayload, UpdateAssessmentComponentPayload } from "../types/assessment-component.types";

export function AssessmentComponentsPage() {
  const { data = [], isLoading } = useAssessmentComponents();
  return (
    <CrudPage<AssessmentComponent, CreateAssessmentComponentPayload, UpdateAssessmentComponentPayload>
      title="Assessment Components"
      description="Configure assessment components for each grade subject."
      addLabel="Add Component"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateAssessmentComponent()}
      updateMutation={useUpdateAssessmentComponent()}
      deleteMutation={useDeleteAssessmentComponent()}
      fields={[
        { name: "gradeSubjectId", label: "Grade Subject ID", type: "text", defaultValue: "grade-subject-1" },
        { name: "type", label: "Type", type: "select", defaultValue: "exam", options: ["oral", "homework", "quiz1", "quiz2", "exam", "participation"].map((v) => ({ label: v, value: v })) },
        { name: "name", label: "Name", type: "text", defaultValue: "" },
        { name: "maxMark", label: "Max Mark", type: "number", defaultValue: 0 },
        { name: "weightPercentage", label: "Weight Percentage", type: "number", defaultValue: 0 },
      ]}
      columns={[
        { key: "gradeSubjectId", header: "Grade Subject", render: (row) => row.gradeSubjectId },
        { key: "type", header: "Type", render: (row) => row.type },
        { key: "name", header: "Name", render: (row) => <strong className="text-slate-950">{row.name}</strong> },
        { key: "maxMark", header: "Max Mark", render: (row) => row.maxMark },
        { key: "weightPercentage", header: "Weight %", render: (row) => row.weightPercentage },
      ]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({ gradeSubjectId: String(values.gradeSubjectId), type: values.type as CreateAssessmentComponentPayload["type"], name: String(values.name), maxMark: Number(values.maxMark), weightPercentage: Number(values.weightPercentage) })}
    />
  );
}
