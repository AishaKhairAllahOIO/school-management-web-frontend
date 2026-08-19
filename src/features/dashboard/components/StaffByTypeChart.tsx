import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StaffTypeData {
  type: string;
  label: string;
  count: number;
}

interface StaffByTypeChartProps {
  data: StaffTypeData[];
}

const COLORS = [
  "#B9A7E8",
  "#91B7E8",
  "#7CC9A5",
  "#F2C978",
  "#F29AA3",
];

const STAFF_TYPES: Record<
  string,
  {
    label: string;
    singular: string;
  }
> = {
  teacher: {
    label: "Teachers",
    singular: "teacher",
  },

  supervisor: {
    label: "Supervisors",
    singular: "supervisor",
  },

  adviser: {
    label: "Supervisors",
    singular: "supervisor",
  },

  secretary: {
    label: "Secretaries",
    singular: "secretary",
  },

  counselor: {
    label: "Counselors",
    singular: "counselor",
  },

  service_staff: {
    label: "Service Staff",
    singular: "service staff",
  },

  employee: {
    label: "Service Staff",
    singular: "service staff",
  },
};

/**
 * Normalize the staff type coming from the API.
 * The UI never uses the original Arabic label.
 */
function normalizeStaffType(item: StaffTypeData): string {
  const type = String(item.type ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const label = String(item.label ?? "")
    .trim()
    .toLowerCase();

  // Teachers
  if (
    type === "teacher" ||
    type === "teachers" ||
    label.includes("معلم") ||
    label.includes("مدرس")
  ) {
    return "teacher";
  }

  // Supervisors / Advisers
  if (
    type === "supervisor" ||
    type === "supervisors" ||
    type === "adviser" ||
    type === "advisers" ||
    type === "advisor" ||
    type === "advisors" ||
    label.includes("موجه") ||
    label.includes("موجّه")
  ) {
    return "supervisor";
  }

  // Secretaries
  if (
    type === "secretary" ||
    type === "secretaries" ||
    label.includes("سكرت")
  ) {
    return "secretary";
  }

  // Counselors
  if (
    type === "counselor" ||
    type === "counsellor" ||
    type === "counselors" ||
    type === "counsellors" ||
    label.includes("مرشد نفسي") ||
    label.includes("المرشد النفسي")
  ) {
    return "counselor";
  }

  // Service Staff
  if (
    type === "service_staff" ||
    type === "service_staffs" ||
    type === "service" ||
    type === "employee" ||
    type === "employees" ||
    label.includes("موظفو الخدمات") ||
    label.includes("موظف الخدمات") ||
    label.includes("الخدمات")
  ) {
    return "service_staff";
  }

  return "service_staff";
}

function getStaffDisplayName(type: string) {
  return STAFF_TYPES[type]?.label ?? "Service Staff";
}

function getStaffSingularName(type: string) {
  return STAFF_TYPES[type]?.singular ?? "service staff";
}

function formatStaffCount(type: string, count: number) {
  const name = getStaffSingularName(type);

  return `${count.toLocaleString()} ${
    count === 1 ? name : `${name}s`
  }`;
}

export function StaffByTypeChart({
  data,
}: StaffByTypeChartProps) {
  /**
   * Convert the API data into a UI-safe dataset.
   * The original `label` is never displayed.
   */
  const chartData = data.map((item) => {
    const normalizedType = normalizeStaffType(item);

    return {
      type: normalizedType,
      name: getStaffDisplayName(normalizedType),
      count: item.count,
    };
  });

  return (
    <div className="group rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[0_8px_30px_rgba(148,163,184,0.07)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(148,163,184,0.12)]">
      <div className="mb-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Workforce Overview
        </p>

        <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
          Staff by Type
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 10,
              left: 5,
              bottom: 5,
            }}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 11,
              }}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={110}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 11,
              }}
            />

            <Tooltip
              cursor={{
                fill: "rgba(148,163,184,0.04)",
              }}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.98)",
                border: "1px solid rgba(226,232,240,0.8)",
                borderRadius: "10px",
                padding: "7px 10px",
                boxShadow:
                  "0 6px 18px rgba(15,23,42,0.08)",
                fontSize: "11px",
              }}
              labelStyle={{
                fontSize: "11px",
                fontWeight: 500,
                marginBottom: "2px",
              }}
              itemStyle={{
                fontSize: "11px",
                padding: 0,
              }}
              formatter={(value, _name, props) => {
                const type =
                  props?.payload?.type ?? "service_staff";

                return [
                  formatStaffCount(
                    String(type),
                    Number(value),
                  ),
                  "Count",
                ];
              }}
              labelFormatter={(value) => String(value)}
            />

            <Bar
              dataKey="count"
              radius={[0, 10, 10, 0]}
              barSize={24}
            >
              {chartData.map((item, index) => (
                <Cell
                  key={`${item.type}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}