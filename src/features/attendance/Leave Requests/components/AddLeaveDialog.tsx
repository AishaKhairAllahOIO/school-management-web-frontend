import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export const AddLeaveDialog = () => {
  return (
    <Dialog>

      <DialogTrigger asChild>
        <Button>
          <Plus size={16}/>
          Add Request
        </Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Add Leave Request
          </DialogTitle>
        </DialogHeader>

        {/* Form Here */}

      </DialogContent>

    </Dialog>
  );
};