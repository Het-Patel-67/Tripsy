import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#2563EB", "#06B6D4", "#10B981", "#7C3AED"];
const data = [
  { name: "Hotel", value: 3000 },
  { name: "Food", value: 2200 },
  { name: "Transport", value: 1500 },
  { name: "Others", value: 700 }
];

export default function ExpenseChart() {
  return (
    <div className="flex items-center border border-white/30 rounded-md p-4 shadow-md">
      <PieChart width={180} height={220}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={4}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <div className="flex flex-col ml-6">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center mb-3 space-x-2">
            <div style={{ width: 12, height: 12, background: COLORS[index], borderRadius: 2 }} />
            <div style={{ fontSize: 12, color: "#111827" }}>{entry.name}: {entry.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
