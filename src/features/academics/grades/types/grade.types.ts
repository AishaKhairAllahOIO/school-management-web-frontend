export type Grade = {
  id: string;
  name: string;
  code: string;
  order: number;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateGradePayload = {
  name: string;
  code: string;
  order: number;
  description?: string | null;
  isActive: boolean;
};

export type UpdateGradePayload = Partial<CreateGradePayload>;