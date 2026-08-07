import type {
  ApiId,
  PaginatedData,
} from "../../shared/types/api.types";

export type UserGender = "male" | "female" | "";

export type UserNationality =  "syrian" | "lebanese" | "palestinian" | "jordanian" | "other" | "";

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
  | "suspended"
  | "withdrawn"
  | "confirmed";

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

  nationalId?: string | null;
  email?: string | null;

  address: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;

  accountStatus: AccountStatus;
  recordStatus: RecordStatus;
};

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
  isDeleted?: boolean;
  deletedAt?: string | null;
};

export type StudentListFilters = {
  page?: number;
  per_page?: number;

  search?: string;
  grade_level_id?: ApiId;
  class_room_id?: ApiId;
  status?: EnrollmentStatus;

  sort?: "asc" | "desc";
};

export type StudentListResponse =
  PaginatedData<StudentListItem>;

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

  photo_url?: File | null;
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

  national_id?: string;
  email?: string;

  address: string;
  phone_number: string;

  photo_url?: File | null;
  token_fcm?: string | null;
};

export type StudentEnrollmentPayload = {
  academic_year_id: ApiId;
  grade_level_id: ApiId;
  class_room_id: ApiId;
};

export type RegisterStudentPayload = {
  student: StudentPersonalPayload;
  guardian: GuardianPersonalPayload;
  enrollment: StudentEnrollmentPayload;
};
export type UpdateGuardianPersonalPayload =
  Partial<GuardianPersonalPayload>;

export type UpdateStudentEnrollmentPayload = {
  academic_year_id?: ApiId;
  grade_level_id?: ApiId;
  class_room_id?: ApiId | null;
  enrollment_status?: EnrollmentStatus;
};


export type UpdateStudentPersonalPayload =
  Partial<StudentPersonalPayload> & {
    guardian_first_name?: string;
    guardian_last_name?: string;

    guardian_father_name?: string;
    guardian_mother_name?: string;

    guardian_birth_date?: string;
    guardian_birth_place?: string;

    guardian_gender?: UserGender;
    guardian_nationality?: UserNationality;

    guardian_national_id?: string;
    guardian_email?: string;

    guardian_address?: string;
    guardian_phone_number?: string;

    guardian_photo_url?: File | null;
    guardian_token_fcm?: string | null;

    academic_year_id?: ApiId;
    grade_level_id?: ApiId;
    class_room_id?: ApiId | null;
    enrollment_status?: EnrollmentStatus;
  };

export type StudentSearchParams = {
  q: string;
  page?: number;
  per_page?: number;
};

export type ToggleStudentAccountResponse = {
  enrollmentId?: ApiId;
  accountStatus?: AccountStatus;
  status?: AccountStatus;
};

export type DeleteStudentResponse = {
  id?: ApiId;
};

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