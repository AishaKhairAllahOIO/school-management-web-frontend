import {
  WalletCards,
} from "lucide-react";

export function PayrollHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          className="
            flex size-11 shrink-0 items-center justify-center
            rounded-2xl
            bg-primary/10
            text-primary
          "
        >
          <WalletCards className="size-5" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Staff Payroll
          </h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage staff contracts, salaries and payments.
          </p>
        </div>
      </div>
    </div>
  );
}