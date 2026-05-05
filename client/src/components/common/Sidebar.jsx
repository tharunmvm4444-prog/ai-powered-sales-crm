import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTachometerAlt,
  faChartBar,
  faClipboardList,
  faChartLine,
  faUsers,
  faBell,
  faSignOutAlt,
  faCircleQuestion,
  faUsersLine
} from "@fortawesome/free-solid-svg-icons";

import ChatInterface from "../chat/ChatInterface"; // ✅ chatbot import
import "./sidebar.css";
import logo from "./logo.png";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showChat, setShowChat] = useState(false); // ✅ chatbot state
  const navigate = useNavigate();

  // LOGOUT (unchanged)
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
        {/* ===== TOP ===== */}
        <div className="sidebar-top">
          <div className="logo-wrapper">
            <img
              src={logo}
              alt="Logo"
              className={collapsed ? "logo collapsed-logo" : "logo expanded-logo"}
            />
          </div>

          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* ===== MENU ===== */}
        <ul className="menu">
          <li>
            <NavLink to="/manager/dashboard">
              <span className="icon"><FontAwesomeIcon icon={faTachometerAlt} /></span>
              {!collapsed && <span className="text">Dashboard</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/manager/analytics">
              <span className="icon"><FontAwesomeIcon icon={faChartBar} /></span>
              {!collapsed && <span className="text">Analytics</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/manager/leads">
              <span className="icon"><FontAwesomeIcon icon={faClipboardList} /></span>
              {!collapsed && <span className="text">Lead Assignment</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/manager/reports">
              <span className="icon"><FontAwesomeIcon icon={faChartLine} /></span>
              {!collapsed && <span className="text">Reports</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/manager/employees">
              <span className="icon"><FontAwesomeIcon icon={faUsers} /></span>
              {!collapsed && <span className="text">Employee Report</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/productivity">
              <span className="icon">
                <FontAwesomeIcon icon={faChartLine} />
              </span>
              {!collapsed && <span className="text">Productivity Report</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/overall">
              <span className="icon">
                <FontAwesomeIcon icon={faUsersLine} />
              </span>
              {!collapsed && <span className="text">Overall Report</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/notifications">
              <span className="icon">
                <FontAwesomeIcon icon={faBell} />
              </span>
              {!collapsed && <span className="text">Notifications</span>}
            </NavLink>
          </li>
        </ul>

        {/* ===== BOTTOM ===== */}
        <div className="sidebar-bottom">
          {/* ✅ HELP BUTTON → CHATBOT */}
          <button
            className="bottom-btn"
            onClick={() => setShowChat(true)}
          >
            <span className="icon">
              <FontAwesomeIcon icon={faCircleQuestion} />
            </span>
            {!collapsed && <span className="text">Help</span>}
          </button>

          <button className="bottom-btn logout" onClick={handleLogout}>
            <span className="icon"><FontAwesomeIcon icon={faSignOutAlt} /></span>
            {!collapsed && <span className="text">Logout</span>}
          </button>
        </div>
      </div>

      {/* ===== CHATBOT OVERLAY (NO UI CHANGE TO SIDEBAR) ===== */}
      {showChat && (
        <div className="chatbot-overlay">
          <div className="chatbot-container">
            <button
              className="chatbot-close"
              onClick={() => setShowChat(false)}
            >
              ✕
            </button>
            <ChatInterface />
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
