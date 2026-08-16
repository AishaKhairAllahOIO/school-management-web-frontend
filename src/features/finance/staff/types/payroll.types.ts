export type ApiId = string | number;

export type SalaryType =
  | "per_period"
  | "fixed_monthly";

export interface StaffSummary {
  id: ApiId;
  name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  user?: {
    id?: ApiId;
    name?: string;
    email?: string;
    photo_url?: string | null;
  };
}

export interface AcademicYearSummary {
  id: ApiId;
  name?: string;
}

export interface StaffFinancialContract {
  id: ApiId;
  staff_id: ApiId;
  academic_year: ApiId;
  salary_type: SalaryType;
  salary_amount: number;
  created_at?: string | null;

  staff?: StaffSummary;
  academicYear?: AcademicYearSummary;
}

export interface CreateContractPayload {
  staff_id: ApiId;
  academic_year_id: ApiId;
  salary_type: SalaryType;
  salary_amount: number;
}

export interface UpdateContractPayload {
  staff_id?: ApiId;
  academic_year_id?: ApiId;
  salary_type?: SalaryType;
  salary_amount?: number;
}

export interface PayrollPreviewPayload {
  staff_id: ApiId;
  year: number;
  month: number;
}

export interface PayrollPreview {
  staff_id: ApiId;
  contract_id: ApiId;
  year: number;
  month: number;
  salary_type: SalaryType;
  contract_rate: number;
  expected_units: number;
  missed_units: number;
  deductions: number;
  net_salary: number;
}

export interface CommitPayrollPayload {
  staff_id: ApiId;
  year: number;
  month: number;
  payment_date?: string;
}

export interface Payroll {
  id: ApiId;
  staff_id: ApiId;
  contract_id: ApiId;
  salary_type?: SalaryType;
  year: number;
  month: number;
  payment_date?: string | null;
  net_salary: number;
  created_at?: string | null;

  staff?: StaffSummary;
  contract?: StaffFinancialContract;
}

export interface UpdatePayrollPayload {
  payment_date: string;
}