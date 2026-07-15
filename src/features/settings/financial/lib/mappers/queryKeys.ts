export const financialKeys = {
  all: ["financial"] as const,

  feePlans: () =>
    [...financialKeys.all, "fee-plans"] as const,

  feePlan: (id: number) =>
    [...financialKeys.feePlans(), id] as const,

  policies: () =>
    [...financialKeys.all, "policies"] as const,

  policy: (id: number) =>
    [...financialKeys.policies(), id] as const,

  extraServices: () =>
    [...financialKeys.all, "extra-services"] as const,
};