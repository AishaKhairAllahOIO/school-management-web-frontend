import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";

import { useStaffLeaves } from "../hooks/useStaffLeaves";
import { LeaveFilters } from "../components/LeaveFilters";
import { LeaveRequestsTable } from "../components/LeaveRequestsTable";
import { AddLeaveDialog } from "../components/AddLeaveDialog";
import type { StaffLeave } from "../../staff/types/staffAttendance.types";

export const LeaveRequestsPage = () => {
  const { data: leavesData = [], isLoading: isLeavesLoading } = useStaffLeaves();

  // 👈 استعلام جلب الموظفين مع معالجة كافة احتمالات هيكلة الرد من الـ API
  const { data: realStaffList = [] } = useQuery({
    queryKey: ['real-staff-list'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/staff/showAllStaff');
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    }
  });

  const { data: realLeaveTypes = [] } = useQuery({
    queryKey: ['real-leave-types'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/leave/leaves');
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("all");

  const filteredData = useMemo(() => {
    const safeData = Array.isArray(leavesData) ? leavesData : [];
    return safeData.filter((leave: StaffLeave) => {
      const typeName = leave.leave_type?.name || "";
      const matchesSearch = 
        String(leave.staff_id).toLowerCase().includes(search.toLowerCase()) ||
        typeName.toLowerCase().includes(search.toLowerCase());
      const matchesType = leaveType === "all" || String(leave.leave_type?.id) === leaveType;
      return matchesSearch && matchesType;
    });
  }, [leavesData, search, leaveType]);

  return (
    <div className="space-y-6 pt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Leave Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and register direct staff leaves.
          </p>
        </div>

        <AddLeaveDialog staffList={realStaffList} leaveTypes={realLeaveTypes} />
      </div>

      <div className="rounded-[22px] border border-border/60 bg-card p-4 shadow-[0_10px_30px_rgba(30,20,70,0.045)]">
        <LeaveFilters
          search={search}
          setSearch={setSearch}
          leaveType={leaveType}
          setLeaveType={setLeaveType}
          leaveTypes={realLeaveTypes}
        />
      </div>

      <LeaveRequestsTable
        data={filteredData}
        isLoading={isLeavesLoading}
      />
    </div>
  );
};