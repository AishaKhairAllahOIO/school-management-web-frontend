import {
  CalendarCheck2,
  CalendarDays,
  Palmtree,
  Save,
  Search,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { axiosClient } from "@/services/axios/axiosClient";
import { useQuery } from "@tanstack/react-query";

import { AddLeaveDialog } from "../../LeaveRequests/components/AddLeaveDialog";
import { LeaveRequestsTable } from "../../LeaveRequests/components/LeaveRequestsTable";
import { useStaffLeaves } from "../../LeaveRequests/hooks/useStaffLeaves";
import type { StaffLeave } from "../types/staffAttendance.types";
import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import { Input } from "@/shared/ui/input";

import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceFilters } from "../components/StaffAttendanceFilters";
import { StaffAttendanceTable } from "../components/StaffAttendanceTable";
import { useStaffAttendance } from "../hooks/useStaffAttendance";
import { useUpdateStaffAttendance } from "../hooks/useUpdateStaffAttendance";
import type {
  StaffAttendanceRecord,
  StaffAttendanceStatus,
  StaffAbsenceType,
} from "../types/staffAttendance.types";

function todayForApi() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

export function StaffAttendancePage() {
  const [draftDate, setDraftDate] = useState(todayForApi());
  const [selectedDate, setSelectedDate] = useState(todayForApi());

  const attendanceQuery = useStaffAttendance(selectedDate);
  const staffIdForLeaves = 1;
  const leaveQuery = useStaffLeaves(staffIdForLeaves);
  const updateAttendanceMutation = useUpdateStaffAttendance();

  // ✅ جلب قائمة الموظفين الحقيقية لتمريرها لنافذة الإجازات
  const { data: staffList = [] } = useQuery({
    queryKey: ['real-staff-list-for-leave'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/staff/showAllStaff');
      return response.data.data || [];
    }
  });

  // ✅ جلب أنواع الإجازات الحقيقية لتمريرها لنافذة الإجازات
  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['real-leave-types-for-leave'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/leave/leaves');
      return response.data.data || [];
    }
  });

  const [records, setRecords] = useState<StaffAttendanceRecord[]>([]);
  const [vacations, setVacations] = useState<StaffLeave[]>([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [absenceType, setAbsenceType] = useState("all");

  const [vacationSearch, setVacationSearch] = useState("");
  const [dirtyIds, setDirtyIds] = useState<Set<string | number>>(new Set());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (attendanceQuery.data) {
      setRecords(attendanceQuery.data);
    }
  }, [attendanceQuery.data]);

  useEffect(() => {
    if (leaveQuery.data) {
      setVacations(leaveQuery.data);
    }
  }, [leaveQuery.data]);

  const filteredAttendance = useMemo(
    () =>
      records.filter((employee) => {
        const normalizedSearch = search.trim().toLowerCase();
        const staffName = `Staff #${employee.staff_id}`.toLowerCase();

        return (
          (!normalizedSearch || staffName.includes(normalizedSearch)) &&
          (status === "all" || employee.status === status) &&
          (status !== "absent" || absenceType === "all" || employee.absence_type === absenceType)
        );
      }),
    [records, search, status, absenceType],
  );

  const filteredVacations = useMemo(
    () =>
      vacations.filter((vacation) => {
        const typeName = vacation.leave_type?.name || "";
        const searchStr = vacationSearch.trim().toLowerCase();
        return (
          String(vacation.staff_id).toLowerCase().includes(searchStr) ||
          typeName.toLowerCase().includes(searchStr)
        );
      }),
    [vacationSearch, vacations],
  );

  const present = filteredAttendance.filter((item) => item.status === "present").length;
  const absent = filteredAttendance.filter((item) => item.status === "absent" || item.status === "partial_absence").length;
  const excused = filteredAttendance.filter((item) => item.absence_type === "excused").length;
  const unexcused = filteredAttendance.filter((item) => item.absence_type === "unexcused").length;

  const isInitialLoading =
    attendanceQuery.isLoading ||
    (leaveQuery.isLoading && leaveQuery.data === undefined);

  function updateRecord(
    id: string | number,
    patch: Partial<
      Pick<
        StaffAttendanceRecord,
        "status" | "absence_type"
      >
    >,
  ) {
    setRecords((current) =>
      current.map((record) => {
        if (record.id !== id) {
          return record;
        }

        const next = {
          ...record,
          ...patch,
        };

        if (patch.status === "present") {
          next.absence_type = null;
        }

        if (patch.status === "absent") {
          next.absence_type = next.absence_type ?? "excused";
        }

        return next;
      }),
    );

    setDirtyIds((current) => new Set(current).add(id));
    setSavedAt(null);
  }

  function applyDate() {
    if (!draftDate) return;
    setSelectedDate(draftDate);
    setDirtyIds(new Set());
    setSavedAt(null);
  }

  async function saveAttendance() {
    if (dirtyIds.size === 0) return;

    try {
      for (const id of dirtyIds) {
        const record = records.find((r) => r.id === id);
        if (record) {
          await updateAttendanceMutation.mutateAsync({
            id: record.id,
            payload: {
              status: record.status as StaffAttendanceStatus,
              absence_type: record.absence_type as StaffAbsenceType,
            },
          });
        }
      }

      setDirtyIds(new Set());
      setSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch (error) {
      console.error("Failed to save attendance changes", error);
    }
  }

  return (
    <section className="space-y-4 pt-5">
      <AttendanceStats
        present={present}
        absent={absent}
        excused={excused}
        unexcused={unexcused}
        isLoading={isInitialLoading}
      />

      <div className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_10px_30px_rgba(30,20,70,0.045)]">
        <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-info/10 bg-info/[0.075] text-info">
              <CalendarCheck2 className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-foreground">
                  Daily staff attendance date
                </h2>
                <span className="rounded-full bg-info/[0.065] px-2 py-0.5 text-[10px] font-medium text-info">
                  Full staff table
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                Apply one working day to the live staff directory, then save all edited attendance rows together.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:items-end">
            <DatePicker
              value={draftDate}
              onChange={setDraftDate}
              label="Attendance date"
              className="w-full sm:w-[228px]"
            />

            <Button
              type="button"
              variant="outline"
              onClick={applyDate}
              disabled={!draftDate || draftDate === selectedDate}
              className="h-11 rounded-[13px] border-info/20 bg-transparent px-4 text-info hover:bg-info/[0.055]"
            >
              <CalendarDays className="h-4 w-4" />
              Apply
            </Button>

            <Button
              type="button"
              onClick={saveAttendance}
              disabled={dirtyIds.size === 0 || updateAttendanceMutation.isPending}
              className="h-11 rounded-[13px] px-5"
            >
              <Save className="h-4 w-4" />
              {updateAttendanceMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="border-t border-border/45 bg-muted/[0.10] p-4">
          <AttendanceFilters
            data={records as any}
            search={search}
            setSearch={setSearch}
            role={role}
            setRole={setRole}
            status={status}
            setStatus={setStatus}
            absenceType={absenceType}
            setAbsenceType={setAbsenceType}
          />
        </div>
      </div>

      {savedAt ? (
        <p className="-mt-1 text-end text-[11px] font-medium text-success">
          Staff attendance changes saved at {savedAt}.
        </p>
      ) : null}

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(290px,1fr)]">
        <div className="min-w-0">
          <StaffAttendanceTable
            data={filteredAttendance}
            isLoading={isInitialLoading}
            onUpdate={updateRecord}
          />
        </div>

        <aside className="min-w-0 self-start overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-warning/[0.10] text-warning">
                <Palmtree className="h-[17px] w-[17px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">
                  Vacation
                </h2>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  Search staff and add vacation directly.
                </p>
              </div>
            </div>

            {/* ✅ تمرير البيانات الحقيقية للـ Dialog */}
            <AddLeaveDialog staffList={staffList} leaveTypes={leaveTypes} />
          </div>

          <div className="border-b border-border/45 p-3.5">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={vacationSearch}
                onChange={(event) => setVacationSearch(event.target.value)}
                placeholder="Search staff vacation..."
                className="h-10 rounded-[12px] border-border/60 bg-background/80 ps-8 text-[11px] shadow-none"
              />
            </div>
          </div>

          <LeaveRequestsTable
            data={filteredVacations}
            compact
            isLoading={isInitialLoading}
          />
        </aside>
      </div>
    </section>
  );
}