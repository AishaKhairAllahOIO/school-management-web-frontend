import { CalendarDays, CheckCircle2, Edit3, X } from "lucide-react";

import { useLayoutStore } from "../store/layoutStore";

const tasks = [
  { title: "Programming Language", value: "75%" },
  { title: "Experimental Statistics", value: "42%" },
];

export function ProfilePanel() {
  const isOpen = useLayoutStore((state) => state.isProfilePanelOpen);

  const toggleProfilePanel = useLayoutStore(
    (state) => state.toggleProfilePanel
  );

  if (!isOpen) return null;

  return (
    <aside className="fixed bottom-0 right-0 top-0 z-50 hidden w-[320px] rounded-[30px] border border-border/70 bg-card p-6 shadow-soft-lg lg:flex lg:flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Profile</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Edit3 size={15} />
          </button>

          <button
            type="button"
            onClick={toggleProfilePanel}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Aisha Khairallah"
          className="h-20 w-20 rounded-full object-cover"
        />

        <h3 className="mt-4 text-sm font-bold text-foreground">
          Aisha Khairallah
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Admin · School Management
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">June 2026</h3>

          <CalendarDays size={16} className="text-muted-foreground" />
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <span key={day}>{day}</span>
          ))}

          {Array.from({ length: 30 }).map((_, index) => (
            <span
              key={index}
              className={[
                "flex h-8 items-center justify-center rounded-full transition",
                index === 14 ? "bg-primary text-white" : "hover:bg-muted",
              ].join(" ")}
            >
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Task Progress
          </h3>

          <button className="text-xs font-semibold text-primary">
            View all
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.title} className="rounded-2xl bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-primary" />

                  <p className="text-xs font-semibold text-foreground">
                    {task.title}
                  </p>
                </div>

                <span className="text-xs font-bold text-primary">
                  {task.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}