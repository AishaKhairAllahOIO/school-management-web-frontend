import { useState } from "react";
import { Plus, Palmtree } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";

import { ActionMenu } from "@/features/settings/academic/components/shared/ActionMenu";
import {
  EntityTable,
  EntityTd,
  EntityTh,
} from "@/features/settings/academic/components/shared/EntityTable";

import { useLeaveTypes, useDeleteLeaveType } from "../hooks/useLeaveTypes";
import { LeaveTypeFormDialog } from "../components/LeaveTypeFormDialog";
import type { LeaveType } from "../types/leaveType.types";

export function LeaveTypesSettingsPage() {
  const { data: leaveTypes = [], isLoading } = useLeaveTypes();
  const deleteMutation = useDeleteLeaveType();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<LeaveType | null>(null);

  const handleOpenCreate = () => {
    setSelectedLeaveType(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: LeaveType) => {
    setSelectedLeaveType(item);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete leave type", error);
    }
  };

if (isLoading) {
  return (
    <section className="space-y-3.5 pt-0">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-5 w-56 rounded-md" />
          <Skeleton className="h-4 w-full max-w-[520px] rounded-md" />
        </div>

        <Skeleton className="h-10 w-[135px] shrink-0 rounded-[13px]" />
      </div>

      {/* Table Skeleton */}
      <EntityTable>
        <thead>
          <tr>
            <EntityTh>Leave Type</EntityTh>
            <EntityTh>Payment Type</EntityTh>
            <EntityTh>Max Days / Year</EntityTh>
            <EntityTh align="right">Actions</EntityTh>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <EntityTd strong>
                <Skeleton className="h-4 w-32 rounded-md" />
              </EntityTd>

              <EntityTd>
                <Skeleton className="h-7 w-20 rounded-full" />
              </EntityTd>

              <EntityTd>
                <Skeleton className="h-7 w-24 rounded-full" />
              </EntityTd>

              <EntityTd align="right">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-[10px]" />
                </div>
              </EntityTd>
            </tr>
          ))}
        </tbody>
      </EntityTable>
    </section>
  );
}

  return (
    <section className="space-y-3.5 pt-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="min-w-0">
            <h1 className="text-[18px] font-semibold tracking-[-0.015em] text-foreground">
              Staff Leave Types Settings
            </h1>

            <p className="mt-0.5 max-w-2xl text-[11.5px] font-normal leading-5 text-muted-foreground">
              Define allowed staff leave types, payment impact, and maximum
              annual days.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleOpenCreate}
          className={[
            "inline-flex h-10 shrink-0",
            "items-center justify-center gap-2",
            "rounded-[13px] border",
            "border-primary/25 bg-card px-4",
            "text-[13px] font-medium text-primary",
            "shadow-none",
            "transition-all duration-200",
            "hover:border-primary/40",
            "hover:bg-primary/[0.055]",
            "hover:text-primary",
            "focus-visible:outline-none",
            "focus-visible:ring-4",
            "focus-visible:ring-primary/10",
          ].join(" ")}
        >
          <Plus size={15} strokeWidth={1.8} />
          Add Leave Type
        </Button>
      </div>

      {/* Table */}
      {leaveTypes.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-border/65 bg-muted/[0.06] px-6 py-12 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary/[0.06] text-primary">
            <Palmtree size={20} strokeWidth={1.7} />
          </span>

          <h3 className="mt-3.5 text-[14px] font-medium text-foreground">
            No leave types yet
          </h3>

          <p className="mx-auto mt-1 max-w-md text-[12px] leading-5 text-muted-foreground">
            Add a leave type to define the allowed staff leave, payment impact,
            and maximum annual days.
          </p>
        </div>
      ) : (
        <EntityTable>
          <thead>
            <tr>
              <EntityTh>Leave Type</EntityTh>
              <EntityTh>Payment Type</EntityTh>
              <EntityTh>Max Days / Year</EntityTh>
              <EntityTh align="right">Actions</EntityTh>
            </tr>
          </thead>

          <tbody>
            {leaveTypes.map((item: LeaveType) => (
              <tr key={item.id}>
                <EntityTd strong>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="text-left text-[13px] transition-colors hover:text-primary"
                  >
                    {item.name}
                  </button>
                </EntityTd>

                <EntityTd>
                  <PaymentBadge paymentType={item.payment_type} />
                </EntityTd>

                <EntityTd>
                  <MetricBadge
                    value={item.max_days_per_academic_year}
                    suffix="days"
                  />
                </EntityTd>

                <EntityTd align="right">
                  <ActionMenu
                    isOpen={false}
                    onOpenChange={() => undefined}
                    onEdit={() => handleOpenEdit(item)}
                    onDelete={() => setDeleteTarget(item)}
                  />
                </EntityTd>
              </tr>
            ))}
          </tbody>
        </EntityTable>
      )}

      <LeaveTypeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leaveTypeToEdit={selectedLeaveType}
      />

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Leave Type"
        description="Are you sure you want to delete this leave type? Note that server might reject if linked with previous staff records."
        itemName={deleteTarget?.name}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}

function MetricBadge({ value, suffix }: { value: number; suffix: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted/40 px-3 py-1.5 text-[12px] font-medium text-foreground/75">
      {value} {suffix}
    </span>
  );
}

function PaymentBadge({
  paymentType,
}: {
  paymentType: LeaveType["payment_type"];
}) {
  const isPaid = paymentType === "paid";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
        "text-[12px] font-medium",
        isPaid
          ? "bg-emerald-500/[0.07] text-emerald-600"
          : "bg-destructive/[0.07] text-destructive",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isPaid ? "bg-emerald-500/80" : "bg-destructive/80",
        ].join(" ")}
      />

      {isPaid ? "Paid" : "Unpaid"}
    </span>
  );
}
