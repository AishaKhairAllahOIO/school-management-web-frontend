import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  LoaderCircle,
  Scale,
} from "lucide-react";
import {
  useEffect,
} from "react";
import {
  useForm,
} from "react-hook-form";
import {
  z,
} from "zod";

import {
  Button,
} from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import type {
  LawPayload,
  SchoolLaw,
} from "../../types/school-laws.types";

const lawSchema = z.object({
  title: z.string().trim().min(3, "Law title must contain at least 3 characters."),
  description: z.string().trim().optional(),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lawToEdit?: SchoolLaw | null;
  isLoading: boolean;
  onSubmit: (values: LawPayload) => void;
};

export function LawDialog({
  open,
  onOpenChange,
  lawToEdit,
  isLoading,
  onSubmit,
}: Props) {
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
    if (open) {
      reset({
        title: lawToEdit?.title ?? "",
        description: lawToEdit?.description ?? "",
      });
    }
  }, [open, lawToEdit, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-[22px] border border-border/70 bg-card p-0 shadow-[0_24px_70px_rgba(27,19,66,0.18)] sm:max-w-xl">
        <div className="p-5 sm:p-6">
          <DialogHeader className="text-start">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[15px] bg-success/[0.09] text-success">
              <Scale className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">
              {lawToEdit ? "Edit school law" : "Add school law"}
            </DialogTitle>
            <DialogDescription className="pt-1 text-[12.5px] leading-5 text-muted-foreground">
              Write a concise official title and a clear description that can be understood by the school community.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-foreground">Law title <span className="text-destructive">*</span></label>
              <input {...register("title")} placeholder="Example: Academic integrity" className="h-11 w-full rounded-[12px] border border-input bg-background px-3 text-[12px] outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/[0.07]" />
              {errors.title ? <p className="text-[11px] text-destructive">{String(errors.title.message)}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-foreground">Official description</label>
              <textarea {...register("description")} placeholder="Explain the law, expected behavior, and relevant consequences." className="min-h-[140px] w-full resize-none rounded-[14px] border border-input bg-background p-3 text-[12px] leading-5 outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/[0.07]" />
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-border/50 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px] font-medium">Cancel</Button>
              <Button type="submit" disabled={isLoading} className="h-10 rounded-[12px] px-4 text-[12px] font-medium">
                {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {lawToEdit ? "Save changes" : "Add law"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
