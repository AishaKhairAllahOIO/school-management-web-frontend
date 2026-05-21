import type { BaseUser } from "../../shared/types/base-user.types";

export type ParentUser = BaseUser & {
  category: "parent";

  parentCode: string;

  occupation?: string | null;
};