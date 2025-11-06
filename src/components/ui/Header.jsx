import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import LanguageSwitcher from "../LanguageSwitcher";
import { t } from "../../utils/i18n";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "booking", message: "Booking confirmed for Gaming Zone Alpha", time: "2 min ago", read: false },
    { id: 2, type: "wallet", message: "Wallet topped up with ₮25,000", time: "1 hour ago", read: false },
    { id: 3, type: "availability", message: "New seats available at CyberArena", time: "3 hours ago", read: true },
  ]);

  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🧠 LocalStorage-с хэрэглэгчийн мэдээлэл авах
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Хэрэглэгчийн нэр тодорхойлох
  const displayName =
    user?.username || user?.name || user?.email?.split("@")[0] || "User";

  // 💬 Mock active booking (жишээ)
  useEffect(() => {
    if (location?.pathname === "/gaming-center-details") {
      setActiveBooking({
        center: "CyberArena Downtown",
        time: "2:00 PM - 4:00 PM",
        seats: 2,
        total: 24000,
      });
    } else {
      setActiveBooking(null);
    }
  }, [location?.pathname]);

  const navigationItems = [
    { label: "Discover", path: "/gaming-center-map", icon: "MapPin" },
    { label: "My Bookings", path: "/booking-history", icon: "Calendar" },
    { label: "Wallet", path: "/digital-wallet", icon: "Wallet" },
  ];

  const unreadCount = notifications?.filter((n) => !n?.read)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    localStorage.removeItem("gc_token");
    localStorage.removeItem("userData");
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => setNotifications([]);

  const completeBooking = () => {
    navigate("/booking-history");
    setActiveBooking(null);
  };

  const modifyBooking = () => navigate("/gaming-center-details");

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 🎮 Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Icon name="Gamepad2" size={20} color="white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            GameCenter Connect
          </span>
        </div>

        {/* 🔗 Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                location.pathname === item.path
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* ⚙️ Right Section */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>

          {/* 💬 Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="xs" onClick={clearAllNotifications}>
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border-b last:border-b-0 cursor-pointer ${
                          !n.read ? "bg-accent/5" : "hover:bg-muted/30"
                        }`}
                        onClick={() => markNotificationAsRead(n.id)}
                      >
                        <p className="text-sm text-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 👤 User Profile */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {displayName[0]?.toUpperCase() || "?"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground">
                  {displayName}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  ₮{user?.balance?.toLocaleString() || "0"}
                </div>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                className={`transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-white">
                        {displayName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {displayName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user?.email || "—"}
                      </div>
                      <div className="text-sm font-mono text-success">
                        Balance: ₮{user?.balance?.toLocaleString() || "0"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/digital-wallet")}
                    className="w-full justify-start"
                    iconName="Wallet"
                  >
                    Manage Wallet
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/booking-history")}
                    className="w-full justify-start"
                    iconName="History"
                  >
                    Booking History
                  </Button>
                  <div className="border-t border-border my-2"></div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-destructive"
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

      {/* 📱 Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-1000 bg-background border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center ${
                location.pathname === item.path ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
