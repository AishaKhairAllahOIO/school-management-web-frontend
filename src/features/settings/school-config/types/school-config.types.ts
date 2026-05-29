import type { SchoolGrade } from "./school.enums";

export type SchoolImage = {
  id: string;
  url: string;
  name: string;
};

export type SchoolGeoLocation = {
  latitude: number | null;
  longitude: number | null;
};

export type GradeStructure = {
  id: string;
  grade: SchoolGrade;
  classroomsCount: number;
  studentsPerClassroom: number;
  isActive: boolean;
};

export type SchoolConfig = {
  id: string;

  schoolName: string;
  description: string;

  address: string;
  city: string;
  country: string;
  location: SchoolGeoLocation;

  phoneNumber: string;
  emergencyPhoneNumber: string;
  email: string;
  website?: string;

  images: SchoolImage[];

  workingDays: string[];
  openingTime: string;
  closingTime: string;

  academicYear: string;

  grades: GradeStructure[];

  createdAt: string;
  updatedAt: string;
};