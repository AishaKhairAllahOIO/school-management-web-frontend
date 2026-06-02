import { useMemo, useState } from "react";

import { useLeaveRequests }
from "../hooks/useLeaveRequests";

import { LeaveStats }
from "../components/LeaveStats";

import { LeaveFilters }
from "../components/LeaveFilters";

import { LeaveRequestsTable }
from "../components/LeaveRequestsTable";

import { AddLeaveDialog }
from "../components/AddLeaveDialog";
import type { LeaveRequest } from "../types/staffLeave.types";
import { LeaveDetailsDrawer } from "../components/LeaveDetailsDrawer";
export const LeaveRequestsPage =
() => {
 const [
  selectedLeave,
  setSelectedLeave,
] = useState<
  LeaveRequest | undefined
>();

const [
  drawerOpen,
  setDrawerOpen,
] = useState(false);
  const {
    data = [],
    isLoading,
  } = useLeaveRequests();

  const [search, setSearch] =
    useState("");

  const [
    leaveType,
    setLeaveType,
  ] = useState("all");

  const [
    status,
    setStatus,
  ] = useState("all");

  const filteredData =
    useMemo(() => {

      return data.filter(
        (leave) => {

          const matchesSearch =
            leave.employeeName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesType =
            leaveType === "all" ||
            leave.leaveType ===
              leaveType;

          const matchesStatus =
            status === "all" ||
            leave.status ===
              status;

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus
          );
        }
      );

    }, [
      data,
      search,
      leaveType,
      status,
    ]);

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const approved =
    filteredData.filter(
      (x) =>
        x.status ===
        "Approved"
    ).length;

  const pending =
    filteredData.filter(
      (x) =>
        x.status ===
        "Pending"
    ).length;

  const rejected =
    filteredData.filter(
      (x) =>
        x.status ===
        "Rejected"
    ).length;

  return (
    <div className="space-y-6">

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Leave Requests
          </h1>

          <p
            className="
              text-muted-foreground
            "
          >
            Manage staff leave requests.
          </p>
        </div>

        <AddLeaveDialog />
      </div>

      <LeaveStats
        total={
          filteredData.length
        }
        approved={approved}
        pending={pending}
        rejected={rejected}
      />

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <LeaveFilters
          search={search}
          setSearch={setSearch}
          leaveType={leaveType}
          setLeaveType={
            setLeaveType
          }
          status={status}
          setStatus={setStatus}
        />
      </div>

    
    <LeaveRequestsTable
     data={filteredData}
     onSelect={(leave) => {
     setSelectedLeave(
      leave
      );

    setDrawerOpen(true);
  }}
/>
<LeaveDetailsDrawer
  open={drawerOpen}
  onOpenChange={
    setDrawerOpen
  }
  leave={selectedLeave}
/>
    </div>
  );
};