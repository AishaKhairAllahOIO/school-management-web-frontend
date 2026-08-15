import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";

import { useStaffLeaves } from "../hooks/useStaffLeaves";
import { LeaveStats } from "../components/LeaveStats";
import { LeaveFilters } from "../components/LeaveFilters";
import { LeaveRequestsTable } from "../components/LeaveRequestsTable";
import { AddLeaveDialog } from "../components/AddLeaveDialog";
import type { StaffLeave } from "../../staff/types/staffAttendance.types";
import { LeaveDetailsDrawer } from "../components/LeaveDetailsDrawer";

export const LeaveRequestsPage = () => {
  const [selectedLeave, setSelectedLeave] = useState<StaffLeave | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);


  const { data: leavesData = [], isLoading: isLeavesLoading } = useStaffLeaves();


  const { data: realStaffList = [] } = useQuery({
    queryKey: ['real-staff-list'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/staff/showAllStaff');
      const data = response.data;
      return Array.isArray(data) ? data : (data?.data || []);
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
  const [status, setStatus] = useState("all");

  const filteredData = useMemo(() => {
    const safeData = Array.isArray(leavesData) ? leavesData : [];

    return safeData.filter((leave: StaffLeave) => {
      const typeName = leave.leave_type?.name || "";
      const currentStatus = (leave as any).status || "Pending";
      
      const matchesSearch = 
        String(leave.staff_id).toLowerCase().includes(search.toLowerCase()) ||
        typeName.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        leaveType === "all" ||
        String(leave.leave_type?.id) === leaveType;

      const matchesStatus = 
        status === "all" || currentStatus === status; 

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [leavesData, search, leaveType, status]);

  const handleSelectLeave = (leave: StaffLeave) => {
    setSelectedLeave(leave);
    setDrawerOpen(true);
  };

  const totalLeaves = filteredData.length;
  const approved = filteredData.filter(l => ((l as any).status || "Pending") === "Approved").length; 
  const pending = filteredData.filter(l => ((l as any).status || "Pending") === "Pending").length; 
  const rejected = filteredData.filter(l => ((l as any).status || "Pending") === "Rejected").length; 

  return (
    <div className="space-y-6 pt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Leave Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage staff leave requests.
          </p>
        </div>


        <AddLeaveDialog staffList={realStaffList} leaveTypes={realLeaveTypes} />
      </div>

      <LeaveStats
        total={totalLeaves}
        approved={approved}
        pending={pending}
        rejected={rejected}
      />

      <div className="rounded-[22px] border border-border/60 bg-card p-4 shadow-[0_10px_30px_rgba(30,20,70,0.045)]">

        <LeaveFilters
          search={search}
          setSearch={setSearch}
          leaveType={leaveType}
          setLeaveType={setLeaveType}
          status={status}
          setStatus={setStatus}
          leaveTypes={realLeaveTypes}
        />
      </div>

      <LeaveRequestsTable
        data={filteredData}
        compact={false}
        isLoading={isLeavesLoading}
        onSelect={handleSelectLeave}
      />

      <LeaveDetailsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        leave={selectedLeave}
      />
    </div>
  );
};