import { CrudPage } from "../../shared/components/CrudPage";
import { useCreateTeacherAssignment, useDeleteTeacherAssignment, useTeacherAssignments, useUpdateTeacherAssignment } from "../hooks/useTeacherAssignments";
import type { CreateTeacherAssignmentPayload, TeacherAssignment, UpdateTeacherAssignmentPayload } from "../types/teacher-assignment.types";

export function TeacherAssignmentsPage() {
  const { data = [], isLoading } = useTeacherAssignments();
  return (
    <CrudPage<TeacherAssignment, CreateTeacherAssignmentPayload, UpdateTeacherAssignmentPayload>
      title="Teacher Assignments"
      description="Assign teachers to grade subjects and classrooms."
      addLabel="Add Assignment"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateTeacherAssignment()}
      updateMutation={useUpdateTeacherAssignment()}
      deleteMutation={useDeleteTeacherAssignment()}
      fields={[
        { name: "academicYearId", label: "Academic Year ID", type: "text", defaultValue: "year-1" },
        { name: "academicTermId", label: "Academic Term ID", type: "text", defaultValue: "term-1" },
        { name: "teacherId", label: "Teacher ID", type: "text", defaultValue: "teacher-1" },
        { name: "gradeSubjectId", label: "Grade Subject ID", type: "text", defaultValue: "grade-subject-1" },
        { name: "classroomIds", label: "Classroom IDs", type: "array", defaultValue: [], full: true },
      ]}
      columns={[
        { key: "academicYearId", header: "Year", render: (row) => row.academicYearId },
        { key: "academicTermId", header: "Term", render: (row) => row.academicTermId },
        { key: "teacherId", header: "Teacher", render: (row) => row.teacherId },
        { key: "gradeSubjectId", header: "Grade Subject", render: (row) => row.gradeSubjectId },
        { key: "classroomIds", header: "Classrooms", render: (row) => row.classroomIds.join(", ") },
      ]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({ academicYearId: String(values.academicYearId), academicTermId: String(values.academicTermId), teacherId: String(values.teacherId), gradeSubjectId: String(values.gradeSubjectId), classroomIds: values.classroomIds as string[] })}
    />
  );
}
