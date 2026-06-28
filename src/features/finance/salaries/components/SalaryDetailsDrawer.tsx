import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import {
  Wallet,
  Briefcase,
  Calculator,
  BadgeDollarSign,
} from "lucide-react";

import type {
  SalaryProfile,
} from "../types/salary.types";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  salary?: SalaryProfile;
}

export const SalaryDetailsDrawer = ({
  open,
  onOpenChange,
  salary,
}: Props) => {
  if (!salary) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        className="
          w-[550px]
          sm:max-w-[550px]
          overflow-y-auto
        "
      >
        <SheetHeader>
          <SheetTitle>
            Salary Profile
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">

          <div className="soft-card rounded-3xl p-5">
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
                {salary.employeeName.charAt(0)}
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  {salary.employeeName}
                </h3>

                <p className="text-muted-foreground">
                  {salary.role}
                </p>
              </div>

            </div>
          </div>

          <div className="grid gap-4">

            <div className="soft-card rounded-2xl p-4">
              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Department
                  </p>

                  <h4 className="font-semibold">
                    {salary.department}
                  </h4>
                </div>

                <Briefcase />
              </div>
            </div>

            <div className="soft-card rounded-2xl p-4">
              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Salary Type
                  </p>

                  <h4 className="font-semibold">
                    {salary.salaryType}
                  </h4>
                </div>

                <Calculator />
              </div>
            </div>

            <div className="soft-card rounded-2xl p-4">
              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Base Salary
                  </p>

                  <h4 className="font-bold text-2xl">
                    {salary.baseSalary.toLocaleString()} SAR
                  </h4>
                </div>

                <Wallet />
              </div>
            </div>

          </div>

          {salary.salaryType ===
            "Per Session" && (
            <div className="soft-card rounded-2xl p-4">

              <h4 className="font-semibold mb-3">
                Teaching Sessions
              </h4>

              <div className="space-y-2">

                <div className="flex justify-between">
                  <span>
                    Session Rate
                  </span>

                  <span>
                    {
                      salary.sessionRate
                    }{" "}
                    SAR
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Expected Sessions
                  </span>

                  <span>
                    {
                      salary.expectedSessions
                    }
                  </span>
                </div>

              </div>

            </div>
          )}

          <div className="soft-card rounded-2xl p-4">

            <h4 className="font-semibold mb-3">
              Current Month
            </h4>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>
                  Leave Deduction
                </span>

                <span className="text-red-500">
                  -50 SAR
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Attendance Deduction
                </span>

                <span className="text-red-500">
                  -20 SAR
                </span>
              </div>

              <div className="flex justify-between font-bold">
                <span>
                  Net Salary
                </span>

                <span className="text-green-600">
                  {(
                    salary.baseSalary -
                    70
                  ).toLocaleString()}{" "}
                  SAR
                </span>
              </div>

            </div>

          </div>

          <div className="soft-card rounded-2xl p-4">

            <h4 className="font-semibold mb-3">
              Salary History
            </h4>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span>
                  April 2026
                </span>

                <span>
                  4,650 SAR
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  March 2026
                </span>

                <span>
                  4,720 SAR
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  February 2026
                </span>

                <span>
                  4,800 SAR
                </span>
              </div>

            </div>

          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};