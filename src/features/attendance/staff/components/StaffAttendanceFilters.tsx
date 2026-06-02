
import { Input } from "@/shared/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  role: string;
  setRole: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;
}

export const AttendanceFilters = ({
  search,
  setSearch,
  role,
  setRole,
  status,
  setStatus,
}: Props) => {
  return (
    <div
  className="
    flex
    flex-wrap
    items-center
    gap-4
  "
>
  <div className="
     w-[320px]
     rounded-2xl
     border-border/60
     shadow-sm
  ">
    <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-muted-foreground
            z-10
          "
        />
    <Input
      placeholder="Search employee..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    className="
            h-12
            rounded-2xl
            border-border/60
            bg-background
            pl-11
            shadow-sm
          " />
  </div>

  <Select
    value={role}
    onValueChange={setRole}
  >
    <SelectTrigger className="
    w-[180px]
     py-5.5 
     rounded-2xl
     border-border/60
     shadow-sm
    ">
      <SelectValue />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">
        All Roles
      </SelectItem>

      <SelectItem value="Teacher">
        Teacher
      </SelectItem>

      <SelectItem value="Secretary">
        Secretary
      </SelectItem>

      <SelectItem value="Supervisor">
        Supervisor
      </SelectItem>
    </SelectContent>
  </Select>

  <Select
    value={status}
    onValueChange={setStatus}
  >
    <SelectTrigger className="
      w-[180px]
      py-5.5 
      rounded-2xl
      border-border/60
      shadow-sm
    ">
      <SelectValue />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">
        All Statuses
      </SelectItem>

      <SelectItem value="Present">
        Present
      </SelectItem>

      <SelectItem value="Late">
        Late
      </SelectItem>

      <SelectItem value="Absent">
        Absent
      </SelectItem>
    </SelectContent>
  </Select>
</div>
  );
};