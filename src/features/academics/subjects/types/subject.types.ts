export type Subject = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isCore: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubjectPayload = {
  name: string;
  code: string;
  description?: string | null;
  isCore: boolean;
  isActive: boolean;
};

export type UpdateSubjectPayload = Partial<CreateSubjectPayload>;