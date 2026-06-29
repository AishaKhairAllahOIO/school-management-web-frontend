import type { AcademicSettingsViewData } from "../types/academic-settings.types";

const now = "2026-06-29T10:00:00.000Z";

export const academicSettingsMock: AcademicSettingsViewData = {
  settings: {
    id: "settings-1",
    currentAcademicYearId: "year-1",
    currentAcademicTermId: "term-1",
    scheduleSettings: {
      workingDays: [
        { day: "sunday", periodsCount: 7 },
        { day: "monday", periodsCount: 7 },
        { day: "tuesday", periodsCount: 6 },
        { day: "wednesday", periodsCount: 7 },
        { day: "thursday", periodsCount: 5 },
      ],
      dayStartTime: "08:00",
      periodDurationMinutes: 45,
      breaks: [
        { id: "break-1", afterPeriodIndex: 3, durationMinutes: 20 },
        { id: "break-2", afterPeriodIndex: 6, durationMinutes: 15 },
      ],
    },
    createdAt: now,
    updatedAt: now,
  },
  academicYears: [
    {
      id: "year-1",
      name: "2025 - 2026",
      startDate: "2025-09-01",
      endDate: "2026-08-31",
      isCurrent: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "year-2",
      name: "2026 - 2027",
      startDate: "2026-09-01",
      endDate: "2027-08-31",
      isCurrent: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "year-3",
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
      id: "term-1",
      academicYearId: "year-1",
      startDate: "2025-09-01",
      endDate: "2026-01-15",
      order: 1,
      isCurrent: true,
      isFinalTerm: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "term-2",
      academicYearId: "year-1",
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
    { id: "stage-1", type: "primary", createdAt: now, updatedAt: now },
    { id: "stage-2", type: "middle", createdAt: now, updatedAt: now },
    { id: "stage-3", type: "secondary", createdAt: now, updatedAt: now },
  ],
};
