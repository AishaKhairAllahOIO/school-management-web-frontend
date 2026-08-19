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
import type {
  FinancialAccount,
  PaymentStatus,
} from "../types/finance.types";
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
    activeClass: "bg-info text-white",
    inactiveClass:
      "border border-info/15 bg-info/[0.05] text-info hover:bg-info/[0.09]",
    iconClass: "bg-info/[0.07] text-info",
  },
  {
    value: "draft",
    label: "Draft",
    icon: FileText,
    activeClass: "bg-secondary-foreground text-white",
    inactiveClass:
      "border border-border/45 bg-secondary/[0.35] text-secondary-foreground hover:bg-secondary/[0.55]",
    iconClass: "bg-secondary/[0.35] text-secondary-foreground",
  },
  {
    value: "unpaid",
    label: "Unpaid",
    icon: CircleAlert,
    activeClass: "bg-destructive text-white",
    inactiveClass:
      "border border-destructive/15 bg-destructive/[0.05] text-destructive hover:bg-destructive/[0.09]",
    iconClass: "bg-destructive/[0.07] text-destructive",
  },
  {
    value: "partially_paid",
    label: "Partially paid",
    icon: Clock3,
    activeClass: "bg-warning text-white",
    inactiveClass:
      "border border-warning/15 bg-warning/[0.06] text-warning hover:bg-warning/[0.10]",
    iconClass: "bg-warning/[0.07] text-warning",
  },
  {
    value: "fully_paid",
    label: "Fully paid",
    icon: CheckCircle2,
    activeClass: "bg-success text-white",
    inactiveClass:
      "border border-success/15 bg-success/[0.05] text-success hover:bg-success/[0.09]",
    iconClass: "bg-success/[0.07] text-success",
  },
];

/**
 * Draft exists only for a registered student without a financial account.
 * Once an account exists, the backend paymentStatus is authoritative.
 */
