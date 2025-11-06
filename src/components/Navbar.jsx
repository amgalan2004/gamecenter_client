import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, clearToken } from "../utils/authAPI";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // 🔍 Токеноос хэрэглэгчийн role-г тодорхойлох
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decoded.role);
      } catch {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location.pathname]);

  const isAuthenticated = !!userRole;

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-white">
        {/* ✅ Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.svg"
            alt="GameCenter Connect"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-lg tracking-wide">
            Game<span className="text-blue-400">Center</span>
          </span>
        </div>

        {/* ✅ Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-400 transition"
          >
            Нүүр
          </button>

          {/* --- Authenticated --- */}
          {isAuthenticated ? (
            <>
              {userRole === "PLAYER" && (
                <>
                  <button
                    onClick={() => navigate("/gaming-center-map")}
                    className="hover:text-blue-400 transition"
                  >
                    Төвүүд
                  </button>
                  <button
                    onClick={() => navigate("/booking-history")}
                    className="hover:text-blue-400 transition"
                  >
                    Захиалгууд
                  </button>
                  <button
                    onClick={() => navigate("/digital-wallet")}
                    className="hover:text-blue-400 transition"
                  >
                    Түрийвч
                  </button>
                </>
              )}

              {userRole === "CENTER_ADMIN" && (
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="hover:text-blue-400 transition"
                >
                  Админ самбар
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full font-medium transition"
              >
                Гарах
              </button>
            </>
          ) : (
            // --- Guest users ---
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-blue-400 transition"
              >
                Нэвтрэх
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition"
              >
                Бүртгүүлэх
              </button>
            </>
          )}
        </div>

        {/* ✅ Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* ✅ Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f172a]/95 backdrop-blur-lg border-t border-white/10 flex flex-col items-center space-y-4 py-4 text-white">
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-400 transition"
          >
            Нүүр
          </button>

          {isAuthenticated ? (
            <>
              {userRole === "PLAYER" && (
                <>
                  <button
                    onClick={() => navigate("/gaming-center-map")}
                    className="hover:text-blue-400 transition"
                  >
                    Төвүүд
                  </button>
                  <button
                    onClick={() => navigate("/booking-history")}
                    className="hover:text-blue-400 transition"
                  >
                    Захиалгууд
                  </button>
                  <button
                    onClick={() => navigate("/digital-wallet")}
                    className="hover:text-blue-400 transition"
                  >
                    Түрийвч
                  </button>
                </>
              )}

              {userRole === "CENTER_ADMIN" && (
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="hover:text-blue-400 transition"
                >
                  Админ самбар
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full font-medium transition"
              >
                Гарах
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-blue-400 transition"
              >
                Нэвтрэх
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition"
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

export default Navbar;
