import { ChevronDown } from "lucide-react";

import { feeCollection } from "@/features/dashboard/data/dashboard.mock";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FeeCollection() {
  return (
    <section className="soft-card rounded-3xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Fee Collection</h2>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-2xl border border-border/70 bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          This Month
          <ChevronDown size={15} />
        </button>
      </div>

      <strong className="text-3xl font-bold tracking-[-0.04em] text-foreground">
        {formatCurrency(feeCollection.totalCollected)}
      </strong>

      <p className="mt-1 text-sm text-muted-foreground">Total Collected</p>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${feeCollection.collectionRate}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <strong className="text-lg font-bold text-foreground">
            {formatCurrency(feeCollection.totalFees)}
          </strong>
          <p className="mt-1 text-sm text-muted-foreground">Total Fees</p>
        </div>

        <div className="text-right">
          <strong className="text-lg font-bold text-foreground">
            {feeCollection.collectionRate}%
          </strong>
          <p className="mt-1 text-sm text-muted-foreground">Collection Rate</p>
        </div>
      </div>
    </section>
  );
}