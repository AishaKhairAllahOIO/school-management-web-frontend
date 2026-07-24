import {
  useState,
} from "react";

import {
   ArrowLeft,
  ArrowUpAZ,
  BriefcaseBusiness,
  Download,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Upload,
  UsersRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  StaffCard,
} from "../components/cards/StaffCard";

import {
  StaffPagination,
} from "../components/pagination/StaffPagination";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useDeleteStaff,
  useStaffByRole,
  useToggleStaffStatus,
} from "../hooks/useStaff";

import type {
  ApiId,
} from "../../shared/types/api.types";

import type {
  StaffProfile,
  StaffRole,
  StaffSectionColor,
} from "../types/staff.types";

type StaffRolePageProps = {
  role: StaffRole;
};

export function StaffRolePage({
  role,
}: StaffRolePageProps) {
  const navigate =
    useNavigate();

  const config =
    staffSectionConfigs[role];

  const Icon =
    config.icon;

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    sortDirection,
    setSortDirection,
  ] = useState<
    "asc" | "desc"
  >("asc");

  const [isExporting] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [
    pendingToggleId,
    setPendingToggleId,
  ] = useState<ApiId>();

  const [
    pendingDeleteId,
    setPendingDeleteId,
  ] = useState<ApiId>();

  const query =
    useStaffByRole(
      role,
      page,
      12,
    );

  const toggleStatus =
    useToggleStaffStatus(
      role,
    );

  const deleteStaff =
    useDeleteStaff(role);

  const staff =
    query.data?.data ?? [];

  const total =
    query.data?.total ??
    staff.length;

  function handleExport() {
    // سيتم ربط Export API هنا.
  }

  function openImportDialog() {
    // سيتم فتح نافذة الاستيراد هنا.
  }

  function viewStaff(
    item: StaffProfile,
  ) {
    navigate(
      `${config.listPath}/${item.id}`,
    );
  }

  function editStaff(
    item: StaffProfile,
  ) {
    navigate(
      `${config.listPath}/${item.id}/edit`,
    );
  }

  async function toggleStaff(
    item: StaffProfile,
  ) {
    const isEnabled =
      item.accountStatus ===
      "active";

    const action =
      isEnabled
        ? "disable"
        : "enable";

    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} ${item.fullName}'s account?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setPendingToggleId(
        item.id,
      );

      await toggleStatus.mutateAsync(
        item.id,
      );
    } finally {
      setPendingToggleId(
        undefined,
      );
    }
  }

  async function removeStaff(
    item: StaffProfile,
  ) {
    const confirmed =
      window.confirm(
        `Delete ${item.fullName}? This action may affect their access to the school system.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setPendingDeleteId(
        item.id,
      );

      await deleteStaff.mutateAsync(
        item.id,
      );
    } finally {
      setPendingDeleteId(
        undefined,
      );
    }
  }

  return (
    <section className="space-y-5">
      <header
        className={[
          "relative overflow-hidden rounded-[26px]",
          "border bg-card",
          config.color.border,
          "px-5 py-5 shadow-[var(--shadow-card)] sm:px-6",
        ].join(" ")}
      >
        <div
          className={[
            "pointer-events-none absolute inset-0 opacity-[0.045]",
            config.color.background,
          ].join(" ")}
        />

        <div
          className={[
            "pointer-events-none absolute -right-10 -top-16",
            "h-40 w-40 rounded-full opacity-15 blur-3xl",
            config.color.background,
          ].join(" ")}
        />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-0 pt-2">
  <button
    type="button"
    aria-label="Back to users"
    title="Back to users"
    onClick={() =>
      navigate("/users")
    }
    className={[
      "absolute left-2 top-0",
      "inline-flex h-7 w-7",
      "items-center justify-center",
      "rounded-full",
      "transition duration-200",
      config.color.text,
      config.color.hover,
      "hover:-translate-x-0.5",
      "focus-visible:outline-none",
      "focus-visible:ring-4",
      config.color.ring,
    ].join(" ")}
  >
    <ArrowLeft
      className="h-4 w-4"
      strokeWidth={1.9}
    />
  </button>

  <div className="flex min-w-0 items-start gap-3.5">
    <span
      className={[
        "mt-5 flex h-10 w-12 shrink-0",
        "items-center justify-center",
        "rounded-[17px]",
        config.color.light,
        config.color.text,
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
          "text-[10px] font-semibold uppercase tracking-[0.14em]",
          config.color.text,
        ].join(" ")}
      >
        Staff directory
      </p>

      <h1 className="mt-1 text-[27px] font-semibold tracking-[-0.04em] text-foreground">
        {config.title}
      </h1>

      <p className="mt-1.5 max-w-2xl text-sm font-normal leading-6 text-muted-foreground">
        Review profiles, employment details and
        account access for{" "}
        {config.pluralLabel.toLowerCase()}.
      </p>
    </div>
  </div>
</div>

          <div className="grid w-full gap-2.5 xl:w-[466px]">
            <div className="grid w-full grid-cols-[minmax(0,1fr)_82px] gap-2">
              <div className="relative min-w-0">
                <Search
                  className={[
                    "pointer-events-none absolute left-3.5 top-1/2",
                    "h-4 w-4 -translate-y-1/2",
                    searchTerm
                      ? config.color.text
                      : "text-muted-foreground",
                  ].join(" ")}
                  strokeWidth={
                    1.8
                  }
                />

                <input
                  type="search"
                  value={
                    searchTerm
                  }
                  onChange={(
                    event,
                  ) => {
                    setSearchTerm(
                      event.target
                        .value,
                    );

                    setPage(1);
                  }}
                  placeholder={`Search ${config.pluralLabel.toLowerCase()}...`}
                  className={[
                    "h-10 w-full rounded-xl border bg-card/80",
                    "pl-10 pr-4",
                    "text-xs font-medium text-foreground",
                    "outline-none transition-colors",
                    "placeholder:text-muted-foreground",
                    config.color.border,
                    "focus:ring-2",
                    config.color.ring,
                  ].join(" ")}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setSortDirection(
                    (
                      current,
                    ) =>
                      current ===
                      "asc"
                        ? "desc"
                        : "asc",
                  )
                }
                className={[
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-xl border bg-card/80 px-3",
                  "text-xs font-semibold transition-colors",
                  config.color.border,
                  config.color.text,
                  config.color.hover,
                  "focus-visible:outline-none focus-visible:ring-4",
                  config.color.ring,
                ].join(" ")}
                title={
                  sortDirection ===
                  "asc"
                    ? "Sort Z to A"
                    : "Sort A to Z"
                }
              >
                <ArrowUpAZ
                  className={[
                    "h-4 w-4 transition-transform",
                    sortDirection ===
                    "desc"
                      ? "rotate-180"
                      : "",
                  ].join(" ")}
                  strokeWidth={
                    1.8
                  }
                />

                <span>
                  {sortDirection ===
                  "asc"
                    ? "A–Z"
                    : "Z–A"}
                </span>
              </button>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={
                  handleExport
                }
                disabled={
                  isExporting
                }
                className={[
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-xl border bg-card/80 px-3",
                  "text-xs font-semibold transition-colors",
                  config.color.border,
                  config.color.text,
                  config.color.hover,
                  "focus-visible:outline-none focus-visible:ring-4",
                  config.color.ring,
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
              >
                <Download
                  className="h-4 w-4"
                  strokeWidth={
                    1.8
                  }
                />

                <span>
                  {isExporting
                    ? "Exporting..."
                    : "Export"}
                </span>
              </button>

              <button
                type="button"
                onClick={
                  openImportDialog
                }
                className={[
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-xl border bg-card/80 px-3",
                  "text-xs font-semibold transition-colors",
                  config.color.border,
                  config.color.text,
                  config.color.hover,
                  "focus-visible:outline-none focus-visible:ring-4",
                  config.color.ring,
                ].join(" ")}
              >
                <Upload
                  className="h-4 w-4"
                  strokeWidth={
                    1.8
                  }
                />

                <span>
                  Import
                </span>
              </button>

              <button
                type="button"
                disabled={
                  query.isFetching
                }
                onClick={() => {
                  void query.refetch();
                }}
                className={[
                  config.color.button,
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-xl px-3",
                  "text-xs font-semibold",
                  "shadow-[var(--shadow-auth-button)]",
                  "transition-transform hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-4",
                  config.color.ring,
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                <RefreshCw
                  className={[
                    "h-4 w-4",
                    query.isFetching
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                  strokeWidth={
                    1.8
                  }
                />

                <span>
                  Refresh
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    config.createPath,
                  )
                }
                className={[
                  config.color.button,
                  "inline-flex h-10 items-center justify-center gap-2",
                  "rounded-xl px-3",
                  "text-xs font-semibold",
                  "shadow-[var(--shadow-auth-button)]",
                  "transition-transform hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-4",
                  config.color.ring,
                ].join(" ")}
              >
                <Plus
                  className="h-4 w-4"
                  strokeWidth={
                    1.8
                  }
                />

                <span>
                  Add{" "}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {!query.isLoading &&
      !query.isError ? (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full border",
              "px-3 py-1.5 text-xs font-medium",
              config.color.border,
              config.color.light,
              config.color.text,
            ].join(" ")}
          >
            <UsersRound className="h-3.5 w-3.5" />

            {total}{" "}
            {total === 1
              ? config.singularLabel.toLowerCase()
              : config.pluralLabel.toLowerCase()}
          </span>

          <span
            className={[
              "inline-flex items-center gap-2 rounded-full border",
              "px-3 py-1.5 text-xs font-medium",
              config.color.border,
              config.color.light,
              config.color.text,
            ].join(" ")}
          >
            <Sparkles className="h-3.5 w-3.5" />

            Updated directory
          </span>
        </div>
      ) : null}

      {query.isLoading ? (
        <StaffGridSkeleton
          color={
            config.color
          }
        />
      ) : query.isError ? (
        <ErrorState
          label={
            config.pluralLabel
          }
          onRetry={() =>
            void query.refetch()
          }
        />
      ) : staff.length ===
        0 ? (
        <EmptyState
          singularLabel={
            config.singularLabel
          }
          pluralLabel={
            config.pluralLabel
          }
          color={
            config.color
          }
          onCreate={() =>
            navigate(
              config.createPath,
            )
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {staff.map(
            (item) => (
              <StaffCard
                key={item.id}
                staff={item}
                color={
                  config.color
                }
                pendingToggle={
                  pendingToggleId ===
                  item.id
                }
                pendingDelete={
                  pendingDeleteId ===
                  item.id
                }
                onView={
                  viewStaff
                }
                onEdit={
                  editStaff
                }
                onToggleStatus={
                  toggleStaff
                }
                onDelete={
                  removeStaff
                }
              />
            ),
          )}
        </div>
      )}

      {query.data &&
      query.data.lastPage >
        1 ? (
        <StaffPagination
          currentPage={
            query.data.currentPage
          }
          lastPage={
            query.data.lastPage
          }
          total={total}
          from={
            query.data.from ??
            null
          }
          to={
            query.data.to ??
            null
          }
          itemLabel={
            config.pluralLabel.toLowerCase()
          }
          disabled={
            query.isFetching
          }
          onPageChange={(
            nextPage,
          ) => {
            setPage(
              nextPage,
            );

            window.scrollTo({
              top: 0,
              behavior:
                "smooth",
            });
          }}
        />
      ) : null}
    </section>
  );
}

function StaffGridSkeleton({
  color,
}: {
  color: StaffSectionColor;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({
        length: 6,
      }).map(
        (_, index) => (
          <div
            key={index}
            className={[
              "min-h-[365px] animate-pulse overflow-hidden",
              "rounded-[24px] border bg-card",
              color.border,
            ].join(" ")}
          >
            <div
              className={[
                "h-[3px]",
                color.background,
              ].join(" ")}
            />

            <div className="p-5">
              <div className="flex items-center gap-4">
                <div
                  className={[
                    "h-14 w-14 rounded-[18px]",
                    color.light,
                  ].join(" ")}
                />

                <div className="flex-1">
                  <div className="h-5 w-2/3 rounded bg-muted" />

                  <div className="mt-2 h-3 w-1/2 rounded bg-muted/70" />
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {Array.from({
                  length: 5,
                }).map(
                  (
                    __,
                    row,
                  ) => (
                    <div
                      key={
                        row
                      }
                      className="h-[53px] rounded-2xl bg-muted/55"
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function EmptyState({
  singularLabel,
  pluralLabel,
  color,
  onCreate,
}: {
  singularLabel: string;
  pluralLabel: string;
  color: StaffSectionColor;
  onCreate: () => void;
}) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-[26px]",
        "border border-dashed bg-card",
        color.border,
        "px-6 py-14 text-center shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0 opacity-[0.045]",
          color.background,
        ].join(" ")}
      />

      <div className="relative mx-auto max-w-md">
        <div
          className={[
            "mx-auto flex h-16 w-16 items-center justify-center",
            "rounded-[20px] border shadow-[var(--shadow-soft)]",
            color.border,
            color.light,
            color.text,
          ].join(" ")}
        >
          <BriefcaseBusiness className="h-7 w-7" />
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
          No{" "}
          {pluralLabel.toLowerCase()}{" "}
          yet
        </h2>

        <p className="mt-2 text-sm font-normal leading-6 text-muted-foreground">
          Create the first{" "}
          {singularLabel.toLowerCase()}{" "}
          profile to begin
          building this staff
          directory.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className={[
            color.button,
            "mt-6 inline-flex h-11 items-center gap-2",
            "rounded-xl px-5",
            "text-sm font-semibold",
            "shadow-[var(--shadow-auth-button)]",
            "transition-transform hover:-translate-y-0.5",
            "focus-visible:outline-none focus-visible:ring-4",
            color.ring,
          ].join(" ")}
        >
          <Plus className="h-4 w-4" />

          Add {singularLabel}
        </button>
      </div>
    </section>
  );
}

function ErrorState({
  label,
  onRetry,
}: {
  label: string;
  onRetry: () => void;
}) {
  return (
    <section className="rounded-[26px] border border-destructive/20 bg-card px-6 py-14 text-center shadow-[var(--shadow-card)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-destructive/[0.08] text-destructive">
        <UsersRound className="h-6 w-6" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-foreground">
        {label} could not
        be loaded
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Check your connection
        and permissions, then
        try loading the
        directory again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-muted"
      >
        <RefreshCw className="h-4 w-4" />

        Try again
      </button>
    </section>
  );
}