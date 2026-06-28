 import {
  useMemo,
  useState,
} from "react";

import {
  useDeductions,
} from   "../hooks/useDeductions";

import { DeductionStats }
from "../components/DeductionStats";

import { DeductionFilters }
from "../components/DeductionFilters";

import { DeductionsTable }
from "../components/DeductionsTable";

import { DeductionDetailsDrawer }
from "../components/DeductionDetailsDrawer";

import type {
  Deduction,
} from "../types/deduction.types";

export const DeductionsPage =
() => {

  const {
    data = [],
    isLoading,
  } = useDeductions();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    type,
    setType,
  ] = useState("all");

  const [
    status,
    setStatus,
  ] = useState("all");

  const [
    selectedDeduction,
    setSelectedDeduction,
  ] = useState<
    Deduction | undefined
  >();

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const filteredData =
    useMemo(() => {

      return data.filter(
        (deduction) => {

          const matchesSearch =
            deduction.employeeName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesType =
            type === "all" ||
            deduction.type ===
              type;

          const matchesStatus =
            status === "all" ||
            deduction.status ===
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
      type,
      status,
    ]);

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const totalAmount =
    filteredData.reduce(
      (
        total,
        deduction
      ) =>
        total +
        deduction.amount,
      0
    );

  const appliedCount =
    filteredData.filter(
      (x) =>
        x.status ===
        "Applied"
    ).length;

  const pendingCount =
    filteredData.filter(
      (x) =>
        x.status ===
        "Pending"
    ).length;

  return (
    <div className="space-y-6">

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Deductions
        </h1>

        <p
          className="
            text-muted-foreground
          "
        >
          Manage salary
          deductions and
          penalties.
        </p>

      </div>

      <DeductionStats
        deductionsCount={
          filteredData.length
        }
        totalAmount={
          totalAmount
        }
        appliedCount={
          appliedCount
        }
        pendingCount={
          pendingCount
        }
      />

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <DeductionFilters
          search={search}
          setSearch={
            setSearch
          }
          type={type}
          setType={
            setType
          }
          status={status}
          setStatus={
            setStatus
          }
        />
      </div>

      <DeductionsTable
        data={filteredData}
        onSelect={(
          deduction
        ) => {

          setSelectedDeduction(
            deduction
          );

          setDrawerOpen(
            true
          );

        }}
      />

      <DeductionDetailsDrawer
        open={drawerOpen}
        onOpenChange={
          setDrawerOpen
        }
        deduction={
          selectedDeduction
        }
      />

    </div>
  );
}; 