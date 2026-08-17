import {
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  X,
} from "lucide-react";

import { Button } from "@/shared/ui/button";

import { useCommitPayroll } from "../hooks/usePayroll";
import type {
  ApiId,
  PayrollPreview,
} from "../types/payroll.types";

import { formatSalary } from "../utils/payroll.utils";

type Props = {
  open: boolean;
  staffId: ApiId;
  year: number;
  month: number;
  preview: PayrollPreview | null;
  previewLoading: boolean;
  previewError: boolean;
  onPreview: () => void;
  onClose: () => void;
  onCommitted: () => void;
};

export function PayrollPreviewDialog({
  open,
  staffId,
  year,
  month,
  preview,
  previewLoading,
  previewError,
  onPreview,
  onClose,
  onCommitted,
}: Props) {
  const commitMutation =
    useCommitPayroll();

  if (!open) {
    return null;
  }

  async function commit() {
    await commitMutation.mutateAsync({
      staff_id: staffId,
      year,
      month,
      payment_date:
        new Date()
          .toISOString()
          .slice(0, 10),
    });

    onCommitted();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[24px] border border-border/50 bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold">
              Payroll preview
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {month}/{year}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5">
          {!preview && (
            <div className="rounded-2xl border border-dashed border-border/70 p-7 text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CircleDollarSign className="size-5" />
              </div>

              <p className="mt-3 text-sm font-semibold">
                Calculate payroll
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Preview the salary before committing the payment.
              </p>

              <Button
                type="button"
                className="mt-4 rounded-xl"
                onClick={onPreview}
                disabled={previewLoading}
              >
                {previewLoading && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}

                Generate preview
              </Button>

              {previewError && (
                <p className="mt-3 text-xs text-destructive">
                  Unable to generate payroll preview.
                </p>
              )}
            </div>
          )}

          {preview && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Metric
                  label="Contract rate"
                  value={formatSalary(
                    preview.contract_rate,
                  )}
                />

                <Metric
                  label="Expected units"
                  value={preview.expected_units}
                />

                <Metric
                  label="Missed units"
                  value={preview.missed_units}
                />

                <Metric
                  label="Deductions"
                  value={formatSalary(
                    preview.deductions,
                  )}
                />
              </div>

              <div className="mt-4 rounded-2xl bg-primary/[0.06] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Net salary
                  </span>

                  <span className="text-xl font-bold text-primary">
                    {formatSalary(
                      preview.net_salary,
                    )}
                  </span>
                </div>
              </div>

              {commitMutation.isError && (
                <div className="mt-3 rounded-xl bg-destructive/8 px-3 py-2.5 text-xs text-destructive">
                  Failed to commit payroll.
                </div>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={onClose}
                  disabled={
                    commitMutation.isPending
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  className="rounded-xl"
                  onClick={commit}
                  disabled={
                    commitMutation.isPending
                  }
                >
                  {commitMutation.isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}

                  <CheckCircle2 className="mr-2 size-4" />

                  Confirm payment
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-bold">
        {value}
      </p>
    </div>
  );
}