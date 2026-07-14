import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { Button } from "@/shared/ui/button";

import {
  PencilLine,
  Trash2,
} from "lucide-react";

import type { FeePlan } from "../../types/feePlan.types";

type Props = {
  feePlans: FeePlan[];

  onEdit: (plan: FeePlan) => void;

  onDelete: (plan: FeePlan) => void;
};

export function FeePlansTable({
  feePlans,
  onEdit,
  onDelete,
}: Props) {
  if (!feePlans.length)
  return (
  <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">

    <h3 className="text-lg font-semibold">
      No Fee Plans Yet
    </h3>

    <p className="mt-2 text-sm text-muted-foreground">
      Create your first fee plan to start configuring school finances.
    </p>

  </div>
);
  return (
    <div className="overflow-hidden rounded-2xl border shadow-sm">
      <Table>

        <TableHeader>

         <TableRow className="hover:bg-muted/30">
         
            <TableHead>Name</TableHead>

            <TableHead>
              Academic Year
            </TableHead>

            <TableHead>
              Grade
            </TableHead>

            <TableHead>
              Base Amount
            </TableHead>

            <TableHead>
              Extra Services
            </TableHead>

            <TableHead className="w-60">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {feePlans.map((plan) => (

            <TableRow key={plan.id}>

              <TableCell>
                {plan.name}
              </TableCell>

             <TableCell>
                {plan.academicYear?.name ?? "-"}
             </TableCell>

             <TableCell>
                {plan.gradeLevel?.name ?? "-"}
             </TableCell>

              <TableCell>
                {plan.baseAmount.toLocaleString()} $
              </TableCell>

              <TableCell>
               {plan.extraServices.length > 0 ? (
                 <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                   {plan.extraServices.length} Services
                 </span>
                  ) : (
                 <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                   No Services
                 </span>
                  )}
             </TableCell>             

              <TableCell>

                <div className="flex gap-2">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onEdit(plan)
                    }
                  >
                    <PencilLine className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() =>
                      onDelete(plan)
                    }
                  >
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