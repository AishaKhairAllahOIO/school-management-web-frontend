import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/shared/ui/button";

import { studentApi } from "../../../users/students/api/student.api";
import { useStudents } from "../../../users/students/hooks/useStudents";
import { studentKeys } from "../../../users/students/hooks/student.keys";
import { useFinanceAccounts } from "../hooks/useFinancialAccounts";
import type { FinancialAccount, PaymentStatus } from "../types/finance.types";
import { FinanceTableSkeleton } from "./FinanceTableSkeleton";

type ContractsSectionProps = {
  studentId?: string | number;
  title?: string;
  description?: string;
  onOpenStudentAccount?: (studentId: string | number) => void;
};

type StatusTab = "all" | PaymentStatus;

type StatusTabConfig = {
  value: StatusTab;
  label: string;
  icon: typeof Users;
  activeClass: string;
  inactiveClass: string;
  iconClass: string;
};

const STATUS_TABS: StatusTabConfig[] = [
  {
    value: "all",
    label: "All",
    icon: Users,
    activeClass: "bg-info text-white shadow-sm",
    inactiveClass:
      "bg-info/[0.08] text-info border border-info/20 hover:bg-info/[0.13]",
    iconClass: "bg-info/[0.12] text-info",
  },
  {
    value: "draft",
    label: "Draft",
    icon: FileText,
    activeClass: "bg-secondary-foreground text-white shadow-sm",
    inactiveClass:
      "bg-secondary/[0.55] text-secondary-foreground border border-border/50 hover:bg-secondary",
    iconClass: "bg-secondary/[0.55] text-secondary-foreground",
  },
  {
    value: "unpaid",
    label: "Unpaid",
    icon: CircleAlert,
    activeClass: "bg-destructive text-white shadow-sm",
    inactiveClass:
      "bg-destructive/[0.08] text-destructive border border-destructive/20 hover:bg-destructive/[0.13]",
    iconClass: "bg-destructive/[0.12] text-destructive",
  },
  {
    value: "partially_paid",
    label: "Partially paid",
    icon: Clock3,
    activeClass: "bg-warning text-white shadow-sm",
    inactiveClass:
      "bg-warning/[0.10] text-warning border border-warning/20 hover:bg-warning/[0.15]",
    iconClass: "bg-warning/[0.12] text-warning",
  },
  {
    value: "fully_paid",
    label: "Fully paid",
    icon: CheckCircle2,
    activeClass: "bg-success text-white shadow-sm",
    inactiveClass:
      "bg-success/[0.08] text-success border border-success/20 hover:bg-success/[0.13]",
    iconClass: "bg-success/[0.12] text-success",
  },
];

/**
 * Draft exists only for a registered student without a financial account.
 * Once an account exists, the backend paymentStatus is authoritative.
 */
function getEffectivePaymentStatus(
  account: FinancialAccount | undefined,
): PaymentStatus {
  // Draft means the student does not have a financial account/contract yet.
  // Once an account exists, always trust the backend payment status.
  return account?.paymentStatus ?? "draft";
}

function statusLabel(status: PaymentStatus) {
  return status === "fully_paid"
    ? "Fully paid"
    : status === "partially_paid"
      ? "Partially paid"
      : status === "unpaid"
        ? "Unpaid"
        : "Draft";
}

