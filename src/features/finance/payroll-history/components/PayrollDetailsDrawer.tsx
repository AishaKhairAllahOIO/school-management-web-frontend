import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import {
  Receipt,
  Wallet,
  MinusCircle,
  PlusCircle,
} from "lucide-react";

import type {
  PayrollHistory,
} from "../types/payrollHistory.types";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  payroll?: PayrollHistory;
}

export const PayrollDetailsDrawer = ({
  open,
  onOpenChange,
  payroll,
}: Props) => {

  if (!payroll) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        className="
          w-[600px]
          sm:max-w-[600px]
          overflow-y-auto
        "
      >

        <SheetHeader>
          <SheetTitle>
            Payroll Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >
            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-primary/10
                  text-primary
                  text-xl
                  font-bold
                "
              >
                {payroll.employeeName.charAt(
                  0
                )}
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  {payroll.employeeName}
                </h3>

                <p className="text-muted-foreground">
                  {payroll.role}
                </p>

              </div>

            </div>
          </div>

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >
            <div className="flex justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Payroll Month
                </p>

                <h3 className="font-bold">
                  {payroll.month}
                </h3>

              </div>

              <Receipt />
            </div>
          </div>

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >

            <h3 className="font-semibold mb-4">
              Salary Breakdown
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>
                  Base Salary
                </span>

                <span>
                  {payroll.baseSalary.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-green-600">

                <div className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  Bonus
                </div>

                <span>
                  +
                  {payroll.bonus.toLocaleString()}
                </span>

              </div>

              <div className="border-t pt-3" />

              <div className="flex justify-between text-red-500">

                <div className="flex items-center gap-2">
                  <MinusCircle size={16} />
                  Leave Deduction
                </div>

                <span>
                  -
                  {payroll.leaveDeduction.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between text-red-500">

                <span>
                  Attendance Deduction
                </span>

                <span>
                  -
                  {payroll.attendanceDeduction.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between text-red-500">

                <span>
                  Manual Deduction
                </span>

                <span>
                  -
                  {payroll.manualDeduction.toLocaleString()}
                </span>

              </div>

              <div className="border-t pt-4" />

              <div
                className="
                  flex
                  justify-between
                  text-lg
                  font-bold
                "
              >
                <span>
                  Net Salary
                </span>

                <span className="text-primary">
                  {payroll.netSalary.toLocaleString()}
                </span>
              </div>

            </div>

          </div>

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >
            <div className="flex justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Payment Status
                </p>

                <h3 className="font-semibold">
                  {payroll.status}
                </h3>

              </div>

              <Wallet />
            </div>

            <p
              className="
                mt-3
                text-sm
                text-muted-foreground
              "
            >
              Payment Date:
              {" "}
              {payroll.paidDate || "-"}
            </p>

          </div>

        </div>

      </SheetContent>
    </Sheet>
  );
};