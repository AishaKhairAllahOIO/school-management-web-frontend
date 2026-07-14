 import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { Button } from "@/shared/ui/button";

import type {
  InstallmentPolicy,
} from "../../types/installmentPolicy.types";

type Props = {
  policies: InstallmentPolicy[];

  onEdit: (
    policy: InstallmentPolicy
  ) => void;

  onDelete: (
    policy: InstallmentPolicy
  ) => void;
};

export function InstallmentPoliciesTable({
  policies,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table>

      <TableHeader>

        <TableRow>

          <TableHead>Name</TableHead>

          <TableHead>
            Installments
          </TableHead>

          <TableHead>
            Created
          </TableHead>

          <TableHead className="w-44">
            Actions
          </TableHead>

        </TableRow>

      </TableHeader>

      <TableBody>

        {policies.length === 0 && (

          <TableRow>

            <TableCell
              colSpan={4}
              className="text-center py-8"
            >
              No Policies Found
            </TableCell>

          </TableRow>

        )}

        {policies.map((policy) => (

          <TableRow key={policy.id}>

            <TableCell>

              {policy.name}

            </TableCell>

            <TableCell>

              {policy.items.length}

            </TableCell>

            <TableCell>

              {new Date(
                policy.createdAt
              ).toLocaleDateString()}

            </TableCell>

            <TableCell className="flex gap-2">

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onEdit(policy)
                }
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  onDelete(policy)
                }
              >
                Delete
              </Button>

            </TableCell>

          </TableRow>

        ))}

      </TableBody>

    </Table>
  );
}