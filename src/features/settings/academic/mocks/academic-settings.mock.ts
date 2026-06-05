import type { AcademicSettings } from "@/features/settings/academic/types/academic-settings.types";

export const academicSettingsMock: AcademicSettings = {
  id: "academic-settings-001",

  currentAcademicYearId: "year-2024-2025",

  academicYears: [
    {
      id: "year-2024-2025",
      name: "2024 - 2025",
      startDate: "2024-08-01",
      endDate: "2025-07-31",
      isCurrent: true,
    },
    {
      id: "year-2025-2026",
      name: "2025 - 2026",
      startDate: "2025-08-01",
      endDate: "2026-07-31",
      isCurrent: false,
    },
  ],

  terms: [
    {
      id: "term-1",
      name: "First Term",
      startDate: "2024-08-01",
      endDate: "2024-10-31",
      status: "active",
    },
    {
      id: "term-2",
      name: "Second Term",
      startDate: "2024-11-01",
      endDate: "2025-01-31",
      status: "upcoming",
    },
    {
      id: "term-3",
      name: "Third Term",
      startDate: "2025-02-01",
      endDate: "2025-04-30",
      status: "upcoming",
    },
  ],

  gradeScale: [
    {
      id: "grade-a",
      grade: "A",
      minimumScore: 90,
      maximumScore: 100,
      description: "Excellent",
    },
    {
      id: "grade-b",
      grade: "B",
      minimumScore: 80,
      maximumScore: 89,
      description: "Very Good",
    },
    {
      id: "grade-c",
      grade: "C",
      minimumScore: 70,
      maximumScore: 79,
      description: "Good",
    },
    {
      id: "grade-d",
      grade: "D",
      minimumScore: 60,
      maximumScore: 69,
      description: "Pass",
    },
    {
      id: "grade-f",
      grade: "F",
      minimumScore: 0,
      maximumScore: 59,
      description: "Fail",
    },
  ],

  preferences: {
    autoPromoteStudents: true,
    allowStudentRepeating: true,
    calculateGpa: true,
    rankStudents: true,
    useAttendanceInPromotion: false,
  },

  passingGrade: "D",
  maximumGrade: 100,
  gpaScale: "4.0",
  minimumAttendancePercentage: 75,
  promotionThreshold: 60,

  createdAt: "2024-05-15T10:00:00.000Z",
  updatedAt: "2025-05-20T10:45:00.000Z",
};