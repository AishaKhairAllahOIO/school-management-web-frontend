import { CrudPage } from "../../shared/components/CrudPage";

import {
  useCreateGrade,
  useGrades,
  useUpdateGrade,
} from "../hooks/useGrades";
import type {
  CreateGradePayload,
  Grade,
  UpdateGradePayload,
} from "../types/grade.types";

export function GradesPage() {
  const {
    data: grades = [],
    isLoading,
  } = useGrades();

  const createGradeMutation =
    useCreateGrade();

  const updateGradeMutation =
    useUpdateGrade();

  return (
    <CrudPage<
      Grade,
      CreateGradePayload,
      UpdateGradePayload
    >
      title="Grades"
      description="Manage school grades and connect each grade to an academic stage."
      addLabel="Add Grade"
      rows={grades}
      isLoading={isLoading}
      createMutation={createGradeMutation}
      updateMutation={updateGradeMutation}
      fields={[
        {
          name: "academicStageId",
          label: "Academic Stage ID",
          type: "number",
          defaultValue: 1,
        },
        {
          name: "name",
          label: "Grade Name",
          type: "text",
          defaultValue: "",
        },
        {
          name: "level",
          label: "Level",
          type: "number",
          defaultValue: 1,
        },
        {
          name: "isGraduationGrade",
          label: "Graduation Grade",
          type: "checkbox",
          defaultValue: false,
        },
      ]}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (row) => row.name,
        },
        {
          key: "academicStageId",
          header: "Stage ID",
          render: (row) =>
            row.academicStageId,
        },
        {
          key: "level",
          header: "Level",
          render: (row) => row.level,
        },
        {
          key: "isGraduationGrade",
          header: "Graduation",
          render: (row) =>
            row.isGraduationGrade
              ? "Yes"
              : "No",
        },
      ]}
      toFormValues={(row) => ({
        academicStageId:
          row.academicStageId,
        name: row.name,
        level: row.level,
        isGraduationGrade:
          row.isGraduationGrade,
      })}
      buildPayload={(values) => ({
        academicStageId: Number(
          values.academicStageId,
        ),

        name: String(
          values.name ?? "",
        ).trim(),

        level: Number(values.level),

        isGraduationGrade: Boolean(
          values.isGraduationGrade,
        ),
      })}
      buildUpdatePayload={(values, currentGrade) => {
  const nextName = String(
    values.name ?? "",
  ).trim();

  const payload: UpdateGradePayload = {};

  if (nextName !== currentGrade.name) {
    payload.name = nextName;
  }

  const nextGraduationStatus = Boolean(
    values.isGraduationGrade,
  );

  if (
    nextGraduationStatus !==
    currentGrade.isGraduationGrade
  ) {
    payload.isGraduationGrade =
      nextGraduationStatus;
  }

  return payload;
}}
    />
  );
}