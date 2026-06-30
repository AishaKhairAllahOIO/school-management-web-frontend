import { CrudPage } from "../../shared/components/CrudPage";
import { useCreateTeacherWorkload, useDeleteTeacherWorkload, useTeacherWorkloads, useUpdateTeacherWorkload } from "../hooks/useTeacherWorkloads";
import type { CreateTeacherWorkloadPayload, TeacherWorkload, UpdateTeacherWorkloadPayload } from "../types/teacher-workload.types";

export function TeacherWorkloadsPage() {
  const { data = [], isLoading } = useTeacherWorkloads();
  return (
    <CrudPage<TeacherWorkload, CreateTeacherWorkloadPayload, UpdateTeacherWorkloadPayload>
      title="Teacher Workloads"
      description="Define each teacher monthly required periods for the academic year."
      addLabel="Add Workload"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateTeacherWorkload()}
      updateMutation={useUpdateTeacherWorkload()}
      deleteMutation={useDeleteTeacherWorkload()}
      fields={[
        { name: "academicYearId", label: "Academic Year ID", type: "text", defaultValue: "year-1" },
        { name: "teacherId", label: "Teacher ID", type: "text", defaultValue: "teacher-1" },
        { name: "requiredMonthlyPeriods", label: "Required Monthly Periods", type: "number", defaultValue: 0 },
      ]}
      columns={[
        { key: "academicYearId", header: "Academic Year", render: (row) => row.academicYearId },
        { key: "teacherId", header: "Teacher", render: (row) => row.teacherId },
        { key: "requiredMonthlyPeriods", header: "Required", render: (row) => row.requiredMonthlyPeriods },
        { key: "assignedMonthlyPeriods", header: "Assigned", render: (row) => row.assignedMonthlyPeriods },
        { key: "remainingMonthlyPeriods", header: "Remaining", render: (row) => row.remainingMonthlyPeriods },
      ]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({ academicYearId: String(values.academicYearId), teacherId: String(values.teacherId), requiredMonthlyPeriods: Number(values.requiredMonthlyPeriods) })}
    />
  );
}
