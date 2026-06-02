import {
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";

import { Button } from "@/shared/ui/button";

type Attendance = {
  id: string;
  studentName: string;
  className: string;
  section: string;
  status: "Present" | "Absent";
  absenceType?: "Excused" | "Unexcused";
  date: string;
};

interface Props {
  data: Attendance[];
}

export const AttendanceTable = ({
  data,
}: Props) => {
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
                Student
              </th>

              <th className="p-4 text-left">
                Class
              </th>

              <th className="p-4 text-left">
                Section
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Absence Type
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((student) => (
              <tr
                key={student.id}
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
                      {student.studentName
                        .charAt(0)}
                    </div>

                    <span>
                      {student.studentName}
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  {student.className}
                </td>

                <td className="p-4">
                  {student.section}
                </td>

                <td className="p-4">
                  {student.status ===
                  "Present" ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-green-700
                      "
                    >
                      <CheckCircle size={15} />
                      Present
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-red-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-red-700
                      "
                    >
                      <XCircle size={15} />
                      Absent
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {student.status ===
                  "Absent" ? (
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-medium
                        ${
                          student.absenceType ===
                          "Excused"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      `}
                    >
                      {student.absenceType}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-4">
                  {student.date}
                </td>

                <td className="p-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Edit size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};