import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// ✅ Pages
import NotFound from "pages/NotFound";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import RegisterPlayer from "./pages/register-player";
import RegisterCenter from "./pages/register-center";
import GamingCenterMap from "./pages/gaming-center-map";
import GamingCenterDetails from "./pages/gaming-center-details";
import BookingHistory from "./pages/booking-history";
import DigitalWallet from "./pages/digital-wallet";
import AdminDashboard from "./pages/admin-dashboard";
import About from "./pages/About"; // ✅ ADD
// import Rules from "./pages/Rules"; // (дараа хэрэгтэй бол)
import Rules from "./pages/Rules";
/* =========================================================
   🧩 Protected Route component (Role-based)
   ========================================================= */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const authToken =
    userData?.token || localStorage.getItem("authToken") || null;

  // ⛔ Нэвтрээгүй бол login
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // ⚠️ Role тохирохгүй
  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>

          {/* ============================
              🌍 PUBLIC ROUTES
          ============================ */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/player" element={<RegisterPlayer />} />
          <Route path="/register/center" element={<RegisterCenter />} />
          
          {/* 👉 БИДНИЙ ТУХАЙ (public + admin) */}
          <Route path="/about" element={<About />} />
          {/* <Route path="/rules" element={<Rules />} /> */}
            <Route path="/rules" element={<Rules />} />
          {/* ============================
              👤 PLAYER ROUTES
          ============================ */}
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

          {/* ============================
              🧑‍💻 ADMIN ROUTES
          ============================ */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["CENTER_ADMIN", "OWNER"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ============================
              ❌ 404
          ============================ */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
