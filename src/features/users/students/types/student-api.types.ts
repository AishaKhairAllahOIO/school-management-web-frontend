import type {
  AccountStatus,
  RecordStatus,
  UserGender,
  UserNationality,
} from "@/features/users/shared/types/user.enums";

export type EntityId = string | number;

export type EnrollmentStatus =
  | "pending"
  | "enrolled"
  | "suspended";

export type StudentSortDirection = "asc" | "desc";

export type ImportBatchStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ApiPerson = {
  id: EntityId;
  userId: EntityId;
  fullName: string;
  fatherName?: string;
  motherName?: string;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  gender?: UserGender;
  nationality?: UserNationality;
  phoneNumber: string;
  photoUrl?: string | null;
  accountStatus?: AccountStatus;
  recordStatus?: RecordStatus;
};

export type ApiEnrollment = {
  id: EntityId;
  studentId: EntityId;
  academicYearId: EntityId;
  gradeId?: EntityId;
  gradeLevelId?: EntityId;
  classroomId?: EntityId;
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate?: string | null;
  completedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type StudentListItem = {
  studentId: EntityId;
  userId: EntityId;
  guardianId: EntityId;
  enrollmentId: EntityId;
  fullName: string;
  grade: {
    id: EntityId;
    name: string;
    level: number;
  } | null;
  classroom: {
    id: EntityId;
    name: string;
  } | null;
  status: EnrollmentStatus;
};

export type StudentPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage?: number;
  total?: number;
};

export type StudentListResult = {
  items: StudentListItem[];
  meta: StudentPaginationMeta;
};

export type StudentFilterApiItem = {
  studentId: EntityId;
  userId: EntityId;
  guardianId: EntityId;
  enrollmentId: EntityId;
  fullName: string;
  grade: {
    id: EntityId;
    name: string;
    level: number;
  } | null;
  classroom: {
    id: EntityId;
    name: string;
  } | null;
  status: EnrollmentStatus;
};

export type StudentFilterApiPayload = {
  data: StudentFilterApiItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page?: number;
    total?: number;
  };
};

export type StudentListFilters = {
  query?: string;
  level?: number;
  classroomName?: string;
  status?: EnrollmentStatus;
  sort?: StudentSortDirection;
  page?: number;
};

export type StudentDetailsResponse = {
  student: ApiPerson;
  guardian: ApiPerson;
};

export type StudentFullProfileResponse = {
  student: ApiPerson;
  guardian: ApiPerson;
  enrollment: ApiEnrollment;
};

export type PersonRegistrationInput = {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  gender: UserGender;
  nationality: UserNationality;
  photo?: File | null;
};

export type RegisterStudentPayload = {
  student: PersonRegistrationInput;
  guardian: PersonRegistrationInput;
  enrollment: {
    academicYearId: EntityId;
    gradeLevelId: EntityId;
    classroomId: EntityId;
  };
};

export type RegisterStudentResponse = {
  student: ApiPerson;
  guardian: ApiPerson;
  enrollment: ApiEnrollment;
};

export type UpdateStudentPersonalPayload =
  Partial<PersonRegistrationInput>;

export type UpdateGuardianPersonalPayload =
  Partial<PersonRegistrationInput>;

export type UpdateStudentEnrollmentPayload = {
  academicYearId?: EntityId;
  gradeLevelId?: EntityId;
  classroomId?: EntityId;
  enrollmentStatus?: EnrollmentStatus;
};

export type ToggleStudentStatusResponse = {
  recordStatus?: AccountStatus;
  record_status?: AccountStatus;
  accountStatus?: AccountStatus;
  account_status?: AccountStatus;
};

export type StudentImportResponse = {
  batchId?: EntityId;
  batch_id?: EntityId;
  id?: EntityId;
};

export type StudentImportBatchStatus = {
  id?: EntityId;
  status: ImportBatchStatus;
  totalRows?: number;
  total_rows?: number;
  successfulRows?: number;
  successful_rows?: number;
  failedRows?: number;
  failed_rows?: number;
  processedRows?: number;
  processed_rows?: number;
};

export type StudentImportHistoryItem = {
  id: EntityId;
  status: ImportBatchStatus;
  fileName?: string;
  file_name?: string;
  totalRows?: number;
  total_rows?: number;
  successfulRows?: number;
  successful_rows?: number;
  failedRows?: number;
  failed_rows?: number;
  createdAt?: string;
  created_at?: string;
};

export type StudentImportHistoryResult = {
  items: StudentImportHistoryItem[];
  meta?: StudentPaginationMeta;
};
