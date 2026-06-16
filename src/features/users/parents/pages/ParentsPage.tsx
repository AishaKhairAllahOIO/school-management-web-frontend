import { useMemo, useState } from "react";

import { UsersToolbar } from "@/features/users/shared/components/UsersToolbar";
import { UsersTable } from "@/features/users/shared/components/UsersTable";
import { parentsMock } from "@/features/users/parents/mocks/parents.mock";
import type { ParentUser } from "@/features/users/parents/types/parent.types";

export function ParentsPage() {
  const [searchValue, setSearchValue] = useState("");

  const filteredParents = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return parentsMock;

    return parentsMock.filter((parent) => {
      const fullName = `${parent.firstName} ${parent.lastName}`.toLowerCase();

      return (
        fullName.includes(search) ||
        parent.phoneNumber.toLowerCase().includes(search) ||
        parent.parentCode.toLowerCase().includes(search) ||
        parent.occupation!.toLowerCase().includes(search) ||
        parent.relation.toLowerCase().includes(search)
      );
    });
  }, [searchValue]);

  return (
    <div className="space-y-4">
      <UsersToolbar
        searchValue={searchValue}
        searchPlaceholder="Search parents..."
        addLabel="Add Parent"
        importLabel="Import Parents"
        exportLabel="Export Parents"
        filterLabel="Filter"
        onSearchChange={setSearchValue}
        onImport={() => {}}
        onExport={() => {}}
      />

      <UsersTable<ParentUser>
        users={filteredParents}
        nameTitle="Parent Name"
        extraColumns={[
          {
            key: "parentCode",
            title: "Parent Code",
            render: (parent) => parent.parentCode,
          },
          {
            key: "relation",
            title: "Relation",
            render: (parent) => parent.relation,
          },
          {
            key: "occupation",
            title: "Occupation",
            render: (parent) => parent.occupation,
          },
        ]}
      />
    </div>
  );
}