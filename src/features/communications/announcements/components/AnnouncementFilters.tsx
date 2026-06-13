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

  target: string;
  setTarget: (
    value: string
  ) => void;

  priority: string;
  setPriority: (
    value: string
  ) => void;
}

export const AnnouncementFilters = ({
  search,
  setSearch,
  target,
  setTarget,
  priority,
  setPriority,
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
          placeholder="Search announcement..."
          className="
            h-11
            rounded-2xl
            pl-10
          "
        />
      </div>

      <Select
        value={target}
        onValueChange={
          setTarget
        }
      >
        <SelectTrigger
          className="
            h-11
            rounded-2xl
          "
        >
          <SelectValue placeholder="Target" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Targets
          </SelectItem>

          <SelectItem value="All Students">
            All Students
          </SelectItem>

          <SelectItem value="All Parents">
            All Parents
          </SelectItem>

          <SelectItem value="All Staff">
            All Staff
          </SelectItem>

          <SelectItem value="Grade 10">
            Grade 10
          </SelectItem>

          <SelectItem value="Grade 11">
            Grade 11
          </SelectItem>

          <SelectItem value="Grade 12">
            Grade 12
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={priority}
        onValueChange={
          setPriority
        }
      >
        <SelectTrigger
          className="
            h-11
            rounded-2xl
          "
        >
          <SelectValue placeholder="Priority" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Priorities
          </SelectItem>

          <SelectItem value="Low">
            Low
          </SelectItem>

          <SelectItem value="Medium">
            Medium
          </SelectItem>

          <SelectItem value="High">
            High
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};