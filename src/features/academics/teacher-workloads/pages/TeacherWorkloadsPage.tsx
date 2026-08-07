import { CrudPage, type CrudColumn, type CrudField, type FormValues } from "../../shared/components/CrudPage";
import { useAcademicYears } from "../../../settings/academic/hooks/useAcademicSettings";
import { useStaffByRole } from "../../../users/staff/hooks/useStaff";
import {
  useCreateTeacherWorkload,
  useDeleteTeacherWorkload,
  useTeacherWorkloads,
  useUpdateTeacherWorkload,
} from "../hooks/useTeacherWorkloads";
import type {
  CreateTeacherWorkloadPayload,
  TeacherWorkload,
  UpdateTeacherWorkloadPayload,
} from "../types/teacher-workload.types";

export function TeacherWorkloadsPage() {
  const teachersQuery = useStaffByRole("teacher", 1, 100);
  const yearsQuery = useAcademicYears();
  const teachers = teachersQuery.data?.data ?? [];
  const teacherIds = teachers.map((teacher) => String(teacher.id));
  const workloadsQuery = useTeacherWorkloads(teacherIds);
  const createMutation = useCreateTeacherWorkload();
  const updateMutation = useUpdateTeacherWorkload();
  const rawDeleteMutation = useDeleteTeacherWorkload();
  const rows = workloadsQuery.data ?? [];

  const teacherOptions = teachers.map((teacher) => ({
    value: String(teacher.id),
    label: teacher.fullName,
  }));
  const yearOptions = (yearsQuery.data ?? []).map((year) => ({
    value: String(year.id),
    label: year.name,
  }));

  const teacherLabel = new Map(teacherOptions.map((option) => [option.value, option.label]));
  const yearLabel = new Map(yearOptions.map((option) => [option.value, option.label]));

  const fields: Array<CrudField> = [
    { name: "teacherId", label: "Teacher", type: "select", options: teacherOptions, defaultValue: "", required: true },
    { name: "academicYearId", label: "Academic Year", type: "select", options: yearOptions, defaultValue: "", required: true },
    { name: "requiredMonthlyPeriods", label: "Required Monthly Periods", type: "number", defaultValue: 1, required: true, min: 1 },
  ];

  const columns: Array<CrudColumn<TeacherWorkload>> = [
    { key: "teacher", header: "Teacher", render: (row) => teacherLabel.get(row.teacherId) ?? "Unknown teacher" },
    { key: "year", header: "Academic Year", render: (row) => yearLabel.get(row.academicYearId) ?? "—" },
    { key: "required", header: "Required", render: (row) => row.requiredMonthlyPeriods },
    { key: "assigned", header: "Assigned", render: (row) => row.assignedMonthlyPeriods },
    { key: "remaining", header: "Remaining", render: (row) => row.remainingMonthlyPeriods },
  ];

  const deleteMutation = {
    isPending: rawDeleteMutation.isPending,
    mutate: (id: string, options?: { onSuccess?: () => void; onError?: (error: unknown) => void }) => {
      const row = rows.find((item) => item.id === id);
      if (!row) return;
      rawDeleteMutation.mutate({ id, teacherId: row.teacherId }, options);
    },
  };

  return (
    <CrudPage<TeacherWorkload, CreateTeacherWorkloadPayload, UpdateTeacherWorkloadPayload>
      title="Teacher Workloads"
      description="Define and monitor each teacher's required, assigned, and remaining monthly periods."
      addLabel="Add Teacher Workload"
      rows={rows}
      isLoading={teachersQuery.isLoading || yearsQuery.isLoading || workloadsQuery.isLoading}
      isError={teachersQuery.isError || yearsQuery.isError || workloadsQuery.isError}
      onRetry={() => void Promise.all([teachersQuery.refetch(), yearsQuery.refetch(), workloadsQuery.refetch()])}
      fields={fields}
      columns={columns}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      toFormValues={(row) => ({
        teacherId: row.teacherId,
        academicYearId: row.academicYearId,
        requiredMonthlyPeriods: row.requiredMonthlyPeriods,
      })}
      buildPayload={(values: FormValues) => ({
        teacherId: String(values.teacherId ?? ""),
        academicYearId: String(values.academicYearId ?? ""),
        requiredMonthlyPeriods: Number(values.requiredMonthlyPeriods ?? 1),
      })}
      buildUpdatePayload={(values: FormValues, currentRow) => ({
        teacherId: String(values.teacherId ?? currentRow.teacherId),
        academicYearId: String(values.academicYearId ?? currentRow.academicYearId),
        requiredMonthlyPeriods: Number(values.requiredMonthlyPeriods ?? currentRow.requiredMonthlyPeriods),
      })}
      emptyTitle="No teacher workloads found"
      emptyDescription="Create the first workload after teachers and academic years are available."
      deleteTitle="Delete teacher workload?"
      deleteDescription={(row) => `The workload for ${teacherLabel.get(row.teacherId) ?? "this teacher"} will be deleted.`}
    />
  );
}
