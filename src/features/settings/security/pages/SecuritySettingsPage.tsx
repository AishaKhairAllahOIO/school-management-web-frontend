import {
  KeyRound,
  LockKeyhole,
  Save,
  ShieldCheck,
  Smartphone,
  Timer,
} from "lucide-react";

const passwordRules = [
  { label: "Minimum Password Length", value: "8 characters" },
  { label: "Require Uppercase Letters", enabled: true },
  { label: "Require Numbers", enabled: true },
  { label: "Require Special Characters", enabled: true },
  { label: "Password Expiry", value: "90 days" },
];

const loginSecurity = [
  { title: "Login Attempt Limit", description: "Block account after repeated failed attempts", enabled: true },
  { title: "Account Lockout", description: "Temporarily lock accounts after failed attempts", enabled: true },
  { title: "Login Notifications", description: "Send email on new device login", enabled: true },
];

const dataProtection = [
  { title: "Encrypt Sensitive Data", description: "Protect sensitive school data", enabled: true },
  { title: "Backup Encryption", description: "Encrypt system backups", enabled: true },
  { title: "Audit Log", description: "Record security-related activities", enabled: true },
];

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <button
      type="button"
      className={[
        "relative h-6 w-11 rounded-full transition",
        enabled ? "bg-primary" : "bg-muted",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
          enabled ? "left-6" : "left-1",
        ].join(" ")}
      />
    </button>
  );
}

function SecurityCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={20} />
        </span>

        <div>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

export function SecuritySettingsPage() {
  return (
    <div className="soft-card rounded-3xl p-6">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">
          Security Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage account protection, login rules, and system security preferences.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <SecurityCard
          title="Password Policy"
          description="Configure password requirements"
          icon={KeyRound}
        >
          <div className="space-y-3">
            {passwordRules.map((rule) => (
              <div
                key={rule.label}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 px-4 py-3"
              >
                <span className="text-sm font-semibold text-foreground">
                  {rule.label}
                </span>

                {"enabled" in rule ? (
                  <Toggle enabled={rule.enabled} />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">
                    {rule.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </SecurityCard>

        <SecurityCard
          title="Two-Factor Authentication"
          description="Add extra login protection"
          icon={Smartphone}
        >
          <div className="rounded-2xl bg-primary/10 p-4 text-primary">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold">2FA is enabled</p>
                <p className="mt-1 text-xs text-primary/75">
                  All dashboard users must verify login.
                </p>
              </div>

              <Toggle enabled />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {["Authenticator App", "SMS Verification", "Backup Codes"].map(
              (item) => (
                <label
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {item}
                  </span>

                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </label>
              )
            )}
          </div>
        </SecurityCard>

        <SecurityCard
          title="Session Settings"
          description="Control dashboard sessions"
          icon={Timer}
        >
          <div className="space-y-4">
            <label>
              <span className="mb-2 block text-xs font-semibold text-muted-foreground">
                Session Timeout
              </span>

              <select className="h-11 w-full rounded-2xl border border-border/70 bg-card px-4 text-sm font-semibold outline-none">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-xs font-semibold text-muted-foreground">
                Remember Me Duration
              </span>

              <select className="h-11 w-full rounded-2xl border border-border/70 bg-card px-4 text-sm font-semibold outline-none">
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
              </select>
            </label>

            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 px-4 py-3">
              <span className="text-sm font-semibold text-foreground">
                Force logout on password change
              </span>
              <Toggle enabled />
            </div>
          </div>
        </SecurityCard>

        <SecurityCard
          title="Login Security"
          description="Protect accounts from suspicious login"
          icon={LockKeyhole}
        >
          <div className="space-y-3">
            {loginSecurity.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <Toggle enabled={item.enabled} />
              </div>
            ))}
          </div>
        </SecurityCard>

        <SecurityCard
          title="Data Protection"
          description="Protect private school data"
          icon={ShieldCheck}
        >
          <div className="space-y-3">
            {dataProtection.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <Toggle enabled={item.enabled} />
              </div>
            ))}
          </div>
        </SecurityCard>

        <SecurityCard
          title="Security Summary"
          description="Current system protection status"
          icon={ShieldCheck}
        >
          <div className="space-y-3">
            <div className="rounded-2xl bg-success/10 p-4">
              <p className="text-sm font-bold text-success">
                System protection is active
              </p>
              <p className="mt-1 text-xs text-success/80">
                Password policy, 2FA, and backup encryption are enabled.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
              <p className="text-sm font-bold text-foreground">
                Last security review
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                May 20, 2025
              </p>
            </div>
          </div>
        </SecurityCard>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-border/70 pt-5">
        <button className="h-11 rounded-2xl border border-border/70 bg-card px-8 text-sm font-bold text-foreground transition hover:bg-muted">
          Reset to Default
        </button>

        <button className="flex h-11 items-center gap-2 rounded-2xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}