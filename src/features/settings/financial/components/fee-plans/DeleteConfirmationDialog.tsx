import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

type Props = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  title?: string;

  description?: string;

  isLoading?: boolean;

  onConfirm: () => void;
};

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title = "Delete Item",
  description = "This action cannot be undone.",
  isLoading = false,
  onConfirm,
}: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}