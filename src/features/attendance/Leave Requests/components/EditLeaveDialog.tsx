import { Edit2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

export const EditLeaveDialog = () => {
  return (
    <Button
      size="icon"
      variant="outline"
    >
      <Edit2 size={16}/>
    </Button>
  );
};