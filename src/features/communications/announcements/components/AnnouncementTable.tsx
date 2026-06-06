import { Megaphone, Edit, Trash2 } from "lucide-react";

import type { Announcement } from "../types/announcement.types";

interface Props {
  data: Announcement[];
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (id: string) => void;
}

export const AnnouncementTable = ({
  data,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div
      className="
        soft-card
        overflow-hidden
        rounded-3xl
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full">

          <thead
            className="
              bg-muted/40
            "
          >
            <tr>
              <th className="p-4 text-left">
                Announcement
              </th>

              <th className="p-4 text-left">
                Audience
              </th>

              <th className="p-4 text-left">
                Priority
              </th>

              <th className="p-4 text-left">
                Delivered
              </th>

              <th className="p-4 text-left">
                Opened
              </th>

              <th className="p-4 text-left">
                Author
              </th>

              <th className="p-4 text-left">
                Publish Date
              </th>

              <th className="p-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {data.map((announcement) => (
              <tr
                key={announcement.id}
                className="
                  border-t
                  hover:bg-muted/20
                "
              >
                <td className="p-4">
                  <div className="flex gap-3">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-primary/10
                        text-primary
                      "
                    >
                      <Megaphone
                        size={18}
                      />
                    </div>

                    <div>
                      <p className="font-medium">
                        {
                          announcement.title
                        }
                      </p>

                      <p
                        className="
                          text-sm
                          text-muted-foreground
                          line-clamp-2
                        "
                      >
                        {
                          announcement.description
                        }
                      </p>
                    </div>

                  </div>
                </td>

                <td className="p-4">
                  {
                    announcement.target
                  }
                </td>

                <td className="p-4">
                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${
                        announcement.priority ===
                        "High"
                          ? "bg-red-100 text-red-700"
                          : announcement.priority ===
                              "Medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    {
                      announcement.priority
                    }
                  </span>
                </td>

                <td className="p-4">
                  {
                    announcement.delivered
                  }
                </td>

                <td className="p-4">
                  {
                    announcement.opened
                  }
                </td>

                <td className="p-4">
                  {
                    announcement.createdBy
                  }
                </td>

                <td className="p-4">
                  {
                    announcement.publishDate
                  }
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(announcement)}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(announcement.id)}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="
                    py-10
                    text-center
                    text-muted-foreground
                  "
                >
                  No announcements found.
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
};