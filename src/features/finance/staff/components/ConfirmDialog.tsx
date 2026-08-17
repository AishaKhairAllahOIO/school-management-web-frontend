import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

import { Button } from "@/shared/ui/button";

type Props = {
  open: boolean;
  title: string;
  description: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative z-10 w-full max-w-sm rounded-[24px] border border-border/50 bg-card p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-foreground">
              {title}
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}

            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}