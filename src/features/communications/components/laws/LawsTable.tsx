import {
  BookOpen,
  Edit2,
  Scale,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import type {
  SchoolLaw,
} from "../../types/school-laws.types";
import {
  CommunicationEmpty,
} from "../shared/CommunicationState";

type Props = {
  laws: SchoolLaw[];
  onEdit: (law: SchoolLaw) => void;
  onDelete: (law: SchoolLaw) => void;
};

export function LawsTable({
  laws,
  onEdit,
  onDelete,
}: Props) {
  if (!laws.length) {
    return (
      <CommunicationEmpty
        icon={Scale}
        title="No school laws yet"
        description="Add the first official rule to build a clear and accessible school policy library."
        toneClassName="bg-success/[0.09] text-success"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-success/[0.13] bg-card shadow-[0_8px_26px_rgba(30,20,70,0.04)]">
      <Table>
        <TableHeader className="bg-muted/[0.18]">
          <TableRow className="border-b border-border/50 hover:bg-transparent">
            <TableHead className="h-11 px-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Law
            </TableHead>
            <TableHead className="h-11 px-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Official description
            </TableHead>
            <TableHead className="h-11 px-5 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {laws.map((law) => (
            <TableRow key={law.id} className="border-border/45 hover:bg-muted/[0.14]">
              <TableCell className="px-5 py-4 align-top">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-success/[0.09] text-success">
                    <BookOpen className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="pt-1.5 text-[13px] font-medium leading-5 text-foreground" dir="auto">
                    {law.title}
                  </span>
                </div>
              </TableCell>

              <TableCell className="max-w-3xl px-5 py-4 align-top">
                <p className="line-clamp-3 text-[12px] leading-[19px] text-muted-foreground" dir="auto">
                  {law.description || "No additional details were provided for this law."}
                </p>
              </TableCell>

              <TableCell className="px-5 py-4 align-top">
                <div className="flex items-center justify-end gap-1.5">
                  <Button type="button" variant="outline" size="sm" onClick={() => onEdit(law)} className="h-9 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-info hover:bg-info/[0.06] hover:text-info">
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => onDelete(law)} className="h-9 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-destructive hover:bg-destructive/[0.06] hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
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
