import { useState, useEffect } from "react";
import { Megaphone, Loader2, Users, School } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { MultiSelectAudience, type OptionItem } from "../shared/MultiSelectAudience";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import type { Announcement, AnnouncementAudience } from "../../types/communication.types";

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

  // Form States
  const [audience, setAudience] = useState<AnnouncementAudience>("student");
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
        { 
          onSuccess: handleSuccess,
          onError: (err: any) => {
            console.error("Update Announcement Error:", err?.response?.data || err);
            alert(err?.response?.data?.message || "فشل في تعديل الإعلان.");
          }
        }
      );
    } else {
      createAnnouncement.mutate(payload, { 
        onSuccess: handleSuccess,
        onError: (err: any) => {

          console.error("Create Announcement Error:", err?.response?.data || err);
          const backendMessage = err?.response?.data?.message;
          const backendErrors = err?.response?.data?.errors;
          const firstError = backendErrors ? Object.values(backendErrors)[0] : null;
          alert(firstError || backendMessage || "فشل في نشر الإعلان. افتح الـ Console لمعرفة السبب الدقيق.");
        }
      });
    }
  };

  const handleSuccess = () => {
    alert(isEditing ? "تم تعديل الإعلان بنجاح!" : "تم نشر الإعلان بنجاح!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground border-border shadow-floating">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Megaphone className="w-5 h-5 text-primary" />
            {isEditing ? "تعديل التعميم / الإعلان" : "نشر تعميم أو إعلان جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* 1. الفئة المستهدفة (طلاب أم كادر) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground block">
              الفئة المستهدفة بالإعلان <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-muted/50 rounded-xl border border-input">
              <button
                type="button"
                onClick={() => setAudience("student")}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  audience === "student"
                    ? "bg-card text-primary shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <School className="w-4 h-4" />
                الطلاب وأولياء الأمور
              </button>
              <button
                type="button"
                onClick={() => setAudience("staff")}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  audience === "staff"
                    ? "bg-card text-primary shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="w-4 h-4" />
                الكادر التدريسي والإداري
              </button>
            </div>
          </div>


          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              عنوان الإعلان <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: اجتماع طارئ، تأجيل امتحان الرياضيات..."
              required
              className="w-full rounded-xl border border-input p-2.5 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
            />
          </div>


          {audience === "student" && (
            <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-3 animate-in fade-in duration-200">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  المرحلة الدراسية <span className="text-destructive">*</span>
                </label>
                <select
                  value={gradeLevelId}
                  onChange={(e) => setGradeLevelId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
                >
                  <option value="">-- اختر المرحلة الدراسية --</option>
                  {gradeLevels.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
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


          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              نص الإعلان والتفاصيل <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل التعميم بوضوح هنا..."
              required
              className="w-full rounded-xl border border-input p-2.5 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all resize-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="primary-gradient text-primary-foreground gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "حفظ التعديلات" : "اعتماد ونشر التعميم"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}