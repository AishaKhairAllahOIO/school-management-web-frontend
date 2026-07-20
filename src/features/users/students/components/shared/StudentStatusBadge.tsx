import type {
  AccountStatus,
  EnrollmentStatus,
} from "../../types/student.types";

type StudentStatus =
  | EnrollmentStatus
  | AccountStatus
  | string
  | null
  | undefined;

type StudentStatusBadgeProps = {
  status: StudentStatus;
};

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  enrolled: {
    label: "مسجل",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },

  active: {
    label: "نشط",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },

  enabled: {
    label: "مفعّل",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },

  pending: {
    label: "قيد الانتظار",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200",
  },

  suspended: {
    label: "موقوف",
    className:
      "bg-rose-50 text-rose-700 ring-rose-200",
  },

  disabled: {
    label: "معطّل",
    className:
      "bg-rose-50 text-rose-700 ring-rose-200",
  },

  inactive: {
    label: "غير نشط",
    className:
      "bg-slate-100 text-slate-600 ring-slate-200",
  },

  withdrawn: {
    label: "منسحب",
    className:
      "bg-slate-100 text-slate-600 ring-slate-200",
  },

  completed: {
    label: "مكتمل",
    className:
      "bg-blue-50 text-blue-700 ring-blue-200",
  },
};

export function StudentStatusBadge({
  status,
}: StudentStatusBadgeProps) {
  const key = status ?? "unknown";

  const config = statusConfig[key] ?? {
    label: String(status ?? "غير محدد"),
    className:
      "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1",
        "text-xs font-semibold ring-1 ring-inset",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}