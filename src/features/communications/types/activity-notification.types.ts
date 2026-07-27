// ==========================================
// 1. أنواع الأنشطة (Activities)
// ==========================================
export interface ActivityPayload {
  activity_name: string;
  type: string;
  activity_date: string; // YYYY-MM-DD
  start_time: string;    // HH:mm
  end_time: string;      // HH:mm
  grade_level_id: string | number;
  class_room_ids?: (string | number)[];
  description?: string;
}

export interface Activity extends ActivityPayload {
  id: string | number;
  created_at?: string;
  updated_at?: string;
}

// ==========================================
// 2. أنواع الإعلانات (Announcements)
// ==========================================
export type AnnouncementAudience = "student" | "staff";

export interface AnnouncementPayload {
  audience: AnnouncementAudience;
  title: string;
  description: string;
  grade_level_id?: string | number;      // مطلوب فقط إذا كان الهدف student
  class_room_ids?: (string | number)[];  // اختياري لتخصيص شعب محددة
}

export interface Announcement extends AnnouncementPayload {
  id: string | number;
  creator_name?: string;
  created_at?: string;
}

// ==========================================
// 3. أنواع التنبيهات (Alerts & Notifications)
// ==========================================

export interface PaymentAlertPayload {
  audience: "student";
  type: "payed" | "payment";
  enrollement_ids: (string | number)[]; // 👈 التزمنا بحرف الـ e الإضافي كما في التعديل
  meta: {
    amount?: number;       // في حال type = payed
    amount_due?: number;   // في حال type = payment
    due_date?: string;     // في حال type = payment
  };
}

// ب) تنبيهات التوجيه (موجه -> طلاب)
export interface AdvisorAlertPayload {
  audience: "student";
  type: "behavior" | "escape" | "late" | "absence";
  enrollement_ids: (string | number)[]; // 👈 التزمنا بحرف الـ e الإضافي
  meta?: {
    severity?: "low" | "medium" | "high"; // في حال behavior
    session?: string;                     // في حال escape أو late
    minutes_late?: number;                // في حال late
  };
}

// ج) تنبيهات الموظفين (إدارة -> موظفين)
export interface StaffAlertPayload {
  audience: "staff";
  type: "salary" | "absence" | "late";
  staff_ids: (string | number)[]; // 👈 مصفوفة معرفات الموظفين
  meta?: {
    amount?: number;        // في حال salary
    mounth?: string;        // 👈 التزمنا بحرف الـ u الإضافي كما يطلبه الباك إند
    session?: string;       // في حال late
    minutes_late?: number;  // في حال late
  };
}

 export type AnyAlertPayload = PaymentAlertPayload | AdvisorAlertPayload | StaffAlertPayload;