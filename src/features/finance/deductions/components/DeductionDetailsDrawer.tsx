import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import { Button } from "@/shared/ui/button";

import {
  Wallet,
  MinusCircle,
  CalendarDays,
} from "lucide-react";

import type {
  Deduction,
} from "../types/deduction.types";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  deduction?: Deduction;
}

export const DeductionDetailsDrawer = ({
  open,
  onOpenChange,
  deduction,
}: Props) => {

  if (!deduction) return null;

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
            Deduction Details
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
                {deduction.employeeName.charAt(
                  0
                )}
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  {deduction.employeeName}
                </h3>

                <p className="text-muted-foreground">
                  {deduction.role}
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
            <h3 className="font-semibold mb-4">
              Deduction Information
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Type</span>
                <span>
                  {deduction.type}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Date</span>
                <span>
                  {deduction.date}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span>
                  {deduction.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Created By</span>
                <span>
                  {deduction.createdBy}
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
            <h3 className="font-semibold mb-3">
              Reason
            </h3>

            <p className="text-muted-foreground">
              {deduction.reason}
            </p>
          </div>

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >
            <h3 className="font-semibold mb-4">
              Financial Impact
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between">

                <div className="flex items-center gap-2">
                  <MinusCircle size={16} />
                  Deduction Amount
                </div>

                <span className="font-bold text-red-500">
                  -{deduction.amount}
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
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={18} />
              <h3 className="font-semibold">
                Previous Deductions
              </h3>
            </div>

            <div className="space-y-2 text-sm">

              <p>
                Attendance Deduction
                - 50
              </p>

              <p>
                Leave Deduction
                - 100
              </p>

              <p>
                Manual Deduction
                - 25
              </p>

            </div>
          </div>

          <div className="flex gap-3">

            <Button
              className="
                flex-1
              "
            >
              Apply Deduction
            </Button>

            <Button
              variant="outline"
            >
              Cancel
            </Button>

          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};