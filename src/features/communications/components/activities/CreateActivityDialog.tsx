import { useState, useEffect } from "react";
import { Calendar, Clock, Loader2, Sparkles, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { MultiSelectAudience, type OptionItem } from "../shared/MultiSelectAudience";
import { useActivities } from "../../hooks/useActivities";
import type { Activity } from "../../types/communication.types";

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
  const [startTime, setStartTime] = useState("08:30");
  const [endTime, setEndTime] = useState("12:00");
  const [gradeLevelId, setGradeLevelId] = useState<string | number>("");
  const [selectedClassRoomIds, setSelectedClassRoomIds] = useState<(string | number)[]>([]);
  const [description, setDescription] = useState("");


  useEffect(() => {
    if (activityToEdit && open) {
      setActivityName(activityToEdit.activity_name || "");
      setType(activityToEdit.type || "");
      setActivityDate(activityToEdit.activity_date || "");
      setStartTime(activityToEdit.start_time || "08:30");
      setEndTime(activityToEdit.end_time || "12:00");
      setGradeLevelId(activityToEdit.grade_level_id || "");
      setSelectedClassRoomIds(activityToEdit.class_room_ids || []);
      setDescription(activityToEdit.description || "");
    } else if (!open) {

      setActivityName("");
      setType("");
      setActivityDate("");
      setStartTime("08:30");
      setEndTime("12:00");
      setGradeLevelId("");
      setSelectedClassRoomIds([]);
      setDescription("");
    }
  }, [activityToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeLevelId) {
      alert("الرجاء تحديد المرحلة الدراسية.");
      return;
    }

    const payload = {
      activity_name: activityName,
      type,
      activity_date: activityDate,
      start_time: startTime,
      end_time: endTime,
      grade_level_id: gradeLevelId,
      class_room_ids: selectedClassRoomIds,
      description,
    };

    if (isEditing && activityToEdit) {

      updateActivity.mutate(
        { id: activityToEdit.id, payload },
        { onSuccess: handleSuccess }
      );
    } else {

      createActivity.mutate(payload, { onSuccess: handleSuccess });
    }
  };

  const handleSuccess = () => {
    alert(isEditing ? "تم تعديل النشاط بنجاح!" : "تم إنشاء النشاط بنجاح!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card text-card-foreground border-border shadow-floating">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            {isEditing ? "تعديل النشاط المدرسي" : "إضافة نشاط مدرسي جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                اسم النشاط <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="مثال: رحلة إلى المرصد الفلكي"
                required
                className="w-full rounded-xl border border-input p-2.5 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                نوع النشاط <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="مثال: رحلة علمية، موسيقى، رياضة"
                required
                className="w-full rounded-xl border border-input p-2.5 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition-all"
              />
            </div>
          </div>


          <div className="p-3 bg-muted/40 rounded-xl border border-border grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> تاريخ النشاط
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                required
                className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> وقت البدء
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> وقت الانتهاء
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
              />
            </div>
          </div>


          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                المرحلة الدراسية <span className="text-destructive">*</span>
              </label>
              <select
                value={gradeLevelId}
                onChange={(e) => setGradeLevelId(e.target.value)}
                required
                className="w-full rounded-xl border border-input p-2.5 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none"
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
              label="تخصيص شعب محددة (اختياري)"
              placeholder="ابحث واختر الشعب المشمولة بالنشاط..."
              options={classRooms}
              selectedIds={selectedClassRoomIds}
              onChange={setSelectedClassRoomIds}
            />
          </div>


          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              تفاصيل وملاحظات النشاط
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل الرحلة، المستلزمات المطلوبة من الطالب، أو أي شروط أخرى..."
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
              {isEditing ? "حفظ التعديلات" : "اعتماد ونشر النشاط"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}