 import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { FeePlansTable } from "../components/fee-plans/FeePlansTable";
import { CreateFeePlanDialog } from "../components/fee-plans/CreateFeePlanDialog";
import { EditFeePlanDialog } from "../components/fee-plans/EditFeePlanDialog";
import { DeleteConfirmationDialog } from "../components/fee-plans/DeleteConfirmationDialog";
import { FeePlansSkeleton } from "../components/fee-plans/FeePlansSkeleton";

import { useFeePlans } from "../hooks/useFeePlans";

import type { FeePlan } from "../types/feePlan.types";
import type { FeePlanFormValues } from "../schemas/feePlan.schema";

import { 
  mapFeePlanFormToCreatePayload, 
  mapFeePlanFormToUpdatePayload 
} from 
 "../lib/mappers/feePlan.mapper";

type Option = {
  id: number;
  name: string;
};

type Props = {
  academicYears: Option[];
  gradeLevels: Option[];
  installmentPolicies: Option[];
};

export function FeePlansSection({
  academicYears,
  gradeLevels,
  installmentPolicies,
}: Props) {
  const {
    data: feePlans = [],
    isLoading,
    isError,

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

function handleCreate(values: FeePlanFormValues) {
 
  createFeePlan.mutate(mapFeePlanFormToCreatePayload(values), {
    onSuccess: () => {
      setCreateOpen(false);
    },
  });
}

function handleEdit(values: FeePlanFormValues) {
  if (!selectedPlan) return;

  updateFeePlan.mutate(
    {
      id: selectedPlan.id,
      
      payload: mapFeePlanFormToUpdatePayload(values),
    },
    {
      onSuccess: () => {
        setEditOpen(false);
        setSelectedPlan(null);
      },
    }
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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        Failed to load Fee Plans.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Fee Plans
          </h2>

          <p className="text-muted-foreground">
            Configure tuition plans.
          </p>

        </div>

        <Button
          onClick={() =>
            setCreateOpen(true)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Fee Plan
        </Button>

      </div>

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

      <CreateFeePlanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        academicYears={academicYears}
        gradeLevels={gradeLevels}
        installmentPolicies={installmentPolicies}
        isLoading={createFeePlan.isPending}
        onSubmit={handleCreate}
      />

      {selectedPlan && (
        <EditFeePlanDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          academicYears={academicYears}
          gradeLevels={gradeLevels}
          installmentPolicies={installmentPolicies}
          defaultValues={{
            academicYearId: selectedPlan.academicYearId,
            gradeLevelId: selectedPlan.gradeLevelId,
            installmentPolicyId: selectedPlan.installmentPolicyId ?? 0,
            name: selectedPlan.name,
            baseAmount: selectedPlan.baseAmount,
            
             extraServices: selectedPlan.extraServices?.map((service) => ({
              type: service.type,
              name: service.name,
              amount: service.amount,
            })) ?? [],
          }}
          isLoading={updateFeePlan.isPending}
          onSubmit={handleEdit}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Fee Plan"
        description="This action cannot be undone."
        isLoading={
          deleteFeePlan.isPending
        }
        onConfirm={handleDelete}
      />

    </div>
  );
}