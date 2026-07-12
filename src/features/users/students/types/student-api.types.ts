export type StudentGender = "male" | "female";

export type StudentPersonRequest = {
  phone_number: string;

  first_name: string;
  last_name: string;

  father_name: string;
  mother_name: string;

  birth_date: string;
  birth_place: string;

  address: string;

  gender: StudentGender;
  nationality: string;

  photo_url: string;
};

export type StudentRegistrationEnrollmentRequest = {
  academic_year_id: number;
  grade_level_id: number;
  class_room_id: number;
};

export type RegisterStudentPayload = {
  guardian: StudentPersonRequest;
  student: StudentPersonRequest;
  enrollment: StudentRegistrationEnrollmentRequest;
};

export type StudentPerson = {
  id: number;
  userId: number;

  fullName: string;

  fatherName: string;
  motherName: string;

  birthDate: string;
  birthPlace: string;

  address: string;

  gender: string;
  nationality: string;

  phoneNumber: string;
  photoUrl: string;

  accountStatus: string;
  recordStatus: string;
};

export type StudentEnrollment = {
  id: string;

  studentId: string;
  academicYearId: string;

  gradeId: string;
  classroomId: string;

  enrollmentStatus: string;

  enrollmentDate: string | null;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type RegisterStudentResponse = {
  student: StudentPerson;
  guardian: StudentPerson;
  enrollment: StudentEnrollment;
};

export type StudentListRelation = {
  id: string;
  name: string;
};

export type StudentListItem = {
  studentId: number;
  userId: number;
  guardianId: number;

  enrollmentId: string;

  fullName: string;

  grade: StudentListRelation | null;
  classroom: StudentListRelation | null;
};

export type StudentListFilters = {
  search?: string;

  gradeLevelId?: number;
  classroomId?: number;

  sort?: "asc" | "desc";
  perPage?: number;
};

export type StudentDetailsResponse = {
  student: StudentPerson;
  guardian: StudentPerson;
};

export type StudentFullProfileResponse = {
  student: StudentPerson;
  guardian: StudentPerson;
  enrollment: StudentEnrollment;
};

export type UpdateStudentPersonalPayload = {
  first_name?: string;
  last_name?: string;

  father_name?: string;
  mother_name?: string;

  birth_date?: string;
  birth_place?: string;

  address?: string;

  gender?: string;
  nationality?: string;

  phone_number?: string;
  photo_url?: string;
};

export type UpdateGuardianPersonalPayload = {
  first_name?: string;
  last_name?: string;

  phone_number?: string;
  address?: string;
};

export type UpdateStudentEnrollmentPayload = {
  class_room_id?: number;
  grade_level_id?: number;
  enrollment_status?: string;
};

export type StudentImportResponse = {
  batch_id: number;
};

export type StudentImportStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type StudentImportBatchStatus = {
  batch_id: number;
  file_name: string;

  status: StudentImportStatus;

  total_rows: number;
  processed_rows: number;

  successful_rows: number;
  failed_rows: number;

  has_errors: boolean;
};

export type ToggleStudentStatusResponse = {
  record_status: string;
};