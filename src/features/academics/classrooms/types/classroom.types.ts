export type Classroom = {
  id: string;
  name: string;
  code: string;
  gradeId: string;
  capacity: number;
  roomNumber?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateClassroomPayload = {
  name: string;
  code: string;
  gradeId: string;
  capacity: number;
  roomNumber?: string | null;
  isActive: boolean;
};

export type UpdateClassroomPayload = Partial<CreateClassroomPayload>;