function photoUrl(student: unknown) {
  if (!student || typeof student !== "object") return null;
  const value = (student as { photoUrl?: unknown }).photoUrl;
  return typeof value === "string" && value.trim() ? value : null;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ContractsSection({
  studentId,
  title = "Student Financial Accounts",
  description = "Students available for financial management.",
  onOpenStudentAccount,
}: ContractsSectionProps = {}) {
  const { accountsQuery } = useFinanceAccounts();
  const { data: accounts = [], isLoading, isError, refetch } = accountsQuery;

  const {
    data: studentsResponse,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
    refetch: refetchStudents,
  } = useStudents({ per_page: 100 });

  const studentItems = studentsResponse?.data ?? [];

  const listedStudentById = useMemo(
    () =>
      new Map(
        studentItems.map(
          (student) => [String(student.studentId), student] as const,
        ),
      ),
    [studentItems],
  );

  // Keep the list driven by registered students as well as financial accounts.
  // A registered student with no activated contract is a Draft entry; the
  // contract is created later from that student's profile.
  const unionStudentIds = useMemo(() => {
    const ids = new Set<string>();

    studentItems.forEach((student) => ids.add(String(student.studentId)));

    accounts.forEach((account) => ids.add(String(account.studentId)));

    if (studentId !== undefined) {
      return [...ids].filter((id) => id === String(studentId));
    }

    return [...ids];
  }, [accounts, studentId, studentItems]);

  const detailQueries = useQueries({
    queries: unionStudentIds.map((id) => ({
      queryKey: studentKeys.detail(id),
      queryFn: () => studentApi.getDetails(id),
      enabled: !listedStudentById.has(id),
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  const detailByStudentId = useMemo(
    () =>
      new Map(
        unionStudentIds.map(
          (id, index) => [id, detailQueries[index]?.data] as const,
        ),
      ),
    [detailQueries, unionStudentIds],
  );

  const accountByStudentId = useMemo(
    () =>
      new Map(
        accounts.map(
          (account) => [String(account.studentId), account] as const,
        ),
      ),
    [accounts],
  );

  const rows = useMemo(
    () =>
      unionStudentIds.map((id) => {
        const listedStudent = listedStudentById.get(id);
        const details = detailByStudentId.get(id);
        const account = accountByStudentId.get(id);

        return {
          studentId: id,
          fullName:
            details?.student?.fullName ?? listedStudent?.fullName ?? "Student",
          account,
        };
      }),
    [accountByStudentId, detailByStudentId, listedStudentById, unionStudentIds],
  );

  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");

 
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const status = getEffectivePaymentStatus(row.account);

      if (activeTab !== "all" && status !== activeTab) {
        return false;
      }

      if (!query) {
        return true;
      }

      return row.fullName.toLowerCase().includes(query);
    });
  }, [activeTab, rows, search]);

  const activeTabConfig = STATUS_TABS.find((tab) => tab.value === activeTab);

  if (isLoading || isLoadingStudents) {
    return (
      <div className="space-y-5 pb-10 pt-4 sm:pt-5 lg:pt-6">
        <FinanceTableSkeleton />
      </div>
    );
  }

  if (isError || isStudentsError) {
    return (
      <div className="space-y-5 pb-10 pt-4 sm:pt-5 lg:pt-6">
        <section className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/[0.08] text-destructive">
              <Users className="size-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-destructive">
              Failed to load students.
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Something went wrong while loading the student financial accounts.
            </p>
            <Button
              variant="outline"
              className="mt-5 rounded-xl"
              onClick={() => {
                void refetch();
                void refetchStudents();
              }}
            >
              Try again
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10 pt-4 sm:pt-5 lg:pt-6">
      {/* FILTERS — intentionally mirrors the staff finance page */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-2 flex min-w-0 flex-1 flex-wrap gap-2 lg:order-1">
          {STATUS_TABS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setActiveTab(item.value)}
                className={[
                  "inline-flex shrink-0 items-center gap-2",
                  "rounded-xl px-3.5 py-2.5",
                  "text-xs font-semibold",
                  "transition-all duration-200",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-primary/30",
                  isActive ? item.activeClass : item.inactiveClass,
                ].join(" ")}
              >
                <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
                {item.label}
              
              </button>
            );
          })}
        </div>

        <div className="order-1 w-full lg:order-2 lg:w-[280px] lg:shrink-0">
          <div
            className={[
              "flex h-10 items-center gap-2",
              "rounded-xl",
              "border border-border/60",
              "bg-card",
              "px-3",
              "shadow-sm",
              "transition",
              "focus-within:border-primary/40",
              "focus-within:ring-2",
              "focus-within:ring-primary/10",
            ].join(" ")}
          >
            <Search
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students by name"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="shrink-0 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STUDENT CONTAINER — same structure as StaffPayrollPage */}
      <section className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
        <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className={[
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                activeTabConfig?.iconClass ?? "bg-primary/[0.10] text-primary",
              ].join(" ")}
            >
              <Users aria-hidden="true" className="size-4" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-foreground">
                {activeTabConfig?.label ?? title}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>

        {!filteredRows.length ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div
              className={[
                "flex size-12 items-center justify-center rounded-2xl",
                activeTabConfig?.iconClass ?? "bg-primary/[0.10] text-primary",
              ].join(" ")}
            >
              <Search className="size-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-foreground">
              No students found
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              No students match the selected payment status or search.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 text-xs font-semibold text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filteredRows.map((row) => {
              const student = detailByStudentId.get(row.studentId);
              const name = row.fullName || "Student unavailable";
              const listedStudent = listedStudentById.get(row.studentId);
              const image =
                photoUrl(student?.student) ?? photoUrl(listedStudent);
              const status = getEffectivePaymentStatus(row.account);

              return (
                <button
                  key={row.studentId}
                  type="button"
                  onClick={() => onOpenStudentAccount?.(row.studentId)}
                  className={[
                    "group flex w-full items-center gap-4",
                    "px-5 py-4",
                    "text-start",
                    "transition-colors duration-200",
                    "hover:bg-primary/[0.025]",
                    "focus-visible:bg-primary/[0.035]",
                    "focus-visible:outline-none",
                  ].join(" ")}
                >
                  <div className="relative shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className="size-12 rounded-[16px] object-cover ring-1 ring-border/40"
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-[16px] bg-primary/[0.09] text-sm font-bold text-primary">
                        {initials(name)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {name}
                      </p>

                      <span
                        className={[
                          "rounded-full px-2 py-0.5",
                          "text-[10px] font-semibold",
                          status === "fully_paid"
                            ? "bg-success/[0.09] text-success"
                            : status === "partially_paid"
                              ? "bg-warning/[0.10] text-warning"
                              : status === "unpaid"
                                ? "bg-destructive/[0.09] text-destructive"
                                : "bg-secondary/[0.65] text-secondary-foreground",
                        ].join(" ")}
                      >
                        {statusLabel(status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 group-hover:bg-primary/[0.08] group-hover:text-primary">
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 rtl:rotate-180"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
