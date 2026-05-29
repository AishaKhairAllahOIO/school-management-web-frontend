import {
  MoreHorizontal,
  Pencil,
  Trash2,
  School2,
} from "lucide-react";

import type { ClassItem } from "../types/class.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from  "@/shared/ui/dropdown-menu";

import { Button } from "@/shared/ui/button";

import { Badge } from  "@/shared/ui/badge";

interface Props {
  data: ClassItem[];
}

export const ClassesTable = ({
  data,
}: Props) => {
  if (!data.length) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-3xl
          border
          border-dashed
          border-border
          bg-card
          py-20
          text-center
        "
      >
        <div
          className="
            mb-4
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-primary/10
          "
        >
          <School2 className="h-8 w-8 text-primary" />
        </div>

        <h3
          className="
            text-xl
            font-semibold
            text-foreground
          "
        >
          No classes found
        </h3>

        <p
          className="
            mt-2
            max-w-sm
            text-sm
            text-muted-foreground
          "
        >
          Start by creating your first class
          for the school.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-border/60
        bg-card
        shadow-soft
      "
    >
      <Table>
        <TableHeader>
          <TableRow
            className="
              bg-muted/40
              hover:bg-muted/40
            "
          >
            <TableHead>
              Class
            </TableHead>

            <TableHead>
              Level
            </TableHead>

            <TableHead>
              Sections
            </TableHead>

            <TableHead>
              Students
            </TableHead>

            <TableHead>
              Created At
            </TableHead>

            <TableHead
              className="
                w-[70px]
                text-right
              "
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className="
                transition-colors
                hover:bg-muted/30
              "
            >
              <TableCell>
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/10
                    "
                  >
                    <School2
                      className="
                        h-5
                        w-5
                        text-primary
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        font-semibold
                        text-foreground
                      "
                    >
                      {item.name}
                    </p>

                    <p
                      className="
                        text-xs
                        text-muted-foreground
                      "
                    >
                      Academic Class
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant="secondary"
                  className="
                    rounded-full
                    px-3
                  "
                >
                  {item.level}
                </Badge>
              </TableCell>

              <TableCell>
                <span
                  className="
                    font-medium
                  "
                >
                  {item.sectionsCount}
                </span>
              </TableCell>

              <TableCell>
                <span
                  className="
                    font-medium
                  "
                >
                  {item.studentsCount}
                </span>
              </TableCell>

              <TableCell
                className="
                  text-muted-foreground
                "
              >
                {item.createdAt}
              </TableCell>

              <TableCell
                className="
                  text-right
                "
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="
                        rounded-xl
                      "
                    >
                      <MoreHorizontal
                        className="
                          h-5
                          w-5
                        "
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="
                      w-44
                    "
                  >
                    <DropdownMenuItem>
                      <Pencil
                        className="
                          mr-2
                          h-4
                          w-4
                        "
                      />

                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="
                        text-red-500
                        focus:text-red-500
                      "
                    >
                      <Trash2
                        className="
                          mr-2
                          h-4
                          w-4
                        "
                      />

                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};