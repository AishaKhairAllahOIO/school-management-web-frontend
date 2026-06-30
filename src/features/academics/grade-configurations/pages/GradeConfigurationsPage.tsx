import { CrudPage } from "../../shared/components/CrudPage";
import { useCreateGradeConfiguration, useDeleteGradeConfiguration, useGradeConfigurations, useUpdateGradeConfiguration } from "../hooks/useGradeConfigurations";
import type { CreateGradeConfigurationPayload, GradeConfiguration, UpdateGradeConfigurationPayload } from "../types/grade-configuration.types";

export function GradeConfigurationsPage() {
  const { data = [], isLoading } = useGradeConfigurations();
  return (
    <CrudPage<GradeConfiguration, CreateGradeConfigurationPayload, UpdateGradeConfigurationPayload>
      title="Grade Configurations"
      description="Configure each grade per academic year: supervisor, planned classrooms, and planned capacity."
      addLabel="Add Configuration"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateGradeConfiguration()}
      updateMutation={useUpdateGradeConfiguration()}
      deleteMutation={useDeleteGradeConfiguration()}
      fields={[
        { name: "academicYearId", label: "Academic Year ID", type: "text", defaultValue: "year-1" },
        { name: "gradeId", label: "Grade ID", type: "text", defaultValue: "grade-7" },
        { name: "supervisorId", label: "Supervisor ID", type: "text", defaultValue: "teacher-1" },
        { name: "plannedClassroomsCount", label: "Planned Classrooms", type: "number", defaultValue: 1 },
      ]}
      columns={[
        { key: "academicYearId", header: "Academic Year", render: (row) => row.academicYearId },
        { key: "gradeId", header: "Grade", render: (row) => row.gradeId },
        { key: "supervisorId", header: "Supervisor", render: (row) => row.supervisorId },
        { key: "plannedClassroomsCount", header: "Planned Classrooms", render: (row) => row.plannedClassroomsCount },
        { key: "plannedStudentsCapacity", header: "Planned Capacity", render: (row) => row.plannedStudentsCapacity },
        { key: "actualClassroomsCount", header: "Actual Classrooms", render: (row) => row.actualClassroomsCount },
        { key: "actualStudentsCount", header: "Actual Students", render: (row) => row.actualStudentsCount },
      ]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({
        academicYearId: String(values.academicYearId),
        gradeId: String(values.gradeId),
        supervisorId: String(values.supervisorId),
        plannedClassroomsCount: Number(values.plannedClassroomsCount),
      })}
    />
  );
}
