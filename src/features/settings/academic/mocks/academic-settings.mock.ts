import type { AcademicSettingsViewData } from "../types/academic-settings.types";

const now = "2026-06-29T10:00:00.000Z";

export const academicSettingsMock: AcademicSettingsViewData = {
  settings: {
    id: "1",
    currentAcademicYearId: "1",
    currentSemesterId: "1",

    scheduleSettings: {
      workingDays: [
        {
          day: "sunday",
          periodsCount: 7,
        },
        {
          day: "monday",
          periodsCount: 7,
        },
        {
          day: "tuesday",
          periodsCount: 6,
        },
        {
          day: "wednesday",
          periodsCount: 7,
        },
        {
          day: "thursday",
          periodsCount: 5,
        },
      ],

      dayStartTime: "08:00",
      periodDurationMinutes: 45,

      breaks: [
        {
          id: "break-1",
          afterPeriodIndex: 3,
          durationMinutes: 20,
        },
        {
          id: "break-2",
          afterPeriodIndex: 6,
          durationMinutes: 15,
        },
      ],
    },

    createdAt: now,
    updatedAt: now,
  },

  academicYears: [
    {
      id: "1",
      name: "2025 - 2026",
      startDate: "2025-09-01",
      endDate: "2026-08-31",
      isCurrent: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "2",
      name: "2026 - 2027",
      startDate: "2026-09-01",
      endDate: "2027-08-31",
      isCurrent: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "3",
      name: "2024 - 2025",
      startDate: "2024-09-01",
      endDate: "2025-08-31",
      isCurrent: false,
      createdAt: now,
      updatedAt: now,
    },
  ],

  academicTerms: [
    {
      id: "1",
      academicYearId: "1",
      semesterName: "First_Term",
      startDate: "2025-09-01",
      endDate: "2026-01-15",
      order: 1,
      isCurrent: true,
      isFinalTerm: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "2",
      academicYearId: "1",
      semesterName: "Second_Term",
      startDate: "2026-01-16",
      endDate: "2026-06-15",
      order: 2,
      isCurrent: false,
      isFinalTerm: true,
      createdAt: now,
      updatedAt: now,
    },
  ],

  academicStages: [
    {
      id: "1",
      type: "primary",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "2",
      type: "middle",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "3",
      type: "secondary",
      createdAt: now,
      updatedAt: now,
    },
  ],
};