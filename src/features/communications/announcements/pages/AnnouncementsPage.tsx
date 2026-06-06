import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { useAnnouncements } from "../hooks/useAnnouncements";
import {
  AnnouncementStats,
  AnnouncementFilters,
  AnnouncementTable,
  AnnouncementFormModal,
} from "../components";
import type { Announcement } from "../types/announcement.types";

export function AnnouncementsPage() {
  const { data = [], isLoading, isError } = useAnnouncements();

  const [search, setSearch] = useState("");
  const [target, setTarget] = useState("all");
  const [priority, setPriority] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((announcement) => {
      const matchesSearch = announcement.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesAudience =
        target === "all" || announcement.target === target;

      const matchesPriority =
        priority === "all" || announcement.priority === priority;

      return matchesSearch && matchesAudience && matchesPriority;
    });
  }, [data, search, priority, target]);

  const highPriority = filteredData.filter(
    (x) => x.priority === "High"
  ).length;

  const today = new Date().toISOString().split("T")[0];

  const todayCount = filteredData.filter(
    (x) => x.publishDate === today
  ).length;

  function handleCreateNew() {
    setSelectedAnnouncement(null);
    setIsFormOpen(true);
  }

  function handleEditAnnouncement(announcement: Announcement) {
    setSelectedAnnouncement(announcement);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setSelectedAnnouncement(null);
    setIsFormOpen(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-border/70 bg-card p-12">
        <p className="text-muted-foreground">Loading announcements...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-border/70 bg-destructive/10 p-12">
        <p className="text-destructive">
          Failed to load announcements. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">
            School-wide communication center.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus size={18} />
          Create Announcement
        </button>
      </div>

      <AnnouncementStats
        total={filteredData.length}
        active={filteredData.length}
        highPriority={highPriority}
        todayCount={todayCount}
      />

      <div className="soft-card rounded-3xl p-5">
        <AnnouncementFilters
          search={search}
          setSearch={setSearch}
          target={target}
          setTarget={setTarget}
          priority={priority}
          setPriority={setPriority}
        />
      </div>

      <AnnouncementTable
        data={filteredData}
        onEdit={handleEditAnnouncement}
      />

      <AnnouncementFormModal
        isOpen={isFormOpen}
        announcement={selectedAnnouncement}
        onClose={handleCloseForm}
      />
    </div>
  );
}