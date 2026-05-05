import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import "./salesCharts.css";

const lineData = [
  { day: "Mon", calls: 8, minutes: 22 },
  { day: "Tue", calls: 10, minutes: 28 },
  { day: "Wed", calls: 6, minutes: 18 },
  { day: "Thu", calls: 9, minutes: 26 },
  { day: "Fri", calls: 15, minutes: 32 },
  { day: "Sat", calls: 0, minutes: 0 },
  { day: "Sun", calls: 0, minutes: 0 },
];

const pieData = [
  { name: "Answered", value: 32 },
  { name: "Missed", value: 10 },
  { name: "Dropped", value: 6 },
];

const pieColors = ["#22c55e", "#ef4444", "#f59e0b"];

function SalesCharts() {
  return (
    <div className="charts-grid">

      {/* LINE GRAPH */}
      <div className="chart-card">
        <h3>Calls Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calls" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="chart-card">
        <h3>Daily Calls</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={lineData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calls" fill="#14b8a6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="chart-card">
        <h3>Call Status</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={pieColors[index]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LINE GRAPH – TALK TIME */}
      <div className="chart-card">
        <h3>Talk Time (mins)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="minutes" stroke="#9333ea" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default SalesCharts;
