import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = {
  food: "#F59E0B",
  transport: "#06B6D4",
  hotel: "#10B981",
  activity: "#7C3AED",
  shopping: "#EC4899",
  other: "#78716C",
};

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function ExpenseChart({ data = [], total = 0 }) {
  if (!data.length) {
    return (
      <div className="flex h-55 items-center justify-center text-sm text-stone-400">
        No expense data available.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row">
      
      {/* Pie Chart */}
      <div className="relative">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[entry.name] || "#78716C"}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [fmt(value), "Spent"]}
          />
        </PieChart>

        {/* Center total */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] uppercase tracking-widest text-stone-400">
            Total
          </span>

          <span className="font-playfair text-xl font-bold text-[#1C1917]">
            {fmt(total)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3">
        {data.map((entry) => {
          const percentage = total
            ? ((entry.value / total) * 100).toFixed(1)
            : 0;

          return (
            <div
              key={entry.name}
              className="flex items-center gap-3"
            >
              <div
                className="h-3 w-3 rounded-sm"
                style={{
                  background: COLORS[entry.name] || "#78716C",
                }}
              />

              <div className="flex flex-col">
                <span className="text-sm font-semibold capitalize text-[#1C1917]">
                  {entry.name}
                </span>

                <span className="text-xs text-stone-400">
                  {fmt(entry.value)} • {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}