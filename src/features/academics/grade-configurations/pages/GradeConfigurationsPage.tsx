import { CrudPage } from "../../shared/components/CrudPage";

import {
  useCreateGradeConfiguration,
  useGradeConfigurations,
  useUpdateGradeConfiguration,
} from "../hooks/useGradeConfigurations";
import type {
  CreateGradeConfigurationPayload,
  GradeConfiguration,
  UpdateGradeConfigurationPayload,
} from "../types/grade-configuration.types";

export function GradeConfigurationsPage() {
  const {
    data: configurations = [],
    isLoading,
  } = useGradeConfigurations();

  const createConfigurationMutation =
    useCreateGradeConfiguration();

  const updateConfigurationMutation =
    useUpdateGradeConfiguration();

  return (
    <CrudPage<
      GradeConfiguration,
      CreateGradeConfigurationPayload,
      UpdateGradeConfigurationPayload
    >
      title="Grade Configurations"
      description="Configure each grade per academic year, including supervisor and planned classrooms."
      addLabel="Add Configuration"
      rows={configurations}
      isLoading={isLoading}
      createMutation={
        createConfigurationMutation
      }
      updateMutation={
        updateConfigurationMutation
      }
      fields={[
        {
          name: "academicYearId",
          label: "Academic Year ID",
          type: "number",
          defaultValue: 1,
        },
        {
          name: "gradeId",
          label: "Grade ID",
          type: "number",
          defaultValue: 1,
        },
        {
          name: "supervisorId",
          label: "Supervisor ID",
          type: "number",
          defaultValue: 1,
        },
        {
          name: "plannedClassroomsCount",
          label: "Planned Classrooms",
          type: "number",
          defaultValue: 1,
        },
      ]}
      columns={[
        {
          key: "academicYearId",
          header: "Academic Year",
          render: (row) =>
            row.academicYearId,
        },
        {
          key: "gradeId",
          header: "Grade",
          render: (row) => row.gradeId,
        },
        {
          key: "supervisorId",
          header: "Supervisor",
          render: (row) =>
            row.supervisorId,
        },
        {
          key: "plannedClassroomsCount",
          header: "Planned Classrooms",
          render: (row) =>
            row.plannedClassroomsCount,
        },
        {
          key: "plannedStudentsCapacity",
          header: "Planned Capacity",
          render: (row) =>
            row.plannedStudentsCapacity,
        },
        {
          key: "actualClassroomsCount",
          header: "Actual Classrooms",
          render: (row) =>
            row.actualClassroomsCount,
        },
        {
          key: "actualStudentsCount",
          header: "Actual Students",
          render: (row) =>
            row.actualStudentsCount,
        },
      ]}
      toFormValues={(row) => ({
        academicYearId:
          row.academicYearId,
        gradeId: row.gradeId,
        supervisorId: row.supervisorId,
        plannedClassroomsCount:
          row.plannedClassroomsCount,
      })}
      buildPayload={(values) => ({
        academicYearId: Number(
          values.academicYearId,
        ),
        gradeId: Number(values.gradeId),
        supervisorId: Number(
          values.supervisorId,
        ),
        plannedClassroomsCount: Number(
          values.plannedClassroomsCount,
        ),
      })}
      buildUpdatePayload={(
        values,
        currentConfiguration,
      ) => {
        const payload: UpdateGradeConfigurationPayload =
          {};

        const nextSupervisorId = Number(
          values.supervisorId,
        );

        if (
          nextSupervisorId !==
          Number(
            currentConfiguration.supervisorId,
          )
        ) {
          payload.supervisorId =
            nextSupervisorId;
        }

        const nextPlannedClassroomsCount =
          Number(
            values.plannedClassroomsCount,
          );

        if (
          nextPlannedClassroomsCount !==
          currentConfiguration
            .plannedClassroomsCount
        ) {
          payload.plannedClassroomsCount =
            nextPlannedClassroomsCount;
        }

        return payload;
      }}
    />
  );
}