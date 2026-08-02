import { useState, useEffect } from "react";
import { Sparkles, Loader2, CalendarDays, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { MultiSelectAudience, type OptionItem } from "../shared/MultiSelectAudience";
import { useActivities } from "../../hooks/useActivities";
import type { Activity, ActivityPayload } from "../../types/communication.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradeLevels: { id: string | number; name: string }[];
  classRooms: OptionItem[];
  activityToEdit?: Activity | null;
};

export function CreateActivityDialog({
  open,
  onOpenChange,
  gradeLevels = [],
  classRooms = [],
  activityToEdit = null,
}: Props) {
  const { createActivity, updateActivity } = useActivities();
  const isEditing = !!activityToEdit;
  const isPending = createActivity.isPending || updateActivity.isPending;

  const [activityName, setActivityName] = useState("");
  const [type, setType] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState<string | number>("");
  const [selectedClassRoomIds, setSelectedClassRoomIds] = useState<(string | number)[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (activityToEdit && open) {
      setActivityName(activityToEdit.activity_name || "");
      setType(activityToEdit.type || "");
      setActivityDate(activityToEdit.activity_date || "");
      setStartTime(activityToEdit.start_time || "");
      setEndTime(activityToEdit.end_time || "");
      setGradeLevelId(activityToEdit.grade_level_id || "");
      setSelectedClassRoomIds(activityToEdit.class_room_ids || []);
      setDescription(activityToEdit.description || "");
    } else if (!open) {
      setActivityName("");
      setType("");
      setActivityDate("");
      setStartTime("");
      setEndTime("");
      setGradeLevelId("");
      setSelectedClassRoomIds([]);
      setDescription("");
    }
  }, [activityToEdit, open]);

  // 🌟 1. تفريغ الشعب تلقائياً عند تغيير المرحلة
  useEffect(() => {
    setSelectedClassRoomIds([]);
  }, [gradeLevelId]);

  // 🌟 2. فلترة الشعب لتطابق المرحلة المختارة فقط
  const filteredClassRooms = classRooms.filter(
    (c: any) => !gradeLevelId || String(c.parentId) === String(gradeLevelId)
  );

  const handleError = (err: any) => {
    console.error("Activity Error:", err?.response?.data || err);
    if (err?.response?.status === 403) {
      alert("❌ عذراً، حسابك الحالي لا يمتلك الصلاحية لإدارة الأنشطة.");
      return;
    }
    const backendMessage = err?.response?.data?.message;
    const backendErrors = err?.response?.data?.errors;
    const firstError = backendErrors ? Object.values(backendErrors).flat()[0] : null;
    alert(`❌ فشل الحفظ:\n[ ${firstError || backendMessage || "حدث خطأ غير معروف"} ]`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!gradeLevelId) {
      alert("الرجاء تحديد المرحلة الدراسية المستهدفة.");
      return;
    }

    // 🌟 3. إصلاح صيغة الوقت لتتوافق مع لارافيل (H:i)
    const formatTime = (timeStr: string) => timeStr ? timeStr.substring(0, 5) : "";

    const payload: ActivityPayload = {
      activity_name: activityName.trim(),
      type: type.trim(),
      activity_date: activityDate,
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
      grade_level_id: Number(gradeLevelId),
      description: description.trim(),
    };

    if (selectedClassRoomIds.length > 0) {
      payload.class_room_ids = selectedClassRoomIds.map(Number);
    }

    if (isEditing && activityToEdit) {
      updateActivity.mutate(
        { id: activityToEdit.id, payload },
        { onSuccess: () => onOpenChange(false), onError: handleError }
      );
    } else {
      createActivity.mutate(payload, { 
        onSuccess: () => onOpenChange(false), 
        onError: handleError 
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="floating-card sm:max-w-xl rounded-3xl border border-border p-6 shadow-2xl max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="space-y-1.5 text-right">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            {isEditing ? "تعديل النشاط المدرسي" : "إضافة نشاط مدرسي جديد"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pr-11">
            قم بتعبئة تفاصيل النشاط، وتحديد الوقت، واختيار الشعب المستهدفة بوضوح.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                اسم النشاط <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                required
                className="w-full h-11 rounded-xl border border-input px-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                نوع النشاط <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full h-11 rounded-xl border border-input px-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
              />
            </div>
          </div>

          <div className="p-4 bg-muted/20 rounded-2xl border border-border space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5" /> تاريخ النشاط <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                required
                className="w-full h-11 rounded-xl border border-input px-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> وقت البدء <span className="text-destructive">*</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full h-11 rounded-xl border border-input px-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> وقت الانتهاء <span className="text-destructive">*</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full h-11 rounded-xl border border-input px-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
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
                <option value="">-- اختر المرحلة --</option>
                {gradeLevels.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            <MultiSelectAudience
              label="تخصيص شعب محددة (اختياري - يترك فارغاً لكل الشعب)"
              placeholder="ابحث واختر الشعب..."
              options={filteredClassRooms}
              selectedIds={selectedClassRoomIds}
              onChange={setSelectedClassRoomIds}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              تفاصيل وملاحظات النشاط
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-input p-3 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all resize-none min-h-[80px]"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="h-11 flex-1 rounded-xl">إلغاء</Button>
            <Button type="submit" disabled={isPending} className="primary-gradient h-11 flex-[2] rounded-xl font-semibold text-primary-foreground shadow-md active:scale-[0.98]">
              {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              {isEditing ? "حفظ التعديلات" : "اعتماد النشاط"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}