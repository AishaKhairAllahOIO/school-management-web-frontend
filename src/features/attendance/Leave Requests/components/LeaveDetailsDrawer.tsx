import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from  "@/shared/ui/sheet";

import type {
  LeaveRequest,
} from "../types/staffLeave.types";

import { Button } from "@/shared/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;

  leave?: LeaveRequest;
}

export const LeaveDetailsDrawer = ({
  open,
  onOpenChange,
  leave,
}: Props) => {
  if (!leave) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        className="
          w-[500px]
          sm:max-w-[500px]
          overflow-y-auto
        "
      >
        <SheetHeader>
          <SheetTitle>
            {leave.employeeName}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">

          {/* Employee */}

         <div
  className="
    rounded-3xl
    border
    bg-background
    p-6
  "
>
  <div className="flex items-center gap-4">

    <div
      className="
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        bg-primary/10
        text-2xl
        font-bold
        text-primary
      "
    >
      {leave.employeeName.charAt(0)}
    </div>

    <div>
      <h2 className="text-xl font-bold">
        {leave.employeeName}
      </h2>

      <p className="text-muted-foreground">
        {leave.role}
      </p>

      <p
        className="
          text-xs
          text-muted-foreground
        "
      >
        {leave.employeeId}
      </p>
    </div>

  </div>
</div>

          {/* Leave Balance */}

          <div className="soft-card rounded-2xl p-4">
            <h4 className="font-semibold mb-3">
              Leave Balance
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  Annual Leave
                </span>

                <span>
                  8 / 14
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Sick Leave
                </span>

                <span>
                  2 / 10
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Emergency
                </span>

                <span>
                  1 / 5
                </span>
              </div>
            </div>
          </div>

          {/* Current Request */}

          <div className="soft-card rounded-2xl p-4">
            <h4 className="font-semibold mb-3">
              Current Request
            </h4>

            <div className="space-y-2">
              <p>
                Type:
                {" "}
                {leave.leaveType}
              </p>

              <p>
                From:
                {" "}
                {leave.startDate}
              </p>

              <p>
                To:
                {" "}
                {leave.endDate}
              </p>

              <p>
                Status:
                {" "}
                {leave.status}
              </p>
            </div>
          </div>

          {/* History */}

          <div className="soft-card rounded-2xl p-4">
            <h4 className="font-semibold mb-3">
              Leave History
            </h4>

            <div className="space-y-2 text-sm">
              <p>
                Annual Leave • 5 Days
              </p>

              <p>
                Sick Leave • 2 Days
              </p>

              <p>
                Emergency • 1 Day
              </p>
            </div>
          </div>

          {/* Actions */}

          <div className="flex gap-3">
            <Button className="flex-1">
              Add Leave
            </Button>

            <Button
              variant="outline"
            >
              Approve
            </Button>

            <Button
              variant="outline"
            >
              Reject
            </Button>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};