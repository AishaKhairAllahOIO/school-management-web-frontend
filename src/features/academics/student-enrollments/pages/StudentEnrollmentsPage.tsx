import { CrudPage } from "../../shared/components/CrudPage";
import { useCreateStudentEnrollment, useDeleteStudentEnrollment, useStudentEnrollments, useUpdateStudentEnrollment } from "../hooks/useStudentEnrollments";
import type { CreateStudentEnrollmentPayload, UpdateStudentEnrollmentPayload } from "../api/studentEnrollment.api";
import type { StudentEnrollment } from "../types/student-enrollment.types";

export function StudentEnrollmentsPage() {
  const { data = [], isLoading } = useStudentEnrollments();
  return (
    <CrudPage<StudentEnrollment, CreateStudentEnrollmentPayload, UpdateStudentEnrollmentPayload>
      title="Student Enrollments"
      description="Manage student enrollment records by year, term, grade, and classroom."
      addLabel="Add Enrollment"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateStudentEnrollment()}
      updateMutation={useUpdateStudentEnrollment()}
      deleteMutation={useDeleteStudentEnrollment()}
      fields={[
        { name: "studentId", label: "Student ID", type: "text", defaultValue: "student-1" },
        { name: "academicYearId", label: "Academic Year ID", type: "text", defaultValue: "year-1" },
        { name: "academicTermId", label: "Academic Term ID", type: "text", defaultValue: "term-1" },
        { name: "gradeId", label: "Grade ID", type: "text", defaultValue: "grade-7" },
        { name: "classroomId", label: "Classroom ID", type: "text", defaultValue: "classroom-1" },
        { name: "enrollmentStatus", label: "Status", type: "select", defaultValue: "pending_payment", options: ["pending_payment", "enrolled", "withdrawn", "transferred", "completed", "cancelled"].map((v) => ({ label: v, value: v })) },
        { name: "enrollmentDate", label: "Enrollment Date", type: "date", defaultValue: "" },
        { name: "activatedAt", label: "Activated At", type: "date", defaultValue: "" },
        { name: "withdrawnAt", label: "Withdrawn At", type: "date", defaultValue: "" },
        { name: "transferredAt", label: "Transferred At", type: "date", defaultValue: "" },
        { name: "completedAt", label: "Completed At", type: "date", defaultValue: "" },
        { name: "cancelledAt", label: "Cancelled At", type: "date", defaultValue: "" },
      ]}
      columns={[
        { key: "studentId", header: "Student", render: (row) => row.studentId },
        { key: "academicYearId", header: "Year", render: (row) => row.academicYearId },
        { key: "academicTermId", header: "Term", render: (row) => row.academicTermId },
        { key: "gradeId", header: "Grade", render: (row) => row.gradeId },
        { key: "classroomId", header: "Classroom", render: (row) => row.classroomId },
        { key: "enrollmentStatus", header: "Status", render: (row) => row.enrollmentStatus },
        { key: "enrollmentDate", header: "Date", render: (row) => row.enrollmentDate },
      ]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({
        studentId: String(values.studentId), academicYearId: String(values.academicYearId), academicTermId: String(values.academicTermId), gradeId: String(values.gradeId), classroomId: String(values.classroomId), enrollmentStatus: values.enrollmentStatus as CreateStudentEnrollmentPayload["enrollmentStatus"], enrollmentDate: String(values.enrollmentDate), activatedAt: values.activatedAt ? String(values.activatedAt) : null, withdrawnAt: values.withdrawnAt ? String(values.withdrawnAt) : null, transferredAt: values.transferredAt ? String(values.transferredAt) : null, completedAt: values.completedAt ? String(values.completedAt) : null, cancelledAt: values.cancelledAt ? String(values.cancelledAt) : null,
      })}
    />
  );
}
