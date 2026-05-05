import Sidebar from "./sidebarsales";
import SalesHeader from "./salesHeader";
import SalesCharts from "./SalesCharts";

import "./salesDashboard.css";
import CallStats from "./CallStats";

function SalesDashboard() {
  return (
    <div className="sales-layout">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT AREA */}
      <div className="sales-content">
        {/* HEADER */}
        <SalesHeader />

        {/* PAGE BODY */}
        <div className="page-body">
          <CallStats />
          <SalesCharts />
        </div>

      </div>
    </div>
  );
}

export default SalesDashboard;
