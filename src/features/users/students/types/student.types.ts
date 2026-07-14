import type { BaseUser } from "@/features/users/shared/types/base-user.types";

export type StudentUser = BaseUser & {
  category: "student";

  parentId: string;
};

export type StudentFormData = Omit<
  StudentUser,
  | "id"
  | "category"
  | "recordStatus"
  | "accountStatus"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;