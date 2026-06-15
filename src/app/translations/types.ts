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
    unauthorized: string;
    forbidden: string;
    notFound: string;
  };
};