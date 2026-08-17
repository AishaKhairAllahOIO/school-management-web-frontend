import type { ReactNode } from "react";
import {
  Edit2,
  Eye,
  GraduationCap,
  WalletCards,
  ChevronRight,
} from "lucide-react";

import type { FinancialAccount } from "../../types/finance.types";

type StudentDisplay = {
  fullName: string;
  academicYearName?: string | null;
};

type Props = {
  accounts: FinancialAccount[];
  headerAction?: ReactNode;
  studentsById?: Map<string, StudentDisplay>;
  onViewDetails?: (account: FinancialAccount) => void;
  onEdit?: (account: FinancialAccount) => void;
};

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "fully_paid"
      ? "border-success/18 bg-success/[0.085] text-success"
      : status === "partially_paid"
        ? "border-warning/20 bg-warning/[0.09] text-warning"
        : "border-destructive/18 bg-destructive/[0.075] text-destructive";

  const label =
    status === "fully_paid"
      ? "Fully paid"
      : status === "partially_paid"
        ? "Partially paid"
        : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={[
        "inline-flex items-center",
        "rounded-full",
        "border",
        "px-2.5 py-1",
        "text-[10.5px] font-semibold",
        tone,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export function ContractsTable({
  accounts,
  headerAction,
  studentsById = new Map(),
  onViewDetails,
  onEdit,
}: Props) {
  if (!accounts.length) {
    return (
      <div
        className={[
          "relative",
          "rounded-[24px]",
          "border border-dashed border-border/55",
          "bg-card",
          "px-6 py-16",
          "text-center",
          "shadow-[0_10px_30px_rgba(31,22,73,0.035)]",
        ].join(" ")}
      >
        {headerAction ? (
          <div className="absolute end-4 top-4">
            {headerAction}
          </div>
        ) : null}

        <span
          className={[
            "mx-auto flex size-12",
            "items-center justify-center",
            "rounded-[16px]",
            "bg-primary/[0.07]",
            "text-primary",
          ].join(" ")}
        >
          <WalletCards
            className="size-5"
            strokeWidth={1.8}
          />
        </span>

        <h3 className="mt-4 text-[15px] font-semibold text-foreground/88">
          No student contracts yet
        </h3>

        <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-5 text-muted-foreground/78">
          Create the first contract to establish a
          student payment schedule.
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        "overflow-hidden",
        "rounded-[24px]",
        "border border-border/45",
        "bg-card",
        "shadow-[0_12px_34px_rgba(31,22,73,0.045)]",
      ].join(" ")}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className={[
          "flex items-center justify-between gap-4",
          "border-b border-border/50",
          "px-5 py-4",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={[
              "flex size-10 shrink-0",
              "items-center justify-center",
              "rounded-xl",
              "bg-primary/[0.08]",
              "text-primary",
            ].join(" ")}
          >
            <GraduationCap
              className="size-4"
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground">
              Student Contracts
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Financial accounts and payment progress.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "hidden items-center gap-1.5",
              "rounded-full",
              "bg-primary/[0.07]",
              "px-3 py-1.5",
              "text-xs font-semibold",
              "text-primary",
              "sm:inline-flex",
            ].join(" ")}
          >
            <WalletCards className="size-3.5" />
            {accounts.length}
          </span>

          {headerAction}
        </div>
      </div>

      {/* =====================================================
          STUDENT CARDS
      ====================================================== */}
      <div className="divide-y divide-border/40">
        {accounts.map((account) => {
          const student = studentsById.get(
            String(account.studentId),
          );

          const total = Number(
            account.totalRequiredAmount ?? 0,
          );

          const remaining = Number(
            account.remainingBalance ?? 0,
          );

          const paid = Math.max(
            0,
            total - remaining,
          );

          const progress = total
            ? Math.min(
                100,
                Math.round((paid / total) * 100),
              )
            : 0;

          return (
            <StudentContractCard
              key={account.id}
              account={account}
              student={student}
              progress={progress}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   STUDENT CONTRACT CARD
============================================================ */

function StudentContractCard({
  account,
  student,
  progress,
  onViewDetails,
  onEdit,
}: {
  account: FinancialAccount;
  student?: StudentDisplay;
  progress: number;
  onViewDetails?: (account: FinancialAccount) => void;
  onEdit?: (account: FinancialAccount) => void;
}) {
  return (
    <div
      className={[
        "group",
        "px-5 py-4",
        "transition-colors duration-200",
        "hover:bg-primary/[0.018]",
      ].join(" ")}
    >
      {/* ===================================================
          TOP
      ==================================================== */}
      <div className="flex items-start gap-4">
        {/* Student avatar */}
        <div
          className={[
            "flex size-12 shrink-0",
            "items-center justify-center",
            "rounded-[16px]",
            "border border-primary/12",
            "bg-primary/[0.06]",
            "text-primary",
          ].join(" ")}
        >
          <GraduationCap
            className="size-5"
            strokeWidth={1.75}
          />
        </div>

        {/* Student information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground/90">
              {student?.fullName ??
                "Student unavailable"}
            </h3>

            <StatusBadge
              status={account.paymentStatus}
            />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-xs text-muted-foreground/75">
              {student?.academicYearName ||
                "Academic year unavailable"}
            </span>

            <span className="text-xs text-muted-foreground/60">
              ID #{String(account.studentId)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {onViewDetails ? (
            <button
              type="button"
              onClick={() =>
                onViewDetails(account)
              }
              className={[
                "inline-flex size-9",
                "items-center justify-center",
                "rounded-xl",
                "border border-primary/15",
                "bg-primary/[0.055]",
                "text-primary",
                "transition-all duration-200",
                "hover:-translate-y-0.5",
                "hover:bg-primary/[0.09]",
              ].join(" ")}
              aria-label="Open student financial profile"
            >
              <Eye
                className="size-4"
                strokeWidth={1.8}
              />
            </button>
          ) : null}

          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(account)}
              className={[
                "inline-flex size-9",
                "items-center justify-center",
                "rounded-xl",
                "border border-border/50",
                "bg-card",
                "text-muted-foreground",
                "transition-all duration-200",
                "hover:-translate-y-0.5",
                "hover:border-primary/20",
                "hover:bg-primary/[0.045]",
                "hover:text-primary",
              ].join(" ")}
              aria-label="Edit contract"
            >
              <Edit2
                className="size-4"
                strokeWidth={1.8}
              />
            </button>
          ) : null}
        </div>
      </div>

      {/* ===================================================
          FINANCIAL DETAILS
      ==================================================== */}
      <div
        className={[
          "mt-4",
          "grid gap-3",
          "sm:grid-cols-3",
        ].join(" ")}
      >
        {/* Fee plan */}
        <div
          className={[
            "rounded-[16px]",
            "border border-border/40",
            "bg-muted/[0.18]",
            "px-3.5 py-3",
          ].join(" ")}
        >
          <p className="text-[10.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/65">
            Fee plan
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-foreground/80">
            {account.feePlan?.name || "—"}
          </p>

          <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground/60">
            {account.installmentPolicy?.name ||
              "Payment schedule"}
          </p>
        </div>

        {/* Total */}
        <div
          className={[
            "rounded-[16px]",
            "border border-border/40",
            "bg-muted/[0.18]",
            "px-3.5 py-3",
          ].join(" ")}
        >
          <p className="text-[10.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/65">
            Total required
          </p>

          <p className="mt-1 text-sm font-bold text-foreground/85">
            {account.totalRequiredAmount?.toLocaleString()}{" "}
            $
          </p>

          <p className="mt-0.5 text-[10.5px] text-muted-foreground/60">
            Contract amount
          </p>
        </div>

        {/* Remaining */}
        <div
          className={[
            "rounded-[16px]",
            "border border-primary/10",
            "bg-primary/[0.035]",
            "px-3.5 py-3",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground/65">
              Remaining
            </p>

            <span className="text-[10px] font-semibold text-primary">
              {progress}%
            </span>
          </div>

          <p className="mt-1 text-sm font-bold text-primary">
            {account.remainingBalance?.toLocaleString()}{" "}
            $
          </p>

          {/* Progress */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full rounded-full bg-primary/70 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ===================================================
          BOTTOM META
      ==================================================== */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-1.5 shrink-0 rounded-full bg-success" />

          <span className="truncate text-[10.5px] text-muted-foreground/65">
            Paid:{" "}
            {Math.max(
              0,
              Number(
                account.totalRequiredAmount ?? 0,
              ) -
                Number(
                  account.remainingBalance ?? 0,
                ),
            ).toLocaleString()}{" "}
            $
          </span>
        </div>

        <span
          className={[
            "flex shrink-0 items-center gap-1",
            "text-[10.5px] font-medium",
            "text-muted-foreground/60",
            "transition-colors",
            "group-hover:text-primary",
          ].join(" ")}
        >
          View profile
          <ChevronRight
            className="size-3.5 rtl:rotate-180"
          />
        </span>
      </div>
    </div>
  );
}