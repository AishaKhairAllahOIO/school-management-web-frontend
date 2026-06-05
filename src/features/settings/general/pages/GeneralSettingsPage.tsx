import { GeneralSettingsForm } from "@/features/settings/general/components/GeneralSettingsForm";
import { useGeneralSettings } from "@/features/settings/general/hooks/useGeneralSettings";

export function GeneralSettingsPage() {
  const { data, isLoading, isError } = useGeneralSettings();

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <p className="text-sm font-semibold text-muted-foreground">
          Loading school information...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <h2 className="text-lg font-bold text-foreground">
          Failed to load school information
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return <GeneralSettingsForm initialData={data} />;
}