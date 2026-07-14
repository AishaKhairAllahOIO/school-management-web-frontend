export type ExtraServiceType =
  | "uniform"
  | "books"
  | "activities"
  | "insurance"
  | "other";

export type ExtraService = {
  id: number;

  type: ExtraServiceType;

  name: string;

  amount: number;

  createdAt: string;

  updatedAt: string;
};