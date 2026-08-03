import {
  BellRing,
  CalendarPlus,
  Megaphone,
  Plus,
  Scale,
  School,
  Sparkles,
  Users,
  type LucideIcon,
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
      if (
        location.pathname.includes(
          "/alerts",
        )
      ) {
        return "alerts";
      }

      if (
        location.pathname.includes(
          "/activities",
        )
      ) {
        return "activities";
      }

      if (
        location.pathname.includes(
          "/laws",
        )
      ) {
        return "laws";
      }

      return "announcements";
    }, [location.pathname]);

  const [
    announcementTab,
    setAnnouncementTab,
  ] = useState<"created" | "staff">(
    "created",
  );

  const [
    alertDialogOpen,
    setAlertDialogOpen,
  ] = useState(false);

  const [
    alertTarget,
    setAlertTarget,
  ] = useState<"student" | "staff">(
    "student",
  );

  const [
    announcementDialogOpen,
    setAnnouncementDialogOpen,
  ] = useState(false);

  const [
    selectedAnnouncement,
    setSelectedAnnouncement,
  ] = useState<Announcement | null>(null);

  const [
    activityDialogOpen,
    setActivityDialogOpen,
  ] = useState(false);

  const [
    selectedActivity,
    setSelectedActivity,
  ] = useState<Activity | null>(null);

  const {
    students,
    staff,
    gradeLevels,
    classRooms,
    isLoadingOptions,
  } = useCommunicationOptions();

  function openAlert(
    target: "student" | "staff",
  ) {
    setAlertTarget(target);
    setAlertDialogOpen(true);
  }

  function openAnnouncement(
    announcement?: Announcement,
  ) {
    setSelectedAnnouncement(
      announcement ?? null,
    );
    setAnnouncementDialogOpen(true);
  }

  function openActivity(
    activity?: Activity,
  ) {
    setSelectedActivity(
      activity ?? null,
    );
    setActivityDialogOpen(true);
  }

  return (
    <section className="min-w-0 space-y-4 pb-8">
      {activeSection ===
      "announcements" ? (
        <AnnouncementsWorkspace
          activeTab={announcementTab}
          onTabChange={
            setAnnouncementTab
          }
          onCreate={() =>
            openAnnouncement()
          }
          onEdit={openAnnouncement}
        />
      ) : null}

      {activeSection === "alerts" ? (
        <AlertsWorkspace
          onNotifyStudents={() =>
            openAlert("student")
          }
          onNotifyStaff={() =>
            openAlert("staff")
          }
        />
      ) : null}

      {activeSection ===
      "activities" ? (
        <ActivitiesWorkspace
          onCreate={() =>
            openActivity()
          }
          onEdit={openActivity}
        />
      ) : null}

      {activeSection === "laws" ? (
        <LawsWorkspace />
      ) : null}

      <SendBulkAlertDialog
        open={alertDialogOpen}
        onOpenChange={
          setAlertDialogOpen
        }
        targetAudience={alertTarget}
        audienceList={
          alertTarget === "student"
            ? students
            : staff
        }
        isLoadingAudience={
          isLoadingOptions
        }
      />

      <CreateAnnouncementDialog
        open={announcementDialogOpen}
        onOpenChange={
          setAnnouncementDialogOpen
        }
        gradeLevels={gradeLevels}
        classRooms={classRooms}
        announcementToEdit={
          selectedAnnouncement
        }
      />

      <CreateActivityDialog
        open={activityDialogOpen}
        onOpenChange={
          setActivityDialogOpen
        }
        gradeLevels={gradeLevels}
        classRooms={classRooms}
        activityToEdit={
          selectedActivity
        }
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
  onTabChange: (
    tab: "created" | "staff",
  ) => void;
  onCreate: () => void;
  onEdit: (
    announcement: Announcement,
  ) => void;
}) {
  return (
    <>
      <WorkspaceGuide
        icon={Megaphone}
        eyebrow="Broad communication"
        title="Publish once, inform everyone clearly"
        description="Use announcements for reusable school-wide messages, audience-based updates, and information that staff may need to revisit later."
        tone="primary"
        action={
          <Button
            type="button"
            onClick={onCreate}
            className="h-11 w-full rounded-[14px] px-5 text-[12px] shadow-[0_12px_28px_rgba(91,62,220,0.14)] sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Publish announcement
          </Button>
        }
      />

      <div className="rounded-[21px] border border-primary/[0.11] bg-card p-1.5 shadow-[0_10px_30px_rgba(38,24,84,0.045)]">
        <div className="grid grid-cols-2 gap-1">
          {([
            [
              "created",
              "Created by me",
              "Review and manage messages you published.",
            ],
            [
              "staff",
              "Staff feed",
              "Read announcements shared with your account.",
            ],
          ] as const).map(
            ([
              value,
              label,
              description,
            ]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  onTabChange(value)
                }
                className={[
                  "relative min-h-[58px] rounded-[15px] px-3 py-2 text-start transition",
                  activeTab === value
                    ? "bg-primary/[0.08] text-primary"
                    : "text-muted-foreground hover:bg-muted/35 hover:text-foreground",
                ].join(" ")}
              >
                <span className="block text-[12px] font-semibold">
                  {label}
                </span>

                <span className="mt-0.5 hidden text-[10px] leading-4 opacity-75 sm:block">
                  {description}
                </span>

                <span
                  className={[
                    "absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-primary transition-transform",
                    activeTab === value
                      ? "scale-x-100"
                      : "scale-x-0",
                  ].join(" ")}
                />
              </button>
            ),
          )}
        </div>
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
    <>
      <WorkspaceGuide
        icon={BellRing}
        eyebrow="Direct communication"
        title="Send focused alerts to the right people"
        description="Alerts are immediate, recipient-specific messages. Choose the audience first, then select the exact event and only the details required for that alert."
        tone="warning"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <AudienceActionCard
          icon={School}
          title="Student alerts"
          description="Notify selected enrolled students about absence, lateness, behavior, homework, escape, or payment situations."
          helper="Recipients are selected by student name and enrollment."
          tone="info"
          actionLabel="Choose students"
          onClick={
            onNotifyStudents
          }
        />

        <AudienceActionCard
          icon={Users}
          title="Staff alerts"
          description="Notify selected staff members about salary deposits, absence, or lateness without mixing these messages with announcements."
          helper="Recipients are selected by staff name and role."
          tone="warning"
          actionLabel="Choose staff"
          onClick={onNotifyStaff}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickExplanation
          number="01"
          title="Choose an audience"
          text="Start with students or staff so the form only shows relevant alert types."
        />

        <QuickExplanation
          number="02"
          title="Select recipients"
          text="Search by name, review the selected people, then continue with the alert details."
        />

        <QuickExplanation
          number="03"
          title="Send one clear alert"
          text="Only fields required by the chosen event are displayed, keeping the process short."
        />
      </div>
    </>
  );
}

