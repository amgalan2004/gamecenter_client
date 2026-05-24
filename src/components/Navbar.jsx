import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, clearToken } from "../utils/authAPI";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [logoError, setLogoError] = useState(false);

  const readToken = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      return getToken() || userData?.token || localStorage.getItem("authToken") || null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = readToken();
    if (!token) { setUserRole(null); return; }
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(window.atob(base64));
      const role = decoded.role || decoded.user?.role || decoded.userRole || null;
      setUserRole(role);
    } catch (err) {
      setUserRole(null);
    }
  }, [location.pathname]);

  const isAuthenticated = Boolean(userRole);

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    setUserRole(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const showHome = !isAuthenticated || userRole === "PLAYER";

  // Лого икон (img ачаалагдахгүй үед харагдана)
  const GamepadIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0f172a]/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-white">

        {/* ЗҮҮН ТАЛ: Лого */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate(isAuthenticated && userRole === "CENTER_ADMIN" ? "/admin-dashboard" : "/")}
        >
          <div className="p-2 bg-blue-600 rounded-xl group-hover:scale-110 group-active:scale-95 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center w-9 h-9">
            {!logoError ? (
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-5 h-5"
                onError={() => setLogoError(true)}
              />
            ) : (
              <GamepadIcon />
            )}
          </div>
          <span className="font-bold text-lg tracking-tight uppercase">
            Game<span className="text-blue-500">Center</span>
          </span>
        </div>

        {/* ТӨВ ХЭСЭГ: Desktop цэс */}
        <div className="hidden md:flex items-center bg-white/5 p-1 rounded-full border border-white/10">
          {showHome && (
            <NavBtn active={location.pathname === "/"} onClick={() => navigate("/")}>Нүүр</NavBtn>
          )}
          {isAuthenticated && userRole === "PLAYER" && (
            <>
              <NavBtn active={location.pathname === "/gaming-center-map"} onClick={() => navigate("/gaming-center-map")}>Төвүүд</NavBtn>
              <NavBtn active={location.pathname === "/booking-history"} onClick={() => navigate("/booking-history")}>Захиалга</NavBtn>
              <NavBtn active={location.pathname === "/digital-wallet"} onClick={() => navigate("/digital-wallet")}>Түрийвч</NavBtn>
            </>
          )}
          {isAuthenticated && userRole === "CENTER_ADMIN" && (
            <>
              <NavBtn active={location.pathname === "/admin-dashboard"} onClick={() => navigate("/admin-dashboard")}>Хянах самбар</NavBtn>
              <NavBtn active={location.pathname === "/reports"} onClick={() => navigate("/reports")}>Тайлан</NavBtn>
              <NavBtn active={location.pathname === "/about"} onClick={() => navigate("/about")}>Бидний тухай</NavBtn>
            </>

          )}
          {isAuthenticated && userRole === "ACCOUNTANT" && (
  <>
    <MobileNavBtn 
      onClick={() => { 
        navigate("/finance-dashboard"); 
        setMenuOpen(false); 
      }}
    >
      Санхүү
    </MobileNavBtn>
    
    <NavBtn 
      active={location.pathname === "/reports"} 
      onClick={() => {
        navigate("/reports");
        setMenuOpen(false); // Цэс хаах логикийг энд бас нэмэх нь зүйтэй
      }}
    >
      Тайлан
    </NavBtn>
  </>
)}
        </div>

        {/* БАРУУН ТАЛ: Auth */}  
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Хэрэглэгч</span>
                <span className="text-xs font-semibold">{userRole}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-500 rounded-xl transition-all text-xs font-bold border border-white/10 hover:border-red-500/20"
              >
                Гарах
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/login")} className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white text-xs font-bold transition-all">
                Нэвтрэх
              </button>
              <button onClick={() => navigate("/register")} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all text-xs font-bold shadow-lg shadow-blue-600/20 active:scale-95">
                Бүртгүүлэх
              </button>
            </div>
          )}

          {/* Mobile toggle */}
          <button className="md:hidden p-2 ml-1 hover:bg-white/5 rounded-lg transition-all" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0f172a] border-b border-white/5 px-6 py-8 flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col gap-1">
            {showHome && <MobileNavBtn onClick={() => { navigate("/"); setMenuOpen(false); }}>Нүүр</MobileNavBtn>}
            {isAuthenticated && userRole === "PLAYER" && (
              <>
                <MobileNavBtn onClick={() => { navigate("/gaming-center-map"); setMenuOpen(false); }}>Төвүүд</MobileNavBtn>
                <MobileNavBtn onClick={() => { navigate("/booking-history"); setMenuOpen(false); }}>Захиалгууд</MobileNavBtn>
                <MobileNavBtn onClick={() => { navigate("/digital-wallet"); setMenuOpen(false); }}>Түрийвч</MobileNavBtn>
              </>
            )}
            {isAuthenticated && userRole === "CENTER_ADMIN" && (
              <>
                <MobileNavBtn onClick={() => { navigate("/admin-dashboard"); setMenuOpen(false); }}>Хянах самбар</MobileNavBtn>
                <NavBtn active={location.pathname === "/reports"} onClick={() => navigate("/reports")}>Тайлан</NavBtn>
                <MobileNavBtn onClick={() => { navigate("/about"); setMenuOpen(false); }}>Тухай</MobileNavBtn>
              </>
            )}
            {isAuthenticated && userRole === "ACCOUNTANT" && (
  <>
    <MobileNavBtn 
      onClick={() => { 
        navigate("/finance-dashboard"); 
        setMenuOpen(false); 
      }}
    >
      Санхүү
    </MobileNavBtn>
    
    <NavBtn 
      active={location.pathname === "/reports"} 
      onClick={() => {
        navigate("/reports");
        setMenuOpen(false); // Цэс хаах логикийг энд бас нэмэх нь зүйтэй
      }}
    >
      Тайлан
    </NavBtn>
  </>
)}
          </div>
          <div className="pt-6 border-t border-white/5">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold text-sm border border-red-500/10">
                Системээс гарах
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="w-full py-4 bg-white/5 text-white rounded-2xl font-bold text-sm">Нэвтрэх</button>
                <button onClick={() => { navigate("/register"); setMenuOpen(false); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20">Бүртгүүлэх</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavBtn = ({ onClick, children, active = false }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full transition-all text-xs font-bold ${
      active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-400 hover:text-white"
    }`}
  >
    {children}
  </button>
);

const MobileNavBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full text-left py-4 px-4 text-lg font-semibold text-gray-300 hover:text-blue-500 hover:bg-white/5 rounded-2xl transition-all"
  >
    {children}
  </button>
);

export default Navbar;