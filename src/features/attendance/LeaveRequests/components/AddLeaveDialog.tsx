import { CalendarDays, Search, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";

import { Button } from "@/shared/ui/button";
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

import type { CreateStaffLeavePayload } from "../../staff/types/staffAttendance.types";
import { useCreateStaffLeave } from "../hooks/useCreateStaffLeave";

export type LeaveTypeOption = { id: number; name: string };
export type StaffOption = any;

interface Props {
  staffList: StaffOption[];
  leaveTypes: LeaveTypeOption[];
}

export function AddLeaveDialog({ staffList = [], leaveTypes = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [leaveTypeId, setLeaveTypeId] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const createLeaveMutation = useCreateStaffLeave();

  const { data: academicYears = [] } = useQuery({
    queryKey: ['active-academic-years'],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS);
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    },
  });

  const activeAcademicYearId = useMemo(() => {
    if (!academicYears.length) return null;
    const activeYear = academicYears.find((y: any) => y.is_active || y.status === "active" || y.isCurrent);
    return activeYear ? activeYear.id : academicYears[0].id;
  }, [academicYears]);

  const getStaffName = (staff: any) => {
    if (!staff) return "Unknown";
    const finalName = staff.fullName || staff.name || `${staff.firstName || ''} ${staff.lastName || ''}`.trim();
    return finalName ? finalName : `Staff #${staff.id}`;
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff: any) => {
      const fullName = getStaffName(staff);
      const safeSearch = (employeeSearch || "").trim().toLowerCase();
      return (
        fullName.toLowerCase().includes(safeSearch) ||
        String(staff?.id || "").includes(safeSearch)
      );
    });
  }, [staffList, employeeSearch]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!employeeId || !leaveTypeId || !startDate || !endDate || !activeAcademicYearId) return;

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
      console.error("Failed to create leave request", error);
      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-[12px] border-warning/25 bg-card px-3 text-[11px] font-medium text-warning hover:bg-warning/[0.06]"
        >
          <UserPlus className="me-1.5 h-3.5 w-3.5" />
          Add vacation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[520px] rounded-[22px] border-border/65 p-0">
        <DialogHeader className="border-b border-border/50 px-5 py-4">
          <DialogTitle className="text-[16px] font-semibold">
            Add staff vacation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 pb-5 pt-4">
          <div className="space-y-2">
            <Label className="text-[12px]">Find employee</Label>
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={employeeSearch}
                onChange={(event) => setEmployeeSearch(event.target.value)}
                placeholder="Search by employee name or ID..."
                className="h-10 rounded-[13px] border-border/60 ps-9 text-[12px]"
              />
            </div>

            <Select
              value={employeeId ? String(employeeId) : ""}
              onValueChange={(val) => setEmployeeId(Number(val))}
            >
              <SelectTrigger className="h-10 rounded-[13px] border-border/60 text-[12px]">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
               {filteredStaff.map((staff: any) => {
                 const fullName = getStaffName(staff);
                 const roleString = Array.isArray(staff?.role) ? staff.role[0] : staff?.role;
                 const roleDisplay = roleString ? ` · ${roleString}` : "";

                 return (
                   <SelectItem key={staff.id} value={String(staff.id)}>
                     {fullName}{roleDisplay}
                   </SelectItem>
                 );
               })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px]">Vacation type</Label>
            <Select
              value={leaveTypeId ? String(leaveTypeId) : ""}
              onValueChange={(value) => setLeaveTypeId(Number(value))}
            >
              <SelectTrigger className="h-10 rounded-[13px] border-border/60 text-[12px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[12px]">Start date</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-10 rounded-[13px] border-border/60 ps-9 text-[12px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[12px]">End date</Label>
              <Input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="h-10 rounded-[13px] border-border/60 text-[12px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-10 rounded-[13px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-[13px]"
              disabled={!employeeId || !leaveTypeId || !startDate || !endDate || !activeAcademicYearId || createLeaveMutation.isPending}
            >
              {createLeaveMutation.isPending ? "Saving..." : "Add vacation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}