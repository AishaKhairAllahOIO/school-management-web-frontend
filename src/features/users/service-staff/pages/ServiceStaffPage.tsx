import { useMemo, useState } from "react";

import { UsersToolbar } from "@/features/users//shared/components/UsersToolbar";
import { UsersTable } from "@/features/users/shared/components/UsersTable";

import { serviceStaffMock } from "@/features/users/service-staff/mocks/service-staff.mock";
import type { ServiceStaffUser } from "@/features/users/service-staff/types/service-staff.types";

export function ServiceStaffPage() {
  const [searchValue, setSearchValue] = useState("");

  const filteredStaff = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return serviceStaffMock;

    return serviceStaffMock.filter((staff) => {
      const fullName =
        `${staff.firstName} ${staff.lastName}`.toLowerCase();

      return (
        fullName.includes(search) ||
        staff.phoneNumber.toLowerCase().includes(search) ||
        staff.jobType.toLowerCase().includes(search)
      );
    });
  }, [searchValue]);

  return (
    <div className="space-y-4">
      <UsersToolbar
        searchValue={searchValue}
        searchPlaceholder="Search service staff..."
        addLabel="Add Staff Member"
        importLabel="Import Staff"
        exportLabel="Export Staff"
        filterLabel="Filter"
        onSearchChange={setSearchValue}
        onImport={() => {}}
        onExport={() => {}}
      />

      <UsersTable<ServiceStaffUser>
        users={filteredStaff}
        nameTitle="Staff Member"
        extraColumns={[
          {
            key: "jobType",
            title: "Job Type",
            render: (staff) => staff.jobType,
          },
          {
            key: "hireDate",
            title: "Hire Date",
            render: (staff) => staff.hireDate,
          },
        ]}
      />
    </div>
  );
}