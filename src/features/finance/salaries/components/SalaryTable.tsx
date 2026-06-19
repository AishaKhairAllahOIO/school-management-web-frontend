import type {
  SalaryProfile,
} from   "../types/salary.types";

interface Props {
  data: SalaryProfile[];

  onSelect: (
    salary: SalaryProfile
  ) => void;
}

export const SalaryTable = ({
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
                Department
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Salary Type
              </th>

              <th className="p-4 text-left">
                Base Salary
              </th>

              <th className="p-4 text-left">
                Status
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
                  <div className="flex gap-3 items-center">
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
                        {item.employeeId}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  {item.department}
                </td>

                <td className="p-4">
                  {item.role}
                </td>

                <td className="p-4">
                  {item.salaryType}
                </td>

                <td className="p-4 font-semibold">
                  {item.baseSalary.toLocaleString()}
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
                        item.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {item.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="
                    py-10
                    text-center
                    text-muted-foreground
                  "
                >
                  No salary records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};