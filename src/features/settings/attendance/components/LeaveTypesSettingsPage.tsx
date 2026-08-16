import { useState } from "react";
import { Plus, Pencil, Trash2, Palmtree } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";
import { useLeaveTypes, useDeleteLeaveType } from "../hooks/useLeaveTypes";
import { LeaveTypeFormDialog } from "../components/LeaveTypeFormDialog";
import type { LeaveType } from "../types/leaveType.types";

export function LeaveTypesSettingsPage() {
  const { data: leaveTypes = [], isLoading } = useLeaveTypes();
  const deleteMutation = useDeleteLeaveType();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
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
    return <div className="p-8 text-center text-muted-foreground">Loading leave types settings...</div>;
  }

  return (
    <section className="space-y-6 pt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-warning/[0.10] text-warning">
            <Palmtree className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Staff Leave Types Settings
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Define allowed staff leave types, payment impact, and max annual days[cite: 1].
            </p>
          </div>
        </div>

        <Button onClick={handleOpenCreate} className="h-11 rounded-[13px] px-5">
          <Plus className="h-4 w-4 me-1.5" /> Add Leave Type
        </Button>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-muted/[0.28]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.075em] text-muted-foreground">
                <th className="h-11 px-5">Name</th>
                <th className="h-11 px-5">Payment Type</th>
                <th className="h-11 px-5">Max Days / Year</th>
                <th className="h-11 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.map((item: LeaveType) => (
                <tr key={item.id} className="border-t border-border/45 text-[13px] hover:bg-muted/[0.20]">
                  <td className="px-5 py-3.5 font-medium text-foreground">{item.name}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        item.payment_type === "paid"
                          ? "bg-success/[0.10] text-success"
                          : "bg-destructive/[0.09] text-destructive"
                      }`}
                    >
                      {item.payment_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{item.max_days_per_academic_year} days</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEdit(item)}
                        className="h-8 w-8 rounded-[10px] border-info/20 text-info hover:bg-info/[0.08]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteTarget(item)}
                        className="h-8 w-8 rounded-[10px] border-destructive/20 text-destructive hover:bg-destructive/[0.07]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {leaveTypes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center text-[13px] text-muted-foreground">
                    No leave types defined yet. Click &quot;Add Leave Type&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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