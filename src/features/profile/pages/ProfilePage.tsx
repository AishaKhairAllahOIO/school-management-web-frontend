import { AccountOverviewCard } from "@/features/profile/components/AccountOverviewCard";
import { EmploymentInformationCard } from "@/features/profile/components/EmploymentInformationCard";
import { PersonalInformationCard } from "@/features/profile/components/PersonalInformationCard";
import { ProfileHeaderCard } from "@/features/profile/components/ProfileHeaderCard";
import { ProfileProductivityCard } from "@/features/profile/components/ProfileProductivityCard";

import { useProfile } from "@/features/profile/hooks/use-my-profile";

export function ProfilePage() {
  const {
    user,
    identity,
    permissions,
    isLoading,
  } = useProfile();

  if (
    isLoading ||
    !user ||
    !identity ||
    !permissions
  ) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="space-y-4">
      <ProfileHeaderCard
        user={user}
        identity={identity}
      />

      <div
        className={[
          "grid items-start gap-4",
          "xl:grid-cols-[minmax(0,1fr)_350px]",
        ].join(" ")}
      >
        <main className="min-w-0 space-y-4">
          <PersonalInformationCard
            user={user}
          />

          <EmploymentInformationCard
            user={user}
          />
        </main>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <AccountOverviewCard
            user={user}
            identity={identity}
          />

          <ProfileProductivityCard
            userId={String(user.id)}
          />
        </aside>
      </div>
    </div>
  );
}

function ProfilePageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading profile"
      className="animate-pulse space-y-4"
    >
      <section
        className={[
          "relative overflow-hidden",
          "rounded-[26px]",
          "border border-border/70",
          "bg-card",
          "px-5 py-5",
          "shadow-[var(--shadow-card)]",
          "sm:px-6",
        ].join(" ")}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-muted" />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="h-[82px] w-[82px] shrink-0 rounded-[22px] bg-muted" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-6 w-52 max-w-full rounded-lg bg-muted" />

                <div className="h-6 w-24 rounded-full bg-muted/75" />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <div className="h-4 w-44 rounded bg-muted/70" />

                <div className="h-4 w-28 rounded bg-muted/70" />

                <div className="h-4 w-24 rounded bg-muted/70" />

                <div className="h-4 w-32 rounded bg-muted/70" />
              </div>
            </div>
          </div>

          <div className="h-10 w-28 rounded-xl bg-muted" />
        </div>
      </section>

      <div
        className={[
          "grid items-start gap-4",
          "xl:grid-cols-[minmax(0,1fr)_350px]",
        ].join(" ")}
      >
        <main className="min-w-0 space-y-4">
          <ProfileInformationSkeleton
            columns={3}
            items={7}
          />

          <ProfileInformationSkeleton
            columns={2}
            items={7}
            grouped
          />
        </main>

        <aside className="space-y-4">
          <ProfileInformationSkeleton
            columns={1}
            items={4}
            compact
          />

          <ProductivitySkeleton />
        </aside>
      </div>
    </div>
  );
}

type ProfileInformationSkeletonProps = {
  columns: 1 | 2 | 3;
  items: number;
  compact?: boolean;
  grouped?: boolean;
};

function ProfileInformationSkeleton({
  columns,
  items,
  compact = false,
  grouped = false,
}: ProfileInformationSkeletonProps) {
  const gridClassName =
    columns === 3
      ? "sm:grid-cols-2 2xl:grid-cols-3"
      : columns === 2
        ? "md:grid-cols-2"
        : "grid-cols-1";

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
          "flex items-start gap-3",
          "border-b border-border/60",
          "bg-muted/15",
          "px-5 py-4",
        ].join(" ")}
      >
        <div className="h-10 w-10 shrink-0 rounded-[14px] bg-muted" />

        <div className="min-w-0 flex-1">
          <div className="h-3 w-20 rounded bg-muted" />

          <div className="mt-2 h-5 w-44 rounded bg-muted" />

          <div className="mt-2 h-3 w-full max-w-xs rounded bg-muted/70" />
        </div>
      </header>

      <div className="p-4 lg:p-5">
        {grouped ? (
          <div className="mb-4 flex items-center gap-3">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-px flex-1 bg-muted" />
          </div>
        ) : null}

        <div
          className={[
            "grid gap-3",
            gridClassName,
          ].join(" ")}
        >
          {Array.from({
            length: items,
          }).map((_, index) => (
            <div
              key={index}
              className={[
                "flex items-center gap-3",
                "rounded-[18px]",
                "border border-border/60",
                "bg-card",
                compact
                  ? "px-3 py-2.5"
                  : "px-3.5 py-3",
              ].join(" ")}
            >
              <div
                className={[
                  "shrink-0 bg-muted",
                  compact
                    ? "h-9 w-9 rounded-[12px]"
                    : "h-10 w-10 rounded-[14px]",
                ].join(" ")}
              />

              <div className="min-w-0 flex-1">
                <div className="h-2.5 w-16 rounded bg-muted/70" />

                <div className="mt-2 h-3.5 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductivitySkeleton() {
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
          <div className="h-10 w-10 shrink-0 rounded-[14px] bg-muted" />

          <div className="min-w-0 flex-1">
            <div className="h-3 w-20 rounded bg-muted" />

            <div className="mt-2 h-5 w-36 rounded bg-muted" />

            <div className="mt-2 h-3 w-full rounded bg-muted/70" />
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-8 rounded bg-muted" />
        </div>

        <div className="mt-2 h-1.5 rounded-full bg-muted" />
      </header>

      <div className="p-4">
        <div className="h-12 rounded-[16px] bg-muted/70" />

        <div className="mt-3 space-y-2">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className={[
                "flex items-center gap-3",
                "rounded-[15px]",
                "border border-border/60",
                "px-3 py-2.5",
              ].join(" ")}
            >
              <div className="h-8 w-8 shrink-0 rounded-[11px] bg-muted" />

              <div className="h-3.5 flex-1 rounded bg-muted" />

              <div className="h-8 w-8 shrink-0 rounded-[11px] bg-muted/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}