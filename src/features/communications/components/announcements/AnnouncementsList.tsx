import {
  CalendarDays,
  Edit3,
  Megaphone,
  Printer,
  School,
  Trash2,
  Users,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  Button,
} from "@/shared/ui/button";

import {
  useAnnouncements,
} from "../../hooks/useAnnouncements";
import type {
  Announcement,
} from "../../types/communication.types";
import {
  CommunicationEmpty,
  CommunicationError,
  CommunicationLoading,
} from "../shared/CommunicationState";
import {
  DeleteConfirmationDialog,
} from "../shared/DeleteConfirmationDialog";


import { PosterTemplate } from "../../../printing/templates/PosterTemplate"; 

type Props = {
  onEdit: (announcement: Announcement) => void;
};

export function AnnouncementsList({
  onEdit,
}: Props) {
  const {
    myAnnouncements,
    isLoadingMy,
    isErrorMy,
    refetchMy,
    deleteAnnouncement,
  } = useAnnouncements();

  const [pendingDelete, setPendingDelete] = useState<Announcement | null>(null);
  
  // 🌟 حالة تتبع الإعلان المُراد طباعته
  const [printingItem, setPrintingItem] = useState<Announcement | null>(null);

  // 🌟 تفريغ حالة الطباعة بمجرد إغلاق نافذة الطباعة
  useEffect(() => {
    const handleAfterPrint = () => setPrintingItem(null);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const handlePrint = (item: Announcement) => {
    setPrintingItem(item);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const announcements = myAnnouncements;
  const isLoading = isLoadingMy;
  const isError = isErrorMy;

  if (isLoading) {
    return <CommunicationLoading cards={4} variant="rows" />;
  }

  if (isError) {
    return (
      <CommunicationError
        title="Announcements could not be loaded"
        description="The announcement feed is temporarily unavailable. Check the connection and try again."
        onRetry={() => {
          void refetchMy();
        }}
      />
    );
  }

  if (!announcements.length) {
    return (
      <CommunicationEmpty
        icon={Megaphone}
        title="No announcements yet"
        description="Create the first announcement to share a clear update with the school community."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_8px_26px_rgba(30,20,70,0.04)] print:hidden">
        {announcements.map((item, index) => {
          const audience = item.audience;
          const AudienceIcon =
            audience === "student"
              ? School
              : audience === "staff"
                ? Users
                : Megaphone;

          const tone =
            audience === "student"
              ? "bg-info/[0.09] text-info"
              : audience === "staff"
                ? "bg-primary/[0.08] text-primary"
                : "bg-success/[0.09] text-success";

          return (
            <article
              key={item.id}
              className={[
                "group flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-muted/[0.16] sm:flex-row sm:items-center",
                index > 0 ? "border-t border-border/45" : "",
              ].join(" ")}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] ${tone}`}>
                <AudienceIcon className="h-[19px] w-[19px]" strokeWidth={1.8} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-[15px] font-medium text-foreground">
                    {item.title}
                  </h3>
                  <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-medium ${tone}`}>
                    {audience === "both" ? "Students & staff" : audience === "student" ? "Students" : "Staff"}
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-[12px] leading-[18px] text-muted-foreground">
                  {item.description}
                </p>

                {item.created_at ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] text-muted-foreground/80">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint(item)}
                    className="h-9 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-primary hover:bg-primary/[0.06] hover:text-primary"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Poster
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="h-9 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-info hover:bg-info/[0.06] hover:text-info"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPendingDelete(item)}
                    className="h-9 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-destructive hover:bg-destructive/[0.06] hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
            </article>
          );
        })}
      </div>

      {/* 🌟 قالب طباعة الإعلان */}
      {printingItem && (
        <div className="hidden print:block">
          <PosterTemplate>
            <div className="flex h-full flex-col items-center justify-center px-12 py-20 text-center">
              <span className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#f3f4f6] text-[#374151]">
                <Megaphone className="h-12 w-12" />
              </span>
              <p className="mb-4 text-[14px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">
                Official School Announcement
              </p>
              <h1 className="mb-8 text-[44px] font-black uppercase leading-tight tracking-wide text-[#111827]">
                {printingItem.title}
              </h1>
              <div className="mb-10 h-[4px] w-24 bg-[#111827]"></div>
              <p className="text-[24px] leading-relaxed text-[#374151]">
                {printingItem.description}
              </p>
            </div>
          </PosterTemplate>
        </div>
      )}

      <DeleteConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete announcement?"
        description={`“${pendingDelete?.title ?? "This announcement"}” will be permanently removed from the communication feed.`}
        isPending={deleteAnnouncement.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteAnnouncement.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </>
  );
}