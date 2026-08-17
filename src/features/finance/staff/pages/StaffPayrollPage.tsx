import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Search,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";

import { staffApi } from "../../../users/staff/api/staff.api";
import type {
  StaffProfile,
  StaffRole,
} from "../../../users/staff/types/staff.types";

const ROLES: Array<{
  value: StaffRole;
  label: string;
  icon: typeof GraduationCap;
  activeClass: string;
  inactiveClass: string;
  iconClass: string;
}> = [
  {
    value: "teacher",
    label: "Teachers",
    icon: BookOpen,
    activeClass: "bg-info text-white shadow-sm",
    inactiveClass:
      "bg-info/[0.08] text-info border border-info/20 hover:bg-info/[0.13]",
    iconClass: "bg-info/[0.12] text-info",
  },
  {
    value: "adviser",
    label: "Supervisor",
    icon: ShieldCheck,
    activeClass: "bg-success text-white shadow-sm",
    inactiveClass:
      "bg-success/[0.08] text-success border border-success/20 hover:bg-success/[0.13]",
    iconClass: "bg-success/[0.12] text-success",
  },
  {
    value: "secretary",
    label: "Secretaries",
    icon: BriefcaseBusiness,
    activeClass: "bg-warning text-white shadow-sm",
    inactiveClass:
      "bg-warning/[0.10] text-warning border border-warning/20 hover:bg-warning/[0.15]",
    iconClass: "bg-warning/[0.12] text-warning",
  },
  {
    value: "counselor",
    label: "Counselors",
    icon: HeartHandshake,
    activeClass: "bg-destructive text-white shadow-sm",
    inactiveClass:
      "bg-destructive/[0.08] text-destructive border border-destructive/20 hover:bg-destructive/[0.13]",
    iconClass: "bg-destructive/[0.12] text-destructive",
  },
  {
    value: "service_staff",
    label: "Service staff",
    icon: UserCog,
    activeClass: "bg-secondary-foreground text-white shadow-sm",
    inactiveClass:
      "bg-secondary/[0.55] text-secondary-foreground border border-border/50 hover:bg-secondary",
    iconClass: "bg-primary/[0.08] text-secondary-foreground",
  },
  {
    value: "super_admin",
    label: "Super admins",
    icon: ShieldCheck,
    activeClass: "bg-primary text-primary-foreground shadow-sm",
    inactiveClass:
      "bg-primary/[0.08] text-primary border border-primary/20 hover:bg-primary/[0.13]",
    iconClass: "bg-primary/[0.10] text-primary",
  },
];

function roleLabel(role: StaffRole | null) {
  return ROLES.find((item) => item.value === role)?.label ?? "Staff";
}

