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
  paymentId?: string | number | null;
};

export function PaymentReceiptDialog({
  open,
  onOpenChange,
  paymentId,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>
            View the details of payment receipt {paymentId ?? ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-[16px] border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
          Receipt details will be shown here once the backend endpoint is wired.
        </div>
      </DialogContent>
    </Dialog>
  );
}