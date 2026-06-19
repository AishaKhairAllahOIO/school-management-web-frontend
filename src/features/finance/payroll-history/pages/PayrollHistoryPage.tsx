import {
  useMemo,
  useState,
} from "react";

import {
  usePayrollHistory,
} from "../hooks/usePayrollHistory";

import { PayrollStats }
from "../components/PayrollStats";

import { PayrollFilters }
from "../components/PayrollFilters";

import { PayrollTable }
from "../components/PayrollTable";

import { PayrollDetailsDrawer }
from "../components/PayrollDetailsDrawer";

import type {
  PayrollHistory,
} from "../types/payrollHistory.types";

export const PayrollHistoryPage =
() => {

  const {
    data = [],
    isLoading,
  } = usePayrollHistory();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedPayroll,
    setSelectedPayroll,
  ] = useState<
    PayrollHistory | undefined
  >();

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const filteredData =
    useMemo(() => {

      return data.filter(
        (payroll) => {

          return (
            payroll.employeeName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            payroll.role
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            payroll.month
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );

        }
      );

    }, [
      data,
      search,
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
      (
        total,
        payroll
      ) =>
        total +
        payroll.netSalary,
      0
    );

  const paidCount =
    filteredData.filter(
      (x) =>
        x.status ===
        "Paid"
    ).length;

  const pendingCount =
    filteredData.filter(
      (x) =>
        x.status ===
        "Pending"
    ).length;

  const totalBonuses =
    filteredData.reduce(
      (
        total,
        payroll
      ) =>
        total +
        payroll.bonus,
      0
    );

  return (
    <div className="space-y-6">

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Payroll History
        </h1>

        <p
          className="
            text-muted-foreground
          "
        >
          View payroll records,
          salary payments and
          deductions history.
        </p>

      </div>

      <PayrollStats
        totalPayroll={
          totalPayroll
        }
        paidCount={
          paidCount
        }
        pendingCount={
          pendingCount
        }
        totalBonuses={
          totalBonuses
        }
      />

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <PayrollFilters
          search={search}
          setSearch={
            setSearch
          }
        />
      </div>

      <PayrollTable
        data={filteredData}
        onSelect={(
          payroll
        ) => {

          setSelectedPayroll(
            payroll
          );

          setDrawerOpen(
            true
          );

        }}
      />

      <PayrollDetailsDrawer
        open={drawerOpen}
        onOpenChange={
          setDrawerOpen
        }
        payroll={
          selectedPayroll
        }
      />

    </div>
  );
};