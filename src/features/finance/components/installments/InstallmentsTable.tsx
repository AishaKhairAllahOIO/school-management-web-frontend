import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { CalendarClock, Eye } from "lucide-react";
import type { Installment } from "../../types/finance.types";

type Props = {
  installments: Installment[];
  onView?: (id: string | number) => void;
};

function StatusBadge({ status, dueDate }: { status: string; dueDate: string }) {
  const overdue = new Date() > new Date(dueDate) && status !== "paid";
  const tone =
    status === "paid"
      ? "border-success/18 bg-success/[0.085] text-success"
      : overdue || status === "overdue"
        ? "border-destructive/18 bg-destructive/[0.075] text-destructive"
        : "border-info/18 bg-info/[0.08] text-info";
  const label = status === "paid" ? "Paid" : overdue || status === "overdue" ? "Overdue" : "Pending";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}>{label}</span>;
}

export function InstallmentsTable({ installments, onView }: Props) {
  if (!installments.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-border/55 bg-card px-6 py-14 text-center shadow-[0_10px_30px_rgba(31,22,73,0.035)]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-info/[0.08] text-info">
          <CalendarClock className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <h3 className="mt-4 text-[15px] font-semibold text-foreground/88">No installments found</h3>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground/78">Installments appear after a student contract is finalized.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.045)]">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 bg-muted/22 hover:bg-muted/22">
            {["Installment", "Amount due", "Paid", "Progress", "Due date", "Status"].map((label) => (
              <TableHead key={label} className="h-12 px-5 text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75">{label}</TableHead>
            ))}
            <TableHead className="h-12 w-20 px-5 text-right text-[11.5px] font-semibold uppercase tracking-[0.045em] text-muted-foreground/75">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {installments.map((item) => {
            const progress = item.amountDue
              ? Math.min(100, Math.round((item.amountPaid / item.amountDue) * 100))
              : 0;

            return (
              <TableRow key={item.id} className="border-border/30 transition-colors hover:bg-info/[0.018]">
                <TableCell className="px-5 py-4">
                  <p className="text-[13px] font-semibold text-foreground/88">{item.title}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground/65">Installment #{item.installmentNumber}</p>
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] font-semibold text-foreground/84">{item.amountDue?.toLocaleString()} $</TableCell>
                <TableCell className="px-5 py-4 text-[13px] font-semibold text-success">{item.amountPaid?.toLocaleString()} $</TableCell>
                <TableCell className="px-5 py-4">
                  <div className="w-28">
                    <div className="mb-1.5 flex items-center justify-between text-[10.5px] text-muted-foreground/70">
                      <span>Collected</span><span>{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
                      <div className="h-full rounded-full bg-info/75" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 text-[12.5px] text-foreground/76">{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="px-5 py-4"><StatusBadge status={item.status} dueDate={item.dueDate} /></TableCell>
                <TableCell className="px-5 py-4 text-right">
                  <button type="button" onClick={() => onView?.(item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.055] text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/[0.09]" aria-label="View installment">
                    <Eye className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