function getEffectivePaymentStatus(
  account: FinancialAccount | undefined,
): PaymentStatus {
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

  const {
    data: accounts = [],
    isLoading,
    isError,
    refetch,
  } = accountsQuery;

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
  // A registered student with no activated contract is a Draft entry.
  const unionStudentIds = useMemo(() => {
    const ids = new Set<string>();

    studentItems.forEach((student) =>
      ids.add(String(student.studentId)),
    );

    accounts.forEach((account) =>
      ids.add(String(account.studentId)),
    );

    if (studentId !== undefined) {
      return [...ids].filter(
        (id) => id === String(studentId),
      );
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
          (id, index) => [
            id,
            detailQueries[index]?.data,
          ] as const,
        ),
      ),
    [detailQueries, unionStudentIds],
  );

  const accountByStudentId = useMemo(
    () =>
      new Map(
        accounts.map(
          (account) =>
            [String(account.studentId), account] as const,
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
            details?.student?.fullName ??
            listedStudent?.fullName ??
            "Student",
          account,
        };
      }),
    [
      accountByStudentId,
      detailByStudentId,
      listedStudentById,
      unionStudentIds,
    ],
  );

  const [activeTab, setActiveTab] =
    useState<StatusTab>("all");

  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const status = getEffectivePaymentStatus(row.account);

      if (
        activeTab !== "all" &&
        status !== activeTab
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return row.fullName
        .toLowerCase()
        .includes(query);
    });
  }, [activeTab, rows, search]);

  const activeTabConfig = STATUS_TABS.find(
    (tab) => tab.value === activeTab,
  );

  if (isLoading || isLoadingStudents) {
    return (
      <div className="space-y-4 pb-8 pt-2 sm:pt-3">
        <FinanceTableSkeleton />
      </div>
    );
  }

  if (isError || isStudentsError) {
    return (
      <div className="space-y-4 pb-8 pt-2 sm:pt-3">
        <section className="overflow-hidden rounded-[18px] border border-border/50 bg-card">
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/[0.06] text-destructive">
              <Users className="size-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-destructive">
              Failed to load students.
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              Something went wrong while loading the
              student financial accounts.
            </p>

            <Button
              variant="outline"
              className="mt-5 h-8 rounded-lg px-3 text-xs"
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
    <div className="space-y-4 pb-8 pt-2 sm:pt-3">
      {/* FILTERS */}
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-2 flex min-w-0 flex-1 flex-wrap gap-1.5 lg:order-1">
          {STATUS_TABS.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setActiveTab(item.value)
                }
                className={[
                  "inline-flex shrink-0 items-center gap-1.5",
                  "rounded-lg px-3 py-2",
                  "text-[11px] font-semibold",
                  "transition-colors duration-150",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-primary/20",
                  isActive
                    ? item.activeClass
                    : item.inactiveClass,
                ].join(" ")}
              >
                <Icon
                  aria-hidden="true"
                  className="size-3.5"
                  strokeWidth={2}
                />

                {item.label}
              </button>
            );
          })}
        </div>

        <div className="order-1 w-full lg:order-2 lg:w-[260px] lg:shrink-0">
          <div
            className={[
              "flex h-9 items-center gap-2",
              "rounded-lg",
              "border border-border/55",
              "bg-card",
              "px-2.5",
              "transition-colors",
              "focus-within:border-primary/30",
            ].join(" ")}
          >
            <Search
              aria-hidden="true"
              className="size-3.5 shrink-0 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search students by name"
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="shrink-0 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STUDENT CONTAINER */}
      <section className="overflow-hidden rounded-[18px] border border-border/50 bg-card">
        <div className="flex items-center gap-3 border-b border-border/45 px-4 py-3 sm:px-4.5 sm:py-3.5">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div
              className={[
                "flex size-8.5 shrink-0 items-center justify-center rounded-lg",
                activeTabConfig?.iconClass ??
                  "bg-primary/[0.06] text-primary",
              ].join(" ")}
            >
              <Users
                aria-hidden="true"
                className="size-3.5"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[13px] font-semibold text-foreground">
                {activeTabConfig?.label ?? title}
              </h2>

              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>

        {!filteredRows.length ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div
              className={[
                "flex size-11 items-center justify-center rounded-xl",
                activeTabConfig?.iconClass ??
                  "bg-primary/[0.06] text-primary",
              ].join(" ")}
            >
              <Search className="size-4.5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-foreground">
              No students found
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              No students match the selected payment
              status or search.
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
          <div className="divide-y divide-border/35">
            {filteredRows.map((row) => {
              const student =
                detailByStudentId.get(
                  row.studentId,
                );

              const name =
                row.fullName ||
                "Student unavailable";

              const listedStudent =
                listedStudentById.get(
                  row.studentId,
                );

              const image =
                photoUrl(student?.student) ??
                photoUrl(listedStudent);

              const status =
                getEffectivePaymentStatus(
                  row.account,
                );

              return (
                <button
                  key={row.studentId}
                  type="button"
                  onClick={() =>
                    onOpenStudentAccount?.(
                      row.studentId,
                    )
                  }
                  className={[
                    "group flex w-full items-center gap-3.5",
                    "px-4 py-3.5",
                    "text-start",
                    "transition-colors duration-150",
                    "hover:bg-muted/30",
                    "focus-visible:bg-muted/35",
                    "focus-visible:outline-none",
                  ].join(" ")}
                >
                  <div className="relative shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className="size-10.5 rounded-xl object-cover ring-1 ring-border/35"
                      />
                    ) : (
                      <div className="flex size-10.5 items-center justify-center rounded-xl bg-primary/[0.06] text-xs font-semibold text-primary">
                        {initials(name)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-[12px] font-semibold text-foreground">
                        {name}
                      </p>

                      <span
                        className={[
                          "rounded-full px-1.5 py-0.5",
                          "text-[9px] font-semibold",
                          status === "fully_paid"
                            ? "bg-success/[0.07] text-success"
                            : status ===
                                "partially_paid"
                              ? "bg-warning/[0.08] text-warning"
                              : status ===
                                  "unpaid"
                                ? "bg-destructive/[0.07] text-destructive"
                                : "bg-secondary/[0.45] text-secondary-foreground",
                        ].join(" ")}
                      >
                        {statusLabel(status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 group-hover:bg-muted/50 group-hover:text-foreground">
                    <ChevronRight
                      aria-hidden="true"
                      className="size-3.5 rtl:rotate-180"
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