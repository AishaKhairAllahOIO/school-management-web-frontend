import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Props {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const LeaveStats = ({
  total,
  pending,
  approved,
  rejected,
}: Props) => {
  const cards = [
    {
      title: "Total Requests",
      value: total,
      icon: CalendarDays,
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      color: "text-yellow-600",
    },
    {
      title: "Approved",
      value: approved,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div
      className="
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className="
            soft-card
            rounded-3xl
            p-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div>
              <p className="text-sm text-muted-foreground">
                {card.title}
              </p>

              <h3
                className={`
                  mt-2
                  text-3xl
                  font-bold
                  ${card.color ?? ""}
                `}
              >
                {card.value}
              </h3>
            </div>

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                text-primary
              "
            >
              <card.icon size={22} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};