export const usersTranslationEn = {
  overview: {
    summary: {
      categories: "Categories",
      totalUsers: "Total users",
      loadingTotalUsers: "Loading total users",
    },
    students: {
      title: "Students",
      description: "Student profiles, guardians, enrollment and academic records.",
      countLabel: "Total students",
      secondaryCountLabel: "Parents",
      viewLabel: "View all students",
    },
    teachers: { title: "Teachers", description: "Teacher personal information and employment details.", countLabel: "Total teachers", viewLabel: "View all teachers", }, supervisors: { title: "Supervisors", description: "Supervisor personal information and employment details.", countLabel: "Total supervisors", viewLabel: "View all supervisors", }, secretaries: { title: "Secretaries", description: "Secretary personal information and employment details.", countLabel: "Total secretaries", viewLabel: "View all secretaries", }, counselors: { title: "Counselors", description: "Counselor personal information and employment details.", countLabel: "Total counselors", viewLabel: "View all counselors", }, serviceStaff: { title: "Service Staff", description: "Service staff personal information and employment details.", countLabel: "Total service staff", viewLabel: "View all service staff", },
  },
  shared: {
    openCategory: "Open",
    backToOverview: "Back to Users Overview",
    confirmDialog: {
      closeDialog: "Close dialog",
      cancel: "Cancel",
      pleaseWait: "Please wait...",
    },
    photo: {
      uploadHint: "Click or drag and drop a profile image here.",
      noPhoto: "No profile image available.",
    },
    image: {
      loading: "Loading",
      couldNotBeLoaded: "could not be loaded",
    },
  },
} as const;
