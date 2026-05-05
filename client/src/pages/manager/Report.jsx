import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import "./Report.css";

const salespersons = ["All", "Rahul", "Sneha", "Vikram", "Kavya"];

const reportsData = [
  {
    id: 1,
    name: "Arun Kumar",
    phone: "9876543210",
    email: "arun@mail.com",
    enquiry: "Product Demo",
    duration: "4m 20s",
    description: "Interested in premium plan",
    aiFeedback: "High intent, follow up recommended",
    sentiment: "positive",
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "9123456780",
    email: "priya@mail.com",
    enquiry: "Pricing Details",
    duration: "2m 10s",
    description: "Asked about discounts",
    aiFeedback: "Moderate intent, send email",
    sentiment: "positive",
  },
  {
    id: 3,
    name: "Rohit Singh",
    phone: "9988776655",
    email: "rohit@mail.com",
    enquiry: "Support Issue",
    duration: "1m 30s",
    description: "Not interested currently",
    aiFeedback: "Low intent, avoid follow-up",
    sentiment: "negative",
  },
];

function Reports() {
  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        {/* ===== FILTER BAR ===== */}
        <div className="report-filters">
          <div className="calendar-box">
            <label>Select Date</label>
            <input type="date" />
          </div>

          <div className="salesperson-box">
            <label>Salesperson</label>
            <select>
              {salespersons.map((sp) => (
                <option key={sp}>{sp}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ===== REPORT TABLE ===== */}
        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Product Enquiry</th>
                <th>Call Duration</th>
                <th>Call Description</th>
                <th>AI Feedback</th>
                <th>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.phone}</td>
                  <td>{row.email}</td>
                  <td>{row.enquiry}</td>
                  <td>{row.duration}</td>
                  <td>{row.description}</td>
                  <td className="ai-feedback">{row.aiFeedback}</td>
                  <td>
                    {row.sentiment === "positive" ? (
                      <span className="sentiment positive">✔</span>
                    ) : (
                      <span className="sentiment negative">✖</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
