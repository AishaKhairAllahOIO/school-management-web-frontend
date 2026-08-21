import {
  CalendarDays,
  Search,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";

import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type { CreateStaffLeavePayload } from "../types/staffLeave.types";
import { useCreateStaffLeave } from "../hooks/useStaffLeaves";

export type LeaveTypeOption = {
  id: number;
  name: string;
};

export type StaffOption = any;

interface Props {
  staffList: StaffOption[];
  leaveTypes: LeaveTypeOption[];
}

export function AddLeaveDialog({
  staffList = [],
  leaveTypes = [],
}: Props) {
  const [open, setOpen] = useState(false);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [leaveTypeId, setLeaveTypeId] = useState<number | "">("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const createLeaveMutation = useCreateStaffLeave();

  // --------------------------------------------------
  // Academic years
  // --------------------------------------------------

  const { data: academicYears = [] } = useQuery({
    queryKey: ["active-academic-years"],
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS,
      );

      const data = response.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;

      return [];
    },
  });

  const activeAcademicYearId = useMemo(() => {
    if (!academicYears.length) return null;

    const activeYear = academicYears.find(
      (year: any) =>
        year.is_active ||
        year.status === "active" ||
        year.isCurrent,
    );

    return activeYear
      ? activeYear.id
      : academicYears[0].id;
  }, [academicYears]);

  // --------------------------------------------------
  // Staff
  // --------------------------------------------------

  const getStaffName = (staff: any) => {
    if (!staff) return "Unknown";

    const finalName =
      staff.fullName ||
      staff.name ||
      `${staff.firstName || ""} ${
        staff.lastName || ""
      }`.trim();

    return finalName
      ? finalName
      : `Staff #${staff.id}`;
  };

  const filteredStaff = useMemo(() => {
    const safeSearch = employeeSearch
      .trim()
      .toLowerCase();

    return staffList.filter((staff: any) => {
      const fullName = getStaffName(staff);

      return (
        fullName.toLowerCase().includes(safeSearch) ||
        String(staff?.id || "").includes(safeSearch)
      );
    });
  }, [staffList, employeeSearch]);

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !employeeId ||
      !leaveTypeId ||
      !startDate ||
      !endDate ||
      !activeAcademicYearId
    ) {
      return;
    }

    /*
     * IMPORTANT:
     * DatePicker returns the API date format through
     * formatDateForApi(), so these values remain:
     *
     * YYYY-MM-DD
     *
     * No conversion is performed here.
     */

    const payload: CreateStaffLeavePayload = {
      staff_id: Number(employeeId),
      leave_type_id: Number(leaveTypeId),
      academic_year_id: Number(activeAcademicYearId),
      start_date: startDate,
      end_date: endDate,
    };

    try {
      await createLeaveMutation.mutateAsync(payload);

      setOpen(false);

      setEmployeeSearch("");
      setEmployeeId("");
      setLeaveTypeId("");
      setStartDate("");
      setEndDate("");
    } catch (error: any) {
      console.error(
        "Failed to create leave request",
        error,
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-[12px] border-warning/30 bg-card px-4 text-[12px] font-semibold text-warning shadow-xs transition-colors hover:bg-warning/10"
        >
          <UserPlus className="me-2 h-4 w-4" />
          Add vacation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[540px] rounded-[24px] border-border/70 bg-card p-0 text-card-foreground shadow-2xl">
        <DialogHeader className="border-b border-border/60 bg-muted/20 px-6 py-4">
          <DialogTitle className="text-[17px] font-semibold tracking-tight text-foreground">
            Add staff vacation
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 pb-6 pt-5"
        >
          {/* ------------------------------------------------ */}
          {/* Employee */}
          {/* ------------------------------------------------ */}

          <div className="space-y-1.5">
            <Label className="text-[12.5px] font-semibold text-foreground">
              Find employee
            </Label>

            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={employeeSearch}
                onChange={(event) =>
                  setEmployeeSearch(event.target.value)
                }
                placeholder="Search by employee name or ID..."
                className="h-11 rounded-[13px] border-border/70 bg-background ps-9 text-[12.5px] text-foreground transition-all focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </div>

            <Select
              value={
                employeeId
                  ? String(employeeId)
                  : ""
              }
              onValueChange={(value) =>
                setEmployeeId(Number(value))
              }
            >
              <SelectTrigger className="mt-2 h-11 w-full rounded-[13px] border-border/70 bg-background text-[12.5px] text-foreground">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>

              <SelectContent className="border-border bg-popover text-popover-foreground">
                {filteredStaff.map(
                  (staff: any) => {
                    const fullName =
                      getStaffName(staff);

                    const roleString =
                      Array.isArray(staff?.role)
                        ? staff.role[0]
                        : staff?.role;

                    const roleDisplay =
                      roleString
                        ? ` · ${roleString}`
                        : "";

                    return (
                      <SelectItem
                        key={staff.id}
                        value={String(
                          staff.id,
                        )}
                      >
                        {fullName}
                        {roleDisplay}
                      </SelectItem>
                    );
                  },
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ------------------------------------------------ */}
          {/* Leave type */}
          {/* ------------------------------------------------ */}

          <div className="space-y-1.5">
            <Label className="text-[12.5px] font-semibold text-foreground">
              Vacation type
            </Label>

            <Select
              value={
                leaveTypeId
                  ? String(leaveTypeId)
                  : ""
              }
              onValueChange={(value) =>
                setLeaveTypeId(Number(value))
              }
            >
              <SelectTrigger className="h-11 w-full rounded-[13px] border-border/70 bg-background text-[12.5px] text-foreground">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent className="border-border bg-popover text-popover-foreground">
                {leaveTypes.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={String(type.id)}
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ------------------------------------------------ */}
          {/* Dates */}
          {/* ------------------------------------------------ */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DatePicker
              label="Start date"
              value={startDate}
              onChange={setStartDate}
              placeholder="Select start date"
              className="w-full"
              icon={
                <CalendarDays
                  size={15}
                  strokeWidth={1.8}
                />
              }
              required
            />

            <DatePicker
              label="End date"
              value={endDate}
              onChange={setEndDate}
              min={startDate || undefined}
              placeholder="Select end date"
              className="w-full"
              required
            />
          </div>

          {/* ------------------------------------------------ */}
          {/* Actions */}
          {/* ------------------------------------------------ */}

          <div className="flex justify-end gap-2.5 border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-10 rounded-[12px] border-border px-4 text-[13px] font-medium"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !employeeId ||
                !leaveTypeId ||
                !startDate ||
                !endDate ||
                !activeAcademicYearId ||
                createLeaveMutation.isPending
              }
              className="h-10 rounded-[12px] bg-primary px-5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {createLeaveMutation.isPending
                ? "Saving..."
                : "Add vacation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}