import type { BaseUser } from "../../shared/types/base-user.types";

export type ParentRelation = "father" | "mother" | "guardian" | "other";

export type ParentUser = BaseUser & {
  category: "parent";
};