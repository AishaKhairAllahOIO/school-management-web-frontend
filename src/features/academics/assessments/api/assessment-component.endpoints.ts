export const assessmentComponentEndpoints = {
  list:
    "/subject/setting/assessment/subjects/show",

  details: (id: string) =>
    `/subject/setting/assessment/subject/show/${id}`,

  create:
    "/subject/setting/assessment/subject/store",

  update: (id: string) =>
    `/subject/setting/assessment/subject/update/${id}`,

  /*
   * مسار الباك الحالي مكتوب delete{id}
   * لذلك لا نضيف / قبل id حاليًا.
   *
   * مثال:
   * /subject/setting/assessment/subject/delete1
   */
  delete: (id: string) =>
    `/subject/setting/assessment/subject/delete${id}`,

  grouped:
    "/subject/setting/assessment/subjects/grouped",
} as const;