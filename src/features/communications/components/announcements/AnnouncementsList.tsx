import { useState } from "react";
import { Megaphone, Edit3, Trash2, Users, School, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import type { Announcement } from "../../types/communication.types";

type Props = {
  activeTab: "created" | "staff";  
  onEdit: (announcement: Announcement) => void;
};

export function AnnouncementsList({ activeTab, onEdit }: Props) {
  const { myAnnouncements, staffAnnouncements, isLoadingMy, isLoadingStaff, deleteAnnouncement } =
    useAnnouncements();

  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const announcements = activeTab === "created" ? myAnnouncements : staffAnnouncements;
  const isLoading = activeTab === "created" ? isLoadingMy : isLoadingStaff;

  const handleDelete = async (id: string | number, title: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف الإعلان "${title}"؟`)) {
      setDeletingId(id);
      deleteAnnouncement.mutate(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">جاري تحميل الإعلانات والتعاميم...</p>
      </div>
    );
  }

  if (!announcements.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center my-6 space-y-2">
        <Megaphone className="w-10 h-10 text-muted-foreground/60 mx-auto animate-pulse" />
        <h3 className="text-lg font-bold text-foreground">لا توجد إعلانات منشورة حالياً</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {activeTab === "created"
            ? "لم تقم بنشر أي تعاميم أو إعلانات بعد. اضغط على زر إضافة إعلان للبدء."
            : "لا توجد تعاميم إدارية موجهة للكادر التدريسي والإداري في الوقت الحالي."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((item) => {
        const isDeleting = deletingId === item.id;
        const isStudentAudience = item.audience === "student";

        return (
          <div
            key={item.id}
            className="soft-card rounded-2xl p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-floating flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
          >
            {/* شريط جانبي ملون لتمييز الهدف */}
            <div
              className={`absolute top-0 bottom-0 right-0 w-1.5 ${
                isStudentAudience ? "bg-info" : "bg-primary"
              }`}
            />

            <div className="space-y-2 flex-1 pr-2">

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                    isStudentAudience
                      ? "bg-info/15 text-info border border-info/20"
                      : "bg-primary/15 text-primary border border-primary/20"
                  }`}
                >
                  {isStudentAudience ? <School className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                  {isStudentAudience ? "موجه للطلاب" : "موجه للكادر"}
                </span>

                {item.creator_name && (
                  <span className="text-xs text-muted-foreground">
                    بواسطة: <strong className="text-foreground">{item.creator_name}</strong>
                  </span>
                )}

                {item.created_at && (
                  <span className="text-xs text-muted-foreground/70">
                    • {new Date(item.created_at).toLocaleDateString("ar-EG")}
                  </span>
                )}
              </div>


              <h3 className="text-base md:text-lg font-bold text-foreground">{item.title}</h3>


              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/40">
                {item.description}
              </p>
            </div>


            {activeTab === "created" && (
              <div className="flex md:flex-col items-center justify-end gap-1.5 border-t md:border-t-0 md:border-r border-border/60 pt-3 md:pt-0 md:pr-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(item)}
                  className="w-full h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent text-xs gap-1 justify-start"
                >
                  <Edit3 className="w-3.5 h-3.5 text-info" />
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(item.id, item.title)}
                  disabled={isDeleting}
                  className="w-full h-8 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs gap-1 justify-start"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-destructive" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  )}
                  حذف
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}