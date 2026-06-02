interface Props {
  total: number;
  present: number;
  absent: number;
  excused: number;
  unexcused: number;
}

export const AttendanceStats = ({
  total,
  present,
  absent,
  excused,
  unexcused,
}: Props) => {
  return (
    <div
      className="
        grid
        gap-4
        md:grid-cols-2
        xl:grid-cols-5
      "
    >
      <StatCard
        title="Total Staff"
        value={total}
      />

      <StatCard
        title="Present"
        value={present}
        valueClass="text-green-600"
      />

      <StatCard
        title="Absent"
        value={absent}
        valueClass="text-red-500"
      />

      <StatCard
        title="Excused"
        value={excused}
        valueClass="text-blue-600"
      />

      <StatCard
        title="Unexcused"
        value={unexcused}
        valueClass="text-orange-500"
      />
    </div>
  );
};

type CardProps = {
  title: string;
  value: number;
  valueClass?: string;
};

const StatCard = ({
  title,
  value,
  valueClass = "",
}: CardProps) => {
  return (
    <div
      className="
        soft-card
        rounded-3xl
        p-5
      "
    >
      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        {title}
      </p>

      <h3
        className={`
          mt-2
          text-3xl
          font-bold
          ${valueClass}
        `}
      >
        {value}
      </h3>
    </div>
  );
};