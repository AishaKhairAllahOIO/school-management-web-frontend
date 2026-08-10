import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";

export const DeleteLeaveDialog = ({ onDelete }: { onDelete?: () => void }) => {
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={onDelete}
      className="
        border-destructive/30
        text-destructive
        hover:bg-destructive/10
      "
    >
      <Trash2 size={16}/>
    </Button>
  );
};