export const WEB_ALLOWED_ROLES = ["super_admin", "secretary", "adviser"] as const;

export type WebAllowedRole = (typeof WEB_ALLOWED_ROLES)[number];
