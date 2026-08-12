 import { useMemo, useState } from "react";
import { useStaffLeaves } from "../hooks/useStaffLeaves";
import { LeaveStats } from "../components/LeaveStats";
import { LeaveFilters } from "../components/LeaveFilters";
import { LeaveRequestsTable } from "../components/LeaveRequestsTable";
import { AddLeaveDialog } from "../components/AddLeaveDialog";
import type { StaffLeave } from "../../staff/types/staffAttendance.types";
import { LeaveDetailsDrawer } from "../components/LeaveDetailsDrawer";

export const LeaveRequestsPage = () => {
  // ✅ ربط حالة التحديد وفتح الـ Drawer
  const [selectedLeave, setSelectedLeave] = useState<StaffLeave | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // معرف الموظف (يمكن جعله ديناميكياً لاحقاً حسب نظام التنقل لديك)
  const staffId = 1; 
  
  const {
    data = [],
    isLoading,
  } = useStaffLeaves(staffId);

  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.filter((leave: StaffLeave) => {
      const typeName = leave.leave_type?.name || "";
      
      const matchesSearch = 
        String(leave.staff_id).toLowerCase().includes(search.toLowerCase()) ||
        typeName.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        leaveType === "all" ||
        String(leave.leave_type?.id) === leaveType;

      const matchesStatus = status === "all"; 

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, search, leaveType, status]);

  // دالة التعامل مع اختيار إجازة من الجدول لفتح تفاصيلها
  const handleSelectLeave = (leave: StaffLeave) => {
    setSelectedLeave(leave);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        Loading leave requests...
      </div>
    );
  }

  const totalLeaves = filteredData.length;
  const approved = 0; 
  const pending = totalLeaves; 
  const rejected = 0; 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Leave Requests
          </h1>
          <p className="text-muted-foreground">
            Manage staff leave requests.
          </p>
        </div>

        <AddLeaveDialog />
      </div>

      <LeaveStats
        total={totalLeaves}
        approved={approved}
        pending={pending}
        rejected={rejected}
      />

      <div className="soft-card rounded-3xl p-5">
        <LeaveFilters
          search={search}
          setSearch={setSearch}
          leaveType={leaveType}
          setLeaveType={setLeaveType}
          status={status}
          setStatus={setStatus}
        />
      </div>

      {/* ✅ ربط الجدول بدالة التحديد */}
      <LeaveRequestsTable
        data={filteredData}
        compact={false}
        isLoading={isLoading}
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