interface Props {
  totalPayroll: number;

  paidCount: number;

  pendingCount: number;

  totalBonuses: number;
}

export const PayrollStats = ({
  totalPayroll,
  paidCount,
  pendingCount,
  totalBonuses,
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
        <p className="text-sm text-muted-foreground">
          Total Payroll
        </p>

        <h3 className="text-3xl font-bold mt-2">
          {totalPayroll.toLocaleString()}
        </h3>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <p className="text-sm text-muted-foreground">
          Paid Records
        </p>

        <h3 className="text-3xl font-bold text-green-600 mt-2">
          {paidCount}
        </h3>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <p className="text-sm text-muted-foreground">
          Pending Records
        </p>

        <h3 className="text-3xl font-bold text-orange-500 mt-2">
          {pendingCount}
        </h3>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <p className="text-sm text-muted-foreground">
          Bonuses
        </p>

        <h3 className="text-3xl font-bold text-primary mt-2">
          {totalBonuses.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};