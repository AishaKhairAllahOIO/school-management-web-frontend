import {
  CalendarDays,
  Clock3,
  Edit3,
  Sparkles,
  Printer,
  Trash2,
  Users,
} from "lucide-react";
import {
  useState,
} from "react";

import { PrintPreviewDialog, usePrintIdentity, usePrintPreview } from "@/features/printing";
import {
  Button,
} from "@/shared/ui/button";

import {
  useActivities,
} from "../../hooks/useActivities";
import type {
  Activity,
} from "../../types/communication.types";
import {
  CommunicationEmpty,
  CommunicationError,
  CommunicationLoading,
} from "../shared/CommunicationState";
import {
  DeleteConfirmationDialog,
} from "../shared/DeleteConfirmationDialog";
import { buildActivityPosterDocument } from "./activityPrintDocument";

type Props = {
  onEdit: (activity: Activity) => void;
};
function formatActivityDate(value: string) {
  if (!value) return "Date not set";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatActivityTime(value: string) {
  if (!value) return "—";

  const [hours, minutes] = value.slice(0, 5).split(":").map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}


export function ActivitiesList({ onEdit }: Props) {
  const {
    activities,
    isLoading,
    isError,
    refetch,
    deleteActivity,
  } = useActivities();

  const [pendingDelete, setPendingDelete] = useState<Activity | null>(null);
  const printPreview = usePrintPreview();
  const printIdentity = usePrintIdentity();

  if (isLoading) return <CommunicationLoading />;

  if (isError) {
    return (
      <CommunicationError
        title="Activities could not be loaded"
        description="The activity schedule is temporarily unavailable. Check the connection and try again."
        onRetry={() => void refetch()}
      />
    );
  }

  if (!activities.length) {
    return (
      <CommunicationEmpty
        icon={Sparkles}
        title="No activities scheduled"
        description="Create the first school activity and define its date, time, grade, and participating classrooms."
        toneClassName="bg-info/[0.09] text-info"
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activities.map((activity) => (
          <article
            key={activity.id}
            className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-[20px] border border-info/[0.13] bg-card shadow-[0_8px_26px_rgba(30,20,70,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(30,20,70,0.07)]"
          >
            <span className="absolute inset-x-0 top-0 h-[3px] bg-info" />

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-info/[0.09] text-info">
                  <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
                <span className="rounded-full bg-info/[0.07] px-2.5 py-1 text-[10px] font-medium text-info">
                  {activity.type || "School activity"}
                </span>
              </div>

              <h3 className="mt-4 line-clamp-1 text-[16px] font-medium tracking-[-0.015em] text-foreground">
                {activity.activity_name}
              </h3>

              <p className="mt-1 line-clamp-2 min-h-9 text-[12px] leading-[18px] text-muted-foreground">
                {activity.description || "No additional activity notes were provided."}
              </p>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                <span className="flex items-center gap-2 rounded-[12px] bg-muted/[0.28] px-3 py-2 text-[10.5px] text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 text-info" />
                  {formatActivityDate(activity.activity_date)}
                </span>
                <span className="flex items-center gap-2 rounded-[12px] bg-muted/[0.28] px-3 py-2 text-[10.5px] text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-warning" />
                  {formatActivityTime(activity.start_time)}–{formatActivityTime(activity.end_time)}
                </span>
              </div>

              {activity.class_room_ids?.length ? (
                <span className="mt-2 flex items-center gap-2 text-[10.5px] text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-info" />
                  {activity.class_room_ids.length} classroom{activity.class_room_ids.length === 1 ? "" : "s"} included
                </span>
              ) : null}
            </div>

            <footer className="flex h-11 items-center justify-end gap-1.5 border-t border-info/[0.10] bg-info/[0.035] px-4">
              <Button type="button" variant="ghost" size="sm" onClick={() => printPreview.openPreview(buildActivityPosterDocument(activity, printIdentity))} className="h-8 rounded-[10px] px-2.5 text-[11px] font-medium text-primary hover:bg-primary/[0.08] hover:text-primary">
                <Printer className="h-3.5 w-3.5" /> Poster
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(activity)} className="h-8 rounded-[10px] px-2.5 text-[11px] font-medium text-info hover:bg-info/[0.08] hover:text-info">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setPendingDelete(activity)} className="h-8 rounded-[10px] px-2.5 text-[11px] font-medium text-destructive hover:bg-destructive/[0.07] hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </footer>
          </article>
        ))}
      </div>

      <PrintPreviewDialog
        open={printPreview.isOpen}
        onOpenChange={printPreview.setOpen}
        document={printPreview.document}
      />

      <DeleteConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete activity?"
        description={`“${pendingDelete?.activity_name ?? "This activity"}” will be permanently removed from the activity schedule.`}
        isPending={deleteActivity.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteActivity.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </>
  );
}
