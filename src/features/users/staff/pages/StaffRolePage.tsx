import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Plus,
  RefreshCw,
  Trash2,
  Power,
} from "lucide-react";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useDeleteStaff,
  useStaffByRole,
  useToggleStaffStatus,
} from "../hooks/useStaff";

import type {
  StaffRole,
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

  const [page, setPage] =
    useState(1);

  const query =
    useStaffByRole(
      role,
      page,
      15,
    );

  const toggleStatus =
    useToggleStaffStatus(
      role,
    );

  const deleteStaff =
    useDeleteStaff(
      role,
    );

  const staff =
    query.data?.data ??
    [];

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {config.title}
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage{" "}
            {config.pluralLabel.toLowerCase()}.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={
              query.isFetching
            }
            onClick={() => {
              void query.refetch();
            }}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                config.createPath,
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add {config.singularLabel}
          </button>
        </div>
      </header>

      {query.isLoading ? (
        <div className="rounded-xl border p-8 text-center">
          Loading...
        </div>
      ) : query.isError ? (
        <div className="rounded-xl border border-destructive/30 p-8 text-center text-destructive">
          Failed to load{" "}
          {config.pluralLabel.toLowerCase()}.
        </div>
      ) : staff.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No{" "}
          {config.pluralLabel.toLowerCase()}{" "}
          registered yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  Name
                </th>

                <th className="px-4 py-3 text-left">
                  Phone
                </th>

                <th className="px-4 py-3 text-left">
                  Email
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

                <th className="px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {staff.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-t"
                  >
                    <td className="px-4 py-3 font-medium">
                      {item.fullName}
                    </td>

                    <td className="px-4 py-3">
                      {item.phoneNumber}
                    </td>

                    <td className="px-4 py-3">
                      {item.email ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      {item.accountStatus}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `${config.listPath}/${item.id}`,
                            )
                          }
                          className="rounded-md border px-3 py-1.5 text-sm"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `${config.listPath}/${item.id}/edit`,
                            )
                          }
                          className="rounded-md border px-3 py-1.5 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            toggleStatus.isPending
                          }
                          onClick={() =>
                            toggleStatus.mutate(
                              item.id,
                            )
                          }
                          className="rounded-md border px-3 py-1.5"
                          title="Toggle status"
                        >
                          <Power className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={
                            deleteStaff.isPending
                          }
                          onClick={() => {
                            const confirmed =
                              window.confirm(
                                `Delete ${item.fullName}?`,
                              );

                            if (confirmed) {
                              deleteStaff.mutate(
                                item.id,
                              );
                            }
                          }}
                          className="rounded-md border border-destructive/30 px-3 py-1.5 text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}

      {query.data &&
      query.data.lastPage > 1 ? (
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={
              page <= 1 ||
              query.isFetching
            }
            onClick={() =>
              setPage(
                (current) =>
                  current - 1,
              )
            }
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-muted-foreground">
            Page{" "}
            {query.data.currentPage}{" "}
            of{" "}
            {query.data.lastPage}
          </span>

          <button
            type="button"
            disabled={
              page >=
                query.data.lastPage ||
              query.isFetching
            }
            onClick={() =>
              setPage(
                (current) =>
                  current + 1,
              )
            }
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}