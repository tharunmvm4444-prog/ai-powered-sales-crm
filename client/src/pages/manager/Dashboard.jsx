import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";

// Charts (unchanged)
import { PieChart } from "../../components/charts/MultiLineChart";
import { BarChart } from "../../components/charts/PieChart";
import { LineChart } from "../../components/charts/Linechart";

import "./Dashboard.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          "/api/dashboard?period=2024-09"
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setDashboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        {/* ===== LOADING / ERROR ===== */}
        {loading && <p>Loading dashboard...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && dashboard && (
          <>
            {/* ================= KPI CARDS ================= */}
            <div className="kpi-grid">
              <div className="kpi-card teal">
                <h4>Total Calls</h4>
                <p>{dashboard.totalCalls.value.toLocaleString()}</p>
                <span>
                  +{dashboard.totalCalls.changePercent}% from last period
                </span>
              </div>

              <div className="kpi-card purple">
                <h4>Total Minutes</h4>
                <p>{dashboard.totalMinutes.value.toLocaleString()}</p>
                <span>
                  +{dashboard.totalMinutes.changePercent}% from last period
                </span>
              </div>

              <div className="kpi-card blue">
                <h4>Avg Call Duration</h4>
                <p>{dashboard.avgCallDuration.value} min</p>
                <span>
                  +{dashboard.avgCallDuration.changePercent}% from last period
                </span>
              </div>

              <div className="kpi-card yellow">
                <h4>Unique Callers</h4>
                <p>{dashboard.uniqueCallers.value.toLocaleString()}</p>
                <span>
                  +{dashboard.uniqueCallers.changePercent}% from last period
                </span>
              </div>

              <div className="kpi-card brown">
                <h4>New Callers</h4>
                <p>{dashboard.newCallers.value.toLocaleString()}</p>
                <span>
                  {dashboard.newCallers.changePercent}% from last period
                </span>
              </div>
            </div>

            {/* ================= CHART SECTION ================= */}
            <div className="chart-layout">
              {/* Left Charts */}
              <div className="chart-left">
                <div className="chart-card">
                  <h3>Call Distribution</h3>
                  <PieChart />
                </div>

                <div className="chart-card">
                  <h3>Calls Trend</h3>
                  <LineChart />
                </div>
              </div>

              {/* Right Charts */}
              <div className="chart-right">
                <div className="chart-card">
                  <h3>Calls by Team</h3>
                  <BarChart />
                </div>

                <div className="stats-card">
                  <h4>Today Summary</h4>
                  <ul>
                    <li>
                      <span>Answered Calls</span>
                      <strong>312</strong>
                    </li>
                    <li>
                      <span>Missed Calls</span>
                      <strong>87</strong>
                    </li>
                    <li>
                      <span>Follow Ups</span>
                      <strong>45</strong>
                    </li>
                    <li>
                      <span>Conversions</span>
                      <strong>28</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
