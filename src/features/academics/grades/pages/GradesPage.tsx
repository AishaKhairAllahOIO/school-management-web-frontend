import { CrudPage } from "../../shared/components/CrudPage";
import { useCreateGrade, useDeleteGrade, useGrades, useUpdateGrade } from "../hooks/useGrades";
import type { CreateGradePayload, Grade, UpdateGradePayload } from "../types/grade.types";

export function GradesPage() {
  const { data = [], isLoading } = useGrades();
  return (
    <CrudPage<Grade, CreateGradePayload, UpdateGradePayload>
      title="Grades"
      description="Manage school grades and connect each grade to an academic stage."
      addLabel="Add Grade"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateGrade()}
      updateMutation={useUpdateGrade()}
      deleteMutation={useDeleteGrade()}
      fields={[
        { name: "academicStageId", label: "Academic Stage ID", type: "text", defaultValue: "stage-middle" },
        { name: "name", label: "Grade Name", type: "text", defaultValue: "" },
        { name: "level", label: "Level", type: "number", defaultValue: 1 },
        { name: "isGraduationGrade", label: "Graduation Grade", type: "checkbox", defaultValue: false },
      ]}
      columns={[
        { key: "name", header: "Name", render: (row) => <strong className="text-slate-950">{row.name}</strong> },
        { key: "academicStageId", header: "Stage ID", render: (row) => row.academicStageId },
        { key: "level", header: "Level", render: (row) => row.level },
        { key: "isGraduationGrade", header: "Graduation", render: (row) => row.isGraduationGrade ? "Yes" : "No" },
      ]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({
        academicStageId: String(values.academicStageId),
        name: String(values.name),
        level: Number(values.level),
        isGraduationGrade: Boolean(values.isGraduationGrade),
      })}
    />
  );
}
