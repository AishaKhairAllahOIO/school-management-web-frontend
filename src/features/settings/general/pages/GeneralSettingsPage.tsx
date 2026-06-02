import { GeneralSettingsForm } from "@/features/settings/general/components/GeneralSettingsForm";
import { useGeneralSettings } from "@/features/settings/general/hooks/useGeneralSettings";

export function GeneralSettingsPage() {
  const { data, isLoading, isError } = useGeneralSettings();

  if (isLoading) {
    return (
      <div className="soft-card rounded-3xl p-6">
        <p className="text-sm font-semibold text-muted-foreground">
          Loading school information...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="soft-card rounded-3xl p-6">
        <h2 className="text-lg font-bold text-foreground">
          Failed to load school information
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return <GeneralSettingsForm initialData={data} />;
}