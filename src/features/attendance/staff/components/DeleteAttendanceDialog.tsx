import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { Button } from "@/shared/ui/button";

import { Trash2 } from "lucide-react";

interface Props {
  id: string;
}

export const DeleteAttendanceDialog = ({
  id,
}: Props) => {
  const handleDelete =
    () => {
      console.log(
        "Delete",
        id
      );

      // delete mutation later
    };

  return (
    <Dialog>
      <DialogTrigger asChild>
       <Button
        size="icon"
        variant="outline"
        className="
          border-primary/30
          text-primary
          hover:bg-primary/10
          hover:text-primary
        "
         >
  <Trash2 size={16} />
</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Attendance
          </DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want
          to delete this record?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={
              handleDelete
            }
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};