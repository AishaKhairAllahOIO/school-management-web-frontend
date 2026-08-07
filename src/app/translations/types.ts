import type { UsersTranslation } from "@/features/users/translations/users.translation.type"

export type TranslationDictionary = {
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    search: string;
    loading: string;
    noData: string;
    back: string;
    close: string;
    confirm: string;
    tryAgain: string;
    backToHome: string;
  };

  navigation: {
    dashboard: string;
    users: string;
    academics: string;
    attendance: string;
    scheduling: string;
    finance: string;
    communications: string;
    reports: string;
    settings: string;
    profile: string;
    notifications: string;
  };

  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    forgotPassword: string;
    rememberMe: string;
  };

  validation: {
    required: string;
    invalidEmail: string;
    minLength: string;
    maxLength: string;
  };

  errors: {
    somethingWentWrong: string;
    unexpectedError: string;
    unauthorized: string;
    forbidden: string;
    notFound: string;
    pageNotFound: string;
    offlineCode: string;
    offlineTitle: string;
    offlineDescription: string;
    connectionRestored: string;
    retryConnection: string;
  };

  layout: {
    sidebar: {
      navigation: string;
      schoolName: string;
      schoolWebsite: string;
      viewWebsite: string;
      mainMenu: string;
      goodMorning: string;
      goodAfternoon: string;
      goodEvening: string;
      expandSidebar: string;
      collapseSidebar: string;
      closeSidebar: string;
    };

    subNavigation: {
      sectionNavigation: string;
      students: string;
      staff: string;
      classes: string;
      exams: string;
      quizzes: string;
      holidays: string;
      studentFinance: string;
      staffPayroll: string;
      announcements: string;
      alerts: string;
      activities: string;
      schoolLaws: string;
      general: string;
      academic: string;
      financial: string;
      attendance: string;
      roles: string;
      permissions: string;
    };

    breadcrumb: {
      label: string;
      pages: Record<string, string>;
    };

    topbar: {
      openSidebar: string;
      toggleTheme: string;
      notifications: string;
      notificationsTitle: string;
      unreadUpdates: string;
      markAllRead: string;
      viewAllNotifications: string;
      notificationsLoadErrorTitle: string;
      notificationsLoadErrorDescription: string;
      noSystemNotificationsTitle: string;
      noSystemNotificationsDescription: string;
      unread: string;
      overview: string;
      online: string;
      viewProfile: string;
      viewProfileDescription: string;
      viewAllAdministrators: string;
      viewAllAdministratorsDescription: string;
      addAdministrator: string;
      addAdministratorDescription: string;
      changePassword: string;
      manageUsers: string;
      manageUsersDescription: string;
      logout: string;
      openProfileMenu: string;
      loadingUser: string;
      fallbackUser: string;
      roles: {
        superAdmin: string;
        teacher: string;
        adviser: string;
        supervisor: string;
        secretary: string;
        counselor: string;
        serviceStaff: string;
        student: string;
        guardian: string;
        user: string;
      };
    };
  };
  users: UsersTranslation;
};
