import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Trash2, Edit2, Scale } from "lucide-react";
import type { SchoolLaw } from "../../types/school-laws.types";

type Props = {
  laws: SchoolLaw[];
  onEdit: (law: SchoolLaw) => void;
  onDelete: (id: string | number) => void;
};

export function LawsTable({ laws, onEdit, onDelete }: Props) {
  if (!laws.length) {
    return (
      <div className="soft-card flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Scale className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-foreground">لا توجد قوانين مسجلة</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          اضغط على "إضافة قانون جديد" للبدء في صياغة قوانين ولوائح المدرسة.
        </p>
      </div>
    );
  }

  return (
    <div className="soft-card overflow-hidden rounded-3xl border border-border bg-card">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="py-4 font-semibold text-muted-foreground w-1/4">عنوان القانون</TableHead>
            <TableHead className="py-4 font-semibold text-muted-foreground w-2/4">التفاصيل والوصف</TableHead>
            <TableHead className="py-4 font-semibold text-muted-foreground">تاريخ الإضافة</TableHead>
            <TableHead className="py-4 text-left font-semibold text-muted-foreground">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {laws.map((law) => (
            <TableRow key={law.id} className="transition-colors hover:bg-muted/30">
              <TableCell className="font-bold text-primary text-base align-top pt-4">
                {law.title}
              </TableCell>
              <TableCell className="text-sm font-medium text-muted-foreground align-top pt-4">
                {law.description || "—"}
              </TableCell>
              <TableCell className="text-sm font-medium text-foreground align-top pt-4">
                {law.createdAt ? new Date(law.createdAt).toLocaleDateString('ar-EG') : "—"}
              </TableCell>
              <TableCell className="text-left align-top pt-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 rounded-xl text-info transition-colors hover:bg-info/10 hover:text-info"
                    onClick={() => onEdit(law)}
                    title="تعديل القانون"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 rounded-xl text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      if (confirm("هل أنت متأكد من حذف هذا القانون؟")) {
                        onDelete(law.id);
                      }
                    }}
                    title="حذف القانون"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> 
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}