import type { ReactNode } from "react";

import { SettingsWorkspace } from "@/features/settings/academic/components/shared/SettingsWorkspace";

type FinancialWorkspaceItem = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
};

type Props = {
  items: FinancialWorkspaceItem[];
  activeId: string;
  onChange: (id: string) => void;
  children: ReactNode;
  hint?: string;
};

/** Reuses the academic settings workspace to keep navigation identical. */
export function FinancialWorkspace(props: Props) {
  return <SettingsWorkspace {...props} />;
}
