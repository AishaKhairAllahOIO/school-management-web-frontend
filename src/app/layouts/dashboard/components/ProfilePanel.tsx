import {
  BadgeCheck,
  Building2,
  Edit3,
  GraduationCap,
  IdCard,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useCurrentUser } from "@/app/layouts/dashboard/hooks/useCurrentUser";
import { useLayoutStore } from "@/app/layouts/dashboard/store/layoutStore";

type InfoItem = {
  label: string;
  value: string;
  icon: typeof IdCard;
};

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function formatName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}

function formatDegree(degree: string) {
  const labels: Record<string, string> = {
    diploma: "Diploma",
    bachelor: "Bachelor",
    master: "Master",
    phd: "PhD",
    other: "Other",
  };

  return labels[degree] ?? degree;
}

function InfoSection({ title, items }: { title: string; items: InfoItem[] }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-background/70 p-4">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </h3>

      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-soft ring-1 ring-border/50">
                  <Icon size={15} />
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>

              <span className="max-w-[140px] truncate text-right text-xs font-semibold text-foreground">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ProfilePanel() {
  const { user } = useCurrentUser();

  const isOpen = useLayoutStore((state) => state.isProfilePanelOpen);
  const closeProfilePanel = useLayoutStore((state) => state.closeProfilePanel);

  if (!isOpen) return null;

  const fullName = formatName(user.firstName, user.lastName);

  const quickInfo: InfoItem[] = [
    {
      label: "Code",
      value: user.superAdminCode,
      icon: IdCard,
    },
    {
      label: "Category",
      value: "Super Admin",
      icon: UserRound,
    },
    {
      label: "Status",
      value: user.recordStatus,
      icon: BadgeCheck,
    },
  ];

  const contactInfo: InfoItem[] = [
    {
      label: "Email",
      value: user.superAdminEmail,
      icon: Mail,
    },
    {
      label: "Phone",
      value: user.phoneNumber,
      icon: Phone,
    },
  ];

  const employmentInfo: InfoItem[] = [
    {
      label: "Hire Date",
      value: user.hireDate,
      icon: Building2,
    },
    {
      label: "Degree",
      value: formatDegree(user.degree),
      icon: GraduationCap,
    },
    {
      label: "University",
      value: user.university,
      icon: GraduationCap,
    },
    {
      label: "Graduation",
      value: formatValue(user.graduationYear),
      icon: GraduationCap,
    },
    {
      label: "Experience",
      value: `${formatValue(user.yearsOfExperience)} years`,
      icon: BadgeCheck,
    },
  ];

  const accessInfo: InfoItem[] = [
    {
      label: "Access",
      value: "Full Access",
      icon: ShieldCheck,
    },
    {
      label: "Account",
      value: user.accountStatus,
      icon: KeyRound,
    },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Close profile panel overlay"
        onClick={closeProfilePanel}
        className="fixed inset-0 z-40 hidden cursor-default bg-transparent lg:block"
      />

      <aside className="fixed bottom-0 right-0 top-0 z-50 hidden w-[320px] border-l border-border/70 bg-card/95 p-5 shadow-floating backdrop-blur-xl lg:flex lg:flex-col">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-[-0.02em] text-foreground">
              Profile
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Current account
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Edit profile"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Edit3 size={15} />
            </button>

            <button
              type="button"
              onClick={closeProfilePanel}
              aria-label="Close profile panel"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-background/70 p-5 text-center">
          <div className="relative mx-auto h-20 w-20">
            <img
              src={user.photoUrl ?? user.avatarUrl}
              alt={fullName}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/10"
            />

            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-success" />
          </div>

          <h3 className="mt-4 truncate text-sm font-bold text-foreground">
            {fullName}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Super Admin · School Management
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-[11px] font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Online
            </span>

            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              Full Access
            </span>
          </div>
        </div>

        <div className="scrollbar-thin mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          <InfoSection title="Quick Information" items={quickInfo} />
          <InfoSection title="Contact Information" items={contactInfo} />
          <InfoSection title="Employment Information" items={employmentInfo} />
          <InfoSection title="System Access" items={accessInfo} />
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-background py-2.5 text-xs font-bold text-muted-foreground ring-1 ring-border/60 transition hover:bg-muted hover:text-foreground"
          >
            <LogOut size={15} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}