import { Building2, Link2, Trash2 } from "lucide-react";

type SchoolLogoUploadProps = {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function SchoolLogoUpload({
  value,
  error,
  disabled = false,
  onChange,
}: SchoolLogoUploadProps) {
  return (
    <div className="rounded-3xl border border-border/70 bg-muted/20 p-5">
      <p className="text-sm font-bold text-foreground">
        School Logo
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Enter a publicly accessible logo URL.
      </p>

      <div className="mt-5 flex min-h-44 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-card p-4">
        {value ? (
          <img
            src={value}
            alt="School logo preview"
            className="max-h-36 max-w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Building2 size={42} strokeWidth={1.5} />
            <span className="text-xs font-semibold">
              No logo URL provided
            </span>
          </div>
        )}
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-[11px] font-bold text-foreground/80">
          Logo URL
        </span>

        <div className="relative">
          <Link2
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
          />

          <input
            type="url"
            value={value}
            disabled={disabled}
            placeholder="https://example.com/logo.png"
            onChange={(event) => onChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-border/70 bg-card pl-10 pr-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {error ? (
          <p className="mt-1 text-[11px] font-semibold text-destructive">
            {error}
          </p>
        ) : null}
      </label>

      {value ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("")}
          className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-border/70 px-4 text-xs font-bold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={15} />
          Remove Logo
        </button>
      ) : null}
    </div>
  );
}