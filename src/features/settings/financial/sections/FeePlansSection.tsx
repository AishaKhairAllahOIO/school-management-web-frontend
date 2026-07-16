import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { FeePlansTable } from "../components/fee-plans/FeePlansTable";
import { CreateFeePlanDialog } from "../components/fee-plans/CreateFeePlanDialog";
import { EditFeePlanDialog } from "../components/fee-plans/EditFeePlanDialog";
import { DeleteConfirmationDialog } from "../components/fee-plans/DeleteConfirmationDialog";
import { FeePlansSkeleton } from "../components/fee-plans/FeePlansSkeleton";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { useFeePlans } from "../hooks/useFeePlans";
import type { FeePlan } from "../types/feePlan.types";
import type { FeePlanFormValues } from "../schemas/feePlan.schema";
import { mapFeePlanFormToCreatePayload, mapFeePlanFormToUpdatePayload } from "../lib/mappers/feePlan.mapper";

type Option = { id: number; name: string; };

type Props = {
  academicYears: Option[];
  gradeLevels: Option[];
};

export function FeePlansSection({ academicYears, gradeLevels }: Props) {
  const { 
    data: feePlans = [], 
    isLoading, 
    isError, 
    refetch,    
    isFetching,   
    createFeePlan, 
    updateFeePlan, 
    deleteFeePlan 
  } = useFeePlans();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FeePlan | null>(null);

  function handleCreate(values: FeePlanFormValues) {
    createFeePlan.mutate(mapFeePlanFormToCreatePayload(values), {
      onSuccess: () => setCreateOpen(false),
    });
  }

  function handleEdit(values: FeePlanFormValues) {
    if (!selectedPlan) return;
    updateFeePlan.mutate(
      { id: selectedPlan.id, payload: mapFeePlanFormToUpdatePayload(values) },
      { onSuccess: () => { setEditOpen(false); setSelectedPlan(null); } }
    );
  }

  function handleDelete() {
    if (!selectedPlan) return;
    deleteFeePlan.mutate(selectedPlan.id, {
      onSuccess: () => { setDeleteOpen(false); setSelectedPlan(null); },
    });
  }

  if (isLoading) return <FeePlansSkeleton />;


  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
          <RefreshCw size={24} className={isFetching ? "animate-spin" : ""} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-red-800">
          Failed to load Fee Plans
        </h3>
        <p className="mb-6 text-sm text-red-600/80 max-w-sm">
          There was a problem connecting to the server. Please try again.
        </p>
        <Button
          variant="outline"
          className="border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <RefreshCw size={16} className="mr-2" />
          )}
          {isFetching ? "Trying Again..." : "Try Again"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fee Plans</h2>
          <p className="text-muted-foreground">Configure tuition plans.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> Create Fee Plan</Button>
      </div>

      <FeePlansTable
        feePlans={feePlans}
        onEdit={(plan) => { setSelectedPlan(plan); setEditOpen(true); }}
        onDelete={(plan) => { setSelectedPlan(plan); setDeleteOpen(true); }}
      />

      <CreateFeePlanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        academicYears={academicYears}
        gradeLevels={gradeLevels}
        isLoading={createFeePlan.isPending}
        onSubmit={handleCreate}
      />

      {selectedPlan && (
        <EditFeePlanDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          academicYears={academicYears}
          gradeLevels={gradeLevels}
          defaultValues={{
            academicYearId: selectedPlan.academicYearId,
            gradeLevelId: selectedPlan.gradeLevelId,
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
        isLoading={deleteFeePlan.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}