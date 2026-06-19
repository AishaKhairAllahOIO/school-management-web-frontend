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
  setSearch: (
    value: string
  ) => void;

  type: string;
  setType: (
    value: string
  ) => void;

  status: string;
  setStatus: (
    value: string
  ) => void;
}

export const DeductionFilters = ({
  search,
  setSearch,
  type,
  setType,
  status,
  setStatus,
}: Props) => {
  return (
    <div
      className="
        grid
        gap-4
        md:grid-cols-3
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
            setSearch(
              e.target.value
            )
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
        value={type}
        onValueChange={
          setType
        }
      >
        <SelectTrigger
          className="
            h-11
            rounded-2xl
          "
        >
          <SelectValue placeholder="Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Types
          </SelectItem>

          <SelectItem value="Leave Deduction">
            Leave Deduction
          </SelectItem>

          <SelectItem value="Attendance Deduction">
            Attendance Deduction
          </SelectItem>

          <SelectItem value="Manual Deduction">
            Manual Deduction
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={
          setStatus
        }
      >
        <SelectTrigger
          className="
            h-11
            rounded-2xl
          "
        >
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Statuses
          </SelectItem>

          <SelectItem value="Applied">
            Applied
          </SelectItem>

          <SelectItem value="Pending">
            Pending
          </SelectItem>

          <SelectItem value="Cancelled">
            Cancelled
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};