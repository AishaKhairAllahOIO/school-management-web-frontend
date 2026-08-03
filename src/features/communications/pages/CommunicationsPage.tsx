import {
  BellRing,
  CalendarPlus,
  Megaphone,
  Plus,
  School,
  Users,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import { Button } from "@/shared/ui/button";

import { ActivitiesList } from "../components/activities/ActivitiesList";
import { CreateActivityDialog } from "../components/activities/CreateActivityDialog";
import { SendBulkAlertDialog } from "../components/alerts/SendBulkAlertDialog";
import { AnnouncementsList } from "../components/announcements/AnnouncementsList";
import { CreateAnnouncementDialog } from "../components/announcements/CreateAnnouncementDialog";
import { SchoolLawsSection } from "../components/laws/SchoolLawsSection";
import { useCommunicationOptions } from "../hooks/useCommunicationOptions";
import type { Activity, Announcement } from "../types/communication.types";

type CommunicationSection = "announcements" | "activities" | "laws";

export function CommunicationsPage() {
  const location = useLocation();

  const activeSection = useMemo<CommunicationSection>(() => {
    if (location.pathname.includes("activities")) return "activities";
    if (location.pathname.includes("laws")) return "laws";
    return "announcements";
  }, [location.pathname]);

  const [announcementTab, setAnnouncementTab] =
    useState<"created" | "staff">("created");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertTarget, setAlertTarget] =
    useState<"student" | "staff">("student");
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const {
    students,
    staff,
    gradeLevels,
    classRooms,
    isLoadingOptions,
  } = useCommunicationOptions();

  function openAlert(target: "student" | "staff") {
    setAlertTarget(target);
    setAlertDialogOpen(true);
  }

  function openAnnouncement(announcement?: Announcement) {
    setSelectedAnnouncement(announcement ?? null);
    setAnnouncementDialogOpen(true);
  }

  function openActivity(activity?: Activity) {
    setSelectedActivity(activity ?? null);
    setActivityDialogOpen(true);
  }

  return (
    <section className="min-w-0 space-y-4 pb-8">
      {activeSection === "announcements" ? (
        <>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex min-w-0 items-center gap-1 rounded-[20px] border border-primary/[0.12] bg-card p-1.5 shadow-[0_10px_30px_rgba(38,24,84,0.045)]">
              {([
                ["created", "Created by me"],
                ["staff", "Staff feed"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAnnouncementTab(value)}
                  className={[
                    "relative h-11 flex-1 rounded-[14px] px-4 text-[12px] font-medium transition",
                    announcementTab === value
                      ? "bg-primary/[0.085] text-primary"
                      : "text-muted-foreground hover:bg-muted/35 hover:text-foreground",
                  ].join(" ")}
                >
                  {label}
                  <span className={[
                    "absolute inset-x-5 bottom-0 h-[2px] rounded-full bg-primary transition-transform",
                    announcementTab === value ? "scale-x-100" : "scale-x-0",
                  ].join(" ")} />
                </button>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => openAnnouncement()}
              className="h-[56px] rounded-[18px] px-5 text-[12px] shadow-[0_12px_28px_rgba(91,62,220,0.16)]"
            >
              <Megaphone className="h-4 w-4" />
              Publish announcement
            </Button>
          </div>

          <div className="rounded-[18px] border border-primary/[0.10] bg-primary/[0.025] px-4 py-3 text-[11.5px] leading-5 text-muted-foreground">
            Use announcements for broad, reusable messages. Choose a feed above, then publish or manage items directly from the list.
          </div>

          <AnnouncementsList
            activeTab={announcementTab}
            onEdit={openAnnouncement}
          />
        </>
      ) : null}

      {activeSection === "activities" ? (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <ActionCard
              icon={CalendarPlus}
              title="Plan an activity"
              description="Create the event, schedule it, then target grades and classrooms."
              tone="info"
              onClick={() => openActivity()}
            />
            <ActionCard
              icon={School}
              title="Notify students"
              description="Send attendance, behavior, homework, or payment alerts to selected enrollments."
              tone="primary"
              onClick={() => openAlert("student")}
            />
            <ActionCard
              icon={Users}
              title="Notify staff"
              description="Send salary, absence, or lateness alerts to staff members by name."
              tone="warning"
              onClick={() => openAlert("staff")}
            />
          </div>

          <div className="flex items-center gap-2 rounded-[18px] border border-info/[0.11] bg-info/[0.025] px-4 py-3 text-[11.5px] leading-5 text-muted-foreground">
            <BellRing className="h-4 w-4 shrink-0 text-info" />
            Activities organize events. Alerts are separate, direct notifications for specific students or staff members.
          </div>

          <ActivitiesList onEdit={openActivity} />
        </>
      ) : null}

      {activeSection === "laws" ? <SchoolLawsSection /> : null}

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
    </section>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  tone,
  onClick,
}: {
  icon: typeof Plus;
  title: string;
  description: string;
  tone: "primary" | "info" | "warning";
  onClick: () => void;
}) {
  const styles = {
    primary: "border-primary/[0.13] bg-primary/[0.035] text-primary",
    info: "border-info/[0.14] bg-info/[0.04] text-info",
    warning: "border-warning/[0.16] bg-warning/[0.04] text-warning",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[118px] items-start gap-3.5 rounded-[22px] border p-4 text-start shadow-[0_10px_28px_rgba(38,24,84,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(38,24,84,0.08)] ${styles}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-background/85 shadow-sm">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-foreground">
          {title}
        </span>
        <span className="mt-1.5 block text-[11px] leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}
