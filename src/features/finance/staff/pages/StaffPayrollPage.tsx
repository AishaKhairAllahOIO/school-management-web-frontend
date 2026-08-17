import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  ChevronRight,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";

import { staffApi } from "../../../users/staff/api/staff.api";
import type { StaffProfile, StaffRole } from "../../../users/staff/types/staff.types";

const ROLES: Array<{ value: StaffRole; label: string }> = [
  { value: "teacher", label: "Teachers" },
  { value: "adviser", label: "Advisers" },
  { value: "secretary", label: "Secretaries" },
  { value: "counselor", label: "Counselors" },
  { value: "service_staff", label: "Service staff" },
  { value: "super_admin", label: "Super admins" },
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
    queryKey: ["finance", "staff", submittedSearch ? "search" : "by-role", role, submittedSearch, page],
    queryFn: () =>
      submittedSearch
        ? staffApi.searchByRole(role, submittedSearch, page, 15)
        : staffApi.getByRole(role, page, 15),
    staleTime: 60_000,
  });

  const rows = useMemo<StaffProfile[]>(() => query.data?.data ?? [], [query.data]);

  function changeRole(nextRole: StaffRole) {
    setRole(nextRole);
    setPage(1);
    setSearch("");
    setSubmittedSearch("");
  }

  function submitSearch() {
    setPage(1);
    setSubmittedSearch(search.trim());
  }

  return (
    <div className="space-y-5 pb-10 pt-4 sm:pt-5 lg:pt-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Staff Financial Accounts
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Select an employee to manage contracts, salary and payroll.
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-md items-center gap-2">
          <div className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-border/60 bg-card px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void submitSearch();
              }}
              placeholder="Search staff by name"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="button" className="h-10 rounded-xl" onClick={() => void submitSearch()}>
            Search
          </Button>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {ROLES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => changeRole(item.value)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              role === item.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/60 bg-card text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
        <div className="flex items-center gap-3 border-b border-border/50 px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">{roleLabel(role)}</h2>
            <p className="text-xs text-muted-foreground">
              Employees available for financial management.
            </p>
          </div>
        </div>

        {query.isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading staff...</div>
        ) : query.isError ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-destructive">Failed to load staff.</p>
            <Button variant="outline" className="mt-4 rounded-xl" onClick={() => void query.refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="px-5 py-3 text-start text-xs font-semibold text-muted-foreground">Employee</th>
                    <th className="px-5 py-3 text-start text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="px-5 py-3 text-start text-xs font-semibold text-muted-foreground">Phone</th>
                    <th className="px-5 py-3 text-start text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="w-12 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((staff) => (
                      <tr
                        key={String(staff.id)}
                        onClick={() => navigate(`/finance/staff/${staff.id}`)}
                        className="cursor-pointer border-b border-border/40 last:border-0 hover:bg-primary/[0.025]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {staff.photoUrl ? (
                              <img
                                src={staff.photoUrl}
                                alt=""
                                className="size-10 rounded-[14px] object-cover"
                              />
                            ) : (
                              <div className="flex size-10 items-center justify-center rounded-[14px] bg-primary/10 text-sm font-bold text-primary">
                                {staff.firstName.charAt(0)}
                                {staff.lastName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-foreground">{staff.fullName}</p>
                              <p className="text-xs text-muted-foreground">#{staff.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">{roleLabel(staff.role)}</td>
                        <td className="px-5 py-4 text-muted-foreground">{staff.phoneNumber || "—"}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                            {staff.accountStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {!rows.length && (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No employees found for this role.
              </div>
            )}

            {query.data && query.data.lastPage > 1 && (
              <div className="flex items-center justify-between border-t border-border/50 px-5 py-3">
                <span className="text-xs text-muted-foreground">
                  {query.data.from ?? 0}–{query.data.to ?? 0} of {query.data.total}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={page <= 1}
                    onClick={() => setPage((value) => value - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={page >= query.data.lastPage}
                    onClick={() => setPage((value) => value + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
