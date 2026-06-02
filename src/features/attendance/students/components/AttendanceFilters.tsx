
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type Props = {
  classFilter: string;
  setClassFilter: (value: string) => void;

  sectionFilter: string;
  setSectionFilter: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  absenceType: string;
  setAbsenceType: (value: string) => void;
};

export const AttendanceFilters = ({
  classFilter,
  setClassFilter,
  sectionFilter,
  setSectionFilter,
  status,
  setStatus,
  absenceType,
  setAbsenceType,
}: Props) => {
  return (
    <div
      className="
        flex
        flex-wrap
        gap-3
      "
    >
     
      {/* CLASS */}

      <Select
        value={classFilter}
        onValueChange={
          setClassFilter
        }
      >
        <SelectTrigger className="
        w-[180px]
        py-5.5 
        rounded-2xl
        border-border/60
        shadow-sm
      ">
          <SelectValue placeholder="Class" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Classes
          </SelectItem>

          <SelectItem value="Grade 7">
            Grade 7
          </SelectItem>

          <SelectItem value="Grade 8">
            Grade 8
          </SelectItem>

          <SelectItem value="Grade 9">
            Grade 9
          </SelectItem>

        </SelectContent>
      </Select>

      {/* SECTION */}

      <Select
        value={sectionFilter}
        onValueChange={
          setSectionFilter
        }
      >
        <SelectTrigger className="
          w-[180px]
          py-5.5 
          rounded-2xl
          border-border/60
          shadow-sm
        ">
          <SelectValue placeholder="Section" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Sections
          </SelectItem>

          <SelectItem value="A">
            Section A
          </SelectItem>

          <SelectItem value="B">
            Section B
          </SelectItem>

          <SelectItem value="C">
            Section C
          </SelectItem>

          <SelectItem value="D">
            Section D
          </SelectItem>
        </SelectContent>
      </Select>

      {/* STATUS */}

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

          <SelectItem value="Absent">
            Absent
          </SelectItem>
        </SelectContent>
      </Select>

      {/* ABSENCE TYPE */}

      <Select
        value={absenceType}
        onValueChange={
          setAbsenceType
        }
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
            All Absences
          </SelectItem>

          <SelectItem value="Excused">
            Excused
          </SelectItem>

          <SelectItem value="Unexcused">
            Unexcused
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};