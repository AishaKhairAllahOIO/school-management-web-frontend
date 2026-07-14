import type { TranslationDictionary } from "./types";

export const ar: TranslationDictionary = {
  common: {
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    search: "بحث",
    loading: "جاري التحميل...",
    noData: "لا توجد بيانات",
    back: "رجوع",
    close: "إغلاق",
    confirm: "تأكيد",
  },

  navigation: {
    dashboard: "لوحة التحكم",
    users: "المستخدمون",
    academics: "الشؤون الأكاديمية",
    attendance: "الحضور",
    scheduling: "الجدولة",
    finance: "المالية",
    communications: "التواصل",
    reports: "التقارير",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
  },

  auth: {
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    rememberMe: "تذكرني",
  },

  validation: {
    required: "هذا الحقل مطلوب",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
    minLength: "القيمة قصيرة جدًا",
    maxLength: "القيمة طويلة جدًا",
  },

  errors: {
    somethingWentWrong: "حدث خطأ غير متوقع",
    unauthorized: "غير مصرح لك",
    forbidden: "ليس لديك صلاحية الوصول",
    notFound: "العنصر غير موجود",
  },

  layout: {
    sidebar: {
      navigation: "التنقل الرئيسي",
      schoolWebsite: "موقع المدرسة",
      expandSidebar: "توسيع القائمة الجانبية",
      collapseSidebar: "طي القائمة الجانبية",
      closeSidebar: "إغلاق القائمة الجانبية",
    },

    topbar: {
      openSidebar: "فتح القائمة الجانبية",
      toggleTheme: "تبديل المظهر",
      notifications: "الإشعارات",
      notificationsTitle: "الإشعارات",
      unreadUpdates: "لديك {{count}} تحديثات غير مقروءة",
      overview: "نظرة عامة",
      online: "متصل",
      viewProfile: "عرض الملف الشخصي",
      changePassword: "تغيير كلمة المرور",
      manageUsers: "إدارة المستخدمين",
      logout: "تسجيل الخروج",
      openProfileMenu: "فتح قائمة الملف الشخصي",
    },
  },
};