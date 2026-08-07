export type UsersTranslation = {
  overview: {
    summary: {
      categories: string;
      totalUsers: string;
      loadingTotalUsers: string;
    };
    students: {
      title: string;
      description: string;
      countLabel: string;
      secondaryCountLabel: string;
      viewLabel: string;
    };
    teachers: UserOverviewCategoryTranslation;
    supervisors: UserOverviewCategoryTranslation;
    secretaries: UserOverviewCategoryTranslation;
    counselors: UserOverviewCategoryTranslation;
    serviceStaff: UserOverviewCategoryTranslation;
  };
  shared: {
    openCategory: string;
    backToOverview: string;
    confirmDialog: {
      closeDialog: string;
      cancel: string;
      pleaseWait: string;
    };
    photo: {
      uploadHint: string;
      noPhoto: string;
    };
    image: {
      loading: string;
      couldNotBeLoaded: string;
    };
  };
};

type UserOverviewCategoryTranslation = {
  title: string;
  description: string;
  countLabel: string;
  viewLabel: string;
};
