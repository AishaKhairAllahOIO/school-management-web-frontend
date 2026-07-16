import type { ApiId, PaginatedData } from "../../shared/types/api.types";
import type { AccountStatus, Gender, Nationality } from "../../students/types/student.types";

export type StaffDegree = "diploma" | "bachelor" | "master" | "phd" | "other";

export type StaffProfile = {
  id: ApiId;
  userId: ApiId;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  birthDate: string;
  address: string;
  photoUrl: string | null;
  accountStatus: AccountStatus;
  degree: StaffDegree;
  specialization: string;
  university: string;
  graduationYear: number;
  hireDate: string;
  experienceYears: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
};

export type StaffListResponse = PaginatedData<StaffProfile>;

export type RegisterStaffFormValues = {
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  birth_date: string;
  birth_place: string;
  address: string;
  gender: Gender;
  nationality: Nationality;
  phone_number: string;
  email: string;
  url_photo?: File | null;
  degree: StaffDegree;
  specialization: string;
  university: string;
  graduation_year: number;
  hire_date: string;
  experience_years: number;
};
