import {
  useQuery,
} from "@tanstack/react-query";
import {
  Scale,
} from "lucide-react";
import {
  useEffect,
} from "react";
import {
  useForm,
} from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  z,
} from "zod";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { schoolLawsService } from "../../services/school-laws.service";
import type {
  LawPayload,
  SchoolLaw,
} from "../../types/school-laws.types";
import { DialogFormSkeleton } from "../shared/DialogFormSkeleton";

const lawSchema = z.object({
  title: z.string().trim().min(1, "Law title is required."),
  description: z.string().optional(),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lawToEdit?: SchoolLaw | null;
  isLoading?: boolean;
  onSubmit: (values: LawPayload) => void;
};

export function LawDialog({
  open,
  onOpenChange,
  lawToEdit = null,
  isLoading = false,
  onSubmit,
}: Props) {
  const detailsQuery = useQuery({
    queryKey: ["communications", "school-laws", "details", lawToEdit?.id],
    queryFn: () => schoolLawsService.getLawById(lawToEdit!.id),
    enabled: open && Boolean(lawToEdit?.id),
  });

  const source = detailsQuery.data ?? lawToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LawPayload>({
    resolver: zodResolver(lawSchema) as any,
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      title: source?.title ?? "",
      description: source?.description ?? "",
    });
  }, [open, reset, source]);

  const isEditing = Boolean(lawToEdit);
  const isLoadingDetails = isEditing && detailsQuery.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-[24px] border border-border/70 bg-card p-0 shadow-[0_28px_90px_rgba(27,19,66,0.20)] sm:max-w-xl">
        <div className="border-b border-border/50 bg-success/[0.025] px-5 py-5 sm:px-6">
          <DialogHeader className="text-start">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-success/10 bg-success/[0.09] text-success">
                <Scale className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em]">
                  {isEditing ? "Edit school law" : "Add school law"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[12.5px] leading-5">
                  Keep the title concise and explain the rule in language the school community can understand.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="max-h-[calc(92vh-96px)] overflow-y-auto px-5 py-5 sm:px-6">
          {isLoadingDetails ? (
            <DialogFormSkeleton rows={2} />
          ) : detailsQuery.isError ? (
            <div className="rounded-[16px] border border-destructive/20 bg-destructive/[0.035] p-5">
              <p className="text-[13px] font-medium">Law details could not be loaded.</p>
              <Button type="button" variant="outline" onClick={() => void detailsQuery.refetch()} className="mt-4 h-10 rounded-[12px]">
                Try again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground">Law title</label>
                <input
                  {...register("title")}
                  placeholder="Example: Academic integrity"
                  className="h-11 w-full rounded-[13px] border border-input bg-background px-3 text-[12px] outline-none transition focus:border-success/35 focus:ring-4 focus:ring-success/[0.07]"
                />
                {errors.title ? (
                  <p className="text-[11px] text-destructive">{String(errors.title.message)}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground">Official description</label>
                <textarea
                  {...register("description")}
                  placeholder="Explain the rule, expected behavior, and relevant consequences."
                  className="min-h-[150px] w-full resize-none rounded-[14px] border border-input bg-background p-3 text-[12px] leading-5 outline-none transition focus:border-success/35 focus:ring-4 focus:ring-success/[0.07]"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border/50 pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px]">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="h-10 rounded-[12px] bg-success px-5 text-[12px] font-semibold text-white hover:bg-success/90">
                  {isLoading ? (
                    <span className="h-3 w-20 animate-pulse rounded-full bg-primary-foreground/60" />
                  ) : isEditing ? (
                    "Save changes"
                  ) : (
                    "Add law"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
