import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title = "Confirm deletion",
  description,
  itemName,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isPending = false,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !isPending && onOpenChange(nextOpen)}>
      <AlertDialogContent className="max-w-[420px] overflow-hidden rounded-[22px] p-5 shadow-[0_28px_80px_rgba(15,10,40,0.2)]">
        <AlertDialogHeader className="place-items-start text-left">
          <AlertDialogMedia className="mb-3 h-11 w-11 rounded-[14px] bg-destructive/10 text-destructive">
            <AlertTriangle size={21} strokeWidth={1.8} />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-base font-semibold tracking-[-0.015em]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-sm font-normal leading-6">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {itemName ? (
          <div className="rounded-[14px] border border-destructive/15 bg-destructive/[0.045] px-4 py-3 text-sm font-medium text-foreground">
            {itemName}
          </div>
        ) : null}

        <AlertDialogFooter className="-mx-5 -mb-5 mt-1 border-border/60 bg-muted/25 p-4">
          <AlertDialogCancel disabled={isPending} className="rounded-xl">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            variant="destructive"
            className="rounded-xl"
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            {isPending ? "Deleting..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
