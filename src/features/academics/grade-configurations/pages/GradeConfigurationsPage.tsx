import { useMemo } from "react";

import { useAcademicYears } from "@/features/settings/academic/hooks/useAcademicSettings";

import { CrudPage } from "../../shared/components/CrudPage";
import { useGrades } from "../../grades/hooks/useGrades";
import { gradeConfigurationApi } from "../api/gradeConfiguration.api";
import {
  useCreateGradeConfiguration,
  useDeleteGradeConfiguration,
  useGradeConfigurations,
  useUpdateGradeConfiguration,
} from "../hooks/useGradeConfigurations";
import type {
  CreateGradeConfigurationPayload,
  GradeConfiguration,
  UpdateGradeConfigurationPayload,
} from "../types/grade-configuration.types";

export function GradeConfigurationsPage() {
  const configurationsQuery = useGradeConfigurations();
  const yearsQuery = useAcademicYears();
  const gradesQuery = useGrades();

  const yearOptions = useMemo(
    () =>
      (yearsQuery.data ?? []).map((year) => ({
        value: String(year.id),
        label: year.name,
      })),
    [yearsQuery.data],
  );

  const gradeOptions = useMemo(
    () =>
      (gradesQuery.data ?? []).map((grade) => ({
        value: String(grade.id),
        label: grade.name,
      })),
    [gradesQuery.data],
  );

  const yearNameById = useMemo(
    () =>
      new Map(
        yearOptions.map((option) => [
          option.value,
          option.label,
        ]),
      ),
    [yearOptions],
  );

  const gradeNameById = useMemo(
    () =>
      new Map(
        gradeOptions.map((option) => [
          option.value,
          option.label,
        ]),
      ),
    [gradeOptions],
  );

  return (
    <CrudPage<
      GradeConfiguration,
      CreateGradeConfigurationPayload,
      UpdateGradeConfigurationPayload
    >
      title="Grade Configurations"
      description="Plan classrooms and assign a supervisor for each grade in an academic year."
      addLabel="Add Configuration"
      rows={configurationsQuery.data ?? []}
      isLoading={
        configurationsQuery.isLoading ||
        yearsQuery.isLoading ||
        gradesQuery.isLoading
      }
      isError={
        configurationsQuery.isError ||
        yearsQuery.isError ||
        gradesQuery.isError
      }
      onRetry={() => {
        void Promise.all([
          configurationsQuery.refetch(),
          yearsQuery.refetch(),
          gradesQuery.refetch(),
        ]);
      }}
      loadEntity={gradeConfigurationApi.getById}
      createMutation={useCreateGradeConfiguration()}
      updateMutation={useUpdateGradeConfiguration()}
      deleteMutation={useDeleteGradeConfiguration()}
      fields={[
        {
          name: "academicYearId",
          label: "Academic Year",
          type: "select",
          options: yearOptions,
          defaultValue: yearOptions[0]?.value ?? "",
          required: true,
          disabledOnEdit: true,
          helperText:
            "The academic year cannot be changed after creation.",
        },
        {
          name: "gradeId",
          label: "Grade",
          type: "select",
          options: gradeOptions,
          defaultValue: gradeOptions[0]?.value ?? "",
          required: true,
          disabledOnEdit: true,
          helperText:
            "The grade cannot be changed after creation.",
        },
        {
          name: "supervisorId",
          label: "Supervisor ID",
          type: "number",
          defaultValue: 1,
          required: true,
          min: 1,
          helperText:
            "No supervisor-list endpoint is included in the supplied API files, so this value remains an ID.",
        },
        {
          name: "plannedClassroomsCount",
          label: "Planned Classrooms",
          type: "number",
          defaultValue: 1,
          required: true,
          min: 1,
        },
      ]}
      columns={[
        {
          key: "year",
          header: "Academic Year",
          render: (row) =>
            yearNameById.get(String(row.academicYearId)) ??
            row.academicYearId,
        },
        {
          key: "grade",
          header: "Grade",
          render: (row) =>
            gradeNameById.get(String(row.gradeId)) ?? row.gradeId,
        },
        {
          key: "supervisor",
          header: "Supervisor ID",
          render: (row) => row.supervisorId,
        },
        {
          key: "plannedClassrooms",
          header: "Planned Classrooms",
          render: (row) => row.plannedClassroomsCount,
        },
        {
          key: "plannedCapacity",
          header: "Planned Capacity",
          render: (row) => row.plannedStudentsCapacity,
        },
        {
          key: "actualClassrooms",
          header: "Actual Classrooms",
          render: (row) => row.actualClassroomsCount,
        },
        {
          key: "actualStudents",
          header: "Actual Students",
          render: (row) => row.actualStudentsCount,
        },
      ]}
      toFormValues={(row) => ({
        academicYearId: String(row.academicYearId),
        gradeId: String(row.gradeId),
        supervisorId: Number(row.supervisorId),
        plannedClassroomsCount: row.plannedClassroomsCount,
      })}
      buildPayload={(values) => ({
        academicYearId: Number(values.academicYearId),
        gradeId: Number(values.gradeId),
        supervisorId: Number(values.supervisorId),
        plannedClassroomsCount: Number(
          values.plannedClassroomsCount,
        ),
      })}
      buildUpdatePayload={(values, row) => {
        const payload: UpdateGradeConfigurationPayload = {};
        const supervisorId = Number(values.supervisorId);
        const plannedClassroomsCount = Number(
          values.plannedClassroomsCount,
        );

        if (supervisorId !== Number(row.supervisorId)) {
          payload.supervisorId = supervisorId;
        }

        if (
          plannedClassroomsCount !== row.plannedClassroomsCount
        ) {
          payload.plannedClassroomsCount = plannedClassroomsCount;
        }

        return payload;
      }}
      emptyTitle="No grade configurations found"
      emptyDescription="Create a configuration to plan classrooms for a grade and academic year."
      deleteTitle="Delete grade configuration?"
      deleteDescription={(row) =>
        `The planning configuration for grade ${
          gradeNameById.get(String(row.gradeId)) ?? row.gradeId
        } will be permanently deleted.`
      }
    />
  );
}
