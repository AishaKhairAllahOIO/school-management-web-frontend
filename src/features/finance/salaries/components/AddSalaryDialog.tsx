import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { Button } from "@/shared/ui/button";

import { Input } from "@/shared/ui/input";

import {
  useState,
} from "react";

export const AddSalaryDialog = () => {

  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <>
      <Button
        onClick={() =>
          setOpen(true)
        }
      >
        Add Salary
      </Button>

      <Dialog
        open={open}
        onOpenChange={
          setOpen
        }
      >
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              New Salary Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Input
              placeholder="Employee Name"
            />

            <Input
              placeholder="Department"
            />

            <Input
              placeholder="Base Salary"
            />

            <div className="flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() =>
                  setOpen(false)
                }
              >
                Cancel
              </Button>

              <Button>
                Save
              </Button>

            </div>

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
};