import {
  Wallet,
  Banknote,
  Clock3,
  TrendingUp,
} from "lucide-react";

interface Props {
  totalEmployees: number;

  paidCount: number;

  pendingCount: number;

  totalPayroll: number;
}

export const SalaryStats = ({
  totalEmployees,
  paidCount,
  pendingCount,
  totalPayroll,
}: Props) => {
  return (
    <div
      className="
        grid
        gap-4
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      <div className="soft-card rounded-3xl p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Employees
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {totalEmployees}
            </h3>
          </div>

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >
            <Wallet size={24} />
          </div>
        </div>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Paid
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {paidCount}
            </h3>
          </div>

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-green-100
              text-green-600
            "
          >
            <Banknote size={24} />
          </div>
        </div>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Pending
            </p>

            <h3 className="mt-2 text-3xl font-bold text-orange-500">
              {pendingCount}
            </h3>
          </div>

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-orange-100
              text-orange-500
            "
          >
            <Clock3 size={24} />
          </div>
        </div>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Payroll Cost
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {totalPayroll.toLocaleString()}
            </h3>
          </div>

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-blue-100
              text-blue-600
            "
          >
            <TrendingUp size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};