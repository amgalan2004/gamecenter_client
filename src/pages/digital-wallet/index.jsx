// src/pages/digital-wallet/index.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/ui/Header";
import WalletBalance from "./components/WalletBalance";
import QuickTopUp from "./components/QuickTopUp";
import TransactionHistory from "./components/TransactionHistory";
import SpendingAnalytics from "./components/SpendingAnalytics";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { t, formatCurrency } from "../../utils/i18n";

// --------------------
// Auth token helper
// --------------------
const getAuthToken = () => {
  try {
    const direct =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");
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

const API_URL = "http://localhost:5000";

const DigitalWallet = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ reservation төлбөрийн мэдээлэл (navigate state-ээр ирнэ)
  const reservationPayment = location.state?.reservationId
    ? {
        reservationId: location.state.reservationId,
        totalPrice: Number(location.state.totalPrice || 0),
        paymentDeadline: location.state.paymentDeadline,
      }
    : null;

  const [activeView, setActiveView] = useState("overview");
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [error, setError] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ✅ reservation төлбөрийн төлөвүүд
  const [timeLeftMs, setTimeLeftMs] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const token = getAuthToken();

  // -------------------------------------------------
  // 1. Түрийвчийн баланс татах
  // -------------------------------------------------
  const fetchWallet = async (signal) => {
    try {
      setError("");

      const res = await fetch(`${API_URL}/api/wallet/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      // ✅ 401/403 үед хуучин дата харагдахгүй болгох
      if (res.status === 401 || res.status === 403) {
        setWalletData(null);
        throw new Error("Нэвтрэлт хүчингүй болсон байна. Дахин нэвтэрнэ үү.");
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setWalletData({
          balance: 0,
          recentChange: { amount: 0, period: "" },
        });
        throw new Error(data.error || "Wallet error");
      }

      setWalletData({
        balance: Number(data.wallet?.balance || 0),
        recentChange: { amount: 0, period: "" },
      });
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(err.message || "Түрийвчийн мэдээлэл татахад алдаа гарлаа.");
    }
  };

  // -------------------------------------------------
  // 2. Гүйлгээ татах
  // -------------------------------------------------
  const fetchTransactions = async (signal) => {
    try {
      setError("");

      const res = await fetch(`${API_URL}/api/wallet/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      if (res.status === 401 || res.status === 403) {
        setTransactions([]);
        throw new Error("Нэвтрэлт хүчингүй болсон байна. Дахин нэвтэрнэ үү.");
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setTransactions([]); 
        throw new Error(data.error || "Transactions error");
      }

      const txList = (data.transactions || []).map((tx) => ({
        id: tx.id,
        type: tx.type === "TOPUP" ? "topup" : "booking",
        amount: Number(tx.amount), 
        description: tx.description || (tx.type === "TOPUP" ? t("wallet.topup") : t("gaming.session")),
        reference: tx.id,
        date: tx.created_at, // TransactionHistory компонент дээр created_at гэж зассан бол энд created_at байх хэрэгтэй
        created_at: tx.created_at,
        status: "completed",
        center: tx.center_name || undefined,
      }));

      setTransactions(txList);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(err.message || "Гүйлгээний жагсаалт татах үед алдаа гарлаа.");
    }
  };

  // -------------------------------------------------
  // 3. Түрийвч цэнэглэх
  // -------------------------------------------------
  const handleTopUp = async (topUpData) => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/wallet/topup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(topUpData.amount),
          method: topUpData.method || "CARD",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error)
        throw new Error(data.error || "Top-up алдаа гарлаа.");

      setWalletData((prev) => ({
        ...(prev || { balance: 0, recentChange: { amount: 0, period: "" } }),
        balance: Number(data.balance),
        recentChange: {
          amount: Number(topUpData.amount),
          period: t("just.now"),
        },
      }));

      await fetchTransactions();
      setIsTopUpModalOpen(false);
    } catch (err) {
      setError(err.message || "Түрийвч цэнэглэх үед алдаа гарлаа.");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------
  // 4. Эхлэх үед өгөгдөл татах
  // -------------------------------------------------
  useEffect(() => {
    if (!token) {
      setWalletData(null);
      setTransactions([]);
      setError("Та эхлээд нэвтэрнэ үү.");
      setIsInitialLoading(false);
      return;
    }

    setWalletData(null);
    setTransactions([]);
    setError("");
    setIsInitialLoading(true);

    const controller = new AbortController();

    const load = async () => {
      await Promise.all([
        fetchWallet(controller.signal),
        fetchTransactions(controller.signal),
      ]);
      setIsInitialLoading(false);
    };

    load();

    return () => controller.abort();
  }, [token]);

  // -------------------------------------------------
  // 5. Reservation countdown
  // -------------------------------------------------
  useEffect(() => {
    if (!reservationPayment?.paymentDeadline) {
      setTimeLeftMs(null);
      return;
    }

    let expiredOnce = false;

    const tick = () => {
      const diff =
        new Date(reservationPayment.paymentDeadline).getTime() - Date.now();
      const safe = diff > 0 ? diff : 0;
      setTimeLeftMs(safe);

      if (safe === 0 && !expiredOnce) {
        expiredOnce = true;
        expireReservationSafe();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [reservationPayment?.paymentDeadline, reservationPayment?.reservationId, token]);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const expireReservationSafe = async () => {
    try {
      if (!token || !reservationPayment?.reservationId) return;

      await fetch(
        `${API_URL}/api/reservations/${reservationPayment.reservationId}/expire`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch {}
  };

  const payReservation = async () => {
    if (!reservationPayment?.reservationId) return;
    if (!walletData) {
      setError("Түрийвчийн мэдээлэл олдсонгүй.");
      return;
    }
    if ((timeLeftMs ?? 1) === 0) {
      setError("Төлбөр хийх хугацаа дууссан байна.");
      return;
    }
    if (walletData.balance < reservationPayment.totalPrice) {
      setError("Түрийвчний үлдэгдэл хүрэлцэхгүй байна.");
      return;
    }

    try {
      setIsPaying(true);
      setError("");

      const res = await fetch(
        `${API_URL}/api/reservations/${reservationPayment.reservationId}/confirm`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || "Төлбөр баталгаажуулахад алдаа гарлаа.");
      }

      await Promise.all([fetchWallet(), fetchTransactions()]);
      navigate("/booking-history");
    } catch (err) {
      setError(err.message || "Төлбөрийн үед алдаа гарлаа.");
    } finally {
      setIsPaying(false);
    }
  };

  // -------------------------------------------------
  // 6. Analytics-ийн тооцоолол
  // -------------------------------------------------
  const analyticsData = useMemo(() => {
    if (!transactions.length) {
      return {
        totalSpent: 0,
        totalBookings: 0,
        avgPerBooking: 0,
        hoursPlayed: 0,
        monthly: [],
        categories: [],
        centers: [],
      };
    }

    const bookingTx = transactions.filter((x) => x.type === "booking");
    const totalSpent = bookingTx.reduce((sum, x) => sum + Math.abs(x.amount), 0);
    const totalBookings = bookingTx.length;
    const avgPerBooking = totalBookings ? totalSpent / totalBookings : 0;

    return {
      totalSpent,
      totalBookings,
      avgPerBooking,
      hoursPlayed: 0,
      monthly: [],
      categories: [],
      centers: [],
    };
  }, [transactions]);

  const viewTabs = [
    { id: "overview", label: t("overview"), icon: "LayoutDashboard" },
    { id: "transactions", label: t("transactions"), icon: "Receipt" },
    { id: "analytics", label: t("analytics"), icon: "BarChart3" },
  ];

  const showWalletUI = token && !isInitialLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-500/15 text-red-300 border border-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t("digital.wallet")}
              </h1>
              <p className="text-muted-foreground mt-1">{t("manage.funds")}</p>
            </div>

            <div className="hidden md:flex gap-3">
              <Button
                variant="outline"
                iconName="Gamepad2"
                iconPosition="left"
                onClick={() => navigate("/gaming-center-map")}
              >
                {t("book.session")}
              </Button>

              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsTopUpModalOpen(true)}
                disabled={!token}
              >
                {t("top.up.wallet")}
              </Button>
            </div>
          </div>

          {!token ? (
            <p className="text-muted-foreground">
              Нэвтрээгүй байгаа тул түрийвчийн мэдээлэл харагдахгүй байна. Дээрх
              цэсэн дэх{" "}
              <button
                onClick={() => navigate("/login")}
                className="underline text-primary"
              >
                нэвтрэх
              </button>{" "}
              товчийг дарна уу.
            </p>
          ) : isInitialLoading ? (
            <p className="text-muted-foreground">Ачаалж байна...</p>
          ) : (
            <>
              {/* ✅ Reservation payment block */}
              {reservationPayment && walletData && (
                <div className="bg-card border border-border rounded-lg p-5 mb-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">Захиалгын төлбөр</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {reservationPayment.paymentDeadline
                          ? `Төлбөр хийх хугацаа: ${new Date(
                              reservationPayment.paymentDeadline
                            ).toLocaleString()}`
                          : "Төлбөрийн хугацаа тодорхойгүй"}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      iconName="X"
                      iconPosition="left"
                      onClick={() => navigate("/booking-history")}
                    >
                      Хаах
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Төлөх дүн</div>
                      <div className="text-xl font-bold text-accent mt-1">
                        {formatCurrency(reservationPayment.totalPrice)}
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Таны баланс</div>
                      <div className="text-xl font-bold mt-1">
                        {formatCurrency(walletData.balance)}
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <div className="text-sm text-muted-foreground">Үлдсэн хугацаа</div>
                      <div className="text-2xl font-bold text-red-500 mt-1">
                        {timeLeftMs === null ? "--:--" : formatTime(timeLeftMs)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 mt-4">
                    <Button
                      variant="default"
                      className="md:flex-1"
                      iconName="Wallet"
                      iconPosition="left"
                      onClick={payReservation}
                      disabled={
                        isPaying ||
                        (timeLeftMs !== null && timeLeftMs === 0) ||
                        walletData.balance < reservationPayment.totalPrice
                      }
                    >
                      {isPaying ? "Төлж байна..." : "Хэтэвчнээс төлөх"}
                    </Button>

                    <Button
                      variant="outline"
                      className="md:flex-1"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => setIsTopUpModalOpen(true)}
                    >
                      {t("top.up.wallet")}
                    </Button>
                  </div>

                  {walletData.balance < reservationPayment.totalPrice && (
                    <p className="text-sm text-red-300 mt-3">
                      Баланс хүрэлцэхгүй байна. Түрийвчээ цэнэглээд дахин төлнө үү.
                    </p>
                  )}
                </div>
              )}

              {/* Tabs */}
              <div className="flex space-x-1 mb-8 bg-muted/30 p-1 rounded-lg">
                {viewTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md flex-1 transition ${
                      activeView === tab.id
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeView === "overview" && walletData && (
                <div className="space-y-8">
                  <WalletBalance
                    balance={walletData.balance}
                    recentChange={walletData.recentChange}
                    onTopUp={() => setIsTopUpModalOpen(true)}
                  />
                  {/* Overview хэсэгт бүх гүйлгээг харуулдаг болгож засав */}
                  <TransactionHistory transactions={transactions} />
                  <SpendingAnalytics analyticsData={analyticsData} />
                </div>
              )}

              {activeView === "transactions" && (
                <TransactionHistory transactions={transactions} full />
              )}

              {activeView === "analytics" && (
                <SpendingAnalytics analyticsData={analyticsData} />
              )}
            </>
          )}

          {/* Top-up Modal */}
          {isTopUpModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background border border-border rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center p-4 border-b border-border">
                  <h3 className="text-lg font-semibold">{t("top.up.wallet")}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsTopUpModalOpen(false)}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>

                <div className="p-4">
                  <QuickTopUp onTopUp={handleTopUp} isLoading={isLoading} />
                </div>
              </div>
            </div>
          )}

          {/* Mobile bottom actions */}
          {showWalletUI && (
            <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-background border-t border-border">
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  variant="outline"
                  iconName="Gamepad2"
                  iconPosition="left"
                  onClick={() => navigate("/gaming-center-map")}
                >
                  {t("book.session")}
                </Button>
                <Button
                  className="flex-1"
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setIsTopUpModalOpen(true)}
                >
                  {t("top.up.wallet")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DigitalWallet;