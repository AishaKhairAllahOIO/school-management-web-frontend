import type {
  ApiId,
  PaginatedData,
} from "../../shared/types/api.types";

/*
|--------------------------------------------------------------------------
| Common enums
|--------------------------------------------------------------------------
*/

export type UserGender = "male" | "female";

export type UserNationality = "syrian" | string;

export type AccountStatus =
  | "enabled"
  | "disabled"
  | "active"
  | "inactive";

export type RecordStatus =
  | "active"
  | "inactive"
  | "deleted";

export type EnrollmentStatus =
  | "pending"
  | "enrolled"
  | "suspended"
  | "withdrawn"
  | "completed";

/*
|--------------------------------------------------------------------------
| Shared API models
|--------------------------------------------------------------------------
*/

export type NamedEntity = {
  id: ApiId;
  name: string;
};

export type GradeReference = NamedEntity & {
  level?: number | null;
};

export type ClassroomReference = NamedEntity;

export type AcademicYearReference = NamedEntity & {
  startDate?: string | null;
  endDate?: string | null;
};

export type PersonProfile = {
  id: ApiId;
  userId: ApiId;

  firstName?: string;
  lastName?: string;
  fullName: string;

  fatherName: string | null;
  motherName: string | null;

  birthDate: string | null;
  birthPlace: string | null;

  gender: UserGender | null;
  nationality: UserNationality | null;

  address: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;

  accountStatus: AccountStatus;
  recordStatus: RecordStatus;
};

/*
|--------------------------------------------------------------------------
| Student list
|--------------------------------------------------------------------------
*/

export type StudentListItem = {
  studentId: ApiId;
  userId: ApiId;
  guardianId: ApiId | null;
  enrollmentId: ApiId;

  fullName: string;

  grade: GradeReference | null;
  classroom: ClassroomReference | null;

  status: EnrollmentStatus;

  photoUrl?: string | null;
  phoneNumber?: string | null;
  accountStatus?: AccountStatus;
};

export type StudentListFilters = {
  page?: number;
  per_page?: number;

  level?: number | ApiId;
  grade_level_id?: ApiId;
  class_room_id?: ApiId;

  name_classroom?: string;
  status?: EnrollmentStatus;

  sort?: "asc" | "desc";
};

export type StudentListResponse =
  PaginatedData<StudentListItem>;

/*
|--------------------------------------------------------------------------
| Student profile
|--------------------------------------------------------------------------
*/

export type StudentEnrollment = {
  id: ApiId;
  studentId: ApiId;

  academicYearId: ApiId;
  gradeId: ApiId;
  classroomId: ApiId | null;

  academicYear?: AcademicYearReference | null;
  grade?: GradeReference | null;
  classroom?: ClassroomReference | null;

  enrollmentStatus: EnrollmentStatus;
  enrollmentDate: string | null;

  completedAt: string | null;

  isDeleted?: boolean;
  deletedAt?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
};

export type StudentDetails = {
  student: PersonProfile;
  guardian: PersonProfile | null;
};

export type StudentFullProfile = {
  student: PersonProfile;
  guardian: PersonProfile | null;
  enrollment: StudentEnrollment;
};

/*
|--------------------------------------------------------------------------
| Register student
|--------------------------------------------------------------------------
*/

export type StudentPersonalPayload = {
  first_name: string;
  last_name: string;

  father_name: string;
  mother_name: string;

  birth_date: string;
  birth_place: string;

  gender: UserGender;
  nationality: UserNationality;

  address: string;
  phone_number: string;

  url_photo?: File | null;
};

export type GuardianPersonalPayload = {
  first_name: string;
  last_name: string;

  father_name: string;
  mother_name: string;

  birth_date: string;
  birth_place: string;

  gender: UserGender;
  nationality: UserNationality;

  address: string;
  phone_number: string;

  url_photo?: File | null;
  token_fcm?: string | null;
};

export type StudentEnrollmentPayload = {
  academic_year_id: ApiId;
  grade_level_id: ApiId;
  class_room_id?: ApiId | null;
};

export type RegisterStudentPayload = {
  student: StudentPersonalPayload;
  guardian: GuardianPersonalPayload;
  enrollment: StudentEnrollmentPayload;
};

/*
|--------------------------------------------------------------------------
| Update student
|--------------------------------------------------------------------------
*/

export type UpdateStudentPersonalPayload =
  Partial<StudentPersonalPayload>;

export type UpdateGuardianPersonalPayload =
  Partial<GuardianPersonalPayload>;

export type UpdateStudentEnrollmentPayload = {
  academic_year_id?: ApiId;
  grade_level_id?: ApiId;
  class_room_id?: ApiId | null;
  enrollment_status?: EnrollmentStatus;
};

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

export type StudentSearchParams = {
  q: string;
  page?: number;
  per_page?: number;
};

/*
|--------------------------------------------------------------------------
| Mutations responses
|--------------------------------------------------------------------------
*/

export type ToggleStudentAccountResponse = {
  enrollmentId?: ApiId;
  accountStatus?: AccountStatus;
  status?: AccountStatus;
};

export type DeleteStudentResponse = {
  id?: ApiId;
};

/*
|--------------------------------------------------------------------------
| Student import
|--------------------------------------------------------------------------
*/

export type StudentImportBatchStatusValue =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type StudentImportStartResponse = {
  batchId?: ApiId;
  batch_id?: ApiId;

  status: StudentImportBatchStatusValue;

  totalRows?: number;
  total_rows?: number;
};

export type StudentImportBatchStatus = {
  batchId?: ApiId;
  batch_id?: ApiId;

  status: StudentImportBatchStatusValue;

  successfulRows?: number;
  successful_rows?: number;

  failedRows?: number;
  failed_rows?: number;

  totalRows?: number;
  total_rows?: number;

  processedRows?: number;
  processed_rows?: number;

  message?: string | null;
};

export type StudentImportHistoryItem = {
  id: ApiId;
  status: StudentImportBatchStatusValue;

  fileName?: string | null;
  file_name?: string | null;

  successfulRows?: number;
  successful_rows?: number;

  failedRows?: number;
  failed_rows?: number;

  totalRows?: number;
  total_rows?: number;

  createdAt?: string | null;
  created_at?: string | null;
};

export type StudentImportHistoryResponse =
  PaginatedData<StudentImportHistoryItem>;