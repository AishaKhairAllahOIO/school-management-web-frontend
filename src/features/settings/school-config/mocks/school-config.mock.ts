import type { SchoolConfig } from "../types/school-config.types";

export const schoolConfigMock: SchoolConfig = {
  id: "school-config-001",

  schoolName: "School Management",
  description:
    "A modern educational institution focused on academic excellence, student growth, and smart school management.",

  address: "45 School Street",
  city: "Damascus",
  country: "Syria",

  location: {
    latitude: null,
    longitude: null,
  },

  phoneNumber: "+963 944 000 000",
  emergencyPhoneNumber: "+963 955 000 000",
  email: "info@aishaschool.com",
  website: "www.aishaschool.com",

  images: [],

  workingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  openingTime: "08:00",
  closingTime: "15:00",

  academicYear: "2026-2027",

  grades: [
    {
      id: "grade-7",
      grade: "seventh",
      classroomsCount: 3,
      studentsPerClassroom: 30,
      isActive: true,
    },
    {
      id: "grade-8",
      grade: "eighth",
      classroomsCount: 3,
      studentsPerClassroom: 30,
      isActive: true,
    },
    {
      id: "grade-9",
      grade: "ninth",
      classroomsCount: 2,
      studentsPerClassroom: 28,
      isActive: true,
    },
  ],

  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};