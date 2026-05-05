import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";

// ===== MANAGER PAGES =====
import Dashboard from "./pages/manager/Dashboard";
import Analytics from "./pages/manager/Analytics";
import LeadAssignment from "./pages/manager/LeadAssignment";
import Reports from "./pages/manager/Report";
import EmployeeReport from "./pages/manager/EmployeeReport";
import OverallReport from "./pages/manager/OverallReport";
import Notifications from "./pages/manager/Notifications";

import ProductivityReport from "./pages/manager/ProductivityReport";


// ===== SALESPERSON PAGES =====
import SalesDashboard from "./salesperson/salesDashboard";
import CallLog from "./salesperson/calllog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== AUTH ===== */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== MANAGER (PROTECTED) ===== */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/leads"
          element={
            <ProtectedRoute>
              <LeadAssignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/employees"
          element={
            <ProtectedRoute>
              <EmployeeReport />
            </ProtectedRoute>
          }

        />
        <Route
          path="/manager/productivity"
          element={
            <ProtectedRoute>
              <ProductivityReport />
            </ProtectedRoute>
          }

        />

        <Route
          path="/manager/overall"
          element={
            <ProtectedRoute>
              <OverallReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />



        {/* ===== SALESPERSON (PROTECTED) ===== */}
        <Route
          path="/sales/dashboard"
          element={
            <ProtectedRoute>
              <SalesDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales/calllog"
          element={
            <ProtectedRoute>
              <CallLog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
