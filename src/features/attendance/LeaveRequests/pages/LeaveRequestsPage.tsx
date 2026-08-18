import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";

import { useAllStaffLeaves } from "../hooks/useStaffLeaves";
import { LeaveFilters } from "../components/LeaveFilters";
import { LeaveRequestsTable } from "../components/LeaveRequestsTable";
import { LeaveStats } from "../components/LeaveStats";
import { AddLeaveDialog } from "../components/AddLeaveDialog";
import type { StaffLeaveRecord } from "../types/staffLeave.types";

export const LeaveRequestsPage = () => {
  const { data: leavesData = [], isLoading: isLeavesLoading } = useAllStaffLeaves();

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
    return safeData.filter((leave: StaffLeaveRecord) => {
      const matchesSearch = String(leave.staff_id).toLowerCase().includes(search.toLowerCase());
      const matchesType = leaveType === "all" || String(leave.leave_type_id || leave.leave_type?.id) === leaveType;
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
    <div className="space-y-6 pt-5 animate-in fade-in duration-300">
      {/* رأس الصفحة */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[24px] border border-border/70 bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-foreground">
            Leave Requests
          </h1>
          <p className="mt-1 text-[12.5px] text-muted-foreground font-medium">
            Manage and register direct staff leaves.
          </p>
        </div>
        <AddLeaveDialog staffList={realStaffList} leaveTypes={realLeaveTypes} />
      </div>

      {/* بطاقات الإحصائيات */}
      <LeaveStats 
        total={stats.total} 
        pending={stats.pending} 
        approved={stats.approved} 
        rejected={stats.rejected} 
      />

      {/* قسم الفلترة */}
      <div className="rounded-[24px] border border-border/70 bg-card p-5 shadow-sm">
        <LeaveFilters
          search={search}
          setSearch={setSearch}
          leaveType={leaveType}
          setLeaveType={setLeaveType}
          leaveTypes={realLeaveTypes}
        />
      </div>

      {/* جدول الطلبات */}
      <LeaveRequestsTable
        data={filteredData}
        staffList={realStaffList}
        leaveTypes={realLeaveTypes}
        isLoading={isLeavesLoading}
      />
    </div>
  );
};