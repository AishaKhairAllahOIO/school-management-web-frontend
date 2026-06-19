import type {
  PayrollHistory,
} from "../types/payrollHistory.types";

interface Props {
  data: PayrollHistory[];

  onSelect: (
    payroll: PayrollHistory
  ) => void;
}

export const PayrollTable = ({
  data,
  onSelect,
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
                Employee
              </th>

              <th className="p-4 text-left">
                Month
              </th>

              <th className="p-4 text-left">
                Base Salary
              </th>

              <th className="p-4 text-left">
                Net Salary
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Paid Date
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
                  {item.month}
                </td>

                <td className="p-4 font-medium">
                  {item.baseSalary.toLocaleString()}
                </td>

                <td className="p-4 font-bold">
                  {item.netSalary.toLocaleString()}
                </td>

                <td className="p-4">

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${
                        item.status ===
                        "Paid"
                          ? "bg-green-100 text-green-700"
                          : item.status ===
                              "Pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="p-4">
                  {item.paidDate || "-"}
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
};