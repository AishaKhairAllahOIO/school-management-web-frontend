export type ExtraServiceType =
  | "uniform"
  | "books"
  | "activities"
  | "insurance"
  | "other";

export type ExtraService = {
  id: number;

  feePlanId?: number;

  type: ExtraServiceType;

  name: string;

  amount: number;

  createdAt: string;

  updatedAt: string;
};