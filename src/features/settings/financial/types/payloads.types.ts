 import type { ExtraServiceType } from "./extraService.types";

// =====================================
// Extra Services
// =====================================

export type CreateExtraServicePayload = {
  type: ExtraServiceType;

  name: string;

  amount: number;
};

export type UpdateExtraServicePayload = {
  type?: ExtraServiceType;

  name?: string;

  amount?: number;
};

// =====================================
// Fee Plans
// =====================================

export type CreateFeePlanPayload = {

  academicYearId: number;

  gradeLevelId: number;
  
  
  name: string;
  
  baseAmount: number;
  
  extraServices: CreateExtraServicePayload[];
};

export type UpdateFeePlanPayload = {
 
  academicYearId?: number;
 
  gradeLevelId?: number;
 
 
  name?: string;
 
  baseAmount?: number;
 
  extraServices?: UpdateExtraServicePayload[];
};

// =====================================
// Installment Policies
// =====================================

export type InstallmentPolicyItemPayload = {
  title: string;

  percentage: number;

  dueMonth: number;

  dueDay: number;
};

export type CreateInstallmentPolicyPayload = {
  name: string;

  items: InstallmentPolicyItemPayload[];
};

export type UpdateInstallmentPolicyPayload = {
  name?: string;

  items?: InstallmentPolicyItemPayload[];
};