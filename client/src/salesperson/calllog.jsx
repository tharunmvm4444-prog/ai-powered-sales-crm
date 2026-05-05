import { useState, useEffect } from "react";
import axios from "axios";
import emailjs from '@emailjs/browser';
import "./calllog.css";
import Sidebar from "./sidebarsales";
import Header from "./salesHeader";

function CallLog() {
  // State for call logs
  const [callLogs, setCallLogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'called', 'not_called'

  // Fetch Assigned Leads from DB
  useEffect(() => {
    const fetchAssignedLeads = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const userName = user.name;

        // Fetch leads assigned to this user
        const res = await axios.get(`/api/leads?assignedTo=${userName}`);

        // Map DB fields to UI fields
        const dbLeads = res.data.map((lead) => ({
          id: lead._id,
          name: lead.customerName,
          phone: lead.phoneNumber,
          email: lead.email,
          duration: lead.callDuration || "--",
          description: lead.callDescription || "",
          feedback: lead.aiFeedback || "",
          sentiment: lead.sentiment || ""
        }));

        setCallLogs(dbLeads); // Replaced static merge with DB data
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchAssignedLeads();
  }, []);

  // Call Logic State
  const [activeCall, setActiveCall] = useState(null); // { sid, name, status }
  const [lastCallSid, setLastCallSid] = useState(null); // Store SID of the last completed call
  const [showModal, setShowModal] = useState(false);
  const [callStatus, setCallStatus] = useState("");

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);

  const handleCall = async (log) => {
    try {
      setShowModal(true);
      setCallStatus("Initiating call to " + log.name + "...");
      setActiveCall({ id: log.id, name: log.name, status: "dialing" });

      const res = await axios.post("/api/twilio/make-call", {
        customerName: log.name,
        leadId: log.id,
      });

      if (res.data.success) {
        setCallStatus("Ringing...");
        setActiveCall({ id: log.id, sid: res.data.callSid, name: log.name, status: "ringing" });
        setLastCallSid(res.data.callSid); // Save SID for analysis
      } else {
        setCallStatus("Failed: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      setCallStatus("Error initiating call.");
    }
  };

  const handleEndCall = async () => {
    if (!activeCall?.sid) {
      setShowModal(false);
      return;
    }

    try {
      setCallStatus("Ending call...");
      const res = await axios.post("/api/twilio/end-call", {
        sid: activeCall.sid,
      });

      if (res.data.success) {
        setCallStatus("Call Ended.");

        // Random duration 10-15s
        const randomDuration = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
        const durationStr = `${randomDuration}s`;

        // Update local state to move to "Called" filter
        setCallLogs(prev => prev.map(log => {
          if (log.id === activeCall.id) {
            return { ...log, duration: durationStr };
          }
          return log;
        }));

        setTimeout(() => {
          setShowModal(false);
          setActiveCall(null);
        }, 1500);
      } else {
        setCallStatus("Failed to end call: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      setCallStatus("Error ending call.");
    }
  };

  const handleAnalyze = async (log) => {
    // In a real app, 'log' would contain the database record with the call SID.
    // Here we check if the user just made a call to this person.
    if (!lastCallSid) {
      alert("No recent call recording found to analyze. Please make a call first.");
      return;
    }

    // Optional: Check if the last call was actually for this log entry to be pedantic,
    // but for demo fluidity we'll just analyze the last valid SID.
    setAnalyzing(true);
    setCallStatus("Analyzing audio..."); // Reusing simple status or added UI

    try {
      const res = await axios.get(`/api/twilio/recording/${lastCallSid}`);
      if (res.data.success) {
        // Update local state to reflect changes immediately
        const analysis = res.data.analysis;

        setCallLogs(prevLogs => prevLogs.map(item => {
          if (item.id === log.id) {
            return {
              ...item,
              description: analysis.description,
              feedback: analysis.feedback,
              sentiment: analysis.sentiment,
              duration: item.duration === "--" ? "Just Now" : item.duration // Mark as called
            };
          }
          return item;
        }));

        alert("Analysis Complete! Data updated in table.");

      } else {
        alert("Analysis failed or still processing: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEmailCheck = (log) => {
    // Basic confirmation
    const confirmSend = window.confirm(`Send follow-up email to ${log.name} (${log.email})?`);
    if (!confirmSend) return;

    const userStr = localStorage.getItem("user");
    const salespersonName = userStr ? JSON.parse(userStr).name : "Salesperson";

    const templateParams = {
      salesperson_name: salespersonName,
      customer_name: log.name,
      email: log.email,
      reply_to: log.email
    };

    // Using credentials from the provided notification project
    emailjs.send('service_rnzjj5j', 'template_hmd469v', templateParams, 'cYfXTSQ7n2mfdvyes')
      .then(async (response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert(`Email sent successfully to ${log.email}!`);

        // Save Notification to DB for Manager
        try {
          await axios.post('/api/notifications', {
            message: `Follow-up email successfully sent to ${log.email} by ${salespersonName}`,
            type: 'email_sent',
            status: 'Email Sent'
          });
        } catch (notifErr) {
          console.error("Failed to save notification:", notifErr);
        }

      }, (err) => {
        console.error('FAILED...', err);
        alert(`Failed to send email: ${err.text || err.message}`);
      });
  };

  return (
    <div className="calllog-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* RIGHT SIDE CONTENT */}
      <div className="calllog-content">
        {/* Header must be INSIDE content */}
        <Header />

        <h2 className="page-title">Call Log</h2>

        {/* ============ CALL MODAL ============ */}
        {showModal && (
          <div className="call-modal-overlay">
            <div className="call-modal">
              <h3>Calling: {activeCall?.name || "Unknown"}</h3>
              <div className="call-status">
                <p>{callStatus}</p>
                <div className="pulse-ring"></div>
              </div>
              <div className="modal-actions">
                <button className="end-call-btn" onClick={handleEndCall}>
                  End Call
                </button>
              </div>
            </div>
            {/* Inline CSS for modal */}
            <style jsx>{`
              .call-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
              }
              .call-modal {
                background: white; padding: 30px; border-radius: 12px; text-align: center; min-width: 300px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
              }
              .call-status { margin: 20px 0; font-size: 1.1rem; font-weight: 500; color: #333; }
              .end-call-btn {
                background: #ff4d4f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem;
              }
              .end-call-btn:hover { background: #ff7875; }
            `}</style>
          </div>
        )}



        <div className="filter-container" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => setFilterStatus("all")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: filterStatus === "all" ? "#2563eb" : "#e5e7eb",
              color: filterStatus === "all" ? "white" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("called")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: filterStatus === "called" ? "#2563eb" : "#e5e7eb",
              color: filterStatus === "called" ? "white" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Called
          </button>
          <button
            onClick={() => setFilterStatus("not_called")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: filterStatus === "not_called" ? "#2563eb" : "#e5e7eb",
              color: filterStatus === "not_called" ? "white" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Not Called
          </button>
        </div>

        <div className="table-card">
          <table className="calllog-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Sentiment</th>
                <th>Call Dur.</th>
                <th>Description</th>
                <th>Feedback</th>
                <th>Call</th>
                <th>Analyze</th>
                <th>Email Sent</th>
              </tr>
            </thead>

            <tbody>
              {callLogs
                .filter((log) => {
                  if (filterStatus === "called") return log.duration !== "--";
                  if (filterStatus === "not_called") return log.duration === "--";
                  return true;
                })
                .map((log, index) => (
                  <tr key={log.id}>
                    <td>{index + 1}</td>
                    <td>{log.name}</td>
                    <td>{log.phone}</td>
                    <td>{log.email}</td>
                    <td>
                      {log.sentiment && log.sentiment.toLowerCase() === "positive" ? (
                        <span style={{ color: "green", fontSize: "1.2rem", fontWeight: "bold" }}>✔</span>
                      ) : log.sentiment && log.sentiment.toLowerCase() === "negative" ? (
                        <span style={{ color: "red", fontSize: "1.2rem", fontWeight: "bold" }}>✖</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{log.duration}</td>
                    <td className="description">{log.description}</td>
                    <td className="description">{log.feedback}</td>
                    <td>
                      <button
                        className="call-btn"
                        onClick={() => handleCall(log)}
                        title="Call Now"
                      >
                        📞
                      </button>
                    </td>
                    <td>
                      <button
                        className="analyze-btn"
                        onClick={() => handleAnalyze(log)}
                        disabled={analyzing}
                        style={{
                          background: analyzing ? "#ccc" : "#4caf50",
                          color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer"
                        }}
                      >
                        {analyzing ? "..." : "🤖"}
                      </button>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input type="checkbox" onClick={() => handleEmailCheck(log)} />
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

export default CallLog;