function ActivitiesWorkspace({
  onCreate,
  onEdit,
}: {
  onCreate: () => void;
  onEdit: (
    activity: Activity,
  ) => void;
}) {
  return (
    <>
      <WorkspaceGuide
        icon={CalendarPlus}
        eyebrow="School planning"
        title="Plan events without mixing them with alerts"
        description="Activities describe scheduled school events. Define the date, time, grade, and classrooms once, then manage the event from the activity list."
        tone="info"
        action={
          <Button
            type="button"
            onClick={onCreate}
            className="h-11 w-full rounded-[14px] bg-info px-5 text-[12px] text-info-foreground shadow-[0_12px_28px_rgba(59,130,246,0.14)] hover:bg-info/90 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Plan activity
          </Button>
        }
      />

      <div className="rounded-[18px] border border-info/[0.11] bg-info/[0.025] px-4 py-3">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-info" />

          <p className="text-[11.5px] leading-5 text-muted-foreground">
            Use this page for scheduled events only. To send a direct message about attendance, payments, or staff events, open the Alerts page instead.
          </p>
        </div>
      </div>

      <ActivitiesList
        onEdit={onEdit}
      />
    </>
  );
}

function LawsWorkspace() {
  return (
    <>
      <WorkspaceGuide
        icon={Scale}
        eyebrow="Official reference"
        title="Maintain rules people can return to"
        description="School laws are long-term regulations and official guidance. Keep them concise, current, and separate from temporary announcements or direct alerts."
        tone="success"
      />

      <SchoolLawsSection />
    </>
  );
}

