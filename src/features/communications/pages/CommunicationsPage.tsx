import { useState } from "react";
import { Sparkles, Megaphone, Plus, Users, School, Layers } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ActivitiesList } from "../components/activities/ActivitiesList";
import { CreateActivityDialog } from "../components/activities/CreateActivityDialog";
import { AnnouncementsList } from "../components/announcements/AnnouncementsList";
import { CreateAnnouncementDialog } from "../components/announcements/CreateAnnouncementDialog";
import { SendBulkAlertDialog } from "../components/alerts/SendBulkAlertDialog";
import { useLocation} from "react-router-dom";
 import { useCommunicationOptions } from "../hooks/useCommunicationOptions";
import type { Activity, Announcement } from "../types/communication.types";

export function CommunicationsPage() {
   const {
    gradeLevels,
    classRooms,
    students,
    staff,
    isLoadingStudents,
    isLoadingStaff,
  } = useCommunicationOptions();

  const location = useLocation();
 // const navigate = useNavigate();
  
  const [announcementSubTab, setAnnouncementSubTab] = useState<"created" | "staff">("created");

  const [activeTab, setActiveTab] = useState<"activities" | "announcements">(
    location.pathname.includes("activities") ? "activities" : "announcements"
  );
 
  //  const handleTabChange = (tab: "activities" | "announcements") => {
  //   navigate(`/admin/communication/${tab}`);  
  // };
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);


  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTargetAudience, setAlertTargetAudience] = useState<"student" | "staff">("student");


  const handleOpenCreateActivity = () => {
    setActivityToEdit(null);
    setIsActivityOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setActivityToEdit(activity);
    setIsActivityOpen(true);
  };


  const handleOpenCreateAnnouncement = () => {
    setAnnouncementToEdit(null);
    setIsAnnouncementOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementToEdit(announcement);
    setIsAnnouncementOpen(true);
  };


  const handleOpenAlert = (audience: "student" | "staff") => {
    setAlertTargetAudience(audience);
    setIsAlertOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">

      <div className="soft-card rounded-3xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <span>إدارة المحتوى والإشعارات</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
            الأنشطة، التعاميم، والتنبيهات
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            جدولة الفعاليات المدرسية، إرسال التعاميم الرسمية، وبث التنبيهات الفورية للطلاب والموظفين بضغطة زر واحدة.
          </p>
        </div>


        <div className="flex flex-wrap items-center gap-2.5 z-10 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
          <Button
            variant="outline"
            onClick={() => handleOpenAlert("student")}
            className="flex-1 lg:flex-none border-input bg-card hover:bg-accent text-foreground gap-2 text-xs h-10 px-3.5 shadow-sm"
          >
            <School className="w-4 h-4 text-info" />
            <span>تنبيه طلاب جماعي</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOpenAlert("staff")}
            className="flex-1 lg:flex-none border-input bg-card hover:bg-accent text-foreground gap-2 text-xs h-10 px-3.5 shadow-sm"
          >
            <Users className="w-4 h-4 text-warning" />
            <span>تنبيه موظفين جماعي</span>
          </Button>

          <Button
            onClick={activeTab === "activities" ? handleOpenCreateActivity : handleOpenCreateAnnouncement}
            className="w-full sm:w-auto primary-gradient text-primary-foreground gap-2 text-xs h-10 px-4 font-semibold shadow-md ml-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{activeTab === "activities" ? "إضافة نشاط جديد" : "نشر تعميم جديد"}</span>
          </Button>
        </div>


        <div className="absolute -left-10 -top-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </div>


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex items-center gap-2 p-1 bg-muted/60 rounded-2xl border border-input w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("activities")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "activities"
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>الأنشطة والرحلات المدرسية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("announcements")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "announcements"
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>التعاميم والإعلانات</span>
          </button>
        </div>

        {/* تبويب أفرع الإعلانات */}
        {activeTab === "announcements" && (
          <div className="flex items-center gap-1.5 text-xs font-medium bg-card border border-border rounded-xl p-1 shadow-sm w-fit">
            <button
              type="button"
              onClick={() => setAnnouncementSubTab("created")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                announcementSubTab === "created"
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              إعلاناتي المنشورة
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={() => setAnnouncementSubTab("staff")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                announcementSubTab === "staff"
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              التعاميم الإدارية (للكادر)
            </button>
          </div>
        )}
      </div>


      <div className="mt-4">
        {activeTab === "activities" ? (
          <ActivitiesList onEdit={handleEditActivity} />
        ) : (
          <AnnouncementsList activeTab={announcementSubTab} onEdit={handleEditAnnouncement} />
        )}
      </div>


      <CreateActivityDialog
        open={isActivityOpen}
        onOpenChange={setIsActivityOpen}
        gradeLevels={gradeLevels}
        classRooms={classRooms}
        activityToEdit={activityToEdit}
      />

      <CreateAnnouncementDialog
        open={isAnnouncementOpen}
        onOpenChange={setIsAnnouncementOpen}
        gradeLevels={gradeLevels}
        classRooms={classRooms}
        announcementToEdit={announcementToEdit}
      />

      <SendBulkAlertDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        targetAudience={alertTargetAudience}
        audienceList={alertTargetAudience === "student" ? students : staff}
        isLoadingAudience={alertTargetAudience === "student" ? isLoadingStudents : isLoadingStaff}
      />
    </div>
  );
}