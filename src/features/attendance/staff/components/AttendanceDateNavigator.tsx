import { Button } from "@/shared/ui/button";

interface Props {
  date: string;
  setDate: (value: string) => void;
}

export const AttendanceDateNavigator = ({
  date,
  setDate,
}: Props) => {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const yesterday =
    new Date(
      Date.now() - 86400000
    )
      .toISOString()
      .split("T")[0];

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-3
        mb-5
      "
    >
      <Button
        variant="outline"
        className="rounded-2xl"
        onClick={() =>
          setDate(today)
        }
      >
        Today
      </Button>

      <Button
        variant="outline"
        className="rounded-2xl"
        onClick={() =>
          setDate(yesterday)
        }
      >
        Yesterday
      </Button>

      <input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(e.target.value)
        }
        className="
          h-10
          rounded-2xl
          border
          border-border
          bg-background
          px-4
          shadow-sm
        "
      />
    </div>
  );
};