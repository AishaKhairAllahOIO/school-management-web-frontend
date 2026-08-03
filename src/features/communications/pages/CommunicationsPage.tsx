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
import {
  useLocation,
} from "react-router-dom";

import {
  Button,
} from "@/shared/ui/button";

import {
  ActivitiesList,
} from "../components/activities/ActivitiesList";
import {
  CreateActivityDialog,
} from "../components/activities/CreateActivityDialog";
import {
  SendBulkAlertDialog,
} from "../components/alerts/SendBulkAlertDialog";
import {
  AnnouncementsList,
} from "../components/announcements/AnnouncementsList";
import {
  CreateAnnouncementDialog,
} from "../components/announcements/CreateAnnouncementDialog";
import {
  SchoolLawsSection,
} from "../components/laws/SchoolLawsSection";
import {
  useCommunicationOptions,
} from "../hooks/useCommunicationOptions";
import type {
  Activity,
  Announcement,
} from "../types/communication.types";

type CommunicationSection =
  | "announcements"
  | "alerts"
  | "activities"
  | "laws";

export function CommunicationsPage() {
  const location = useLocation();

  const activeSection =
    useMemo<CommunicationSection>(() => {
      if (location.pathname.includes("/alerts")) {
        return "alerts";
      }

      if (location.pathname.includes("/activities")) {
        return "activities";
      }

      if (location.pathname.includes("/laws")) {
        return "laws";
      }

      return "announcements";
    }, [location.pathname]);

  const [announcementTab, setAnnouncementTab] =
    useState<"created" | "staff">("created");

  const [alertDialogOpen, setAlertDialogOpen] =
    useState(false);
  const [alertTarget, setAlertTarget] =
    useState<"student" | "staff">("student");

  const [announcementDialogOpen, setAnnouncementDialogOpen] =
    useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const [activityDialogOpen, setActivityDialogOpen] =
    useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<Activity | null>(null);

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
        <AnnouncementsWorkspace
          activeTab={announcementTab}
          onTabChange={setAnnouncementTab}
          onCreate={() => openAnnouncement()}
          onEdit={openAnnouncement}
        />
      ) : null}

      {activeSection === "alerts" ? (
        <AlertsWorkspace
          onNotifyStudents={() => openAlert("student")}
          onNotifyStaff={() => openAlert("staff")}
        />
      ) : null}

      {activeSection === "activities" ? (
        <ActivitiesWorkspace
          onCreate={() => openActivity()}
          onEdit={openActivity}
        />
      ) : null}

      {activeSection === "laws" ? (
        <SchoolLawsSection />
      ) : null}

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

function AnnouncementsWorkspace({
  activeTab,
  onTabChange,
  onCreate,
  onEdit,
}: {
  activeTab: "created" | "staff";
  onTabChange: (tab: "created" | "staff") => void;
  onCreate: () => void;
  onEdit: (announcement: Announcement) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 rounded-[22px] border border-primary/[0.10] bg-card p-2 shadow-[0_10px_30px_rgba(38,24,84,0.045)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1">
            {([
              ["created", "Published"],
              ["staff", "Received"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onTabChange(value)}
                className={[
                  "group relative inline-flex h-11 min-w-max items-center justify-center rounded-[14px] px-4 text-[12px] font-medium transition-all duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
                  activeTab === value
                    ? "bg-primary/[0.07] text-primary"
                    : "text-muted-foreground hover:bg-primary/[0.04] hover:text-foreground",
                ].join(" ")}
              >
                <span className="whitespace-nowrap">{label}</span>
                <span
                  aria-hidden
                  className={[
                    "absolute bottom-0 left-4 right-4 h-[2px] origin-center rounded-full bg-primary transition-transform duration-200",
                    activeTab === value ? "scale-x-100" : "scale-x-0",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          onClick={onCreate}
          className="h-11 w-full rounded-[14px] bg-primary px-5 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(91,62,220,0.18)] hover:bg-primary/90 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          New announcement
        </Button>
      </div>

      <AnnouncementsList
        activeTab={activeTab}
        onEdit={onEdit}
      />
    </>
  );
}

function AlertsWorkspace({
  onNotifyStudents,
  onNotifyStaff,
}: {
  onNotifyStudents: () => void;
  onNotifyStaff: () => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AlertAudienceCard
        icon={School}
        title="Student alerts"
        description="Send attendance, behavior, homework, escape, or payment alerts to selected enrolled students."
        tone="info"
        actionLabel="Send student alert"
        onClick={onNotifyStudents}
      />

      <AlertAudienceCard
        icon={Users}
        title="Staff alerts"
        description="Send salary, absence, or lateness alerts directly to selected staff members by name."
        tone="warning"
        actionLabel="Send staff alert"
        onClick={onNotifyStaff}
      />
    </div>
  );
}

function ActivitiesWorkspace({
  onCreate,
  onEdit,
}: {
  onCreate: () => void;
  onEdit: (activity: Activity) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 rounded-[22px] border border-info/[0.13] bg-card p-3 shadow-[0_10px_30px_rgba(38,24,84,0.045)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-info/[0.10] text-info">
            <CalendarPlus className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <p className="text-[11.5px] leading-5 text-muted-foreground">
            Schedule school events with a date, time, grade, and classrooms.
          </p>
        </div>

        <Button
          type="button"
          onClick={onCreate}
          className="h-11 w-full rounded-[14px] bg-info px-5 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(59,130,246,0.17)] hover:bg-info/90 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          New activity
        </Button>
      </div>

      <ActivitiesList onEdit={onEdit} />
    </>
  );
}

function AlertAudienceCard({
  icon: Icon,
  title,
  description,
  tone,
  actionLabel,
  onClick,
}: {
  icon: typeof BellRing;
  title: string;
  description: string;
  tone: "info" | "warning";
  actionLabel: string;
  onClick: () => void;
}) {
  const info = tone === "info";

  return (
    <article
      className={[
        "group overflow-hidden rounded-[24px] border bg-card shadow-[0_12px_34px_rgba(38,24,84,0.05)] transition-transform duration-200 hover:-translate-y-0.5",
        info ? "border-info/[0.14]" : "border-warning/[0.17]",
      ].join(" ")}
    >
      <div className={[
        "p-5 sm:p-6",
        info ? "bg-info/[0.035]" : "bg-warning/[0.04]",
      ].join(" ")}
      >
        <span className={[
          "flex h-12 w-12 items-center justify-center rounded-[17px] border bg-card",
          info ? "border-info/15 text-info" : "border-warning/20 text-warning",
        ].join(" ")}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>

        <h2 className="mt-4 text-[16px] font-semibold tracking-[-0.018em] text-foreground">
          {title}
        </h2>

        <p className="mt-1.5 text-[11.5px] leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="border-t border-border/50 p-4">
        <Button
          type="button"
          onClick={onClick}
          className={[
            "h-11 w-full rounded-[14px] text-[12px] font-semibold text-white",
            info
              ? "bg-info shadow-[0_10px_22px_rgba(59,130,246,0.16)] hover:bg-info/90"
              : "bg-warning shadow-[0_10px_22px_rgba(245,158,11,0.16)] hover:bg-warning/90",
          ].join(" ")}
        >
          <BellRing className="h-4 w-4" />
          {actionLabel}
        </Button>
      </div>
    </article>
  );
}
