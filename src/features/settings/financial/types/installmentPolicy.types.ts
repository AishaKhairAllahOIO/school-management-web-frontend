import type { InstallmentPolicyItem } from "./installmentItem.types";

export type InstallmentPolicy = {
  id: number;

  name: string;

  installmentsCount: number;

  createdAt: string;

  updatedAt: string;

  items: InstallmentPolicyItem[];
};