import {
  AttendanceStatusBadge,
} from "./AttendanceStatusBadge";

import type {
  StaffAttendance,
} from "../types/staffAttendance.types";

import {
  EditStaffAttendanceDialog,
} from "./EditStaffAttendanceDialog";

import {
  DeleteAttendanceDialog,
} from "./DeleteAttendanceDialog";

interface Props {
  data: StaffAttendance[];
}

export const StaffAttendanceTable = ({
  data,
}: Props) => {

  const calculateHours = (
    checkIn?: string,
    checkOut?: string
  ) => {

    if (!checkIn || !checkOut)
      return "-";

    const start =
      new Date(
        `2025-01-01 ${checkIn}`
      );

    const end =
      new Date(
        `2025-01-01 ${checkOut}`
      );

    const diff =
      (end.getTime() -
        start.getTime()) /
      1000 /
      60 /
      60;

    return `${diff.toFixed(1)} h`;
  };

  return (
    <div
      className="
        soft-card
        overflow-hidden
        rounded-3xl
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          px-6
          py-4
        "
      >
        <div>
          <h3 className="font-semibold">
            Attendance Records
          </h3>

          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            {data.length} records
          </p>
        </div>
      </div>

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
                Role
              </th>

              <th className="p-4 text-left">
                Check In
              </th>

              <th className="p-4 text-left">
                Check Out
              </th>

              <th className="p-4 text-left">
                Hours
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Notes
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {data.map((item) => (

              <tr
                key={item.id}
                className="
                  border-t
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
                        font-semibold
                        text-primary
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
                        {item.employeeId}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="p-4">
                  {item.role}
                </td>

               
                <td className="p-4">
                  {item.checkIn ?? "-"}
                </td>

                <td className="p-4">
                  {item.checkOut ?? "-"}
                </td>

                <td className="p-4">
                  {calculateHours(
                    item.checkIn,
                    item.checkOut
                  )}
                </td>

                <td className="p-4">
                  <AttendanceStatusBadge
                    status={item.status}
                  />
                </td>

                <td className="p-4">
                  {item.notes ?? "-"}
                </td>

                <td className="p-4">

                  <div
                    className="
                      flex
                      justify-center
                      gap-2
                    "
                  >

                    <EditStaffAttendanceDialog
                      attendance={item}
                    />

                    <DeleteAttendanceDialog
                      id={item.id}
                    />

                  </div>

                </td>

              </tr>

            ))}

            {data.length === 0 && (

              <tr>

                <td
                  colSpan={9}
                  className="
                    py-10
                    text-center
                    text-muted-foreground
                  "
                >
                  No attendance records found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};