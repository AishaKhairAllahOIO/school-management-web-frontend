import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  ReceiptText,
} from "lucide-react";

import { Button } from "@/shared/ui/button";

import {
  useSalaryProfiles,
} from "../hooks/useSalaryProfiles";

import { SalaryStats }
from "../components/SalaryStats";

import { SalaryFilters }
from "../components/SalaryFilters";

import { SalaryTable }
from "../components/SalaryTable";

import { SalaryDetailsDrawer }
from "../components/SalaryDetailsDrawer";

import { AddSalaryDialog }
from "../components/AddSalaryDialog";

import { GeneratePayrollDialog }
from "../components/GeneratePayrollDialog";

import type {
  SalaryProfile,
} from "../types/salary.types";

export const SalariesPage = () => {

  const {
    data = [],
    isLoading,
  } = useSalaryProfiles();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    role,
    setRole,
  ] = useState("all");

  const [
    selectedSalary,
    setSelectedSalary,
  ] = useState<
    SalaryProfile | undefined
  >();

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    payrollDialogOpen,
    setPayrollDialogOpen,
  ] = useState(false);

  const filteredData =
    useMemo(() => {

      return data.filter(
        (salary) => {

          const matchesSearch =
            salary.employeeName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesRole =
            role === "all" ||
            salary.role === role;

          return (
            matchesSearch &&
            matchesRole
          );
        }
      );

    }, [
      data,
      search,
      role,
    ]);

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const totalPayroll =
    filteredData.reduce(
      (sum, employee) =>
        sum +
        employee.baseSalary,
      0
    );

  return (
    <div className="space-y-6">

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
        "
      >
        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Salaries
          </h1>

          <p
            className="
              text-muted-foreground
            "
          >
            Manage payroll and salary profiles.
          </p>

        </div>

        <div className="flex gap-3">

          <Button
            variant="outline"
            onClick={() =>
              setPayrollDialogOpen(
                true
              )
            }
          >
            <ReceiptText
              size={18}
              className="mr-2"
            />

            Generate Payroll
          </Button>

          <AddSalaryDialog />

        </div>

      </div>

      <SalaryStats
        totalEmployees={
          filteredData.length
        }
        paidCount={18}
        pendingCount={4}
        totalPayroll={
          totalPayroll
        }
      />

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <SalaryFilters
          search={search}
          setSearch={
            setSearch
          }
          role={role}
          setRole={setRole}
        />
      </div>

      <SalaryTable
        data={filteredData}
        onSelect={(
          salary
        ) => {

          setSelectedSalary(
            salary
          );

          setDrawerOpen(
            true
          );
        }}
      />

      <SalaryDetailsDrawer
        open={drawerOpen}
        onOpenChange={
          setDrawerOpen
        }
        salary={
          selectedSalary
        }
      />

      <GeneratePayrollDialog
        open={
          payrollDialogOpen
        }
        onOpenChange={
          setPayrollDialogOpen
        }
      />

    </div>
  );
};