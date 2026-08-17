import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/shared/ui/button";

import {
  useDeletePayroll,
  usePayroll,
  useUpdatePayroll,
} from "../hooks/usePayroll";

import {
  formatSalary,
  getStaffName,
} from "../utils/payroll.utils";

import type { ApiId } from "../types/payroll.types";

import { ConfirmDialog } from "./ConfirmDialog";

type Props = {
  payrollId: ApiId | null;
  onClose: () => void;
};

export function PayrollDetailDialog({
  payrollId,
  onClose,
}: Props) {
  const query = usePayroll(
    payrollId ?? undefined,
  );

  const updateMutation =
    useUpdatePayroll();

  const deleteMutation =
    useDeletePayroll();

  const [paymentDate, setPaymentDate] =
    useState("");

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const payroll =
    query.data?.data;

  async function saveDate() {
    if (!payroll || !paymentDate) {
      return;
    }

    await updateMutation.mutateAsync({
      id: payroll.id,

      payload: {
        payment_date:
          paymentDate,
      },
    });
  }

  async function deletePayroll() {
    if (!payroll) {
      return;
    }

    await deleteMutation.mutateAsync(
      payroll.id,
    );

    setDeleteOpen(false);
    onClose();
  }

  if (!payrollId) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        />

        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[24px] border border-border/50 bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold">
                Payroll details
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Payment information
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

          {query.isLoading && (
            <div className="p-10 text-center">
              <Loader2 className="mx-auto size-5 animate-spin text-primary" />

              <p className="mt-3 text-xs text-muted-foreground">
                Loading payroll...
              </p>
            </div>
          )}

          {query.isError && (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-destructive">
                Failed to load payroll.
              </p>
            </div>
          )}

          {payroll && (
            <div className="p-5">
              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-sm font-bold">
                  {getStaffName(
                    payroll.staff,
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {payroll.month}/{payroll.year}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Info
                  label="Net salary"
                  value={formatSalary(
                    payroll.net_salary,
                  )}
                />

                <Info
                  label="Contract"
                  value={`#${payroll.contract_id}`}
                />

                <Info
                  label="Status"
                  value={
                    payroll.payment_date
                      ? "Paid"
                      : "Pending"
                  }
                  icon={
                    payroll.payment_date
                      ? CheckCircle2
                      : Clock3
                  }
                />

                <Info
                  label="Payroll ID"
                  value={`#${payroll.id}`}
                />
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold">
                  Payment date
                </label>

                <div className="mt-1.5 flex gap-2">
                  <div className="relative flex-1">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      type="date"
                      value={
                        paymentDate ||
                        payroll.payment_date ||
                        ""
                      }
                      onChange={(event) =>
                        setPaymentDate(
                          event.target.value,
                        )
                      }
                      className="
                        h-10 w-full rounded-xl
                        border border-border/60
                        bg-background pl-9 pr-3
                        text-sm outline-none
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/10
                      "
                    />
                  </div>

                  <Button
                    type="button"
                    className="h-10 rounded-xl"
                    onClick={saveDate}
                    disabled={
                      updateMutation.isPending ||
                      !(
                        paymentDate ||
                        payroll.payment_date
                      )
                    }
                  >
                    {updateMutation.isPending && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}

                    Save
                  </Button>
                </div>

                {updateMutation.isError && (
                  <p className="mt-2 text-xs text-destructive">
                    Failed to update payment date.
                  </p>
                )}
              </div>

              <div className="mt-5 flex justify-between border-t border-border/50 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() =>
                    setDeleteOpen(true)
                  }
                >
                  <Trash2 className="mr-2 size-4" />

                  Delete
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete payroll?"
        description="This payment record will be permanently removed."
        loading={
          deleteMutation.isPending
        }
        onClose={() =>
          setDeleteOpen(false)
        }
        onConfirm={deletePayroll}
      />
    </>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof CheckCircle2;
}) {
  return (
    <div className="rounded-xl border border-border/50 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-1.5 text-sm font-bold">
        {Icon && (
          <Icon className="size-3.5 text-success" />
        )}

        {value}
      </div>
    </div>
  );
}