import type {
  SalaryType,
} from "../types/payroll.types";

export function formatSalary(
  amount: number | string | null | undefined,
) {
  const value = Number(amount ?? 0);

  return new Intl.NumberFormat("ar-SY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getSalaryTypeLabel(
  type?: SalaryType,
) {
  switch (type) {
    case "fixed_monthly":
      return "fixed monthly";

    case "per_period":
      return " per period";

    default:
      return " un defined";
  }
}

export function getMonthName(month: number) {
  return new Intl.DateTimeFormat("ar", {
    month: "long",
  }).format(
    new Date(2024, month - 1, 1),
  );
}

export function getStaffName(staff: any) {
  return (
    staff?.user?.name ??
    staff?.name ??
    staff?.full_name ??
    [
      staff?.first_name,
      staff?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ??
    `staff #${staff?.id ?? ""}`
  );
}