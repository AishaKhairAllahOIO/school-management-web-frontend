import { CrudPage, type CrudColumn, type CrudField, type FormValues } from "../../shared/components/CrudPage";
import { useAcademicTerms, useAcademicYears } from "../../../settings/academic/hooks/useAcademicSettings";
import { useStaffByRole } from "../../../users/staff/hooks/useStaff";
import { useClassrooms } from "../../classrooms/hooks/useClassrooms";
import { useGradeSubjects } from "../../grade-subjects/hooks/useGradeSubjects";
import {
  useCreateTeacherAssignment,
  useDeleteTeacherAssignment,
  useTeacherAssignments,
  useUpdateTeacherAssignment,
} from "../hooks/useTeacherAssignments";
import type {
  CreateTeacherAssignmentPayload,
  TeacherAssignment,
  UpdateTeacherAssignmentPayload,
} from "../types/teacher-assignment.types";

export function TeacherAssignmentsPage() {
  const teachersQuery = useStaffByRole("teacher", 1, 100);
  const yearsQuery = useAcademicYears();
  const termsQuery = useAcademicTerms();
  const gradeSubjectsQuery = useGradeSubjects();
  const classroomsQuery = useClassrooms();

  const teachers = teachersQuery.data?.data ?? [];
  const teacherIds = teachers.map((teacher) => String(teacher.id));
  const assignmentsQuery = useTeacherAssignments(teacherIds);
  const rows = assignmentsQuery.data ?? [];

  const createMutation = useCreateTeacherAssignment();
  const updateMutation = useUpdateTeacherAssignment();
  const rawDeleteMutation = useDeleteTeacherAssignment();

  const teacherOptions = teachers.map((teacher) => ({ value: String(teacher.id), label: teacher.fullName }));
  const yearOptions = (yearsQuery.data ?? []).map((year) => ({ value: String(year.id), label: year.name }));
  const termOptions = (termsQuery.data ?? []).map((term) => ({ value: String(term.id), label: term.semesterName }));
  const gradeSubjectOptions = (gradeSubjectsQuery.data ?? []).map((item) => ({
    value: String(item.id),
    label: [item.subjectName, item.gradeName].filter(Boolean).join(" — ") || `Grade subject #${item.id}`,
  }));
  const classroomOptions = (classroomsQuery.data ?? []).map((item) => ({ value: String(item.id), label: item.name }));

  const teacherLabel = new Map(teacherOptions.map((option) => [option.value, option.label]));
  const termLabel = new Map(termOptions.map((option) => [option.value, option.label]));
  const gradeSubjectLabel = new Map(gradeSubjectOptions.map((option) => [option.value, option.label]));
  const classroomLabel = new Map(classroomOptions.map((option) => [option.value, option.label]));

  const fields: Array<CrudField> = [
    { name: "teacherId", label: "Teacher", type: "select", options: teacherOptions, defaultValue: "", required: true },
    { name: "academicYearId", label: "Academic Year", type: "select", options: yearOptions, defaultValue: "", required: true },
    { name: "academicTermId", label: "Academic Term", type: "select", options: termOptions, defaultValue: "", required: true },
    { name: "gradeSubjectId", label: "Grade Subject", type: "select", options: gradeSubjectOptions, defaultValue: "", required: true },
    { name: "classroomIds", label: "Classrooms", type: "array", options: classroomOptions, defaultValue: [], required: true, full: true },
  ];

  const columns: Array<CrudColumn<TeacherAssignment>> = [
    { key: "teacher", header: "Teacher", render: (row) => teacherLabel.get(row.teacherId) ?? "Unknown teacher" },
    { key: "subject", header: "Grade Subject", render: (row) => gradeSubjectLabel.get(row.gradeSubjectId) ?? "—" },
    { key: "classroom", header: "Classroom", render: (row) => classroomLabel.get(row.classroomId) ?? "—" },
    { key: "term", header: "Term", render: (row) => termLabel.get(row.academicTermId) ?? "—" },
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
    <CrudPage<TeacherAssignment, CreateTeacherAssignmentPayload, UpdateTeacherAssignmentPayload>
      title="Teacher Assignments"
      description="Assign teachers to grade subjects and classrooms for each academic term."
      addLabel="Add Teacher Assignment"
      rows={rows}
      isLoading={
        teachersQuery.isLoading ||
        yearsQuery.isLoading ||
        termsQuery.isLoading ||
        gradeSubjectsQuery.isLoading ||
        classroomsQuery.isLoading ||
        assignmentsQuery.isLoading
      }
      isError={
        teachersQuery.isError ||
        yearsQuery.isError ||
        termsQuery.isError ||
        gradeSubjectsQuery.isError ||
        classroomsQuery.isError ||
        assignmentsQuery.isError
      }
      onRetry={() => void Promise.all([
        teachersQuery.refetch(),
        yearsQuery.refetch(),
        termsQuery.refetch(),
        gradeSubjectsQuery.refetch(),
        classroomsQuery.refetch(),
        assignmentsQuery.refetch(),
      ])}
      fields={fields}
      columns={columns}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      toFormValues={(row) => ({
        teacherId: row.teacherId,
        academicYearId: row.academicYearId,
        academicTermId: row.academicTermId,
        gradeSubjectId: row.gradeSubjectId,
        classroomIds: [row.classroomId],
      })}
      buildPayload={(values: FormValues) => ({
        teacherId: String(values.teacherId ?? ""),
        academicYearId: String(values.academicYearId ?? ""),
        academicTermId: String(values.academicTermId ?? ""),
        gradeSubjectId: String(values.gradeSubjectId ?? ""),
        classroomIds: Array.isArray(values.classroomIds) ? values.classroomIds.map(String) : [],
      })}
      buildUpdatePayload={(values: FormValues, currentRow) => {
        const classroomIds = Array.isArray(values.classroomIds) ? values.classroomIds.map(String) : [];
        return {
          teacherId: String(values.teacherId ?? currentRow.teacherId),
          academicYearId: String(values.academicYearId ?? currentRow.academicYearId),
          academicTermId: String(values.academicTermId ?? currentRow.academicTermId),
          gradeSubjectId: String(values.gradeSubjectId ?? currentRow.gradeSubjectId),
          classroomId: classroomIds[0] ?? currentRow.classroomId,
        };
      }}
      emptyTitle="No teacher assignments found"
      emptyDescription="Create the first assignment after workloads, grade subjects, and classrooms are configured."
      deleteTitle="Delete teacher assignment?"
      deleteDescription={(row) => `${teacherLabel.get(row.teacherId) ?? "This teacher"} will be removed from ${classroomLabel.get(row.classroomId) ?? "the selected classroom"}.`}
    />
  );
}
