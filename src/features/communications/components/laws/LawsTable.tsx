import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Trash2, Edit2, Scale, BookOpen } from "lucide-react";
import type { SchoolLaw } from "../../types/school-laws.types";

type Props = {
  laws: SchoolLaw[];
  onEdit: (law: SchoolLaw) => void;
  onDelete: (id: string | number) => void;
};

export function LawsTable({ laws, onEdit, onDelete }: Props) {
  if (!laws.length) {
    return (
      <div className="soft-card flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 p-16 text-center bg-muted/10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
          <Scale className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No Laws Found</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Click on "Add New Law" to start creating rules and regulations for your school.
        </p>
      </div>
    );
  }

  return (
    <div className="soft-card overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-b border-border/50 hover:bg-transparent">
            <TableHead className="py-4 px-6 font-bold text-muted-foreground text-xs uppercase tracking-wider w-[35%] text-left">
              Law Title
            </TableHead>
            <TableHead className="py-4 px-6 font-bold text-muted-foreground text-xs uppercase tracking-wider w-[50%] text-left">
              Description & Details
            </TableHead>
            <TableHead className="py-4 px-6 font-bold text-muted-foreground text-xs uppercase tracking-wider w-[15%] text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/50">
          {laws.map((law) => (
            <TableRow 
              key={law.id} 
              className="transition-all duration-200 hover:bg-muted/30 group"
            >
              <TableCell className="align-top py-5 px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  {/* dir="auto" يجعل النص العربي يظهر بشكل سليم داخل بيئة إنجليزية */}
                  <span className="font-bold text-foreground text-sm leading-relaxed block mt-1" dir="auto">
                    {law.title}
                  </span>
                </div>
              </TableCell>
              
              <TableCell className="align-top py-5 px-6">
                <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl" dir="auto">
                  {law.description || "No additional details provided."}
                </p>
              </TableCell>
              
              <TableCell className="align-top py-5 px-6">
                {/* الأزرار تظهر فقط عند عمل Hover على السطر (نظافة بصرية) */}
                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-lg text-info hover:text-info hover:bg-info/10 hover:border-info/30 border-border/60 bg-card transition-all shadow-sm"
                    onClick={() => onEdit(law)}
                  >
                    <Edit2 className="h-4 w-4 mr-1.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 border-border/60 bg-card transition-all shadow-sm"
                    onClick={() => onDelete(law.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" /> Delete
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