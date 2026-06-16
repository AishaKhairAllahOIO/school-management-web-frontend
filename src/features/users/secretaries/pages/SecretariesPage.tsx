import { useMemo, useState } from "react";

import { UsersToolbar } from "@/features/users/shared/components/UsersToolbar";
import { UsersTable } from "@/features/users/shared/components/UsersTable";

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
        secretary.secretaryEmail.toLowerCase().includes(search) ||
        secretary.specialization.toLowerCase().includes(search)
      );
    });
  }, [searchValue]);

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
        onImport={() => {}}
        onExport={() => {}}
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