function WorkspaceGuide({
  icon: Icon,
  eyebrow,
  title,
  description,
  tone,
  action,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  tone:
    | "primary"
    | "info"
    | "warning"
    | "success";
  action?: React.ReactNode;
}) {
  const toneClasses = {
    primary: {
      shell:
        "border-primary/[0.12] bg-primary/[0.025]",
      icon:
        "border-primary/15 bg-primary/[0.09] text-primary",
      eyebrow: "text-primary",
    },
    info: {
      shell:
        "border-info/[0.13] bg-info/[0.025]",
      icon:
        "border-info/15 bg-info/[0.09] text-info",
      eyebrow: "text-info",
    },
    warning: {
      shell:
        "border-warning/[0.15] bg-warning/[0.025]",
      icon:
        "border-warning/15 bg-warning/[0.10] text-warning",
      eyebrow: "text-warning",
    },
    success: {
      shell:
        "border-success/[0.13] bg-success/[0.025]",
      icon:
        "border-success/15 bg-success/[0.09] text-success",
      eyebrow: "text-success",
    },
  }[tone];

  return (
    <div
      className={[
        "rounded-[23px] border p-4 shadow-[0_10px_32px_rgba(38,24,84,0.045)] sm:p-5",
        toneClasses.shell,
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border bg-card",
              toneClasses.icon,
            ].join(" ")}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </span>

          <div className="min-w-0">
            <p
              className={[
                "text-[10px] font-semibold uppercase tracking-[0.12em]",
                toneClasses.eyebrow,
              ].join(" ")}
            >
              {eyebrow}
            </p>

            <h1 className="mt-1 text-[17px] font-semibold tracking-[-0.02em] text-foreground sm:text-[19px]">
              {title}
            </h1>

            <p className="mt-1.5 max-w-3xl text-[11.5px] leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {action ? (
          <div className="shrink-0">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AudienceActionCard({
  icon: Icon,
  title,
  description,
  helper,
  tone,
  actionLabel,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  helper: string;
  tone: "info" | "warning";
  actionLabel: string;
  onClick: () => void;
}) {
  const isInfo = tone === "info";

  return (
    <article
      className={[
        "overflow-hidden rounded-[23px] border bg-card shadow-[0_12px_32px_rgba(38,24,84,0.045)]",
        isInfo
          ? "border-info/[0.13]"
          : "border-warning/[0.15]",
      ].join(" ")}
    >
      <div
        className={[
          "p-5",
          isInfo
            ? "bg-info/[0.035]"
            : "bg-warning/[0.035]",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-12 w-12 items-center justify-center rounded-[16px] border bg-card",
            isInfo
              ? "border-info/15 text-info"
              : "border-warning/15 text-warning",
          ].join(" ")}
        >
          <Icon
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </span>

        <h2 className="mt-4 text-[16px] font-semibold tracking-[-0.018em] text-foreground">
          {title}
        </h2>

        <p className="mt-1.5 text-[11.5px] leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="border-t border-border/50 p-4">
        <p className="text-[10.5px] leading-4 text-muted-foreground">
          {helper}
        </p>

        <Button
          type="button"
          onClick={onClick}
          className={[
            "mt-3 h-10 w-full rounded-[13px] text-[12px]",
            isInfo
              ? "bg-info text-info-foreground hover:bg-info/90"
              : "bg-warning text-warning-foreground hover:bg-warning/90",
          ].join(" ")}
        >
          <BellRing className="h-4 w-4" />
          {actionLabel}
        </Button>
      </div>
    </article>
  );
}

function QuickExplanation({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[18px] border border-border/55 bg-card px-4 py-3.5 shadow-[0_8px_24px_rgba(38,24,84,0.035)]">
      <span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground/70">
        {number}
      </span>

      <p className="mt-1 text-[12px] font-semibold text-foreground">
        {title}
      </p>

      <p className="mt-1 text-[10.5px] leading-4 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
