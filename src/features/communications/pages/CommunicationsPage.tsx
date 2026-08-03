import {
  BellRing,
  CalendarDays,
  Megaphone,
  Plus,
  Scale,
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

const sectionVisuals = {
  announcements: {
    icon: Megaphone,
    label: "Announcements",
    description:
      "Publish focused school updates for students, staff, or both audiences.",
    accent: "bg-primary",
    iconSurface: "bg-primary/[0.09] text-primary",
    border: "border-primary/[0.12]",
    actionLabel: "New announcement",
  },
  activities: {
    icon: CalendarDays,
    label: "Activities",
    description:
      "Plan school events with a clear date, time, grade, and classroom audience.",
    accent: "bg-info",
    iconSurface: "bg-info/[0.10] text-info",
    border: "border-info/[0.13]",
    actionLabel: "New activity",
  },
  laws: {
    icon: Scale,
    label: "School laws",
    description:
      "Maintain the official rules and regulations shared across the school community.",
    accent: "bg-success",
    iconSurface: "bg-success/[0.10] text-success",
    border: "border-success/[0.13]",
    actionLabel: "Add law",
  },
} as const;

type CommunicationSection = keyof typeof sectionVisuals;

export function CommunicationsPage() {
  const location = useLocation();

  const activeSection = useMemo<CommunicationSection>(() => {
    if (location.pathname.includes("activities")) {
      return "activities";
    }
    if (location.pathname.includes("laws")) {
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

  const visual = sectionVisuals[activeSection];
  const SectionIcon = visual.icon;

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

  function handlePrimaryAction() {
    if (activeSection === "announcements") {
      openAnnouncement();
      return;
    }
    if (activeSection === "activities") {
      openActivity();
    }
  }

  return (
    <section className="-mt-1 min-w-0 space-y-4 pb-8">
      <article
        className={[
          "relative overflow-hidden rounded-[22px] border bg-card",
          "shadow-[0_10px_30px_rgba(38,24,84,0.05)]",
          visual.border,
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-[3px] ${visual.accent}`}
        />

        <div className="flex min-h-[76px] flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] ${visual.iconSurface}`}
            >
              <SectionIcon className="h-5 w-5" strokeWidth={1.85} />
            </span>

            <div className="min-w-0">
              <h1 className="text-[18px] font-medium leading-6 tracking-[0.003em] text-foreground">
                {visual.label}
              </h1>
              <p className="mt-1 text-[12.5px] leading-[18px] text-muted-foreground">
                {visual.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeSection !== "laws" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openAlert("staff")}
                  className="h-10 rounded-[12px] border-border/70 bg-transparent px-3.5 text-[12px] font-medium"
                >
                  <Users className="h-4 w-4" />
                  Staff alert
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openAlert("student")}
                  className="h-10 rounded-[12px] border-primary/20 bg-transparent px-3.5 text-[12px] font-medium text-primary hover:bg-primary/[0.05]"
                >
                  <School className="h-4 w-4" />
                  Student alert
                </Button>
              </>
            ) : null}

            {activeSection !== "laws" ? (
              <Button
                type="button"
                onClick={handlePrimaryAction}
                className="h-10 rounded-[12px] px-4 text-[12px] font-medium"
              >
                <Plus className="h-4 w-4" />
                {visual.actionLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </article>

      {activeSection === "announcements" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-[18px] border border-border/60 bg-card p-1.5 shadow-[0_7px_22px_rgba(38,24,84,0.035)]">
            <div className="flex min-w-0 items-center gap-1">
              {([
                ["created", "Created by me"],
                ["staff", "Staff feed"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAnnouncementTab(value)}
                  className={[
                    "relative h-10 rounded-[12px] px-4 text-[12px] font-medium transition-colors",
                    announcementTab === value
                      ? "bg-primary/[0.075] text-primary"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  ].join(" ")}
                >
                  {label}
                  <span
                    className={[
                      "absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-primary transition-transform",
                      announcementTab === value ? "scale-x-100" : "scale-x-0",
                    ].join(" ")}
                  />
                </button>
              ))}
            </div>

            <span className="hidden items-center gap-1.5 pe-3 text-[10.5px] text-muted-foreground sm:flex">
              <BellRing className="h-3.5 w-3.5" />
              School-wide communication feed
            </span>
          </div>

          <AnnouncementsList
            activeTab={announcementTab}
            onEdit={openAnnouncement}
          />
        </div>
      ) : null}

      {activeSection === "activities" ? (
        <ActivitiesList onEdit={openActivity} />
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
