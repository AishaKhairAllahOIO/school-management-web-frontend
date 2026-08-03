import { CalendarDays, Clock3, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useActivities } from "../../hooks/useActivities";
import type { Activity, ActivityPayload } from "../../types/communication.types";
import { MultiSelectAudience, type OptionItem } from "../shared/MultiSelectAudience";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; gradeLevels: { id: string | number; name: string }[]; classRooms: OptionItem[]; activityToEdit?: Activity | null };

export function CreateActivityDialog({ open, onOpenChange, gradeLevels = [], classRooms = [], activityToEdit = null }: Props) {
  const { createActivity, updateActivity } = useActivities();
  const isEditing = Boolean(activityToEdit);
  const isPending = createActivity.isPending || updateActivity.isPending;
  const [activityName, setActivityName] = useState(""); const [type, setType] = useState(""); const [activityDate, setActivityDate] = useState(""); const [startTime, setStartTime] = useState(""); const [endTime, setEndTime] = useState(""); const [gradeLevelId, setGradeLevelId] = useState<string | number>(""); const [selectedClassRoomIds, setSelectedClassRoomIds] = useState<(string | number)[]>([]); const [description, setDescription] = useState(""); const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open && activityToEdit) {
      setActivityName(activityToEdit.activity_name ?? ""); setType(activityToEdit.type ?? ""); setActivityDate(activityToEdit.activity_date ?? ""); setStartTime(activityToEdit.start_time ?? ""); setEndTime(activityToEdit.end_time ?? ""); setGradeLevelId(activityToEdit.grade_level_id ?? ""); setSelectedClassRoomIds(activityToEdit.class_room_ids ?? []); setDescription(activityToEdit.description ?? ""); setFormError(null);
    } else if (!open) { setActivityName(""); setType(""); setActivityDate(""); setStartTime(""); setEndTime(""); setGradeLevelId(""); setSelectedClassRoomIds([]); setDescription(""); setFormError(null); }
  }, [activityToEdit, open]);

  const filteredClassRooms = classRooms.filter((item: any) => !gradeLevelId || String(item.parentId) === String(gradeLevelId));
  function submit(event: React.FormEvent) {
    event.preventDefault(); setFormError(null);
    if (!activityName.trim() || !type.trim() || !activityDate || !startTime || !endTime || !gradeLevelId) { setFormError("Complete all required activity fields before saving."); return; }
    if (endTime <= startTime) { setFormError("End time must be later than start time."); return; }
    const payload: ActivityPayload = { activity_name: activityName.trim(), type: type.trim(), activity_date: activityDate, start_time: startTime.slice(0,5), end_time: endTime.slice(0,5), grade_level_id: Number(gradeLevelId), description: description.trim() };
    if (selectedClassRoomIds.length) payload.class_room_ids = selectedClassRoomIds.map(Number);
    const options = { onSuccess: () => onOpenChange(false) };
    if (isEditing && activityToEdit) updateActivity.mutate({ id: activityToEdit.id, payload }, options); else createActivity.mutate(payload, options);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[88vh] overflow-y-auto rounded-[22px] border border-border/70 bg-card p-0 shadow-[0_24px_70px_rgba(27,19,66,0.18)] sm:max-w-2xl"><div className="p-5 sm:p-6">
      <DialogHeader className="text-start"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[15px] bg-info/[0.09] text-info"><Sparkles className="h-5 w-5" /></div><DialogTitle className="text-[18px] font-semibold tracking-[-0.02em]">{isEditing ? "Edit activity" : "New school activity"}</DialogTitle><DialogDescription className="pt-1 text-[12.5px] leading-5">Define the event, schedule, grade, and participating classrooms in one clear form.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Activity name"><input value={activityName} onChange={(e)=>setActivityName(e.target.value)} placeholder="Science fair" className="field" /></Field><Field label="Activity type"><input value={type} onChange={(e)=>setType(e.target.value)} placeholder="Academic, sports, cultural..." className="field" /></Field></div>
        <div className="grid gap-4 sm:grid-cols-3"><Field label="Activity date" icon={<CalendarDays className="h-3.5 w-3.5" />}><input type="date" value={activityDate} onChange={(e)=>setActivityDate(e.target.value)} className="field" /></Field><Field label="Start time" icon={<Clock3 className="h-3.5 w-3.5" />}><input type="time" value={startTime} onChange={(e)=>setStartTime(e.target.value)} className="field" /></Field><Field label="End time" icon={<Clock3 className="h-3.5 w-3.5" />}><input type="time" value={endTime} onChange={(e)=>setEndTime(e.target.value)} className="field" /></Field></div>
        <div className="space-y-4 rounded-[16px] border border-info/[0.12] bg-info/[0.025] p-4"><Field label="Grade"><select value={gradeLevelId} onChange={(e)=>{setGradeLevelId(e.target.value);setSelectedClassRoomIds([])}} className="field"><option value="">Select grade</option>{gradeLevels.map((grade)=><option key={grade.id} value={grade.id}>{grade.name}</option>)}</select></Field><MultiSelectAudience label="Participating classrooms (optional)" placeholder="Search classrooms" options={filteredClassRooms} selectedIds={selectedClassRoomIds} onChange={setSelectedClassRoomIds} /></div>
        <Field label="Activity notes"><textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Add instructions, location, or preparation notes." className="min-h-[120px] w-full resize-none rounded-[14px] border border-input bg-background p-3 text-[12px] leading-5 outline-none focus:ring-4 focus:ring-primary/[0.07]" /></Field>
        {formError ? <p className="rounded-[10px] bg-destructive/[0.07] px-3 py-2 text-[11px] text-destructive">{formError}</p> : null}
        <div className="flex justify-end gap-2.5 border-t border-border/50 pt-4"><Button type="button" variant="outline" onClick={()=>onOpenChange(false)} disabled={isPending} className="h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px]">Cancel</Button><Button type="submit" disabled={isPending} className="h-10 rounded-[12px] px-4 text-[12px]">{isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{isEditing ? "Save changes" : "Create activity"}</Button></div>
      </form>
      <style>{`.field{height:44px;width:100%;border-radius:12px;border:1px solid hsl(var(--input));background:hsl(var(--background));padding:0 12px;font-size:12px;outline:none}.field:focus{box-shadow:0 0 0 4px hsl(var(--primary)/.07)}`}</style>
    </div></DialogContent></Dialog>
  );
}

function Field({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) { return <div className="space-y-1.5"><label className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">{icon}{label}</label>{children}</div>; }
