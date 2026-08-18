import { useGeneralSettings } from "@/features/settings/general/hooks/useGeneralSettings";

import type { PrintIdentity } from "../types/print.types";

const FALLBACK_IDENTITY: PrintIdentity = {
  schoolName: "School Management System",
};

export function usePrintIdentity(): PrintIdentity {
  const { data } = useGeneralSettings();

  if (!data) {
    return FALLBACK_IDENTITY;
  }

  return {
    schoolName:
      data.schoolName.trim() ||
      FALLBACK_IDENTITY.schoolName,

    shortName:
      data.shortName.trim() || undefined,

    logoUrl:
      data.logoUrl || undefined,

    phoneNumber:
      data.phoneNumber.trim() || undefined,

    email:
      data.email.trim() || undefined,

    website:
      data.website.trim() || undefined,

    address:
      data.address.trim() || undefined,

    city:
      data.city.trim() || undefined,

    country:
      data.country.trim() || undefined,
      
      
  };
}