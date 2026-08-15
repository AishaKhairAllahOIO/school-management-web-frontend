import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; isLoading?: boolean; onConfirm: () => void };

export function DeletePaymentDialog({ open, onOpenChange, isLoading, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[28px] border-border/45 bg-background/95 p-0 shadow-[0_24px_80px_rgba(31,22,73,0.14)] backdrop-blur-xl sm:max-w-[430px]">
        <div className="px-6 pt-6">
          <DialogHeader className="text-left">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[15px] border border-destructive/18 bg-destructive/[0.07] text-destructive"><AlertTriangle className="h-5 w-5" strokeWidth={1.8}/></div>
            <DialogTitle className="text-[17px] font-medium tracking-[-0.015em] text-foreground/90">Delete payment?</DialogTitle>
            <DialogDescription className="pt-1 text-[13px] font-normal leading-5 text-muted-foreground">This reverses the payment amount in the student balance. This action cannot be undone.</DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="mt-6 border-t border-border/45 bg-muted/20 px-6 py-4 sm:justify-end">
          <Button type="button" variant="outline" onClick={()=>onOpenChange(false)} className="h-10 rounded-xl px-4 text-[12.5px] font-medium">Cancel</Button>
          <Button type="button" onClick={onConfirm} disabled={isLoading} className="h-10 rounded-xl bg-destructive px-4 text-[12.5px] font-medium text-destructive-foreground hover:bg-destructive/90"><Trash2 className="mr-2 h-4 w-4" strokeWidth={1.8}/>{isLoading ? "Deleting..." : "Delete payment"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
