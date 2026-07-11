export type Classroom = {
  id: string;

  academicYearId: string;
  gradeId: string;

  name: string;
  capacity: number;

  currentStudentsCount: number;
  availableSeats: number;

  createdAt: string;
  updatedAt: string;
};

export type CreateClassroomPayload = {
  academicYearId: number;
  gradeId: number;
  capacity: number;
};

export type UpdateClassroomPayload = {
  capacity?: number;
};

export type CreateClassroomApiPayload = {
  academicYearId: number;
  grade_level_id: number;
  capacity: number;
};

export type UpdateClassroomApiPayload = {
  capacity?: number;
};