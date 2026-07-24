import {
  CalendarCheck2,
  Check,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  ListTodo,
  Plus,
  Trash2,
} from "lucide-react";

import type {FormEvent} from "react";
import {
  
  useEffect,
  useMemo,
  useState,
} from "react";

import type {ProfileTask} from "@/features/profile/utils/profileTaskStorage";
import {
  getProfileTaskStorage,
} from "@/features/profile/utils/profileTaskStorage";

type ProfileProductivityCardProps = {
  userId: string;
};

export function ProfileProductivityCard({
  userId,
}: ProfileProductivityCardProps) {
  const storage = useMemo(
    () =>
      getProfileTaskStorage(
        userId,
      ),
    [userId],
  );

  const [tasks, setTasks] =
    useState<ProfileTask[]>(() =>
      storage.read(),
    );

  const [taskTitle, setTaskTitle] =
    useState("");

  useEffect(() => {
    setTasks(storage.read());
  }, [storage]);

  useEffect(() => {
    storage.write(tasks);
  }, [storage, tasks]);

  const completedCount =
    tasks.filter(
      (task) => task.completed,
    ).length;

  const progress =
    tasks.length > 0
      ? Math.round(
          (completedCount /
            tasks.length) *
            100,
        )
      : 0;

  const orderedTasks = useMemo(
    () =>
      [...tasks].sort(
        (firstTask, secondTask) =>
          Number(
            firstTask.completed,
          ) -
            Number(
              secondTask.completed,
            ) ||
          secondTask.createdAt -
            firstTask.createdAt,
      ),
    [tasks],
  );

  function addTask(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const title =
      taskTitle.trim();

    if (!title) {
      return;
    }

    setTasks((currentTasks) => [
      {
        id: createTaskId(),
        title,
        completed: false,
        createdAt: Date.now(),
      },
      ...currentTasks,
    ]);

    setTaskTitle("");
  }

  function toggleTask(
    taskId: string,
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task,
      ),
    );
  }

  function deleteTask(
    taskId: string,
  ) {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) =>
          task.id !== taskId,
      ),
    );
  }

  return (
    <section
      className={[
        "overflow-hidden rounded-[26px]",
        "border border-border/70",
        "bg-card",
        "shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <header
        className={[
          "border-b border-border/60",
          "bg-muted/15",
          "px-5 py-4",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <span
            className={[
              "flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-[14px]",
              "bg-primary/[0.07]",
              "text-primary",
            ].join(" ")}
          >
            <ClipboardCheck className="h-4.5 w-4.5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p
                  className={[
                    "text-[11px] font-semibold",
                    "uppercase tracking-[0.12em]",
                    "text-primary",
                  ].join(" ")}
                >
                  Workspace
                </p>

                <h2
                  className={[
                    "mt-1 text-base font-semibold",
                    "tracking-[-0.025em]",
                    "text-foreground",
                  ].join(" ")}
                >
                  My task board
                </h2>
              </div>

              <span
                className={[
                  "rounded-full",
                  "bg-primary/[0.07]",
                  "px-2.5 py-1",
                  "text-[11px] font-semibold",
                  "text-primary",
                ].join(" ")}
              >
                {completedCount}/
                {tasks.length}
              </span>
            </div>

            <p className="mt-1 text-[13px] text-muted-foreground">
              Personal tasks saved on this device
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-muted-foreground">
              Daily progress
            </span>

            <span className="font-semibold text-foreground">
              {progress}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={[
                "h-full rounded-full",
                "primary-gradient",
                "transition-[width]",
                "duration-300",
              ].join(" ")}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </header>

      <div className="p-4">
        <form
          onSubmit={addTask}
          className={[
            "flex items-center gap-2",
            "rounded-[16px]",
            "border border-border/70",
            "bg-muted/20 p-1.5",
            "focus-within:border-primary/25",
            "focus-within:bg-card",
            "focus-within:ring-4",
            "focus-within:ring-primary/[0.06]",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-9 w-9 shrink-0",
              "items-center justify-center",
              "text-muted-foreground",
            ].join(" ")}
          >
            <ListTodo className="h-4 w-4" />
          </span>

          <input
            value={taskTitle}
            onChange={(event) =>
              setTaskTitle(
                event.target.value,
              )
            }
            maxLength={120}
            placeholder="Add a personal task..."
            aria-label="Task title"
            className={[
              "h-9 min-w-0 flex-1",
              "bg-transparent",
              "text-[13px] font-medium",
              "text-foreground",
              "outline-none",
              "placeholder:text-muted-foreground/70",
            ].join(" ")}
          />

          <button
            type="submit"
            disabled={
              !taskTitle.trim()
            }
            aria-label="Add task"
            className={[
              "primary-gradient",
              "flex h-9 w-9 shrink-0",
              "items-center justify-center",
              "rounded-xl",
              "text-primary-foreground",
              "shadow-sm",
              "transition-transform",
              "hover:-translate-y-0.5",
              "disabled:cursor-not-allowed",
              "disabled:opacity-40",
              "disabled:hover:translate-y-0",
            ].join(" ")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-3 space-y-2">
          {orderedTasks.length > 0 ? (
            orderedTasks.map(
              (task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() =>
                    toggleTask(
                      task.id,
                    )
                  }
                  onDelete={() =>
                    deleteTask(
                      task.id,
                    )
                  }
                />
              ),
            )
          ) : (
            <EmptyTaskState />
          )}
        </div>

        <div
          className={[
            "mt-4 flex items-center",
            "justify-between gap-3",
            "border-t border-border/60",
            "pt-3",
            "text-[11px]",
            "text-muted-foreground",
          ].join(" ")}
        >
          <span className="flex items-center gap-1.5">
            <CalendarCheck2 className="h-3.5 w-3.5 text-primary" />
            {formatToday()}
          </span>

          <span>
            {storage.type ===
            "local"
              ? "Remembered"
              : "Current session"}
          </span>
        </div>
      </div>
    </section>
  );
}

type TaskRowProps = {
  task: ProfileTask;
  onToggle: () => void;
  onDelete: () => void;
};

function TaskRow({
  task,
  onToggle,
  onDelete,
}: TaskRowProps) {
  return (
    <div
      className={[
        "group flex items-center gap-2.5",
        "rounded-[15px]",
        "border border-border/60",
        "px-3 py-2.5",
        "transition-colors",
        task.completed
          ? "bg-muted/25"
          : "bg-card hover:border-primary/20 hover:bg-primary/[0.02]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          task.completed
            ? "Mark task as pending"
            : "Mark task as complete"
        }
        className={[
          "flex h-8 w-8 shrink-0",
          "items-center justify-center",
          "rounded-[11px]",
          "transition-colors",
          task.completed
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-primary/[0.07] text-primary hover:bg-primary/[0.12]",
        ].join(" ")}
      >
        {task.completed ? (
          <Check className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={onToggle}
        className={[
          "min-w-0 flex-1 text-left",
          "text-[13px] font-medium",
          task.completed
            ? "text-muted-foreground line-through"
            : "text-foreground",
        ].join(" ")}
      >
        <span className="block truncate">
          {task.title}
        </span>
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
        className={[
          "flex h-8 w-8 shrink-0",
          "items-center justify-center",
          "rounded-[11px]",
          "text-muted-foreground",
          "opacity-70",
          "transition",
          "hover:bg-destructive/10",
          "hover:text-destructive",
          "group-hover:opacity-100",
        ].join(" ")}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function EmptyTaskState() {
  return (
    <div
      className={[
        "rounded-[18px]",
        "border border-dashed",
        "border-border/80",
        "px-4 py-7",
        "text-center",
      ].join(" ")}
    >
      <span
        className={[
          "mx-auto flex h-11 w-11",
          "items-center justify-center",
          "rounded-[15px]",
          "bg-primary/[0.07]",
          "text-primary",
        ].join(" ")}
      >
        <CheckCircle2 className="h-5 w-5" />
      </span>

      <p className="mt-3 text-[13px] font-semibold text-foreground">
        Your board is clear
      </p>

      <p className="mx-auto mt-1 max-w-[220px] text-[11px] leading-5 text-muted-foreground">
        Add a task above to keep your personal work organized.
      </p>
    </div>
  );
}

function createTaskId(): string {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function formatToday(): string {
  return new Intl.DateTimeFormat(
    undefined,
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  ).format(new Date());
}