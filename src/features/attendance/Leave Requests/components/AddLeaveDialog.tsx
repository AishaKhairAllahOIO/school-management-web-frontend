import { CalendarDays, Search, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

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

import type { LeaveRequest, LeaveType } from "../types/staffLeave.types";

const staffOptions = [
  { id: "EMP001", name: "Ahmed Ali", role: "Teacher", department: "Science" },
  { id: "EMP002", name: "Sara Omar", role: "Secretary", department: "Administration" },
  { id: "EMP003", name: "Mohammad Hasan", role: "Supervisor", department: "Academic" },
];

type Props = {
  onAdd?: (leave: LeaveRequest) => void;
};

export function AddLeaveDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const filteredStaff = useMemo(
    () =>
      staffOptions.filter((staff) =>
        staff.name.toLowerCase().includes(employeeSearch.toLowerCase()),
      ),
    [employeeSearch],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const employee = staffOptions.find((staff) => staff.id === employeeId);
    if (!employee || !startDate || !endDate) return;

    onAdd?.({
      id: `${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      role: employee.role,
      department: employee.department,
      leaveType,
      startDate,
      endDate,
      status: "Pending",
      reason,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    setOpen(false);
    setEmployeeSearch("");
    setEmployeeId("");
    setStartDate("");
    setEndDate("");
    setReason("");
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
                placeholder="Search by employee name..."
                className="h-10 rounded-[13px] border-border/60 ps-9 text-[12px]"
              />
            </div>

            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger className="h-10 rounded-[13px] border-border/60 text-[12px]">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {filteredStaff.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name} · {staff.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px]">Vacation type</Label>
            <Select
              value={leaveType}
              onValueChange={(value) => setLeaveType(value as LeaveType)}
            >
              <SelectTrigger className="h-10 rounded-[13px] border-border/60 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual Leave">Annual vacation</SelectItem>
                <SelectItem value="Sick Leave">Sick vacation</SelectItem>
                <SelectItem value="Emergency Leave">Emergency vacation</SelectItem>
                <SelectItem value="Maternity Leave">Maternity vacation</SelectItem>
                <SelectItem value="Unpaid Leave">Unpaid vacation</SelectItem>
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
                onChange={(event) => setEndDate(event.target.value)}
                className="h-10 rounded-[13px] border-border/60 text-[12px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px]">Notes</Label>
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Optional vacation note"
              className="h-10 rounded-[13px] border-border/60 text-[12px]"
            />
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
              disabled={!employeeId || !startDate || !endDate}
            >
              Add vacation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
