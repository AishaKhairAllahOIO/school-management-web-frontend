
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
  <div className="w-[320px]">
    <Input
      placeholder="Search employee..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />
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