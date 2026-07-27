import { useState } from "react";
import { Calendar, Clock, Edit3, Trash2, Sparkles, Users, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useActivities } from "../../hooks/useActivities";
import type { Activity } from "../../types/communication.types";

type Props = {
  onEdit: (activity: Activity) => void;
};

export function ActivitiesList({ onEdit }: Props) {
  const { activities, isLoading, isError, refetch, deleteActivity } = useActivities();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const handleDelete = async (id: string | number, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف النشاط "${name}"؟ لا يمكن التراجع عن هذه العملية.`)) {
      setDeletingId(id);
      deleteActivity.mutate(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">جاري تحميل الأنشطة المدرسية...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center space-y-3 my-4">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
        <h3 className="text-base font-bold text-foreground">حدث خطأ أثناء جلب الأنشطة</h3>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center my-6 space-y-2">
        <Sparkles className="w-10 h-10 text-muted-foreground/60 mx-auto animate-pulse" />
        <h3 className="text-lg font-bold text-foreground">لا توجد أنشطة مجدولة حالياً</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          يمكنك البدء بجدولة رحلات فلكية، أنشطة رياضية، أو فعاليات ثقافية عبر الضغط على زر إضافة نشاط جديد.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {activities.map((activity) => {
        const isDeleting = deletingId === activity.id;

        return (
          <div
            key={activity.id}
            className="soft-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-primary/50 hover:shadow-floating group relative overflow-hidden"
          >

            <div className="absolute top-0 right-0 left-0 h-1.5 primary-gradient opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-3">

              <div className="flex items-center justify-between pt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                  <Sparkles className="w-3 h-3" />
                  {activity.type}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                  {activity.activity_date}
                </span>
              </div>


              <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {activity.activity_name}
              </h3>


              <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-xs text-muted-foreground pt-1 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-warning" />
                  <span>
                    {activity.start_time} - {activity.end_time}
                  </span>
                </div>
                {activity.class_room_ids && activity.class_room_ids.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-info" />
                    <span>{activity.class_room_ids.length} شعب مشمولة</span>
                  </div>
                )}
              </div>


              {activity.description ? (
                <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed bg-muted/40 p-2.5 rounded-xl border border-border/40">
                  {activity.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/50 italic py-2">لا توجد ملاحظات إضافية</p>
              )}
            </div>


            <div className="flex items-center justify-end gap-1.5 pt-4 mt-2 border-t border-border/60">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(activity)}
                className="h-8 px-2.5 text-muted-foreground hover:text-foreground hover:bg-accent text-xs gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-info" />
                تعديل
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(activity.id, activity.activity_name)}
                disabled={isDeleting}
                className="h-8 px-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs gap-1"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-destructive" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                )}
                حذف
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}