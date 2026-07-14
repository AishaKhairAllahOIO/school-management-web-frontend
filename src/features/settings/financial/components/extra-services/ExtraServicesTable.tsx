 import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { Button } from "@/shared/ui/button";
import { PencilLine, Trash2 } from "lucide-react";

import type { FeePlanExtraService } from "../../types/feePlan.types";

type Props = {
  services: FeePlanExtraService[];
  onEdit: (service: FeePlanExtraService) => void;
  onDelete: (service: FeePlanExtraService) => void;
};

export function ExtraServicesTable({ services, onEdit, onDelete }: Props) {
  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">No Extra Services Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add optional school services like uniforms, books, or activities.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-foreground">Name</TableHead>
            <TableHead className="text-foreground">Type</TableHead>
            <TableHead className="text-foreground">Amount</TableHead>
            <TableHead className="w-[190px] text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id} className="h-14 hover:bg-muted/30">
              <TableCell className="font-medium text-foreground">{service.name}</TableCell>
              <TableCell>{service.type}</TableCell>
              <TableCell>{service.amount.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(service)} className="h-9 rounded-xl border-border/70 bg-white hover:bg-muted">
                    <PencilLine className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(service)} className="h-9 rounded-xl border border-red-200/80 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
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