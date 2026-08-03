import {
  LoaderCircle,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
};

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  isPending = false,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md rounded-[22px] border border-border/70 bg-card p-0 shadow-[0_24px_70px_rgba(27,19,66,0.18)]">
        <div className="p-5 sm:p-6">
          <DialogHeader className="text-start">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[15px] bg-destructive/[0.09] text-destructive">
              <Trash2
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">
              {title}
            </DialogTitle>

            <DialogDescription className="pt-1 text-[12.5px] leading-5 text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-border/50 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={isPending}
              className="h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px] font-medium"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="h-10 rounded-[12px] bg-destructive px-4 text-[12px] font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
