import { useMemo, useState } from "react";

import { UsersToolbar } from "@/features/users/components/UsersToolbar";
import { UsersTable } from "@/features/users/components/UsersTable";
import { secretaryCsvColumns } from "@/features/users/shared/config/userCsvColumns";
import {
  exportDataToCsv,
  parseCsvFile,
} from "@/features/users/shared/utils/usersCsv.utils";

import { secretariesMock } from "@/features/users/secretaries/mocks/secretaries.mock";
import type { SecretaryUser } from "@/features/users/secretaries/types/secretary.types";

export function SecretariesPage() {
  const [searchValue, setSearchValue] = useState("");

  const filteredSecretaries = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return secretariesMock;

    return secretariesMock.filter((secretary) => {
      const fullName =
        `${secretary.firstName} ${secretary.lastName}`.toLowerCase();

      return (
        fullName.includes(search) ||
        secretary.phoneNumber.toLowerCase().includes(search) ||
        secretary.secretaryCode.toLowerCase().includes(search) ||
        secretary.specialization.toLowerCase().includes(search)
      );
    });
  }, [searchValue]);

  function handleExportSecretaries() {
    exportDataToCsv(
      filteredSecretaries,
      secretaryCsvColumns,
      "secretaries.csv"
    );
  }

  async function handleImportSecretaries(file: File) {
    const rows = await parseCsvFile(file);

    console.log("Secretaries CSV rows ready for API:", rows);

    // لاحقًا:
    // await createSecretariesBulk(rows);
  }

  return (
    <div className="space-y-4">
      <UsersToolbar
        searchValue={searchValue}
        searchPlaceholder="Search secretaries..."
        addLabel="Add Secretary"
        importLabel="Import Secretaries"
        exportLabel="Export Secretaries"
        filterLabel="Filter"
        onSearchChange={setSearchValue}
        onImport={handleImportSecretaries}
        onExport={handleExportSecretaries}
      />

      <UsersTable<SecretaryUser>
        users={filteredSecretaries}
        nameTitle="Secretary Name"
        extraColumns={[
          {
            key: "secretaryCode",
            title: "Secretary Code",
            render: (secretary) => secretary.secretaryCode,
          },
          {
            key: "degree",
            title: "Degree",
            render: (secretary) => secretary.degree,
          },
          {
            key: "specialization",
            title: "Specialization",
            render: (secretary) => secretary.specialization,
          },
          {
            key: "yearsOfExperience",
            title: "Experience",
            render: (secretary) =>
              `${secretary.yearsOfExperience ?? 0} Years`,
          },
        ]}
      />
    </div>
  );
}