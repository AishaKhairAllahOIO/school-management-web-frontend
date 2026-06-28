import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { Button } from "@/shared/ui/button";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
}

export const GeneratePayrollDialog = ({
  open,
  onOpenChange,
}: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Generate Payroll
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <p>
            Generate salary records
            for all employees for
            the current month.
          </p>

          <div className="flex gap-3 justify-end">

            <Button
              variant="outline"
              onClick={() =>
                onOpenChange(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button>
              Generate
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
};