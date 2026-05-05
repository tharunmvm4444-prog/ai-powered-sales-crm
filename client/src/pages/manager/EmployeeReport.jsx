import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

import "./EmployeeReport.css";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

const salespersons = ["All", "Rahul", "Sneha", "Vikram", "Kavya"];

// Data for each salesperson matching the previous hardcoded values
// colors: Rahul(blue), Sneha(green), Vikram(red), Kavya(purple)
const salesData = {
  Rahul: {
    color: "#2563eb",
    overall: [60, 70, 65, 80],
    monthwise: [60, 68, 72, 78, 75],
    leads: [15, 10, 5], // Converted, Pending, Lost
    calls: [10, 15, 8, 12, 10, 18, 20]
  },
  Sneha: {
    color: "#16a34a",
    overall: [70, 75, 78, 85],
    monthwise: [70, 75, 73, 80, 85],
    leads: [20, 8, 2],
    calls: [12, 16, 10, 18, 14, 20, 22]
  },
  Vikram: {
    color: "#dc2626",
    overall: [55, 60, 58, 65],
    monthwise: [55, 60, 65, 70, 72],
    leads: [10, 7, 5],
    calls: [8, 10, 8, 12, 10, 12, 15]
  },
  Kavya: {
    color: "#9333ea",
    overall: [65, 72, 75, 82],
    monthwise: [65, 70, 74, 78, 82],
    leads: [10, 5, 3],
    calls: [12, 14, 12, 20, 16, 18, 18]
  }
};

// Default aggregate data for "All" view
const aggregateLeads = [55, 30, 15];
const aggregateCalls = [42, 55, 38, 62, 50, 68, 75];

function EmployeeReport() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedSalesperson, setSelectedSalesperson] = useState("All");

  // --- Helper to get datasets for Overall/Monthwise charts ---
  // If 'All', return array of all salesperson objects.
  // If specific, return array of just that one.
  const getMultiPersonDatasets = (type) => {
    // type is 'overall' or 'monthwise'
    const peopleToShow =
      selectedSalesperson === "All"
        ? ["Rahul", "Sneha", "Vikram", "Kavya"]
        : [selectedSalesperson];

    return peopleToShow.map((person) => ({
      label: person,
      data: salesData[person][type],
      borderColor: salesData[person].color,
      backgroundColor: salesData[person].color, // for bar chart
      tension: 0.4
    }));
  };

  // --- Helper for Lead Distribution (Pie) ---
  const getLeadData = () => {
    if (selectedSalesperson === "All") return aggregateLeads;
    return salesData[selectedSalesperson].leads;
  };

  // --- Helper for Call Trend (Line) ---
  const getCallData = () => {
    if (selectedSalesperson === "All") return aggregateCalls;
    return salesData[selectedSalesperson].calls;
  };

  const getCallColor = () => {
    if (selectedSalesperson === "All") return "#f97316"; // Orange default
    return salesData[selectedSalesperson].color;
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        {/* ===== FILTER BAR ===== */}
        <div className="employee-filters">
          {/* MONTH CALENDAR */}
          <div className="calendar-box">
            <label>Select Month</label>
            <input type="month" value={currentMonth} readOnly />
          </div>

          {/* SALESPERSON DROPDOWN */}
          <div className="salesperson-box">
            <label>Salesperson</label>
            <select
              value={selectedSalesperson}
              onChange={(e) => setSelectedSalesperson(e.target.value)}
            >
              {salespersons.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ===== GRAPH GRID ===== */}
        <div className="employee-graph-grid">
          {/* Line Graph – Overall Performance */}
          <div className="graph-card">
            <h3 aria-label="Overall Performance">Overall Performance</h3>
            <Line
              key={`overall-${selectedSalesperson}`}
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: getMultiPersonDatasets("overall")
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" }
                },
                scales: {
                  x: { title: { display: true, text: "Weeks" } },
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: "Performance Score" }
                  }
                }
              }}
            />
          </div>

          {/* Bar Graph – Monthwise Productivity */}
          <div className="graph-card">
            <h3 aria-label="Monthwise Productivity Comparison">
              Monthwise Productivity Comparison
            </h3>
            <Line
              key={`monthwise-${selectedSalesperson}`}
              type="bar"
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                datasets: getMultiPersonDatasets("monthwise")
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" }
                },
                scales: {
                  x: { title: { display: true, text: "Months" } },
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: "Productivity Score" }
                  }
                }
              }}
            />
          </div>

          {/* Pie Chart – Lead Distribution */}
          <div className="graph-card">
            <h3 aria-label="Lead Distribution">Lead Distribution</h3>
            <div style={{ width: "260px", height: "260px", margin: "0 auto" }}>
              <Pie
                key={`leads-${selectedSalesperson}`}
                data={{
                  labels: ["Converted", "Pending", "Lost"],
                  datasets: [
                    {
                      data: getLeadData(),
                      backgroundColor: ["#4f46e5", "#22c55e", "#9ca3af"],
                      borderWidth: 2,
                      borderColor: "#ffffff"
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { boxWidth: 14, padding: 12 }
                    }
                  }
                }}
              />
            </div>
            <p className="pie-label">Converted vs Pending Leads</p>
          </div>

          {/* Line Chart – Call Trend */}
          <div className="graph-card">
            <h3 aria-label="Daily Call Trend">Daily Call Trend</h3>
            <div style={{ height: "260px" }}>
              <Line
                key={`calls-${selectedSalesperson}`}
                data={{
                  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  datasets: [
                    {
                      label: "Calls Handled",
                      data: getCallData(),
                      borderColor: getCallColor(),
                      backgroundColor: `${getCallColor()}26`, // ~15% opacity hex
                      tension: 0.4,
                      pointRadius: 4,
                      pointBackgroundColor: getCallColor(),
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true, position: "top" }
                  },
                  scales: {
                    x: { title: { display: true, text: "Days" } },
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Number of Calls" }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeReport;