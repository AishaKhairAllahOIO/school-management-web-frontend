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
  const { myAnnouncements, staffAnnouncements, isLoadingMy, isLoadingStaff, deleteAnnouncement } = useAnnouncements();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const announcements = activeTab === "created" ? myAnnouncements : staffAnnouncements;
  const isLoading = activeTab === "created" ? isLoadingMy : isLoadingStaff;

  const handleDelete = async (id: string | number, title: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف الإعلان "${title}"؟`)) {
      setDeletingId(id);
      deleteAnnouncement.mutate(id, {
        onSettled: () => setDeletingId(null),
        onError: (err: any) => {
          if (err?.response?.status === 403) {
            alert("❌ غير مصرح لك بحذف هذا الإعلان."); // التقاط 403
          } else {
            alert("❌ فشل حذف الإعلان.");
          }
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">جاري تحميل التعاميم...</p>
      </div>
    );
  }

  if (!announcements.length) {
    return (
      <div className="soft-card flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center my-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Megaphone className="w-7 h-7" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-foreground">لا توجد إعلانات حالياً</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((item) => {
        const isDeleting = deletingId === item.id;
        const isStudentAudience = item.audience === "student";
        const isBothAudience = item.audience === "both";

        return (
          <div key={item.id} className="soft-card rounded-3xl p-5 border border-border bg-card transition-all hover:shadow-floating flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
            <div className={`absolute top-0 bottom-0 right-0 w-1.5 ${isBothAudience ? "bg-purple-500" : isStudentAudience ? "bg-info" : "bg-primary"}`} />

            <div className="space-y-2 flex-1 pr-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold ${
                  isBothAudience ? "bg-purple-500/15 text-purple-600 border border-purple-500/20" :
                  isStudentAudience ? "bg-info/15 text-info border border-info/20" : "bg-primary/15 text-primary border border-primary/20"
                }`}>
                  {isBothAudience ? <Megaphone className="w-3 h-3" /> : isStudentAudience ? <School className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                  {isBothAudience ? "الجميع" : isStudentAudience ? "موجه للطلاب" : "موجه للكادر"}
                </span>
                
                {item.created_at && (
                  <span className="text-xs text-muted-foreground font-medium">
                    • {new Date(item.created_at).toLocaleDateString("ar-EG")}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-extrabold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {activeTab === "created" && (
              <div className="flex md:flex-col items-center justify-end gap-2 border-t md:border-t-0 md:border-r border-border/60 pt-3 md:pt-0 md:pr-4">
                <Button size="sm" variant="ghost" onClick={() => onEdit(item)} className="w-full h-9 rounded-xl text-info hover:text-info hover:bg-info/10 text-xs gap-1 justify-start">
                  <Edit3 className="w-4 h-4" /> تعديل
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id, item.title)} disabled={isDeleting} className="w-full h-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 text-xs gap-1 justify-start">
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} حذف
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}