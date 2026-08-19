import {useNavigate } from "react-router-dom";
import { useMemo, useState , } from "react";
import { ArrowLeft} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";
import { Button } from "@/shared/ui/button";
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
    <div className="space-y-6 pt-5 animate-in fade-in duration-300">
      {/* رأس الصفحة */}
      <div className="flex flex-col gap-4 rounded-[24px] border border-border/70 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        
        <div className="flex items-center gap-3.5">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/attendance/staff')}
            className="h-10 w-10 shrink-0 rounded-[12px] border-border/70 hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>

          <div>
            <h1 className="text-[18px] font-semibold tracking-tight text-foreground">
              Leave Requests
            </h1>
            <p className="mt-0.5 text-[12.5px] font-semibold text-muted-foreground">
              Manage and register direct staff leaves.
            </p>
          </div>
        </div>

        <AddLeaveDialog
          staffList={realStaffList}
          leaveTypes={realLeaveTypes}
        />
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