export type ApiId = string | number;

export type StaffRole =
  | "teacher"
  | "adviser"
  | "secretary"
  | "counselor"
  | "service_staff";

export type StaffGender = "male" | "female";

export type StaffNationality =
  | "syrian"
  | "lebanese"
  | "palestinian"
  | "jordanian"
  | "other";

export type StaffDegree =
  | "diploma"
  | "bachelor"
  | "master"
  | "phd"
  | "student"
  | "none"
  | "other";

export type StaffServiceType =
  | "cleaner"
  | "guard"
  | "driver"
  | "maintenance"
  | "kitchen_staff";

export type StaffProfile = {
  id: ApiId;
  userId: ApiId | null;

  firstName: string;
  fatherName: string;
  motherName: string;
  lastName: string;
  fullName: string;

  phoneNumber: string;
  email: string | null;

  birthDate: string | null;
  birthPlace: string | null;

  gender: StaffGender | null;
  nationality: StaffNationality | null;

  address: string | null;
  photoUrl: string | null;

  accountStatus: string;

  degree: StaffDegree | null;
  specialization: string | null;
  university: string | null;
  graduationYear: number | null;

  hireDate: string | null;
  experienceYears: number | null;

  serviceType: StaffServiceType | null;
  role: StaffRole | null;

  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type StaffPaginator = {
  data: StaffProfile[];

  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;

  from: number | null;
  to: number | null;
};

export type RegisterStaffValues = {
  phone_number: string;

  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;

  birth_date: string;
  birth_place: string;

  address: string;
  gender: StaffGender;

  nationality?: StaffNationality | null;

  photo_url?: File | null;
  email?: string | null;

  degree?: StaffDegree | null;
  specialization?: string | null;
  university?: string | null;
  graduation_year?: number | null;

  hire_date: string;
  experience_years?: number | null;

  password?: string | null;
  service_type?: StaffServiceType | null;
};

export type UpdateStaffPersonalValues = {
  phone_number?: string;

  first_name?: string;
  last_name?: string;
  father_name?: string;
  mother_name?: string;

  birth_date?: string;
  birth_place?: string;

  address?: string;
  gender?: StaffGender;

  nationality?: StaffNationality | null;

  photo_url?: File | null;
  email?: string | null;
};

export type UpdateStaffEmploymentValues = {
  degree?: StaffDegree | null;
  specialization?: string | null;
  university?: string | null;

  graduation_year?: number | null;
  hire_date?: string;
  experience_years?: number | null;

  service_type?: StaffServiceType | null;
};

export type StaffSectionConfig = {
  role: StaffRole;

  title: string;
  singularLabel: string;
  pluralLabel: string;

  listPath: string;
  createPath: string;
};