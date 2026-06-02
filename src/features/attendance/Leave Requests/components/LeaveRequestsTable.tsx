import type {
  LeaveRequest,
} from "../types/staffLeave.types";

import { LeaveStatusBadge }
from "./LeaveStatusBadge";

interface Props {
  data: LeaveRequest[];

  onSelect: (
    leave: LeaveRequest
  ) => void;
}

export const LeaveRequestsTable = ({
  data,
  onSelect,
}: Props) => {
  const calculateDays = (
    startDate: string,
    endDate: string
  ) => {
    const start =
      new Date(startDate);

    const end =
      new Date(endDate);

    const diff =
      end.getTime() -
      start.getTime();

    return (
      Math.floor(
        diff /
          (1000 *
            60 *
            60 *
            24)
      ) + 1
    );
  };

  return (
    <div
      className="
        soft-card
        overflow-hidden
        rounded-3xl
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full">

          <thead
            className="
              bg-muted/40
            "
          >
            <tr>
              <th className="p-4 text-left">
                Employee
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Start Date
              </th>

              <th className="p-4 text-left">
                End Date
              </th>

              <th className="p-4 text-left">
                Duration
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Approved By
              </th>
            </tr>
          </thead>

          <tbody>

            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  onSelect(item)
                }
                className="
                  border-t
                  cursor-pointer
                  transition-colors
                  hover:bg-muted/20
                "
              >
                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-primary/10
                        text-primary
                        font-semibold
                      "
                    >
                      {item.employeeName.charAt(
                        0
                      )}
                    </div>

                    <div>

                      <p className="font-medium">
                        {item.employeeName}
                      </p>

                      <p
                        className="
                          text-xs
                          text-muted-foreground
                        "
                      >
                        {item.role}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="p-4">
                  {item.leaveType}
                </td>

                <td className="p-4">
                  {item.startDate}
                </td>

                <td className="p-4">
                  {item.endDate}
                </td>

                <td className="p-4">
                  {calculateDays(
                    item.startDate,
                    item.endDate
                  )}{" "}
                  Days
                </td>

                <td className="p-4">
                  <LeaveStatusBadge
                    status={item.status}
                  />
                </td>

                <td className="p-4">
                  {item.approvedBy ??
                    "-"}
                </td>

              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="
                    py-10
                    text-center
                    text-muted-foreground
                  "
                >
                  No leave requests found.
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
};