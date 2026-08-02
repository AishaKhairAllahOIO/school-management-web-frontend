import { useState, useMemo, useEffect } from "react"; // 🌟 تم إضافة useEffect هنا
import { useLocation } from "react-router-dom";
import { Megaphone, Plus, Users, School } from "lucide-react";
import { Button } from "@/shared/ui/button";

import { ActivitiesList } from "../components/activities/ActivitiesList";
import { CreateActivityDialog } from "../components/activities/CreateActivityDialog";
import { AnnouncementsList } from "../components/announcements/AnnouncementsList";
import { CreateAnnouncementDialog } from "../components/announcements/CreateAnnouncementDialog";
import { SendBulkAlertDialog } from "../components/alerts/SendBulkAlertDialog";
import { SchoolLawsSection } from "../components/laws/SchoolLawsSection";
import { useCommunicationOptions } from "../hooks/useCommunicationOptions";
import type { Activity, Announcement } from "../types/communication.types";

export function CommunicationsPage() {
  const location = useLocation();

  const activeTab = useMemo(() => {
    if (location.pathname.includes("activities")) return "activities";
    if (location.pathname.includes("laws")) return "laws";
    return "announcements";
  }, [location.pathname]);

  const [announcementTab, setAnnouncementTab] = useState<"created" | "staff">("created");

  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertTarget, setAlertTarget] = useState<"student" | "staff">("student");

  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const { students, staff, gradeLevels, classRooms, isLoadingOptions } = useCommunicationOptions();
  


  const handleOpenAlert = (target: "student" | "staff") => {
    setAlertTarget(target);
    setAlertDialogOpen(true);
  };

  const handleOpenAnnouncement = (announcement?: Announcement) => {
    setSelectedAnnouncement(announcement || null);
    setAnnouncementDialogOpen(true);
  };

  const handleOpenActivity = (activity?: Activity) => {
    setSelectedActivity(activity || null);
    setActivityDialogOpen(true);
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 🌟 Header Card with Animated Glow Border */}
      <div className="glow-border-wrapper shadow-sm">
        <div className="glow-border-content p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Megaphone className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Communications</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage announcements, activities, alerts, and school regulations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => handleOpenAlert("staff")}
              className="h-11 rounded-xl border-border bg-transparent hover:bg-muted font-medium text-sm"
            >
              <Users className="mr-2 h-4 w-4" /> Staff Alert
            </Button>
            <Button
              onClick={() => handleOpenAlert("student")}
              className="primary-gradient h-11 rounded-xl font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98] text-sm"
            >
              <School className="mr-2 h-4 w-4" /> Student Alert
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Tab Content (No internal tabs anymore!) */}
      <div className="mt-2">
        {activeTab === "announcements" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-2xl border border-border w-fit">
                <button
                  onClick={() => setAnnouncementTab("created")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    announcementTab === "created"
                      ? "bg-card text-primary shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  My Announcements
                </button>
                <button
                  onClick={() => setAnnouncementTab("staff")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    announcementTab === "staff"
                      ? "bg-card text-primary shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Staff Announcements
                </button>
              </div>
              <Button
                onClick={() => handleOpenAnnouncement()}
                className="primary-gradient h-11 rounded-xl px-5 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
              >
                <Plus className="mr-2 h-4 w-4" /> New Announcement
              </Button>
            </div>
            <AnnouncementsList activeTab={announcementTab} onEdit={handleOpenAnnouncement} />
          </div>
        )}

        {activeTab === "activities" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-foreground">Scheduled Activities</h3>
              <Button
                onClick={() => handleOpenActivity()}
                className="primary-gradient h-11 rounded-xl px-5 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
              >
                <Plus className="mr-2 h-4 w-4" /> New Activity
              </Button>
            </div>
            <ActivitiesList onEdit={handleOpenActivity} />
          </div>
        )}

        {activeTab === "laws" && <SchoolLawsSection />}
      </div>

      <SendBulkAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        targetAudience={alertTarget}
        audienceList={alertTarget === "student" ? students : staff}
        isLoadingAudience={isLoadingOptions}
      />
      <CreateAnnouncementDialog
        open={announcementDialogOpen}
        onOpenChange={setAnnouncementDialogOpen}
        gradeLevels={gradeLevels}
        classRooms={classRooms}
        announcementToEdit={selectedAnnouncement}
      />
      <CreateActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        gradeLevels={gradeLevels}
        classRooms={classRooms}
        activityToEdit={selectedActivity}
      />
    </div>
  );
}