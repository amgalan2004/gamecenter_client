import ReportsPage from "./pages/reports";
import React from "react";
import {
  BrowserRouter,
  BrowserRouter as Router, // Зарим газар Router гэж ашиглах бол
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Pages
import NotFound from "pages/NotFound";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import RegisterPlayer from "./pages/register-player";
import RegisterCenter from "./pages/register-center";
// ШИНЭЭР НЭМЭГДСЭН: Санхүүчийн бүртгэлийн хуудас
import RegisterAccountant from "./pages/register-accountant"; 

import GamingCenterMap from "./pages/gaming-center-map";
import GamingCenterDetails from "./pages/gaming-center-details";
import BookingHistory from "./pages/booking-history";
import DigitalWallet from "./pages/digital-wallet";
import AdminDashboard from "./pages/admin-dashboard";

// ШИНЭЭР НЭМЭГДСЭН: Санхүүчийн хяналтын самбар
import FinanceDashboard from "./pages/finance-dashboard"; 

import About from "./pages/About";
import Rules from "./pages/Rules";

/* ============================
   🔐 Protected Route
============================ */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // ❌ Login хийгээгүй бол Home руу
  if (!userData?.role) {
    return <Navigate to="/login" replace />; // Login руу буцаах нь илүү тохиромжтой
  }

  // ❌ Role тохирохгүй бол Home
  // Энд role-ийг том жижиг үсэг ялгалгүй шалгахаар сайжруулав
  const userRole = userData.role.toUpperCase();
  const roles = allowedRoles.map(r => r.toUpperCase());

  if (allowedRoles && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <RouterRoutes>
          {/* 🌍 PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/player" element={<RegisterPlayer />} />
          <Route path="/register/center" element={<RegisterCenter />} />
          
          {/* ✅ НЭМЭГДСЭН: Санхүүч бүртгүүлэх зам */}
          <Route path="/register/accountant" element={<RegisterAccountant />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/rules" element={<Rules />} />

          {/* 👤 PLAYER */}
          <Route
            path="/gaming-center-map"
            element={
              <ProtectedRoute allowedRoles={["PLAYER"]}>
                <GamingCenterMap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gaming-center-details"
            element={
              <ProtectedRoute allowedRoles={["PLAYER"]}>
                <GamingCenterDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking-history"
            element={
              <ProtectedRoute allowedRoles={["PLAYER"]}>
                <BookingHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/digital-wallet"
            element={
              <ProtectedRoute allowedRoles={["PLAYER"]}>
                <DigitalWallet />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍💻 ADMIN & OWNER */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["CENTER_ADMIN", "OWNER"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 💰 ACCOUNTANT (Санхүүч) - ШИНЭЭР НЭМЭГДЭВ */}
          <Route
            path="/finance-dashboard"
            element={
              <ProtectedRoute allowedRoles={["ACCOUNTANT", "OWNER"]}>
                <FinanceDashboard />
              </ProtectedRoute>
            }
          />
            <Route
  path="/reports"
  element={
    <ProtectedRoute allowedRoles={["ACCOUNTANT", "CENTER_ADMIN", "OWNER"]}>
      <ReportsPage />
    </ProtectedRoute>
  }
/>
          {/* ❌ 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;