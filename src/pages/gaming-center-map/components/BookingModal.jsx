import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const API_URL = "http://localhost:5000";

/** Token helper */
const getAuthToken = () => {
  try {
    const direct =
      localStorage.getItem("gc_token") ||
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
        if (obj?.token) return obj.token;
        if (obj?.accessToken) return obj.accessToken;
      } catch {}
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * ✅ Select onChange:
 * - event байж болно -> e.target.value
 * - option object байж болно -> {value,label} -> option.value
 * - шууд primitive байж болно -> value
 */
const pickValue = (v) => {
  if (v && typeof v === "object") {
    if ("target" in v) return v.target.value; // event
    if ("value" in v) return v.value; // option object
  }
  return v; // string/number
};

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const BookingModal = ({ center, isOpen, onClose }) => {
  const navigate = useNavigate();

  // ✅ Hook-уудын дараалал алдагдуулахгүй guard
  const shouldRender = Boolean(isOpen && center);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState(""); // string
  const [duration, setDuration] = useState(2);
  const [selectedSeats, setSelectedSeats] = useState(1);

  const [walletBalance, setWalletBalance] = useState(null); // null = loading
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = getAuthToken();

  // ✅ Wallet balance татах (modal нээлттэй үед л)
  useEffect(() => {
    const controller = new AbortController();

    const loadWallet = async () => {
      try {
        if (!shouldRender) {
          setWalletBalance(null);
          return;
        }

        if (!token) {
          setWalletBalance(0);
          return;
        }

        setWalletBalance(null);

        const res = await fetch(`${API_URL}/api/wallet/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.error) throw new Error(data.error || "Wallet error");

        setWalletBalance(toNumber(data.wallet?.balance, 0));
      } catch (e) {
        if (e?.name === "AbortError") return;
        setWalletBalance(0);
      }
    };

    loadWallet();
    return () => controller.abort();
  }, [token, shouldRender]);

  // ✅ Options
  const timeSlots = useMemo(
    () =>
      [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
      ].map((t) => ({ value: t, label: t })),
    []
  );

  const durationOptions = useMemo(
    () => [1, 2, 3, 4, 6, 8].map((h) => ({ value: h, label: `${h} цаг` })),
    []
  );

  const maxSeats = useMemo(() => {
    const available = toNumber(center?.availablePCs, 0);
    const total = toNumber(center?.totalPCs, 0);
    const base = available || total || 1;
    return Math.min(base, 4) || 1;
  }, [center]);

  const seatOptions = useMemo(
    () =>
      Array.from({ length: maxSeats }, (_, i) => ({
        value: i + 1,
        label: `${i + 1} суудал`,
      })),
    [maxSeats]
  );

  // ✅ Calculations
  const hourlyRate = toNumber(center?.hourlyRate, 0);
  const durationHours = toNumber(duration, 0);
  const seatCount = toNumber(selectedSeats, 0);

  const totalCost = hourlyRate * durationHours * seatCount;

  const canAfford =
    walletBalance !== null ? walletBalance >= totalCost : false;

  const missingAmount =
    walletBalance !== null ? Math.max(0, totalCost - walletBalance) : 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const getEndTime = () => {
    if (!selectedTime) return "";
    const [h, m] = String(selectedTime).split(":");
    const endHour = (parseInt(h, 10) + durationHours) % 24;
    return `${String(endHour).padStart(2, "0")}:${m}`;
  };

  const resetState = () => {
    setError("");
    setSuccess("");
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetState();
    onClose?.();
  };

  // ✅ centerId авах (backend centerId шаарддаг байсан)
  const centerId = useMemo(() => {
    // боломжит нэршлүүд
    return (
      center?.id ??
      center?.centerId ??
      center?.center_id ??
      center?._id ??
      null
    );
  }, [center]);

  const handleBooking = async () => {
    if (!selectedTime) {
      setError("Эхлэх цаг сонгоно уу.");
      return;
    }

    resetState();

    if (!token) {
      setError("Захиалга хийхийн өмнө нэвтэрч орно уу.");
      navigate("/login");
      return;
    }

    if (!centerId) {
      setError("Gaming center-ийн ID олдсонгүй. (centerId)");
      return;
    }

    if (!durationHours || durationHours <= 0) {
      setError("Үргэлжлэх хугацаа буруу байна. (durationHours)");
      return;
    }

    if (walletBalance === null) {
      setError("Хэтэвчийн мэдээлэл ачаалж байна. Түр хүлээнэ үү.");
      return;
    }

    if (!canAfford) {
      setError("Таны дансны үлдэгдэл хүрэлцэхгүй байна.");
      return;
    }

    try {
      setIsProcessing(true);

      const start = new Date(`${selectedDate}T${String(selectedTime)}:00`);
      const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

      // ✅ Backend 400 “centerId / durationHours” гэснийг зассан payload
      // camelCase + snake_case хоёуланг нь зэрэг явуулж compatibility нэмэв
      const body = {
        // required fields (backend талд байж магад)
        centerId,
        durationHours,
        seatCount,

        // snake_case mirror
        center_id: centerId,
        duration_hours: durationHours,
        seat_count: seatCount,

        // existing fields
        pc_id: null,
        start_time: start.toISOString().slice(0, 19).replace("T", " "),
        end_time: end.toISOString().slice(0, 19).replace("T", " "),
        total_price: totalCost,
      };

      const res = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || "Захиалга амжилтгүй боллоо.");
      }

      setSuccess("Захиалга амжилттай бүртгэгдлээ.");

      navigate("/booking-history", {
        state: {
          newBooking: {
            center: center?.name,
            date: selectedDate,
            time: `${selectedTime} - ${getEndTime()}`,
            duration: durationHours,
            seats: seatCount,
            total: totalCost,
            status: "PENDING",
          },
        },
      });

      onClose?.();
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      setError(err.message || "Серверийн алдаа гарлаа.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ guard after hooks
  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-popover border border-border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Calendar" size={24} className="text-accent" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Тоглоомын суудал захиалах
              </h2>
              <p className="text-sm text-muted-foreground">{center?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Center Info */}
          <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
            <Image
              src={center?.image}
              alt={center?.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{center?.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {center?.address}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-green-600 font-mono">
                  ₮{hourlyRate.toLocaleString()} / цаг
                </span>
                <span className="text-muted-foreground">
                  {center?.availablePCs || center?.totalPCs || 0} PC боломжтой
                </span>
              </div>

              {/* debug help (optional) */}
              <p className="mt-2 text-xs text-muted-foreground">
                centerId: <span className="font-mono">{String(centerId ?? "—")}</span>
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                type="date"
                label="Огноо"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(selectedDate)}
              </p>
            </div>

            <div>
              <Select
                label="Эхлэх цаг"
                placeholder="Цаг сонгох"
                options={timeSlots}
                value={selectedTime}
                onChange={(v) => setSelectedTime(String(pickValue(v) || ""))}
                required
              />
            </div>

            <div>
              <Select
                label="Үргэлжлэх хугацаа"
                options={durationOptions}
                value={duration}
                onChange={(v) => setDuration(toNumber(pickValue(v), 2))}
                required
              />
            </div>

            <div>
              <Select
                label="Суудлын тоо"
                options={seatOptions}
                value={selectedSeats}
                onChange={(v) => setSelectedSeats(toNumber(pickValue(v), 1))}
                required
              />
            </div>
          </div>

          {/* Summary */}
          {selectedTime && (
            <div className="p-4 bg-card border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-3">
                Захиалгын мэдээлэл
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Огноо:</span>
                  <span className="text-foreground">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Цаг:</span>
                  <span className="text-foreground">
                    {selectedTime} – {getEndTime()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Үргэлжлэх:</span>
                  <span className="text-foreground">{durationHours} цаг</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Суудал:</span>
                  <span className="text-foreground">{seatCount} суудал</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тариф:</span>
                  <span className="text-foreground">
                    ₮{hourlyRate.toLocaleString()} / цаг / суудал
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Нийт төлбөр:</span>
                    <span className="text-green-600 font-mono">
                      ₮{totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wallet */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Wallet" size={20} className="text-accent" />
                <span className="font-medium text-foreground">
                  Хэтэвчний үлдэгдэл
                </span>
              </div>
              <span className="font-mono font-medium text-foreground">
                {walletBalance === null
                  ? "..."
                  : `₮${walletBalance.toLocaleString()}`}
              </span>
            </div>

            {walletBalance !== null && !canAfford && totalCost > 0 && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  Үлдэгдэл хүрэлцэхгүй байна. Нэмэлтээр ₮
                  {missingAmount.toLocaleString()} цэнэглэх шаардлагатай.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate("/digital-wallet")}
                  className="p-0 h-auto text-red-600 hover:text-red-500"
                >
                  Хэтэвч цэнэглэх →
                </Button>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              {success}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            {totalCost > 0 && (
              <span>
                Нийт:{" "}
                <span className="font-mono font-medium text-foreground">
                  ₮{totalCost.toLocaleString()}
                </span>
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Болих
            </Button>
            <Button
              variant="default"
              onClick={handleBooking}
              disabled={
                !selectedTime ||
                !centerId ||
                walletBalance === null ||
                !canAfford ||
                isProcessing
              }
              iconName="Calendar"
              iconPosition="left"
            >
              {isProcessing ? "Илгээж байна..." : "Захиалга баталгаажуулах"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
