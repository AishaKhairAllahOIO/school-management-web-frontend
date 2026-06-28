import { Search } from "lucide-react";

import { Input } from "@/shared/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  role: string;
  setRole: (value: string) => void;
}

export const SalaryFilters = ({
  search,
  setSearch,
  role,
  setRole,
}: Props) => {
  return (
    <div
      className="
        grid
        gap-4
        md:grid-cols-2
      "
    >
      <div className="relative">
        <Search
          size={18}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <Input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search employee..."
          className="
            h-11
            rounded-2xl
            pl-10
          "
        />
      </div>

      <Select
        value={role}
        onValueChange={setRole}
      >
        <SelectTrigger
          className="
            h-11
            rounded-2xl
          "
        >
          <SelectValue placeholder="Role" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Roles
          </SelectItem>

          <SelectItem value="Teacher">
            Teacher
          </SelectItem>

          <SelectItem value="Supervisor">
            Supervisor
          </SelectItem>

          <SelectItem value="Secretary">
            Secretary
          </SelectItem>

          <SelectItem value="Service Staff">
            Service Staff
          </SelectItem>

          <SelectItem value="Counselor">
            Counselor
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};