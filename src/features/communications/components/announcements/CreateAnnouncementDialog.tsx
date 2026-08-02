import { useState, useEffect } from "react";
import { Megaphone, Loader2, Users, School } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { MultiSelectAudience, type OptionItem } from "../shared/MultiSelectAudience";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import type { Announcement } from "../../types/communication.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradeLevels: { id: string | number; name: string }[];
  classRooms: OptionItem[];
  announcementToEdit?: Announcement | null;
};

export function CreateAnnouncementDialog({
  open,
  onOpenChange,
  gradeLevels = [],
  classRooms = [],
  announcementToEdit = null,
}: Props) {
  const { createAnnouncement, updateAnnouncement } = useAnnouncements();
  const isEditing = !!announcementToEdit;
  const isPending = createAnnouncement.isPending || updateAnnouncement.isPending;

  const [audience, setAudience] = useState("student");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState<string | number>("");
  const [selectedClassRoomIds, setSelectedClassRoomIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (announcementToEdit && open) {
      setAudience(announcementToEdit.audience || "student");
      setTitle(announcementToEdit.title || "");
      setDescription(announcementToEdit.description || "");
      setGradeLevelId(announcementToEdit.grade_level_id || "");
      setSelectedClassRoomIds(announcementToEdit.class_room_ids || []);
    } else if (!open) {
      setAudience("student");
      setTitle("");
      setDescription("");
      setGradeLevelId("");
      setSelectedClassRoomIds([]);
    }
  }, [announcementToEdit, open]);

  const handleError = (err: any) => {
    console.error("Announcement Error:", err?.response?.data || err);
    
    // 🌟 معالجة خطأ الصلاحيات 403 الذي يظهر في الباك إند
    if (err?.response?.status === 403) {
      alert("❌ عذراً، حسابك الحالي لا يمتلك الصلاحيات الكافية لنشر هذا الإعلان.");
      return;
    }

    const backendMessage = err?.response?.data?.message;
    const backendErrors = err?.response?.data?.errors;
    const firstError = backendErrors ? Object.values(backendErrors)[0] : null;
    alert(`❌ فشل النشر:\n[ ${firstError || backendMessage || "حدث خطأ غير معروف"} ]`);
  };

  const handleSuccess = () => {
    alert(isEditing ? "✅ تم تعديل الإعلان بنجاح!" : "✅ تم نشر الإعلان بنجاح!");
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (audience === "student" && !gradeLevelId) {
      alert("الرجاء تحديد المرحلة الدراسية الموجه إليها الإعلان.");
      return;
    }

    const payload: any = {
      audience,
      title: title.trim(),
      description: description.trim(),
    };

    if (audience === "student") {
      payload.grade_level_id = Number(gradeLevelId);
      if (selectedClassRoomIds.length > 0) {
        payload.class_room_ids = selectedClassRoomIds.map((id) => Number(id));
      }
    }

    if (isEditing && announcementToEdit) {
      updateAnnouncement.mutate(
        { id: announcementToEdit.id, payload },
        { onSuccess: handleSuccess, onError: handleError }
      );
    } else {
      createAnnouncement.mutate(payload, { 
        onSuccess: handleSuccess, 
        onError: handleError 
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 🌟 تطبيق الـ Classes الخاصة بالتصميم الموحد */}
      <DialogContent className="floating-card sm:max-w-xl rounded-3xl border border-border p-6 shadow-2xl" dir="rtl">
        <DialogHeader className="space-y-1.5 text-right">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Megaphone className="h-5 w-5" />
            </div>
            {isEditing ? "تعديل التعميم / الإعلان" : "نشر تعميم أو إعلان جديد"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pr-11">
            أدخل تفاصيل التعميم وحدد الفئة المستهدفة ليتم إرساله وتنبيههم فوراً.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              الفئة المستهدفة بالإعلان <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-muted/30 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setAudience("student")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  audience === "student"
                    ? "bg-card text-primary shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <School className="w-4 h-4" /> الطلاب وأولياء الأمور
              </button>
              <button
                type="button"
                onClick={() => setAudience("staff")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  audience === "staff"
                    ? "bg-card text-primary shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Users className="w-4 h-4" /> الكادر التدريسي والإداري
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              عنوان الإعلان <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: اجتماع طارئ، عطلة رسمية..."
              required
              className="w-full h-11 rounded-xl border border-input p-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
            />
          </div>

          {audience === "student" && (
            <div className="p-4 bg-muted/20 rounded-2xl border border-border space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  المرحلة الدراسية <span className="text-destructive">*</span>
                </label>
                <select
                  value={gradeLevelId}
                  onChange={(e) => setGradeLevelId(e.target.value)}
                  required
                  className="w-full h-11 rounded-xl border border-input px-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none"
                >
                  <option value="">-- اختر المرحلة الدراسية --</option>
                  {gradeLevels.map((grade) => (
                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                  ))}
                </select>
              </div>

              <MultiSelectAudience
                label="تخصيص شعب محددة (اختياري - يترك فارغاً لكل الشعب)"
                placeholder="ابحث واختر الشعب..."
                options={classRooms}
                selectedIds={selectedClassRoomIds}
                onChange={setSelectedClassRoomIds}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              نص الإعلان والتفاصيل <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل التعميم بوضوح هنا..."
              required
              className="w-full rounded-2xl border border-input p-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all resize-none min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-11 flex-1 rounded-xl border-border bg-transparent text-foreground hover:bg-muted"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="primary-gradient h-11 flex-[2] rounded-xl font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
            >
              {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              {isEditing ? "حفظ التعديلات" : "اعتماد ونشر التعميم"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}