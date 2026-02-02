import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, clearToken } from "../utils/authAPI";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ✅ Token авах (getToken + localStorage fallback)
  const readToken = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    return (
      getToken() ||
      userData?.token ||
      localStorage.getItem("authToken") ||
      null
    );
  };

  // 🔍 Token-с role тодорхойлох
  useEffect(() => {
    const token = readToken();
    if (!token) {
      setUserRole(null);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const role =
        decoded.role || decoded.user?.role || decoded.userRole || null;
      setUserRole(role);
    } catch (err) {
      console.error("JWT decode error:", err);
      setUserRole(null);
    }
  }, [location.pathname]);

  const isAuthenticated = Boolean(userRole);

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    setUserRole(null);
    navigate("/login");
  };

  // ✅ Нүүр харагдах эсэх логик
  const showHome = !isAuthenticated || userRole === "PLAYER";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-white">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(isAuthenticated && userRole === "CENTER_ADMIN" ? "/admin-dashboard" : "/")}
        >
          <img
            src="/logo.svg"
            alt="GameCenter"
            className="w-8 h-8"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="font-bold text-lg tracking-wide">
            Game<span className="text-blue-400">Center</span>
          </span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {showHome && <NavBtn onClick={() => navigate("/")}>Нүүр</NavBtn>}

          {/* PLAYER */}
          {isAuthenticated && userRole === "PLAYER" && (
            <>
              <NavBtn onClick={() => navigate("/gaming-center-map")}>Төвүүд</NavBtn>
              <NavBtn onClick={() => navigate("/booking-history")}>Захиалгууд</NavBtn>
              <NavBtn onClick={() => navigate("/digital-wallet")}>Түрийвч</NavBtn>
            </>
          )}

          {/* CENTER ADMIN */}
          {isAuthenticated && userRole === "CENTER_ADMIN" && (
            <>
              <NavBtn onClick={() => navigate("/about")}>Бидний тухай</NavBtn>
              <NavBtn onClick={() => navigate("/rules")}>Дүрмүүд</NavBtn>
              <NavBtn onClick={() => navigate("/admin-dashboard")}>Админ самбар</NavBtn>
            </>
          )}

          {/* Auth buttons */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full transition font-medium"
            >
              Гарах
            </button>
          ) : (
            <>
              <NavBtn onClick={() => navigate("/login")}>Нэвтрэх</NavBtn>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition font-medium"
              >
                Бүртгүүлэх
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f172a]/95 py-6 flex flex-col items-center gap-4 text-white border-t border-white/10">
          {showHome && <NavBtn onClick={() => navigate("/")}>Нүүр</NavBtn>}

          {isAuthenticated && userRole === "PLAYER" && (
            <>
              <NavBtn onClick={() => navigate("/gaming-center-map")}>Төвүүд</NavBtn>
              <NavBtn onClick={() => navigate("/booking-history")}>Захиалгууд</NavBtn>
              <NavBtn onClick={() => navigate("/digital-wallet")}>Түрийвч</NavBtn>
            </>
          )}

          {isAuthenticated && userRole === "CENTER_ADMIN" && (
            <>
              <NavBtn onClick={() => navigate("/about")}>Бидний тухай</NavBtn>
              <NavBtn onClick={() => navigate("/rules")}>Дүрмүүд</NavBtn>
              <NavBtn onClick={() => navigate("/admin-dashboard")}>Админ самбар</NavBtn>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-full transition font-medium"
            >
              Гарах
            </button>
          ) : (
            <>
              <NavBtn onClick={() => navigate("/login")}>Нэвтрэх</NavBtn>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-blue-600 rounded-full transition font-medium"
              >
                Бүртгүүлэх
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const NavBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="hover:text-blue-400 transition font-medium"
  >
    {children}
  </button>
);

export default Navbar;
