import {
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  StaffFinancialContract,
} from "../types/payroll.types";

export function ContractActions({
  onEdit,
  onDelete,
}: {
  contract: StaffFinancialContract;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
        title="Edit contract"
      >
        <Pencil className="size-4" />
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        title="Delete contract"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}