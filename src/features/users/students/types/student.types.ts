import type { ApiId, PaginatedData } from "../../shared/types/api.types";

export type Gender = "male" | "female";
export type Nationality = "syrian" | string;
export type AccountStatus = "enabled" | "disabled";
export type RecordStatus = "active" | "inactive";
export type EnrollmentStatus = "pending" | "enrolled" | "suspended" | "withdrawn";

export type PersonProfile = {
  id: ApiId;
  userId: ApiId;
  fullName: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  gender: Gender;
  nationality: Nationality;
  phoneNumber: string;
  photoUrl: string | null;
  accountStatus: AccountStatus;
  recordStatus: RecordStatus;
};

export type StudentEnrollment = {
  id: ApiId;
  studentId: ApiId;
  academicYearId: ApiId;
  gradeId: ApiId;
  classroomId: ApiId | null;
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate: string;
  completedAt: string | null;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type StudentProfile = {
  student: PersonProfile;
  guardian: PersonProfile;
  enrollment?: StudentEnrollment;
};

export type StudentListItem = {
  studentId: ApiId;
  userId: ApiId;
  guardianId: ApiId;
  enrollmentId: ApiId;
  fullName: string;
  grade: { id: ApiId; name: string; level: number } | null;
  classroom: { id: ApiId; name: string } | null;
  status: EnrollmentStatus;
};

export type StudentFilters = {
  page?: number;
  level?: number;
  name_classroom?: string;
  status?: EnrollmentStatus;
  sort?: "asc" | "desc";
};

export type StudentListResponse = PaginatedData<StudentListItem>;

export type StudentPersonalFormValues = {
  phone_number: string;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  birth_date: string;
  birth_place: string;
  address: string;
  gender: Gender;
  nationality: Nationality;
  url_photo?: File | null;
};

export type GuardianPersonalFormValues = StudentPersonalFormValues & {
  token_fcm?: string;
};

export type EnrollmentFormValues = {
  academic_year_id: ApiId;
  grade_level_id: ApiId;
  class_room_id?: ApiId | null;
};

export type RegisterStudentFormValues = {
  student: StudentPersonalFormValues;
  guardian: GuardianPersonalFormValues;
  enrollment: EnrollmentFormValues;
};

export type UpdateEnrollmentPayload = {
  grade_level_id?: ApiId;
  class_room_id?: ApiId | null;
  enrollment_status?: EnrollmentStatus;
};

export type ImportBatchStatus = {
  batch_id?: ApiId;
  status: "pending" | "processing" | "completed" | "failed";
  successful_rows?: number;
  failed_rows?: number;
  total_rows?: number;
};
