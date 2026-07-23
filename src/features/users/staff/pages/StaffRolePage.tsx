import {
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Plus,
  RefreshCw,
  Sparkles,
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
} from "../types/staff.types";

type StaffRolePageProps = {
  role: StaffRole;
};

export function StaffRolePage({
  role,
}: StaffRolePageProps) {
  const navigate = useNavigate();

  const config =
    staffSectionConfigs[role];

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

  const query = useStaffByRole(
    role,
    page,
    12,
  );

  const toggleStatus =
    useToggleStaffStatus(role);

  const deleteStaff =
    useDeleteStaff(role);

  const staff =
    query.data?.data ?? [];

  const total =
    query.data?.total ??
    staff.length;

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
        "enabled" ||
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
          "border border-border/70 bg-card",
          "px-5 py-5 shadow-[var(--shadow-card)] sm:px-6",
        ].join(" ")}
      >
        <div className="soft-purple-gradient pointer-events-none absolute inset-0 opacity-55" />

        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-primary/[0.09] text-primary">
              <UsersRound
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                Staff directory
              </p>

              <h1 className="mt-1 text-[27px] font-semibold tracking-[-0.04em] text-foreground">
                {config.title}
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm font-normal leading-6 text-muted-foreground">
                Review profiles, employment details and account access for{" "}
                {config.pluralLabel.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={
                query.isFetching
              }
              onClick={() => {
                void query.refetch();
              }}
              className={[
                "inline-flex h-10 items-center justify-center gap-2",
                "rounded-xl border border-border bg-card/80 px-4",
                "text-xs font-semibold text-foreground",
                "transition-colors",
                "hover:border-primary/20 hover:bg-primary/[0.06] hover:text-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
              ].join(" ")}
            >
              <RefreshCw
                className={[
                  "h-4 w-4",
                  query.isFetching
                    ? "animate-spin"
                    : "",
                ].join(" ")}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  config.createPath,
                )
              }
              className={[
                "primary-gradient inline-flex h-10 items-center justify-center gap-2",
                "rounded-xl px-4",
                "text-xs font-semibold text-primary-foreground",
                "shadow-[var(--shadow-auth-button)]",
                "transition-transform hover:-translate-y-0.5",
              ].join(" ")}
            >
              <Plus className="h-4 w-4" />
              Add {config.singularLabel}
            </button>
          </div>
        </div>
      </header>

      {!query.isLoading &&
      !query.isError ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/[0.06] px-3 py-1.5 text-xs font-medium text-primary">
            <UsersRound className="h-3.5 w-3.5" />
            {total}{" "}
            {total === 1
              ? config.singularLabel.toLowerCase()
              : config.pluralLabel.toLowerCase()}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-success/10 bg-success/[0.06] px-3 py-1.5 text-xs font-medium text-success">
            <Sparkles className="h-3.5 w-3.5" />
            Updated directory
          </span>
        </div>
      ) : null}

      {query.isLoading ? (
        <StaffGridSkeleton />
      ) : query.isError ? (
        <ErrorState
          label={
            config.pluralLabel
          }
          onRetry={() =>
            void query.refetch()
          }
        />
      ) : staff.length === 0 ? (
        <EmptyState
          singularLabel={
            config.singularLabel
          }
          pluralLabel={
            config.pluralLabel
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
            (item, index) => (
              <StaffCard
                key={item.id}
                staff={item}
                index={index}
                pendingToggle={
                  pendingToggleId ===
                  item.id
                }
                pendingDelete={
                  pendingDeleteId ===
                  item.id
                }
                onView={viewStaff}
                onEdit={editStaff}
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
      query.data.lastPage > 1 ? (
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
          onPageChange={(nextPage) => {
            setPage(nextPage);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      ) : null}
    </section>
  );
}

function StaffGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="min-h-[365px] animate-pulse overflow-hidden rounded-[24px] border border-border/70 bg-card"
        >
          <div className="h-[3px] bg-muted" />

          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-[18px] bg-muted" />

              <div className="flex-1">
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted/70" />
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              {Array.from({
                length: 5,
              }).map((__, row) => (
                <div
                  key={row}
                  className="h-[53px] rounded-2xl bg-muted/55"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  singularLabel,
  pluralLabel,
  onCreate,
}: {
  singularLabel: string;
  pluralLabel: string;
  onCreate: () => void;
}) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-[26px]",
        "border border-dashed border-primary/20 bg-card",
        "px-6 py-14 text-center shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <div className="soft-purple-gradient pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-primary/15 bg-card/80 text-primary shadow-[var(--shadow-soft)]">
          <BriefcaseBusiness className="h-7 w-7" />
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
          No {pluralLabel.toLowerCase()} yet
        </h2>

        <p className="mt-2 text-sm font-normal leading-6 text-muted-foreground">
          Create the first{" "}
          {singularLabel.toLowerCase()}{" "}
          profile to begin building this staff directory.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="primary-gradient mt-6 inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-auth-button)]"
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
        {label} could not be loaded
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Check your connection and permissions, then try loading the directory again.
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