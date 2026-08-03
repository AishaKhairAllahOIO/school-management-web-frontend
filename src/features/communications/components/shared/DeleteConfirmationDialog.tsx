import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type Props = {
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
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[24px] border border-border/70 bg-card p-0 shadow-[0_28px_90px_rgba(27,19,66,0.20)] sm:max-w-md">
        <div className="border-b border-border/50 bg-destructive/[0.025] p-5 sm:p-6">
          <DialogHeader className="text-start">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-destructive/10 bg-destructive/[0.09] text-destructive">
                <Trash2 className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[12.5px] leading-5 text-muted-foreground">
                  {description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-[14px] border border-destructive/15 bg-destructive/[0.04] px-4 py-3 text-[11px] leading-5 text-muted-foreground">
            This action cannot be undone. The record will be removed from the current workspace.
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="h-10 rounded-[12px] bg-destructive px-5 text-[12px] text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <span className="h-3 w-20 animate-pulse rounded-full bg-destructive-foreground/60" />
              ) : (
                <><Trash2 className="h-4 w-4" />{confirmLabel}</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
