import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

export const DeleteLeaveDialog = () => {
  return (
    <Button
      size="icon"
      variant="outline"
      className="
        border-primary/30
        text-primary
        hover:bg-primary/10
      "
    >
      <Trash2 size={16}/>
    </Button>
  );
};