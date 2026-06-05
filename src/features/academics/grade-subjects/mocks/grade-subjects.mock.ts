import type { GradeSubject } from "@/features/academics/grade-subjects/types/grade-subject.types";

export const gradeSubjectsMock: GradeSubject[] = [
  {
    id: "grade-subject-1",
    gradeId: "grade-7",
    subjectId: "subject-math",
    weeklyHours: 5,
    isCore: true,
    isActive: true,
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "grade-subject-2",
    gradeId: "grade-7",
    subjectId: "subject-english",
    weeklyHours: 4,
    isCore: true,
    isActive: true,
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
  },
];