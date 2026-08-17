import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  Phone,
  UserRound,
} from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/shared/ui/button";

import { staffApi } from "../../../users/staff/api/staff.api";
import { useStaffContracts } from "../hooks/useStaffContracts";
import { useStaffPayrolls } from "../hooks/usePayroll";
import { ContractsTable } from "../components/ContractsTable";
import { PayrollTable } from "../components/PayrollTable";
import type { Payroll } from "../types/payroll.types";

export function StaffPayrollProfilePage() {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  const staffQuery = useQuery({
    queryKey: ["finance", "staff", "detail", staffId],
    queryFn: () => staffApi.getDetails(staffId!),
    enabled: Boolean(staffId),
    retry: false,
  });

  const contractsQuery = useStaffContracts(
    staffId ? { staff_id: staffId } : undefined,
  );
  const payrollQuery = useStaffPayrolls(staffId);

  if (!staffId) {
    return <Navigate to="/finance/staff" replace />;
  }

  if (staffQuery.isLoading) {
    return <div className="p-10 text-center text-sm text-muted-foreground">Loading employee...</div>;
  }

  if (staffQuery.isError || !staffQuery.data) {
    return (
      <div className="mx-auto mt-6 max-w-xl rounded-[24px] border border-destructive/15 bg-card p-8 text-center">
        <h2 className="text-sm font-semibold">Employee unavailable</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          The employee details could not be loaded.
        </p>
        <Button variant="outline" className="mt-5 rounded-xl" onClick={() => navigate("/finance/staff")}>
          <ArrowLeft className="mr-2 size-4" />
          Staff accounts
        </Button>
      </div>
    );
  }

  const staff = staffQuery.data;
  const payrolls = (payrollQuery.data?.data ?? []) as Payroll[];

  return (
    <div className="space-y-5 pb-10 pt-4 sm:pt-5 lg:pt-6">
      <header className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 rounded-xl"
          onClick={() => navigate("/finance/staff")}
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Button>

        <div className="flex size-10 items-center justify-center rounded-[13px] bg-primary/[0.07] text-primary">
          {staff.photoUrl ? (
            <img src={staff.photoUrl} alt="" className="size-10 rounded-[13px] object-cover" />
          ) : (
            <UserRound className="size-[18px]" />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-semibold">{staff.fullName}</h1>
          <p className="text-[11px] text-muted-foreground">
            {staff.role?.replace("_", " ") ?? "Staff"} · Employee #{staff.id}
          </p>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard icon={Phone} label="Phone" value={staff.phoneNumber || "—"} />
        <InfoCard icon={BriefcaseBusiness} label="Specialization" value={staff.specialization || "—"} />
        <InfoCard icon={CalendarDays} label="Hire date" value={staff.hireDate || "—"} />
        <InfoCard icon={CircleDollarSign} label="Experience" value={staff.experienceYears != null ? `${staff.experienceYears} years` : "—"} />
      </section>

      <section className="space-y-3">
        <ContractsTable
          contracts={contractsQuery.data?.data ?? []}
          loading={contractsQuery.isLoading}
          error={contractsQuery.isError}
        />
      </section>

      <section className="space-y-3">
        <PayrollTable
          payrolls={payrolls}
          loading={payrollQuery.isLoading}
          onSelect={() => undefined}
        />
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-border/45 bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
