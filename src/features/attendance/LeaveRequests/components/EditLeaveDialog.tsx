import { Edit2 } from "lucide-react";
import { Button } from "@/shared/ui/button";

export const EditLeaveDialog = ({ onEdit }: { onEdit?: () => void }) => {
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={onEdit}
    >
      <Edit2 size={16}/>
    </Button>
  );
};