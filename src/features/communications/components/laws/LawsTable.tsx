
import {
  BookOpen,
  Edit2,
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
        icon={BookOpen}
        title="No laws found"
        description="There are no school laws to display."
      />
    );
  }

  return (
    <>
{/* Desktop / Tablet */} <div className="hidden w-full md:block"> <Table className="w-full"> <TableHeader> <TableRow className="border-border/45 hover:bg-transparent"> <TableHead className="px-5 py-4"> Law </TableHead> <TableHead className="px-5 py-4"> Official description </TableHead> <TableHead className="w-[180px] px-5 py-4 text-right"> Actions </TableHead> </TableRow> </TableHeader> <TableBody> {laws.map((law) => ( <TableRow key={law.id} className="border-border/45 hover:bg-muted/[0.14]" > {/* Law */} <TableCell className="w-[28%] px-5 py-4 align-top"> <div className="flex items-start gap-3"> <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-success/[0.09] text-success"> <BookOpen className="h-4 w-4" strokeWidth={1.8} /> </span> <span className="pt-1.5 text-[13px] font-medium leading-5 text-foreground break-words" dir="auto" > {law.title} </span> </div> </TableCell> {/* Description */} <TableCell className="px-5 py-4 align-top"> <p className="whitespace-normal break-words text-[12px] leading-[19px] text-muted-foreground" dir="auto" > {law.description || "No additional details were provided for this law."} </p> </TableCell> {/* Actions */} <TableCell className="w-[180px] px-5 py-4 align-top"> <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"> <Button type="button" variant="outline" size="sm" onClick={() => onEdit(law)} className="h-9 shrink-0 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-success hover:bg-success/[0.08] hover:text-success" > <Edit2 className="h-3.5 w-3.5" /> Edit </Button> <Button type="button" variant="outline" size="sm" onClick={() => onDelete(law)} className="h-9 shrink-0 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-destructive hover:bg-destructive/[0.06] hover:text-destructive" > <Trash2 className="h-3.5 w-3.5" /> Delete </Button> </div> </TableCell> </TableRow> ))} </TableBody> </Table> </div>
      {/* Mobile */}
      <div className="grid gap-3 md:hidden">
        {laws.map((law) => (
          <div
            key={law.id}
            className="rounded-[16px] border border-border/45 bg-background p-4 shadow-sm"
          >
            {/* Law title */}
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-success/[0.09] text-success">
                <BookOpen
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className="text-[13px] font-medium leading-5 text-foreground"
                  dir="auto"
                >
                  {law.title}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-3 rounded-[12px] bg-muted/[0.18] px-3 py-2.5">
              <p
                className="text-[12px] leading-[19px] text-muted-foreground"
                dir="auto"
              >
                {law.description ||
                  "No additional details were provided for this law."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(law)}
                className="h-9 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-success hover:bg-success/[0.08] hover:text-success"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDelete(law)}
                className="h-9 rounded-[11px] border-border/65 bg-transparent px-3 text-[11px] font-medium text-destructive hover:bg-destructive/[0.06] hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
