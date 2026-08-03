import { LoaderCircle, Megaphone, School, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import type { Announcement, AnnouncementAudience } from "../../types/communication.types";
import { MultiSelectAudience, type OptionItem } from "../shared/MultiSelectAudience";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; gradeLevels: { id: string | number; name: string }[]; classRooms: OptionItem[]; announcementToEdit?: Announcement | null };

export function CreateAnnouncementDialog({ open, onOpenChange, gradeLevels = [], classRooms = [], announcementToEdit = null }: Props) {
  const { createAnnouncement, updateAnnouncement } = useAnnouncements();
  const isEditing = Boolean(announcementToEdit);
  const isPending = createAnnouncement.isPending || updateAnnouncement.isPending;
  const [audience, setAudience] = useState<AnnouncementAudience>("student");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState<string | number>("");
  const [selectedClassRoomIds, setSelectedClassRoomIds] = useState<(string | number)[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open && announcementToEdit) {
      setAudience(announcementToEdit.audience ?? "student");
      setTitle(announcementToEdit.title ?? "");
      setDescription(announcementToEdit.description ?? "");
      setGradeLevelId(announcementToEdit.grade_level_id ?? "");
      setSelectedClassRoomIds(announcementToEdit.class_room_ids ?? []);
      setFormError(null);
    } else if (!open) {
      setAudience("student"); setTitle(""); setDescription(""); setGradeLevelId(""); setSelectedClassRoomIds([]); setFormError(null);
    }
  }, [announcementToEdit, open]);

  const filteredClassRooms = classRooms.filter((item: any) => !gradeLevelId || String(item.parentId) === String(gradeLevelId));

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!title.trim() || !description.trim()) { setFormError("Title and announcement details are required."); return; }
    if (audience === "student" && !gradeLevelId) { setFormError("Select a grade for student announcements."); return; }

    const payload: any = { audience, title: title.trim(), description: description.trim() };
    if (audience === "student") {
      payload.grade_level_id = Number(gradeLevelId);
      if (selectedClassRoomIds.length) payload.class_room_ids = selectedClassRoomIds.map(Number);
    }

    const options = { onSuccess: () => onOpenChange(false) };
    if (isEditing && announcementToEdit) updateAnnouncement.mutate({ id: announcementToEdit.id, payload }, options);
    else createAnnouncement.mutate(payload, options);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-[22px] border border-border/70 bg-card p-0 shadow-[0_24px_70px_rgba(27,19,66,0.18)] sm:max-w-xl">
        <div className="p-5 sm:p-6">
          <DialogHeader className="text-start">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary"><Megaphone className="h-5 w-5" /></div>
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em]">{isEditing ? "Edit announcement" : "New announcement"}</DialogTitle>
            <DialogDescription className="pt-1 text-[12.5px] leading-5">Publish a focused message and choose exactly who should receive it.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {([ ["student", School, "Students"], ["staff", Users, "Staff"], ["both", Megaphone, "Both"] ] as const).map(([value, Icon, label]) => (
                <button key={value} type="button" onClick={() => { setAudience(value); if (value !== "student") { setGradeLevelId(""); setSelectedClassRoomIds([]); } }} className={["flex h-11 items-center justify-center gap-2 rounded-[12px] border text-[11px] font-medium transition", audience === value ? "border-primary/25 bg-primary/[0.07] text-primary" : "border-border/65 bg-background text-muted-foreground hover:bg-muted/30"].join(" ")}><Icon className="h-4 w-4" />{label}</button>
              ))}
            </div>

            <div className="space-y-1.5"><label className="text-[11px] font-medium">Announcement title</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: Parent meeting update" className="h-11 w-full rounded-[12px] border border-input bg-background px-3 text-[12px] outline-none focus:ring-4 focus:ring-primary/[0.07]" /></div>

            {audience === "student" ? (
              <div className="space-y-4 rounded-[16px] border border-info/[0.12] bg-info/[0.025] p-4">
                <div className="space-y-1.5"><label className="text-[11px] font-medium">Grade</label><select value={gradeLevelId} onChange={(e) => { setGradeLevelId(e.target.value); setSelectedClassRoomIds([]); }} className="h-11 w-full rounded-[12px] border border-input bg-background px-3 text-[12px]"><option value="">Select grade</option>{gradeLevels.map((grade) => <option key={grade.id} value={grade.id}>{grade.name}</option>)}</select></div>
                <MultiSelectAudience label="Classrooms (optional)" placeholder="Search classrooms" options={filteredClassRooms} selectedIds={selectedClassRoomIds} onChange={setSelectedClassRoomIds} />
              </div>
            ) : null}

            <div className="space-y-1.5"><label className="text-[11px] font-medium">Announcement details</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a clear and complete announcement." className="min-h-[135px] w-full resize-none rounded-[14px] border border-input bg-background p-3 text-[12px] leading-5 outline-none focus:ring-4 focus:ring-primary/[0.07]" /></div>
            {formError ? <p className="rounded-[10px] bg-destructive/[0.07] px-3 py-2 text-[11px] text-destructive">{formError}</p> : null}

            <div className="flex justify-end gap-2.5 border-t border-border/50 pt-4"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px]">Cancel</Button><Button type="submit" disabled={isPending} className="h-10 rounded-[12px] px-4 text-[12px]">{isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{isEditing ? "Save changes" : "Publish announcement"}</Button></div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
