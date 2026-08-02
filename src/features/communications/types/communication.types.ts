export type AudienceType = "student" | "staff" | "both";

export interface ActivityPayload {
  activity_name: string;
  type: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  grade_level_id: number | string;
  class_room_ids?: (number | string)[]; // مصفوفة كما في البوستمان
  description?: string;
}

export interface Activity extends ActivityPayload {
  id: number | string;
  created_at?: string;
}

export interface AnnouncementPayload {
  audience: AudienceType;
  title: string;
  description: string;
  grade_level_id?: number | string;
  class_room_ids?: (number | string)[];
}

export interface Announcement extends AnnouncementPayload {
  id: number | string;
  creator_name?: string;
  created_at?: string;
}

// التنبيهات الجماعية باستخدام المصفوفات 
export interface StaffAlertPayload {
  audience: "staff";
  type: "salary" | "absence" | "late";
  staff_ids: (number | string)[]; // مصفوفة المعرفات
  meta?: {
    amount?: number;
    mounth?: string; // الخطأ الإملائي المعتمد في الباك إند
    session?: string;
    minutes_late?: number;
  };
}

export interface PaymentAlertPayload {
  audience: "student";
  type: "payed" | "payment";
  enrollment_ids: (number | string)[]; // مصفوفة المعرفات مع حرف e الزائد
  meta?: {
    amount?: number;
    amount_due?: number;
    due_date?: string;
  };
}

export interface AdvisorAlertPayload {
  audience: "student";
  type: "behavior" | "escape" | "late" | "absence";
  enrollment_ids: (number | string)[]; // مصفوفة المعرفات
  meta?: {
    severity?: "low" | "medium" | "high";
    session?: string;
    minutes_late?: number;
  };
}