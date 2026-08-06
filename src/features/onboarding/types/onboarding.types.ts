import type { LucideIcon } from "lucide-react";

export type OnboardingSectionId =
  | "settings"
  | "administration"
  | "academic-setup"
  | "people"
  | "teaching"
  | "scheduling"
  | "finance"
  | "attendance"
  | "communications"
  | "reports"
  | "system";

export type SetupStep = {
  id: string;
  sectionId: OnboardingSectionId;
  sectionTitle: string;
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  targetSelectors: string[];
  outcome?: string;
};

export type FeatureTipDefinition = {
  id: string;
  pathPrefix: string;
  title: string;
  description: string;
};
