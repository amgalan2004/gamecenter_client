import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import LanguageSwitcher from "../LanguageSwitcher";

const API_URL = "http://localhost:5000";

// ---- token helper ----
const getAuthToken = () => {
  try {
    const direct =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("gc_token");

    if (direct) return direct;

    const candidates = ["userData", "user", "gc_user", "currentUser"];
    for (const key of candidates) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const obj = JSON.parse(raw);
        if (obj.token) return obj.token;
        if (obj.accessToken) return obj.accessToken;
      } catch {}
    }

    return null;
  } catch {
    return null;
  }
};

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      message: "Booking confirmed for Gaming Zone Alpha",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "wallet",
      message: "Wallet topped up with ₮25,000",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "availability",
      message: "New seats available at CyberArena",
      time: "3 hours ago",
      read: true,
    },
  ]);

  const [user, setUser] = useState(null);

  // ✅ Header дээрх баланс
  const [headerBalance, setHeaderBalance] = useState(null); // null = loading
  const [balanceError, setBalanceError] = useState("");

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const token = getAuthToken();

  // LocalStorage-оос хэрэглэгч авах
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // ✅ Wallet balance татах (header дээр харуулах)
  useEffect(() => {
    const controller = new AbortController();

    const fetchHeaderBalance = async () => {
      try {
        setBalanceError("");

        if (!token) {
          setHeaderBalance(null);
          return;
        }

        const res = await fetch(`${API_URL}/api/wallet/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.error) {
          throw new Error(data.error || "Wallet error");
        }

        const bal = Number(data.wallet?.balance || 0);
        setHeaderBalance(bal);
      } catch (e) {
        if (e?.name === "AbortError") return;
        setHeaderBalance(0);
        setBalanceError(e?.message || "Wallet error");
      }
    };

    fetchHeaderBalance();
    return () => controller.abort();
  }, [token]);

  const displayName =
    user?.username || user?.name || user?.email?.split("@")[0] || "User";

  const navigationItems = [
    { label: "Discover", path: "/gaming-center-map", icon: "MapPin" },
    { label: "My Bookings", path: "/booking-history", icon: "Calendar" },
    { label: "Wallet", path: "/digital-wallet", icon: "Wallet" },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    // ✅ бүх боломжит token-уудыг цэвэрлэ
    localStorage.removeItem("gc_token");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");

    localStorage.removeItem("userData");
    localStorage.removeItem("user");
    localStorage.removeItem("gc_user");
    localStorage.removeItem("currentUser");

    navigate("/login");
    setIsUserMenuOpen(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => setNotifications([]);

  const balanceText =
    headerBalance === null ? "..." : `₮${headerBalance.toLocaleString()}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* LOGO */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
            <Icon name="Gamepad2" size={20} color="white" />
          </div>
          <span className="hidden sm:block text-lg font-semibold tracking-tight text-foreground">
            GameCenter Connect
          </span>
        </button>

        {/* NAV – desktop */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 rounded-full bg-muted/40 px-1 py-1">
            {navigationItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition
                    ${
                      active
                        ? "bg-black text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {/* NOTIFICATIONS */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen((v) => !v)}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background hover:bg-muted/60 transition"
            >
              <Icon name="Bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-11 w-80 rounded-xl border border-border bg-popover shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <span className="text-sm font-semibold text-foreground">
                    Notifications
                  </span>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllNotifications}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                      <Icon
                        name="Bell"
                        size={22}
                        className="mx-auto mb-2 opacity-40"
                      />
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`w-full px-4 py-3 text-left text-xs transition ${
                          !n.read ? "bg-accent/5" : "hover:bg-muted/40"
                        }`}
                      >
                        <p className="text-foreground">{n.message}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {n.time}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* USER */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-border/70 bg-background px-2 py-1.5 hover:bg-muted/60 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-white">
                {displayName[0]?.toUpperCase() || "?"}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs font-medium leading-none text-foreground">
                  {displayName}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {balanceText}
                </span>
              </div>
              <Icon
                name="ChevronDown"
                size={14}
                className={`hidden md:block transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-11 w-64 rounded-xl border border-border bg-popover shadow-lg">
                <div className="border-b border-border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
                      {displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email || "—"}
                      </p>
                      <p className="mt-0.5 text-xs font-mono text-success">
                        Balance: {balanceText}
                      </p>
                      {balanceError && (
                        <p className="mt-1 text-[11px] text-red-300 truncate">
                          {balanceError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-2 py-1">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/digital-wallet")}
                    className="w-full justify-start text-sm"
                    iconName="Wallet"
                  >
                    Manage Wallet
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/booking-history")}
                    className="w-full justify-start text-sm"
                    iconName="History"
                  >
                    Booking History
                  </Button>
                  <div className="my-1 border-t border-border" />
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-sm text-destructive"
                    iconName="LogOut"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-around py-1.5">
          {navigationItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center gap-0.5 text-[11px] ${
                  active ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
