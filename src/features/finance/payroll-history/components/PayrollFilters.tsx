import { Search }
from "lucide-react";

import { Input }
from "@/shared/ui/input";

interface Props {
  search: string;

  setSearch: (
    value: string
  ) => void;
}

export const PayrollFilters = ({
  search,
  setSearch,
}: Props) => {
  return (
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
        placeholder="Search payroll..."
        className="
          h-11
          rounded-2xl
          pl-10
        "
      />

    </div>
  );
};