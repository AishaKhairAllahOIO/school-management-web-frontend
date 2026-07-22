export const assessmentComponentEndpoints = {
  list:
    "/subject/setting/assessment/subjects/show",

  details: (id: string) =>
    `/subject/setting/assessment/subject/show/${id}`,

  create:
    "/subject/setting/assessment/subject/store",

  update: (id: string) =>
    `/subject/setting/assessment/subject/update/${id}`,

  delete: (id: string) =>
    `/subject/setting/assessment/subject/delete/${id}`,

  grouped:
    "/subject/setting/assessment/subjects/grouped",
} as const;