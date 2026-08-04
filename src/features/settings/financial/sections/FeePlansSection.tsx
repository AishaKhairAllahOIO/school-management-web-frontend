import { useState } from "react";
import {
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/shared/ui/button";

import { FeePlansTable } from "../components/fee-plans/FeePlansTable";
import { CreateFeePlanDialog } from "../components/fee-plans/CreateFeePlanDialog";
import { EditFeePlanDialog } from "../components/fee-plans/EditFeePlanDialog";
import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";
import { FeePlansSkeleton } from "../components/fee-plans/FeePlansSkeleton";
import { FinancialSectionHeader } from "../shared/FinancialSectionHeader";
import { useFeePlans } from "../hooks/useFeePlans";
import type { FeePlan } from "../types/feePlan.types";
import type { FeePlanFormValues } from "../schemas/feePlan.schema";
import {
  mapFeePlanFormToCreatePayload,
  mapFeePlanFormToUpdatePayload,
} from "../lib/mappers/feePlan.mapper";

type Option = {
  id: number;
  name: string;
};

type Props = {
  academicYears: Option[];
  gradeLevels: Option[];
};

export function FeePlansSection({
  academicYears,
  gradeLevels,
}: Props) {
  const {
    data: feePlans = [],
    isLoading,
    isError,
    refetch,
    isFetching,
    createFeePlan,
    updateFeePlan,
    deleteFeePlan,
  } = useFeePlans();

  const [createOpen, setCreateOpen] =
    useState(false);
  const [editOpen, setEditOpen] =
    useState(false);
  const [deleteOpen, setDeleteOpen] =
    useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<FeePlan | null>(null);

  function handleCreate(
    values: FeePlanFormValues,
  ) {
    createFeePlan.mutate(
      mapFeePlanFormToCreatePayload(values),
      {
        onSuccess: () =>
          setCreateOpen(false),
      },
    );
  }

  function handleEdit(
    values: FeePlanFormValues,
  ) {
    if (!selectedPlan) return;

    updateFeePlan.mutate(
      {
        id: selectedPlan.id,
        payload:
          mapFeePlanFormToUpdatePayload(
            values,
          ),
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedPlan(null);
        },
      },
    );
  }

  function handleDelete() {
    if (!selectedPlan) return;

    deleteFeePlan.mutate(selectedPlan.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedPlan(null);
      },
    });
  }

  if (isLoading) {
    return <FeePlansSkeleton />;
  }

  if (isError) {
    return (
      <div className="m-5 flex min-h-[300px] flex-col items-center justify-center rounded-[20px] border border-destructive/15 bg-destructive/[0.025] px-6 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-destructive/[0.08] text-destructive">
          <RefreshCw
            size={19}
            className={
              isFetching ? "animate-spin" : ""
            }
          />
        </span>

        <h3 className="mt-3 text-[15px] font-semibold text-foreground">
          Failed to load fee plans
        </h3>

        <p className="mt-1 max-w-sm text-[13px] leading-5 text-muted-foreground">
          There was a problem connecting to the server. Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5 h-10 rounded-[14px] border-destructive/15 bg-card px-4 text-[13px] text-destructive hover:bg-destructive/[0.04] hover:text-destructive"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2
              size={15}
              className="mr-2 animate-spin"
            />
          ) : (
            <RefreshCw
              size={15}
              className="mr-2"
            />
          )}
          {isFetching
            ? "Trying Again..."
            : "Try Again"}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="p-5 sm:p-6">
        <FinancialSectionHeader
          title="Student Fee Plans"
          description="Set the tuition and optional service charges that will be applied when a student is enrolled in a specific academic year and grade level."
          actionLabel="Add Fee Plan"
          onAction={() => setCreateOpen(true)}
        />

        <FeePlansTable
          feePlans={feePlans}
          onEdit={(plan) => {
            setSelectedPlan(plan);
            setEditOpen(true);
          }}
          onDelete={(plan) => {
            setSelectedPlan(plan);
            setDeleteOpen(true);
          }}
        />
      </div>

      <CreateFeePlanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        academicYears={academicYears}
        gradeLevels={gradeLevels}
        isLoading={createFeePlan.isPending}
        onSubmit={handleCreate}
      />

      {selectedPlan ? (
        <EditFeePlanDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          academicYears={academicYears}
          gradeLevels={gradeLevels}
          defaultValues={{
            academicYearId:
              selectedPlan.academicYearId,
            gradeLevelId:
              selectedPlan.gradeLevelId,
            name: selectedPlan.name,
            baseAmount:
              selectedPlan.baseAmount,
            extraServices:
              selectedPlan.extraServices?.map(
                (service) => ({
                  type: service.type,
                  name: service.name,
                  amount: service.amount,
                }),
              ) ?? [],
          }}
          isLoading={updateFeePlan.isPending}
          onSubmit={handleEdit}
        />
      ) : null}

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedPlan(null);
        }}
        title="Delete fee plan?"
        description="Students already assigned to this plan may keep existing invoices, but the plan will no longer be available for future enrollment. This action cannot be undone."
        itemName={selectedPlan?.name}
        isPending={deleteFeePlan.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