export function StaffPayrollPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<StaffRole>("teacher");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: [
      "finance",
      "staff",
      submittedSearch ? "search" : "by-role",
      role,
      submittedSearch,
      page,
    ],
    queryFn: () =>
      submittedSearch
        ? staffApi.searchByRole(
            role,
            submittedSearch,
            page,
            15,
          )
        : staffApi.getByRole(role, page, 15),
    staleTime: 60_000,
  });

  const rows = useMemo<StaffProfile[]>(
    () => query.data?.data ?? [],
    [query.data],
  );

  function changeRole(nextRole: StaffRole) {
    setRole(nextRole);
    setPage(1);
    setSearch("");
    setSubmittedSearch("");
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
    setSubmittedSearch(value.trim());
  }

  const activeRole = ROLES.find(
    (item) => item.value === role,
  );

  return (
    <div className="space-y-5 pb-10 pt-4 sm:pt-5 lg:pt-6">
      {/* =====================================================
          FILTERS
      ====================================================== */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* ===================================================
            ROLE TABS
        ==================================================== */}
        <div className="order-2 flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 lg:order-1">
          {ROLES.map((item) => {
            const Icon = item.icon;
            const isActive = role === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => changeRole(item.value)}
                className={[
                  "inline-flex shrink-0 items-center gap-2",
                  "rounded-xl px-3.5 py-2.5",
                  "text-xs font-semibold",
                  "transition-all duration-200",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-primary/30",
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

        {/* ===================================================
            SEARCH
        ==================================================== */}
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
              onChange={(event) =>
                handleSearch(event.target.value)
              }
              placeholder="Search staff by name"
              className={[
                "min-w-0 flex-1",
                "bg-transparent",
                "text-sm",
                "outline-none",
                "placeholder:text-muted-foreground",
              ].join(" ")}
            />

            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className={[
                  "shrink-0",
                  "text-xs font-medium",
                  "text-muted-foreground",
                  "transition",
                  "hover:text-foreground",
                ].join(" ")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          STAFF CONTAINER
      ====================================================== */}
      <section
        className={[
          "overflow-hidden",
          "rounded-[24px]",
          "border border-border/45",
          "bg-card",
          "shadow-[0_12px_34px_rgba(31,22,73,0.045)]",
        ].join(" ")}
      >
        {/* ===================================================
            HEADER
        ==================================================== */}
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
                activeRole?.iconClass ??
                  "bg-primary/[0.10] text-primary",
              ].join(" ")}
            >
              <Users
                aria-hidden="true"
                className="size-4"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-foreground">
                {roleLabel(role)}
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Employees available for financial management.
              </p>
            </div>
          </div>

          {query.data && (
            <div
              className={[
                "hidden shrink-0 items-center gap-1.5",
                "rounded-full",
                "bg-primary/[0.07]",
                "px-3 py-1.5",
                "text-xs font-semibold",
                "text-primary",
                "sm:flex",
              ].join(" ")}
            >
              <Users
                aria-hidden="true"
                className="size-3.5"
              />

              {query.data.total}
            </div>
          )}
        </div>

        {/* ===================================================
            LOADING
        ==================================================== */}
        {query.isLoading ? (
          <div className="divide-y divide-border/40">
            {Array.from({ length: 5 }).map((_, index) => (
              <StaffSkeleton key={index} />
            ))}
          </div>
        ) : query.isError ? (
          /* =================================================
             ERROR
          ================================================== */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/[0.08] text-destructive">
              <Users className="size-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-destructive">
              Failed to load staff.
            </p>

            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Something went wrong while loading the employees.
            </p>

            <Button
              variant="outline"
              className="mt-5 rounded-xl"
              onClick={() => void query.refetch()}
            >
              Try again
            </Button>
          </div>
        ) : !rows.length ? (
          /* =================================================
             EMPTY
          ================================================== */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div
              className={[
                "flex size-12 items-center justify-center",
                "rounded-2xl",
                activeRole?.iconClass ??
                  "bg-primary/[0.10] text-primary",
              ].join(" ")}
            >
              <Search className="size-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-foreground">
              No employees found
            </p>

            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              No employees match the selected role or search.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="mt-4 text-xs font-semibold text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          /* =================================================
             STAFF CARDS
          ================================================== */
          <div className="divide-y divide-border/40">
            {rows.map((staff) => (
              <StaffCard
                key={String(staff.id)}
                staff={staff}
                onClick={() =>
                  navigate(`/finance/staff/${staff.id}`)
                }
              />
            ))}
          </div>
        )}

        {/* ===================================================
            PAGINATION
        ==================================================== */}
        {query.data && query.data.lastPage > 1 && (
          <div
            className={[
              "flex flex-col gap-3",
              "border-t border-border/50",
              "px-5 py-4",
              "sm:flex-row",
              "sm:items-center",
              "sm:justify-between",
            ].join(" ")}
          >
            <span className="text-xs text-muted-foreground">
              {query.data.from ?? 0}–
              {query.data.to ?? 0} of{" "}
              {query.data.total}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={page <= 1}
                onClick={() =>
                  setPage((value) => value - 1)
                }
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={
                  page >= query.data.lastPage
                }
                onClick={() =>
                  setPage((value) => value + 1)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================================================
   STAFF CARD
============================================================ */

function StaffCard({
  staff,
  onClick,
}: {
  staff: StaffProfile;
  onClick: () => void;
}) {
  const initials =
    `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`.toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
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
      {/* Avatar */}
      <div className="relative shrink-0">
        {staff.photoUrl ? (
          <img
            src={staff.photoUrl}
            alt=""
            className={[
              "size-12",
              "rounded-[16px]",
              "object-cover",
              "ring-1 ring-border/40",
            ].join(" ")}
          />
        ) : (
          <div
            className={[
              "flex size-12 items-center justify-center",
              "rounded-[16px]",
              "bg-primary/[0.09]",
              "text-sm font-bold text-primary",
            ].join(" ")}
          >
            {initials}
          </div>
        )}

      
      </div>

      {/* Main information */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {staff.fullName}
          </p>

          <span
            className={[
              "rounded-full",
              "bg-success/[0.09]",
              "px-2 py-0.5",
              "text-[10px] font-semibold",
              "text-success",
            ].join(" ")}
          >
            {staff.accountStatus}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
          
          <span className="text-xs text-muted-foreground">
            {staff.phoneNumber || "No phone number"}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div
        className={[
          "flex size-9 shrink-0 items-center justify-center",
          "rounded-xl",
          "text-muted-foreground",
          "transition-all duration-200",
          "group-hover:bg-primary/[0.08]",
          "group-hover:text-primary",
        ].join(" ")}
      >
        <ChevronRight
          aria-hidden="true"
          className="size-4 rtl:rotate-180"
        />
      </div>
    </button>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function StaffSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="size-12 shrink-0 animate-pulse rounded-[16px] bg-muted" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-36 animate-pulse rounded-md bg-muted" />
        <div className="h-3 w-52 max-w-full animate-pulse rounded-md bg-muted" />
      </div>

      <div className="size-9 shrink-0 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}