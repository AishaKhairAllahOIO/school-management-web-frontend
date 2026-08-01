import type { SchedulingCatalog } from "@/features/scheduling/catalog/types/scheduling-catalog.types";

export const schedulingCatalogMock: SchedulingCatalog = {
  academicYearId: "year-2026-2027",
  grades: [
    { id: "grade-7", name: "Seventh Grade", level: 7, color: "violet" },
    { id: "grade-8", name: "Eighth Grade", level: 8, color: "sky" },
    { id: "grade-9", name: "Ninth Grade", level: 9, color: "mint" },
  ],
  classrooms: [
    { id: "classroom-7-a", name: "Section A", gradeId: "grade-7", roomNumber: "101", studentCount: 28 },
    { id: "classroom-7-b", name: "Section B", gradeId: "grade-7", roomNumber: "102", studentCount: 26 },
    { id: "classroom-8-a", name: "Section A", gradeId: "grade-8", roomNumber: "201", studentCount: 25 },
    { id: "classroom-8-b", name: "Section B", gradeId: "grade-8", roomNumber: "202", studentCount: 24 },
    { id: "classroom-9-a", name: "Section A", gradeId: "grade-9", roomNumber: "301", studentCount: 23 },
    { id: "classroom-9-b", name: "Section B", gradeId: "grade-9", roomNumber: "302", studentCount: 22 },
  ],
  subjects: [
    { id: "subject-arabic", name: "Arabic", color: "peach" },
    { id: "subject-english", name: "English", color: "sky" },
    { id: "subject-math", name: "Mathematics", color: "violet" },
    { id: "subject-science", name: "Science", color: "mint" },
    { id: "subject-french", name: "French", color: "rose" },
    { id: "subject-national", name: "National Education", color: "peach" },
  ],
  teachers: [
    { id: "teacher-1", name: "Ms. Aisha Ali" },
    { id: "teacher-2", name: "Mr. John Smith" },
    { id: "teacher-3", name: "Mr. Ahmad Hassan" },
    { id: "teacher-4", name: "Ms. Sara Mocha" },
    { id: "teacher-5", name: "Ms. Lina Khalil" },
  ],
};
