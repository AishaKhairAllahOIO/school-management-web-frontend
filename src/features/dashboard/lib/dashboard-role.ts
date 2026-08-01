import type {
  DashboardRole,
  DashboardRoleResolution,
} from "@/features/dashboard/types/dashboard-role.types";

const supportedRoles: DashboardRole[] = [
  "super_admin",
  "secretary",
  "adviser",
];

function normalizeRoleValue(
  value: unknown,
): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const normalized =
        normalizeRoleValue(item);

      if (normalized) {
        return normalized;
      }
    }

    return null;
  }

  if (typeof value === "string") {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");

    return normalized || null;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const record = value as Record<
      string,
      unknown
    >;

    return normalizeRoleValue(
      record.name ??
        record.slug ??
        record.code ??
        record.role,
    );
  }

  return null;
}

function readNestedValue(
  source: unknown,
  path: string[],
): unknown {
  let current = source;

  for (const key of path) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object"
    ) {
      return undefined;
    }

    current = (
      current as Record<string, unknown>
    )[key];
  }

  return current;
}

export function resolveDashboardRole(
  source: unknown,
): DashboardRoleResolution {
  const candidates: unknown[] = [
    readNestedValue(source, [
      "role",
    ]),

    readNestedValue(source, [
      "user",
      "role",
    ]),

    readNestedValue(source, [
      "data",
      "role",
    ]),

    readNestedValue(source, [
      "data",
      "user",
      "role",
    ]),

    readNestedValue(source, [
      "profile",
      "role",
    ]),

    readNestedValue(source, [
      "currentUser",
      "role",
    ]),

    readNestedValue(source, [
      "authUser",
      "role",
    ]),

    readNestedValue(source, [
      "roles",
    ]),

    readNestedValue(source, [
      "user",
      "roles",
    ]),

    readNestedValue(source, [
      "data",
      "user",
      "roles",
    ]),
  ];

  for (const candidate of candidates) {
    const rawRole =
      normalizeRoleValue(candidate);

    if (!rawRole) {
      continue;
    }

    if (
      supportedRoles.includes(
        rawRole as DashboardRole,
      )
    ) {
      return {
        role: rawRole as DashboardRole,
        rawRole,
      };
    }

    return {
      role: null,
      rawRole,
    };
  }

  return {
    role: null,
    rawRole: null,
  };
}