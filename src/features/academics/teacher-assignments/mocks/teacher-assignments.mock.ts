import type { TeacherAssignment } from "@/features/academics/teacher-assignments/types/teacher-assignment.types";

export const teacherAssignmentsMock: TeacherAssignment[] = [
  {
    id: "teacher-assignment-1",
    teacherId: "teacher-1",
    classroomId: "classroom-7-a",
    subjectId: "subject-math",
    academicYearId: "year-2024-2025",
    isActive: true,
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "teacher-assignment-2",
    teacherId: "teacher-2",
    classroomId: "classroom-8-a",
    subjectId: "subject-english",
    academicYearId: "year-2024-2025",
    isActive: true,
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
  },
];