import "./callStats.css";

function CallStats() {
  return (
    <div className="stats-container">
      <div className="stats-row">

        <div className="stat-card teal">
          <p className="stat-title">Total Calls</p>
          <h2 className="stat-value">48</h2>
          <span className="stat-sub">Today</span>
        </div>

        <div className="stat-card purple">
          <p className="stat-title">Total Minutes</p>
          <h2 className="stat-value">126</h2>
          <span className="stat-sub">Talk time today</span>
        </div>

        <div className="stat-card blue">
          <p className="stat-title">Avg Call Duration</p>
          <h2 className="stat-value">2.6 min</h2>
          <span className="stat-sub">Per call</span>
        </div>

        <div className="stat-card yellow">
          <p className="stat-title">Unique Callers</p>
          <h2 className="stat-value">31</h2>
          <span className="stat-sub">Distinct numbers</span>
        </div>

        <div className="stat-card brown">
          <p className="stat-title">New Callers</p>
          <h2 className="stat-value">12</h2>
          <span className="stat-sub">First-time callers</span>
        </div>

      </div>
    </div>
  );
}

export default CallStats;
