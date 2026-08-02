import {
  useMemo,
} from "react";

import {
  useStudents,
} from "@/features/users/students/hooks/useStudents";

import type {
  StudentAttendance,
} from "../types/attendance.types";

export function useStudentAttendance(
  attendanceDate: string,
) {
  const studentsQuery = useStudents({
    page: 1,
    per_page: 100,
    sort: "asc",
  });

  const data = useMemo<StudentAttendance[]>(
    () =>
      (studentsQuery.data?.data ?? [])
        .filter(
          (student) =>
            !student.isDeleted &&
            Boolean(student.enrollmentId),
        )
        .map((student) => ({
          id: String(student.enrollmentId),
          studentId: String(student.studentId),
          enrollmentId: String(student.enrollmentId),
          studentName:
            student.fullName || "Unnamed student",

          gradeId: String(
            student.grade?.id ?? "",
          ),
          gradeName:
            student.grade?.name ?? "Unassigned grade",

          classroomId:
            student.classroom?.id !== undefined &&
            student.classroom?.id !== null
              ? String(student.classroom.id)
              : null,
          classroomName:
            student.classroom?.name ?? null,

          date: attendanceDate,
          status: "Present",
        })),
    [
      attendanceDate,
      studentsQuery.data,
    ],
  );

  return {
    ...studentsQuery,
    data,
  };
}
