interface Props {
  totalAmount: number;

  appliedCount: number;

  pendingCount: number;

  deductionsCount: number;
}

export const DeductionStats = ({
  totalAmount,
  appliedCount,
  pendingCount,
  deductionsCount,
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
          Total Deductions
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {deductionsCount}
        </h3>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <p className="text-sm text-muted-foreground">
          Total Amount
        </p>

        <h3 className="mt-2 text-3xl font-bold text-red-500">
          {totalAmount}
        </h3>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <p className="text-sm text-muted-foreground">
          Applied
        </p>

        <h3 className="mt-2 text-3xl font-bold text-green-600">
          {appliedCount}
        </h3>
      </div>

      <div className="soft-card rounded-3xl p-5">
        <p className="text-sm text-muted-foreground">
          Pending
        </p>

        <h3 className="mt-2 text-3xl font-bold text-orange-500">
          {pendingCount}
        </h3>
      </div>
    </div>
  );
};