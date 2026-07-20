import type {
  ApiId,
  PaginatedData,
} from "../../shared/types/api.types";

export type EntityId = ApiId;

export type Gender = "male" | "female";

export type Nationality =
  | "syrian"
  | "lebanese"
  | "palestinian"
  | "jordanian"
  | "other";

export type AccountStatus = "enabled" | "disabled";

export type RecordStatus = "active" | "inactive";

export type EnrollmentStatus =
  | "pending"
  | "enrolled"
  | "suspended"
  | "withdrawn";

export type SortDirection = "asc" | "desc";

export type StudentApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type Nullable<T> = T | null;

export type SelectOption = {
  id: EntityId;
  name: string;
};

export type PersonProfile = {
  id: EntityId;
  userId: EntityId;

  firstName?: string;
  lastName?: string;
  fullName: string;

  fatherName: string;
  motherName: string;

  birthDate: string;
  birthPlace: string;

  address: string;

  gender: Gender;
  nationality: Nationality | null;

  phoneNumber: string;
  photoUrl: string | null;

  accountStatus: AccountStatus;
  recordStatus: RecordStatus;
};

export type StudentUser = PersonProfile & {
  role?: "student";
};

export type StudentEnrollment = {
  id: EntityId;
  studentId: EntityId;

  academicYearId: EntityId;
  gradeId: EntityId;
  classroomId: EntityId | null;

  enrollmentStatus: EnrollmentStatus;

  enrollmentDate: string | null;
  completedAt: string | null;

  isDeleted?: boolean;
  deletedAt?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
};

export type StudentProfile = {
  student: PersonProfile;
  guardian: PersonProfile | null;
  enrollment?: StudentEnrollment | null;
};

export type StudentFullProfile = {
  student: PersonProfile;
  guardian: PersonProfile | null;
  enrollment: StudentEnrollment;
};

export type StudentGradeSummary = {
  id: EntityId;
  name: string;
  level: number | null;
};

export type StudentClassroomSummary = {
  id: EntityId;
  name: string;
};

export type StudentAcademicYearSummary = {
  id: EntityId;
  name: string;
};

export type StudentListItem = {
  studentId: EntityId;
  userId: EntityId;

  guardianId: EntityId | null;
  enrollmentId: EntityId;

  fullName: string;

  phoneNumber?: string | null;
  photoUrl?: string | null;

  grade: StudentGradeSummary | null;
  classroom: StudentClassroomSummary | null;
  academicYear?: StudentAcademicYearSummary | null;

  status: EnrollmentStatus;
  accountStatus?: AccountStatus;
  recordStatus?: RecordStatus;
};

export type StudentFilters = {
  page?: number;
  per_page?: number;

  level?: number;
  name_classroom?: string;
  status?: EnrollmentStatus;

  search?: string;
  sort?: SortDirection;
};

export type StudentListFilters = StudentFilters;

export type StudentListResponse = PaginatedData<StudentListItem>;

export type StudentPersonalFormValues = {
  first_name: string;
  last_name: string;

  father_name: string;
  mother_name: string;

  birth_date: string;
  birth_place: string;

  address: string;
  phone_number: string;

  gender: Gender;
  nationality: Nationality | "";

  photo_url?: File | null;
};

export type GuardianPersonalFormValues = {
  first_name: string;
  last_name: string;

  father_name: string;
  mother_name: string;

  birth_date: string;
  birth_place: string;

  address: string;
  phone_number: string;

  gender: Gender;
  nationality: Nationality | "";

  photo_url?: File | null;

  token_fcm?: string;
};

export type EnrollmentFormValues = {
  academic_year_id: EntityId | "";
  grade_level_id: EntityId | "";
  class_room_id: EntityId | "";
};

export type RegisterStudentFormValues = {
  guardian: GuardianPersonalFormValues;
  student: StudentPersonalFormValues;
  enrollment: EnrollmentFormValues;
};

export type RegisterStudentPayload = RegisterStudentFormValues;

export type UpdateStudentPersonalPayload = Partial<
  Omit<StudentPersonalFormValues, "photo_url">
> & {
  photo_url?: File | null;
};

export type UpdateGuardianPersonalPayload = Partial<
  Omit<GuardianPersonalFormValues, "photo_url">
> & {
  photo_url?: File | null;
};

export type UpdateEnrollmentPayload = {
  academic_year_id?: EntityId;
  grade_level_id?: EntityId;
  class_room_id?: EntityId | null;
  enrollment_status?: EnrollmentStatus;
};

export type UpdateStudentEnrollmentPayload = UpdateEnrollmentPayload;

export type StudentImportFile = {
  file: File;
};

export type StudentImportRowError = {
  row: number;
  field?: string;
  message: string;
};

export type ImportBatchStatusValue =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ImportBatchStatus = {
  batch_id?: EntityId;
  status: ImportBatchStatusValue;

  successful_rows?: number;
  failed_rows?: number;
  total_rows?: number;

  errors?: StudentImportRowError[];
};

export type StudentImportResult = {
  batchId?: EntityId;
  status: ImportBatchStatusValue;

  successfulRows: number;
  failedRows: number;
  totalRows: number;

  errors: StudentImportRowError[];
};

export type ToggleStudentAccountResponse = {
  accountStatus: AccountStatus;
};

export type DeleteStudentResponse = {
  enrollmentId: EntityId;
  deleted: boolean;
};