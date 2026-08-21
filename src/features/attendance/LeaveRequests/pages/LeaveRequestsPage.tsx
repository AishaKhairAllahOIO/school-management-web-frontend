import {useNavigate } from "react-router-dom";
import { useMemo, useState , } from "react";
import { ArrowLeft} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";
import { useAllStaffLeaves } from "../hooks/useStaffLeaves";
import { LeaveFilters } from "../components/LeaveFilters";
import { LeaveRequestsTable } from "../components/LeaveRequestsTable";
import { LeaveStats } from "../components/LeaveStats";
import { AddLeaveDialog } from "../components/AddLeaveDialog";
import type { StaffLeaveRecord } from "../types/staffLeave.types";

export const LeaveRequestsPage = () => {
  const { data: leavesData = [], isLoading: isLeavesLoading } =
    useAllStaffLeaves();
  const navigate = useNavigate();

  const { data: realStaffList = [] } = useQuery({
    queryKey: ["real-staff-list"],
    queryFn: async () => {
      const response = await axiosClient.get("/admin/staff/showAllStaff");
      const data = response.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;

      return [];
    },
  });

  const { data: realLeaveTypes = [] } = useQuery({
    queryKey: ["real-leave-types"],
    queryFn: async () => {
      const response = await axiosClient.get("/admin/leave/leaves");
      const data = response.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;

      return [];
    },
  });

  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("all");

  const filteredData = useMemo(() => {
    const safeData = Array.isArray(leavesData) ? leavesData : [];

    return safeData.filter((leave: StaffLeaveRecord) => {
      const matchesSearch = String(leave.staff_id)
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        leaveType === "all" ||
        String(leave.leave_type_id || leave.leave_type?.id) === leaveType;

      return matchesSearch && matchesType;
    });
  }, [leavesData, search, leaveType]);

  const stats = useMemo(() => {
    const safeData = Array.isArray(leavesData) ? leavesData : [];
    const total = safeData.length;
    let pending = 0;
    let approved = total;
    let rejected = 0;

    safeData.forEach((item: any) => {
      if (item.status === "pending") pending++;
      else if (item.status === "rejected") rejected++;
    });

    return { total, pending, approved, rejected };
  }, [leavesData]);

return (
  <div className="space-y-4 pt-2 animate-in fade-in duration-300">
    {/* Page Header */}
    <div className="flex flex-col gap-4 rounded-[22px] border border-border/60 bg-card px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3.5">
        {/* Back to Staff */}
        <button
          type="button"
          onClick={() => navigate("/attendance/staff")}
          className="
            group inline-flex shrink-0 items-center gap-1.5
            text-xs font-medium
            text-muted-foreground
            transition-colors duration-200
            hover:text-amber-500
          "
        >
          <ArrowLeft
            className="h-4 w-4 transition-colors duration-200 group-hover:text-amber-500"
            strokeWidth={1.7}
          />
          <span>Back to Staff</span>
        </button>

        <div className="h-5 w-px bg-border/60" />

        <div className="min-w-0">
          <h1 className="text-[17px] font-medium tracking-tight text-foreground">
            Leave Requests
          </h1>

          <p className="mt-0.5 text-[12px] font-normal text-muted-foreground">
            Manage and register direct staff leaves.
          </p>
        </div>
      </div>

      <AddLeaveDialog
        staffList={realStaffList}
        leaveTypes={realLeaveTypes}
      />
    </div>

    {/* Statistics */}
    <LeaveStats
      total={stats.total}
      pending={stats.pending}
      approved={stats.approved}
      rejected={stats.rejected}
    />

    {/* Filters */}
    <div className="rounded-[22px] border border-border/60 bg-card p-5 shadow-sm">
      <LeaveFilters
        search={search}
        setSearch={setSearch}
        leaveType={leaveType}
        setLeaveType={setLeaveType}
        leaveTypes={realLeaveTypes}
      />
    </div>

    {/* Leave Requests Table */}
    <LeaveRequestsTable
      data={filteredData}
      staffList={realStaffList}
      leaveTypes={realLeaveTypes}
      isLoading={isLeavesLoading}
    />
  </div>
);
};