import type { ReactNode } from "react";

import { SectionHeader } from "@/features/settings/academic/components/shared/SectionHeader";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

/**
 * Financial settings deliberately reuse the academic settings header so all
 * settings pages share the same typography, spacing and action-button style.
 */
export function FinancialSectionHeader({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: Props) {
  return (
    <SectionHeader
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
    >
      {children}
    </SectionHeader>
  );
}
