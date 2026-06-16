import { useMemo, useState } from "react";

import { UsersToolbar } from "@/features/users/shared/components/UsersToolbar";
import { UsersTable } from "@/features/users/shared/components/UsersTable";
import { supervisorCsvColumns } from "@/features/users/shared/config/userCsvColumns";
import {
  exportDataToCsv,
  parseCsvFile,
} from "@/features/users/shared/utils/usersCsv.utils";

import { supervisorsMock } from "@/features/users/supervisors/mocks/supervisors.mock";
import type { SupervisorUser } from "@/features/users/supervisors/types/supervisor.types";

export function SupervisorsPage() {
  const [searchValue, setSearchValue] = useState("");

  const filteredSupervisors = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return supervisorsMock;

    return supervisorsMock.filter((supervisor) => {
      const fullName =
        `${supervisor.firstName} ${supervisor.lastName}`.toLowerCase();

      return (
        fullName.includes(search) ||
        supervisor.phoneNumber.toLowerCase().includes(search) ||
        supervisor.supervisorCode.toLowerCase().includes(search) ||
        supervisor.supervisorEmail.toLowerCase().includes(search) ||
        supervisor.specialization.toLowerCase().includes(search)
      );
    });
  }, [searchValue]);

  function handleExportSupervisors() {
    exportDataToCsv(
      filteredSupervisors,
      supervisorCsvColumns,
      "supervisors.csv"
    );
  }

  async function handleImportSupervisors(file: File) {
    const rows = await parseCsvFile(file);

    console.log("Supervisors CSV rows ready for API:", rows);

    // لاحقًا:
    // await createSupervisorsBulk(rows);
  }

  return (
    <div className="space-y-4">
      <UsersToolbar
        searchValue={searchValue}
        searchPlaceholder="Search supervisors..."
        addLabel="Add Supervisor"
        importLabel="Import Supervisors"
        exportLabel="Export Supervisors"
        filterLabel="Filter"
        onSearchChange={setSearchValue}
        onImport={handleImportSupervisors}
        onExport={handleExportSupervisors}
      />

      <UsersTable<SupervisorUser>
        users={filteredSupervisors}
        nameTitle="Supervisor Name"
        extraColumns={[
          {
            key: "supervisorCode",
            title: "Supervisor Code",
            render: (supervisor) => supervisor.supervisorCode,
          },
          {
            key: "degree",
            title: "Degree",
            render: (supervisor) => supervisor.degree,
          },
          {
            key: "specialization",
            title: "Specialization",
            render: (supervisor) => supervisor.specialization,
          },
          {
            key: "yearsOfExperience",
            title: "Experience",
            render: (supervisor) =>
              `${supervisor.yearsOfExperience ?? 0} Years`,
          },
        ]}
      />
    </div>
  );
}