import { toast } from "sonner";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
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

import { ConfirmActionDialog } from "../../shared/components/ConfirmActionDialog";
import { UsersOverviewBackLink } from "../../shared/components/UsersOverviewBackLink";
import { exportStaffToExcel } from "../../shared/utils/export-users-xlsx";
import { staffApi } from "../api/staff.api";

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
  useRestoreStaff,
  useStaffByRole,
  useStaffSearch,
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
  allowImport?: boolean;
};

export function StaffRolePage({
  role,
  allowImport = true,
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

  const [isExporting, setIsExporting] =
    useState(false);

  const [dialogAction, setDialogAction] = useState<
    | { type: "delete" | "restore" | "toggle"; staff: StaffProfile }
    | null
  >(null);

  const [page, setPage] =
    useState(1);

  const [
    pendingToggleId,
    setPendingToggleId,
  ] = useState<ApiId>();

  const [
    pendingRestoreId,
    setPendingRestoreId,
  ] = useState<ApiId>();

  const [
    pendingDeleteId,
    setPendingDeleteId,
  ] = useState<ApiId>();

  const normalizedSearch = searchTerm.trim();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(normalizedSearch);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [normalizedSearch]);

  const isSearchMode = debouncedSearch.length >= 2;

  const listQuery = useStaffByRole(role, page, 12);
  const searchQuery = useStaffSearch(role, debouncedSearch, page, 12);
  const query = isSearchMode ? searchQuery : listQuery;

  const toggleStatus =
    useToggleStaffStatus(
      role,
    );

  const deleteStaff =
    useDeleteStaff(role);

  const restoreStaffMutation =
    useRestoreStaff(role);

  const staff = useMemo(() => {
    const items = query.data?.data ?? [];

    return [...items].sort((left, right) => {
      const result = left.fullName.localeCompare(right.fullName, undefined, {
        sensitivity: "base",
      });

      return sortDirection === "asc" ? result : -result;
    });
  }, [query.data?.data, sortDirection]);

  const total =
    query.data?.total ??
    staff.length;

  async function handleExport() {
    try {
      setIsExporting(true);

      const perPage = 100;
      const firstPage = isSearchMode
        ? await staffApi.searchByRole(role, debouncedSearch, 1, perPage)
        : await staffApi.getByRole(role, 1, perPage);

      const allStaff = [...firstPage.data];

      for (let pageNumber = 2; pageNumber <= firstPage.lastPage; pageNumber += 1) {
        const response = isSearchMode
          ? await staffApi.searchByRole(
              role,
              debouncedSearch,
              pageNumber,
              perPage,
            )
          : await staffApi.getByRole(role, pageNumber, perPage);

        allStaff.push(...response.data);
      }

      exportStaffToExcel(allStaff, config.pluralLabel);
      toast.success(`${allStaff.length} ${config.pluralLabel.toLowerCase()} exported.`);
    } catch {
      toast.error(`${config.pluralLabel} could not be exported.`);
    } finally {
      setIsExporting(false);
    }
  }

  function openImportDialog() {
    navigate(`${config.listPath}/import`);
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

  function toggleStaff(item: StaffProfile) {
    setDialogAction({ type: "toggle", staff: item });
  }

  function removeStaff(item: StaffProfile) {
    setDialogAction({ type: "delete", staff: item });
  }

  function restoreStaff(item: StaffProfile) {
    setDialogAction({ type: "restore", staff: item });
  }

  async function confirmStaffAction() {
    if (!dialogAction) {
      return;
    }

    const { type, staff: item } = dialogAction;

    try {
      if (type === "delete") {
        setPendingDeleteId(item.id);
        await deleteStaff.mutateAsync(item.id);
      } else if (type === "restore") {
        setPendingRestoreId(item.id);
        await restoreStaffMutation.mutateAsync(item.id);
      } else {
        setPendingToggleId(item.id);
        await toggleStatus.mutateAsync(item.id);
      }

      setDialogAction(null);
    } finally {
      setPendingToggleId(undefined);
      setPendingDeleteId(undefined);
      setPendingRestoreId(undefined);
    }
  }

  return (
    <section className="-mt-6 space-y-5">
      <UsersOverviewBackLink />

      {query.isLoading ? (
        <DirectoryStatsSkeleton color={config.color} />
      ) : !query.isError ? (
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
          <div className="relative min-w-0">
  <div className="flex min-w-0 items-center gap-3.5">
    <span
      className={[
        "flex h-10 w-10 shrink-0",
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

      <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-foreground">
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

              {allowImport && (
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
              )}

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
                  "",
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
                  "",
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
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
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
                pendingRestore={
                  pendingRestoreId ===
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
                onRestore={
                  restoreStaff
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

      <ConfirmActionDialog
        open={Boolean(dialogAction)}
        title={
          dialogAction?.type === "delete"
            ? `Delete ${config.singularLabel}?`
            : dialogAction?.type === "restore"
              ? `Restore ${config.singularLabel}?`
              : "Change Account Status?"
        }
        description={
          dialogAction?.type === "delete"
            ? "The staff record will be moved to deleted records and access may be disabled."
            : dialogAction?.type === "restore"
              ? "The staff record and user account will be reactivated."
              : "This changes whether the staff member can access the system."
        }
        confirmLabel={
          dialogAction?.type === "delete"
            ? "Delete"
            : dialogAction?.type === "restore"
              ? "Restore"
              : "Confirm"
        }
        pendingLabel={
          dialogAction?.type === "delete"
            ? "Deleting..."
            : dialogAction?.type === "restore"
              ? "Restoring..."
              : "Updating..."
        }
        tone={dialogAction?.type === "restore" ? "restore" : dialogAction?.type === "delete" ? "danger" : "neutral"}
        isPending={
          deleteStaff.isPending ||
          restoreStaffMutation.isPending ||
          toggleStatus.isPending
        }
        details={
          dialogAction ? (
            <span className="font-medium text-foreground">
              {dialogAction.staff.fullName}
            </span>
          ) : null
        }
        onClose={() => setDialogAction(null)}
        onConfirm={() => {
          void confirmStaffAction();
        }}
      />
    </section>
  );
}

function StaffGridSkeleton({
  color,
}: {
  color: StaffSectionColor;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading staff directory"
      className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <article
          key={index}
          className={[
            "relative flex h-[280px] flex-col overflow-hidden",
            "rounded-[20px] border bg-card",
            color.border,
            "shadow-[var(--shadow-card)]",
          ].join(" ")}
        >
          <div className={["h-[3px] animate-pulse", color.background].join(" ")} />

          <div className="flex flex-1 flex-col p-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3.5">
                <div className={["h-11 w-11 shrink-0 animate-pulse rounded-[14px]", color.light].join(" ")} />
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-2/3 animate-pulse rounded-md bg-muted" />
                  <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded bg-muted/70" />
                </div>
              </div>
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted/70" />
            </div>

            <div className="mt-3 h-7 w-24 animate-pulse rounded-full bg-muted" />

            <div className="mt-3 grid grid-cols-2 gap-2">
              {Array.from({ length: 2 }).map((__, row) => (
                <div key={row} className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-border/55 bg-muted/25 px-3 py-2.5">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-xl bg-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="h-2.5 w-12 animate-pulse rounded bg-muted/75" />
                    <div className="mt-2 h-3.5 w-3/4 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={[
            "grid grid-cols-3 items-center gap-2",
            "border-t px-3.5 py-2.5",
            color.border,
            color.footer,
          ].join(" ")}>
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
          </div>
        </article>
      ))}
    </div>
  );
}

function DirectoryStatsSkeleton({
  color,
}: {
  color: StaffSectionColor;
}) {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-wrap items-center gap-2"
    >
      <span className={["h-7 w-24 rounded-full border", color.border, color.light].join(" ")} />
      <span className={["h-7 w-36 rounded-full border", color.border, color.light].join(" ")} />
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
            "",
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