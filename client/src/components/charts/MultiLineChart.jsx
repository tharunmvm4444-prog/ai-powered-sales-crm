import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

import "./MultiLineChart.css";

/* Dummy data with overlapping trends */
const data = [
  { day: "Mon", answered: 120, missed: 60, followUp: 45, converted: 38, dropped: 30 },
  { day: "Tue", answered: 180, missed: 90, followUp: 70, converted: 62, dropped: 50 },
  { day: "Wed", answered: 150, missed: 75, followUp: 65, converted: 55, dropped: 45 },
  { day: "Thu", answered: 230, missed: 110, followUp: 95, converted: 85, dropped: 70 },
  { day: "Fri", answered: 210, missed: 100, followUp: 85, converted: 78, dropped: 65 },
  { day: "Sat", answered: 260, missed: 130, followUp: 110, converted: 98, dropped: 82 },
  { day: "Sun", answered: 240, missed: 120, followUp: 100, converted: 90, dropped: 75 }
];

export const PieChart = () => {
  return (
    <div className="multiline-chart">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
  data={data}
  margin={{
    top: 10,
    right: 20,
    left: -8,   // 🔧 was -20 → soften it
    bottom: 0
  }}
>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" />
          <YAxis width={48} /> {/* tighter Y axis */}
          <Tooltip />
          <Legend />

          {/* Answered */}
          <Line
            type="monotone"
            dataKey="answered"
            stroke="#60a5fa"   // soft blue
            strokeWidth={3}
            dot={false}
          />

          {/* Missed */}
          <Line
            type="monotone"
            dataKey="missed"
            stroke="#fbbf24"   // subtle amber
            strokeWidth={3}
            dot={false}
          />

          {/* Follow Up */}
          <Line
            type="monotone"
            dataKey="followUp"
            stroke="#34d399"   // calm green
            strokeWidth={3}
            dot={false}
          />

          {/* Converted */}
          <Line
            type="monotone"
            dataKey="converted"
            stroke="#a78bfa"   // soft violet
            strokeWidth={3}
            dot={false}
          />

          {/* Dropped */}
          <Line
            type="monotone"
            dataKey="dropped"
            stroke="#94a3b8"   // muted slate
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
