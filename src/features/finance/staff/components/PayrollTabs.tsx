import {
  FileText,
  Wallet,
} from "lucide-react";

type PayrollTab =
  | "contracts"
  | "payroll";

type Props = {
  value: PayrollTab;
  onChange: (value: PayrollTab) => void;
};

export function PayrollTabs({
  value,
  onChange,
}: Props) {
  return (
    <div className="soft-card rounded-2xl p-1.5">
      <div className="flex gap-1">
        <Tab
          active={value === "contracts"}
          icon={FileText}
          label="Contracts"
          onClick={() =>
            onChange("contracts")
          }
        />

        <Tab
          active={value === "payroll"}
          icon={Wallet}
          label="Payroll"
          onClick={() =>
            onChange("payroll")
          }
        />
      </div>
    </div>
  );
}

function Tab({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof FileText;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-10 items-center gap-2 rounded-xl
        px-4 text-sm font-semibold
        transition-all
        ${
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
      `}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}