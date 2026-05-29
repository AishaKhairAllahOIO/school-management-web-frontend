import { useState } from "react";

import { AddClassDialog } from "../components/AddClassDialog";

import { ClassesTable } from "../components/ClassesTable";

import { useClasses } from "../hooks/useClasses";

import { Input } from "@/shared/ui/input";

import { Search } from "lucide-react";

export const ClassesPage = () => {
  const { data, isLoading } =
    useClasses();

  const [search, setSearch] =
    useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filteredData =
    data?.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Classes
          </h1>

          <p
            className="
              text-muted-foreground
            "
          >
            Manage school classes.
          </p>
        </div>

        <AddClassDialog />
      </div>

      <div
        className="
          relative
          max-w-md
        "
      >
        <Search
          className="
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <Input
          placeholder="Search classes..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="pl-10"
        />
      </div>

      <ClassesTable
        data={filteredData}
      />
    </div>
  );
};