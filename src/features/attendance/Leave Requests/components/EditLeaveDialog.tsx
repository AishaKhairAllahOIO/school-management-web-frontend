import { Edit2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type {
  StaffLeave,
} from "../types/staffLeave.types";

interface Props {
  leave: StaffLeave;
}

export const EditLeaveDialog = ({
  leave,
}: Props) => {
  return (
    <Button
      size="icon"
      variant="outline"
    >
      <Edit2 size={16}/>
    </Button>
  );
};