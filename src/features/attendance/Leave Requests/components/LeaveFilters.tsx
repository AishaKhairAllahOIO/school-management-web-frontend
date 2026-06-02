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

  leaveType: string;
  setLeaveType: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;
}

export const LeaveFilters = ({
  search,
  setSearch,
  leaveType,
  setLeaveType,
  status,
  setStatus,
}: Props) => {
  return (
    <div
      className="
        grid
        gap-4
        lg:grid-cols-3
      "
    >
      {/* Search */}

      <div className="relative">
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
          "
        />
      </div>

      {/* Leave Type */}

      <Select
        value={leaveType}
        onValueChange={setLeaveType}
      >
        <SelectTrigger
          className="
            h-12
            py-5.5
            rounded-2xl
            border-border/60
            shadow-sm
          "
        >
          <SelectValue placeholder="Leave Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Types
          </SelectItem>

          <SelectItem value="Annual Leave">
            Annual Leave
          </SelectItem>

          <SelectItem value="Sick Leave">
            Sick Leave
          </SelectItem>

          <SelectItem value="Emergency Leave">
            Emergency Leave
          </SelectItem>

          <SelectItem value="Maternity Leave">
            Maternity Leave
          </SelectItem>

          <SelectItem value="Unpaid Leave">
            Unpaid Leave
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}

      <Select
        value={status}
        onValueChange={setStatus}
      >
        <SelectTrigger
          className="
            h-12
            py-5.5
            rounded-2xl
            border-border/60
            shadow-sm
          "
        >
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Statuses
          </SelectItem>

          <SelectItem value="Pending">
            Pending
          </SelectItem>

          <SelectItem value="Approved">
            Approved
          </SelectItem>

          <SelectItem value="Rejected">
            Rejected
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};