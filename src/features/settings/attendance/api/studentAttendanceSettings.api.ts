
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type {
 StudentAttendanceSetting,
 CreateStudentAttendanceSettingPayload,
 UpdateStudentAttendanceSettingPayload,
} from "../types/student-attendance.types";

const mapItem=(item:any):StudentAttendanceSetting=>({
 id:String(item.id),
 semesterId:String(item.semester_id),
 workingDays:item.working_days,
 requiredAttendancePercentage:Number(item.required_attendance_percentage),
 allowedAbsenceDays:item.allowed_absence_days,
 createdAt:item.created_at,
 updatedAt:item.updated_at,
});

export async function getStudentAttendanceSettings(){
 const res=await axiosClient.get(API_ENDPOINTS.SETTINGS.ATTENDANCE.STUDENT_SETTINGS.LIST);
 return res.data.data.map(mapItem);
}

export async function createStudentAttendanceSetting(
 payload:CreateStudentAttendanceSettingPayload
){
 const res=await axiosClient.post(
 API_ENDPOINTS.SETTINGS.ATTENDANCE.STUDENT_SETTINGS.CREATE,
 {
 semester_id:payload.semesterId,
 working_days:payload.workingDays,
 required_attendance_percentage:payload.requiredAttendancePercentage,
 });
 return mapItem(res.data.data);
}

export async function updateStudentAttendanceSetting(
 id:string,
 payload:UpdateStudentAttendanceSettingPayload
){
 const res=await axiosClient.post(
 API_ENDPOINTS.SETTINGS.ATTENDANCE.STUDENT_SETTINGS.UPDATE(id),
 {
 semester_id:payload.semesterId,
 working_days:payload.workingDays,
 required_attendance_percentage:payload.requiredAttendancePercentage,
 });
 return mapItem(res.data.data);
}

export async function deleteStudentAttendanceSetting(id:string){
 return axiosClient.delete(
 API_ENDPOINTS.SETTINGS.ATTENDANCE.STUDENT_SETTINGS.DELETE(id)
 );
}
