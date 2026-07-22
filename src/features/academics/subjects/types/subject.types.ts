export type Subject = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SubjectApiItem = {
  id: string | number;

  name?: string;
  subjectName?: string;
  subject_name?: string;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
};

export type CreateSubjectPayload = {
  name: string;
};

export type UpdateSubjectPayload =
  Partial<CreateSubjectPayload>;