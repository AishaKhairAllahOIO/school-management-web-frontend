import {
  BadgeCheck,
  Building2,
  Edit3,
  IdCard,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLayoutStore } from "../store/layoutStore";

const quickInfo = [
  {
    label: "Employee ID",
    value: "ADM-2026",
    icon: IdCard,
  },
  {
    label: "Department",
    value: "Administration",
    icon: Building2,
  },
  {
    label: "Office",
    value: "Main Building",
    icon: MapPin,
  },
  {
    label: "Status",
    value: "Active",
    icon: BadgeCheck,
  },
];

const contactInfo = [
  {
    label: "Email",
    value: "admin@school.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+40 712 555 888",
    icon: Phone,
  },
];

const accessInfo = [
  {
    label: "Role",
    value: "Super Admin",
    icon: UserRound,
  },
  {
    label: "Access",
    value: "Full Access",
    icon: ShieldCheck,
  },
  {
    label: "Last Login",
    value: "Today 09:42 AM",
    icon: KeyRound,
  },
];

function InfoSection({
  title,
  items,
}: {
  title: string;
  items: {
    label: string;
    value: string;
    icon: typeof IdCard;
  }[];
}) {
  return (
    <section className="rounded-[24px] bg-background/80 p-4">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
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
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                  <Icon size={15} />
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>

              <span className="max-w-[130px] truncate text-right text-xs font-semibold text-foreground">
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
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/10"
          />

          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-success" />
        </div>

        <h3 className="mt-4 text-sm font-bold text-foreground">
          {user.fullName}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          {user.role} · School Management
        </p>
      </div>

      <div className="mt-7 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <InfoSection title="Quick Information" items={quickInfo} />

        <InfoSection title="Contact Information" items={contactInfo} />

        <InfoSection title="System Access" items={accessInfo} />
      </div>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-2.5 text-xs font-bold text-white transition hover:bg-primary-dark"
        >
          <Edit3 size={15} />
          Edit Profile
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-background py-2.5 text-xs font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <LogOut size={15} />
          Log Out
        </button>
      </div>
    </aside>
  );
}