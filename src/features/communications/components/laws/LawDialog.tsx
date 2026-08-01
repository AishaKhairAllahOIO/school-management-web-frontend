import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Scale } from "lucide-react";

import type { SchoolLaw, LawPayload } from "../../types/school-laws.types";

const lawSchema = z.object({
  title: z.string().min(3, "عنوان القانون يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().optional(),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lawToEdit?: SchoolLaw | null;
  isLoading: boolean;
  onSubmit: (values: LawPayload) => void;
};

export function LawDialog({ open, onOpenChange, lawToEdit, isLoading, onSubmit }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LawPayload>({
    resolver: zodResolver(lawSchema) as any,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // تعبئة البيانات عند فتح النافذة في حالة التعديل
  useEffect(() => {
    if (open) {
      if (lawToEdit) {
        reset({ title: lawToEdit.title, description: lawToEdit.description || "" });
      } else {
        reset({ title: "", description: "" });
      }
    }
  }, [open, lawToEdit, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="floating-card sm:max-w-md rounded-3xl border border-border p-6 shadow-2xl" dir="rtl">
        <DialogHeader className="space-y-1.5 text-right">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Scale className="h-5 w-5" />
            </div>
            {lawToEdit ? "تعديل القانون المدرسي" : "إضافة قانون جديد"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pr-11">
            {lawToEdit ? "قم بتعديل بيانات القانون المختار." : "أدخل عنوان وتفاصيل القانون ليتم تطبيقه في النظام."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              عنوان القانون <span className="text-destructive">*</span>
            </label>
            <Input 
              className="h-11 rounded-xl border-border bg-card text-foreground focus-visible:ring-ring" 
              placeholder="مثال: الالتزام بالنزاهة الأكاديمية"
              {...register("title")} 
            />
            {errors.title && <p className="text-xs font-medium text-destructive">{String(errors.title.message)}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">التفاصيل والوصف</label>
            <textarea 
              className="w-full min-h-[120px] rounded-xl border border-border bg-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
              placeholder="اكتب تفاصيل القانون والعقوبات المترتبة على مخالفته..."
              {...register("description")} 
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 flex-1 rounded-xl border-border bg-transparent text-foreground hover:bg-muted"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="primary-gradient h-11 flex-[2] rounded-xl font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? "جاري الحفظ..." : "حفظ القانون"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}