import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
 
import {
  AnnouncementPriorityBadge,
} from "./AnnouncementPriorityBadge";

import { Button }
from "@/shared/ui/button";
import type { Announcement } from "../types/announcement.types";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  announcement?:
    | Announcement
    | undefined;
}

export const AnnouncementDetailsDrawer =
({
  open,
  onOpenChange,
  announcement,
}: Props) => {

  if (!announcement)
    return null;

  const unread =
    announcement.delivered -
    announcement.opened;

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        className="
          w-[550px]
          sm:max-w-[550px]
          overflow-y-auto
        "
      >
        <SheetHeader>

          <SheetTitle>
            {
              announcement.title
            }
          </SheetTitle>

        </SheetHeader>

        <div className="mt-6 space-y-5">

          {/* Header Card */}

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >
            <div className="flex items-center justify-between">

              <AnnouncementPriorityBadge
                priority={
                  announcement.priority
                }
              />

              <span
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                {
                  announcement.publishDate
                }
              </span>

            </div>

            <p
              className="
                mt-4
                text-sm
                leading-7
              "
            >
              {
                announcement.description
              }
            </p>
          </div>

          {/* Audience */}

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >
            <h4
              className="
                mb-3
                font-semibold
              "
            >
              Audience
            </h4>

            <p>
              {
                announcement.target
              }
            </p>
          </div>

          {/* Author */}

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >
            <h4
              className="
                mb-3
                font-semibold
              "
            >
              Created By
            </h4>

            <p>
              {
                announcement.createdBy
              }
            </p>
          </div>

          {/* Analytics */}

          <div
            className="
              grid
              grid-cols-3
              gap-3
            "
          >
            <div
              className="
                soft-card
                rounded-3xl
                p-4
                text-center
              "
            >
              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Delivered
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-bold
                "
              >
                {
                  announcement.delivered
                }
              </h3>
            </div>

            <div
              className="
                soft-card
                rounded-3xl
                p-4
                text-center
              "
            >
              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Opened
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-bold
                "
              >
                {
                  announcement.opened
                }
              </h3>
            </div>

            <div
              className="
                soft-card
                rounded-3xl
                p-4
                text-center
              "
            >
              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Unread
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-bold
                "
              >
                {unread}
              </h3>
            </div>
          </div>

          {/* Attachments */}

          <div
            className="
              soft-card
              rounded-3xl
              p-5
            "
          >
            <h4
              className="
                mb-3
                font-semibold
              "
            >
              Attachments
            </h4>

            {announcement.attachments
              ?.length ? (
              <div className="space-y-2">

                {announcement.attachments.map(
                  (
                    attachment
                  ) => (
                    <div
                      key={
                        attachment
                      }
                    >
                      {
                        attachment
                      }
                    </div>
                  )
                )}

              </div>
            ) : (
              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                No attachments
              </p>
            )}
          </div>

          {/* Actions */}

          <div className="flex gap-3">

            <Button
              className="flex-1"
            >
              Edit
            </Button>

            <Button
              variant="outline"
            >
              Archive
            </Button>

            <Button
              variant="outline"
            >
              Delete
            </Button>

          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};