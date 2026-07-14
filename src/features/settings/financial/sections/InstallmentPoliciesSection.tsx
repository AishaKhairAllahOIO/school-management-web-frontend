 import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { DeleteConfirmationDialog } from "../components/fee-plans/DeleteConfirmationDialog";

import { InstallmentPoliciesTable } from "../components/installment-policies/InstallmentPoliciesTable";

import { CreateInstallmentPolicyDialog } from "../components/installment-policies/CreateInstallmentPolicyDialog";

import { EditInstallmentPolicyDialog } from "../components/installment-policies/EditInstallmentPolicyDialog";

import { InstallmentPoliciesSkeleton } from "../components/installment-policies/InstallmentPoliciesSkeleton";

import { useInstallmentPolicies } from "../hooks/useInstallmentPolicies";

import type { InstallmentPolicy } from "../types/installmentPolicy.types";

import type { InstallmentPolicyFormValues } from "../schemas/installmentPolicy.schema";

export function InstallmentPoliciesSection() {

 const {
  data: policies = [],

  isLoading,

  createPolicy,

  updatePolicy,

  deletePolicy,

} = useInstallmentPolicies();
 
  const [createOpen, setCreateOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedPolicy, setSelectedPolicy] =
    useState<InstallmentPolicy | null>(null);

  function handleCreate(
    values: InstallmentPolicyFormValues
  ) {
    createPolicy.mutate(values, {
  onSuccess: () => {
    setCreateOpen(false);
  },
});
  }

  function handleEdit(
    values: InstallmentPolicyFormValues
  ) {
    if (!selectedPolicy) return;

   updatePolicy.mutate(
  {
    id: selectedPolicy.id,
    payload: values,
  },
  {
    onSuccess: () => {
      setEditOpen(false);
      setSelectedPolicy(null);
    },
  }
);
  }

  function handleDelete() {
    if (!selectedPolicy) return;

   deletePolicy.mutate(selectedPolicy.id, {
  onSuccess: () => {
    setDeleteOpen(false);
    setSelectedPolicy(null);
  },
});
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Installment Policies
          </h2>

          <p className="text-muted-foreground">
            Configure installment schedules.
          </p>

        </div>

        <Button
          onClick={() =>
            setCreateOpen(true)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>

      </div>

      {isLoading ? (
        <InstallmentPoliciesSkeleton />
      ) : (
        <InstallmentPoliciesTable
          policies={policies}
          onEdit={(policy) => {
            setSelectedPolicy(policy);
            setEditOpen(true);
          }}
          onDelete={(policy) => {
            setSelectedPolicy(policy);
            setDeleteOpen(true);
          }}
        />
      )}

      <CreateInstallmentPolicyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        isLoading={createPolicy.isPending}
        onSubmit={handleCreate}
      />

      {selectedPolicy && (
        <EditInstallmentPolicyDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          defaultValues={{
            name: selectedPolicy.name,
            items: selectedPolicy.items.map((item) => ({ ...item })),
          }}
          isLoading={updatePolicy.isPending}
          onSubmit={handleEdit}
        />
      )}
              

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Installment Policy"
        description="This action cannot be undone."
        isLoading={deletePolicy.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}