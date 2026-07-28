// ==========================================
// 1. الأنشطة والرحلات (Activities)
// ==========================================
export interface ActivityPayload {
  activity_name: string;
  type: string;
  activity_date: string;  
  start_time: string;    
  end_time: string;     
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
// 2. التعاميم والإعلانات (Announcements)
// ==========================================
export type AnnouncementAudience = "student" | "staff";

export interface AnnouncementPayload {
  audience: AnnouncementAudience;
  title: string;
  description: string;
  grade_level_id?: string | number;       
  class_room_ids?: (string | number)[];   
}

export interface Announcement extends AnnouncementPayload {
  id: string | number;
  creator_name?: string;
  created_at?: string;
  updated_at?: string;
}

// ==========================================
// 3. التنبيهات الذكية والجماعية (Bulk Alerts)
// ==========================================

 export interface PaymentAlertPayload {
  audience: "student";
  type: "payed" | "payment";
  enrollement_ids: (string | number)[];  
  meta: {
    amount?: number;       
    amount_due?: number;    
    due_date?: string;      
  };
}

 export interface AdvisorAlertPayload {
  audience: "student";
  type: "behavior" | "escape" | "late" | "absence";
  enrollement_ids: (string | number)[];
  meta?: {
    severity?: "low" | "medium" | "high";  
    session?: string;                     
    minutes_late?: number;             
  };
}

 export interface StaffAlertPayload {
  audience: "staff";
  type: "salary" | "absence" | "late";
  staff_ids: (string | number)[];
  meta?: {
    amount?: number;         
    mounth?: string;        
    session?: string;      
    minutes_late?: number;   
  };
}

 export type AnyAlertPayload = PaymentAlertPayload | AdvisorAlertPayload | StaffAlertPayload;