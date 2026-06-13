import type {
  Announcement,
} from "../types/announcement.types";

import { AnnouncementPriorityBadge }
from "./AnnouncementPriorityBadge";

interface Props {
  data: Announcement[];

  onSelect: (
    announcement: Announcement
  ) => void;
}

export const AnnouncementsTable = ({
  data,
  onSelect,
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
                Target
              </th>

              <th className="p-4 text-left">
                Priority
              </th>

              <th className="p-4 text-left">
                Publish Date
              </th>

              <th className="p-4 text-left">
                Author
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map(
              (
                announcement
              ) => (
                <tr
                  key={
                    announcement.id
                  }
                  onClick={() =>
                    onSelect(
                      announcement
                    )
                  }
                  className="
                    border-t
                    cursor-pointer
                    hover:bg-muted/20
                  "
                >
                  <td className="p-4">

                    <div>
                      <p className="font-medium">
                        {
                          announcement.title
                        }
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-muted-foreground
                          line-clamp-1
                        "
                      >
                        {
                          announcement.description
                        }
                      </p>
                    </div>

                  </td>

                  <td className="p-4">
                    {
                      announcement.target
                    }
                  </td>

                  <td className="p-4">
                    <AnnouncementPriorityBadge
                      priority={
                        announcement.priority
                      }
                    />
                  </td>

                  <td className="p-4">
                    {
                      announcement.publishDate
                    }
                  </td>

                  <td className="p-4">
                    {
                      announcement.createdBy
                    }
                  </td>
                </tr>
              )
            )}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
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