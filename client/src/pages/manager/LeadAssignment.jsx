import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import "./LeadAssignment.css";

const salespersons = ["Rahul", "Sneha", "Vikram", "Kavya", "Ivan", "Grace", "Eve", "Heidi", "Frank", "Tharun"];

function LeadAssignment() {
  const [leads, setLeads] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState("All");

  const fileInputRef = useRef(null);

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/api/leads");
      // Map MongoDB _id to id for the frontend logic if needed, or just use _id
      // The frontend uses .id in the map key, so let's stick to that or map it.
      // MongoDB returns _id. Let's map it to id for compatibility or update usage.
      const formattedLeads = res.data.map(lead => ({
        ...lead,
        id: lead._id, // Map _id to id for consistency with existing code
        name: lead.customerName,
        phone: lead.phoneNumber,
        assignedTo: lead.assignedUser || ""
      }));
      setLeads(formattedLeads);
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post("/api/leads/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("Leads uploaded successfully!");
      fetchLeads(); // Refresh list
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading file");
    }
    setLoading(false);
    e.target.value = null; // Reset input
  };

  const toggleLead = (id) => {
    setSuccessMsg("");
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!assignedTo || selectedIds.length === 0) return;

    try {
      await axios.put("/api/leads/assign", {
        leadIds: selectedIds,
        assignedTo
      });

      setSuccessMsg(`${selectedIds.length} lead(s) assigned to ${assignedTo}`);
      setSelectedIds([]);
      setAssignedTo("");
      fetchLeads(); // Refresh from DB to confirm persistence
    } catch (err) {
      console.error("Assignment error:", err);
      alert("Failed to assign leads");
    }
  };

  // --- Filter Logic ---
  const filteredLeads = leads.filter((lead) => {
    if (filterStatus === "Assigned") return lead.assignedTo;
    if (filterStatus === "Unassigned") return !lead.assignedTo;
    return true; // "All"
  });

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="lead-layout">
          {/* LEFT SIDE */}
          <div className="lead-left">
            <div className="actions-bar">
              <div className="filter-tabs">
                {["All", "Assigned", "Unassigned"].map((status) => (
                  <button
                    key={status}
                    className={`filter-btn ${filterStatus === status ? "active" : ""}`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="upload-wrapper">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                />
                <button className="import-btn" onClick={handleImportClick} disabled={loading}>
                  {loading ? "Uploading..." : "📥 Import Excel"}
                </button>
              </div>
            </div>

            <table className="lead-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Sentiment</th>
                  <th>Description</th>
                  <th>Feedback</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No leads found.</td></tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                        />
                      </td>
                      <td>{lead.name}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.email}</td>
                      <td>
                        {lead.sentiment === "positive" ? (
                          <span style={{ color: "green", fontSize: "1.2rem", fontWeight: "bold" }}>✔</span>
                        ) : lead.sentiment === "negative" ? (
                          <span style={{ color: "red", fontSize: "1.2rem", fontWeight: "bold" }}>✖</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{lead.assignedTo ? lead.callDescription : "-"}</td>
                      <td>{lead.aiFeedback}</td>
                      <td>
                        {lead.assignedTo ? (
                          <span className="assigned-badge">
                            {lead.assignedTo}
                          </span>
                        ) : (
                          <span className="unassigned">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* RIGHT SIDE */}
          <div className="lead-right">
            <h3>Selected Leads</h3>
            <p className="count">{selectedIds.length} selected</p>

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select Salesperson</option>
              {salespersons.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>

            <button
              className="assign-btn"
              disabled={!assignedTo || selectedIds.length === 0}
              onClick={handleAssign}
            >
              Assign
            </button>

            {successMsg && <p className="success">{successMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadAssignment;
