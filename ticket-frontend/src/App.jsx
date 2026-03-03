import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

/* ---------------- Public Pages ---------------- */
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";

/* ---------------- User Layout + Pages ---------------- */
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./features/tickets/components/DashboardHome";
import MyTicketsPage from "./features/tickets/pages/MyTicketsPage";
import TicketDetailsPage from "./features/tickets/pages/TicketDetailsPage";
import Settings from "./features/settings/pages/SettingsPage";
import Notifications from "./features/notifications/pages/NotificationsPage";

/* ---------------- Admin Layout + Pages ---------------- */
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboardHome from "./features/admin/components/AdminDashboardHome";
import UserManagementPage from "./features/admin/pages/UserManagementPage";

const App = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* ================= USER ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="ROLE_USER">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="tickets" element={<MyTicketsPage />} />
        <Route path="tickets/:id" element={<TicketDetailsPage />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ROLE_ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardHome />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="tickets/:id" element={<TicketDetailsPage isAdmin={true} />} />
        <Route path="settings" element={<Settings />} />
      </Route>

    </Routes>
  );
};

export default App;
