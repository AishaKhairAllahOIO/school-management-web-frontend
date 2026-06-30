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
  academicYearId: string;
  gradeId: string;
  capacity: number;
};

export type UpdateClassroomPayload = Partial<CreateClassroomPayload>;
