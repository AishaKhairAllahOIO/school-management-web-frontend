import type { LucideIcon } from "lucide-react";

export type SetupStep = {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
};

export type FeatureTipDefinition = {
  id: string;
  pathPrefix: string;
  title: string;
  description: string;
};
