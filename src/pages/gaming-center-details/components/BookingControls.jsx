import React, { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const getAuthToken = () =>
  localStorage.getItem("authToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("gc_token") || "";

const API_URL = "http://localhost:5000";

const BookingControls = ({
  selectedSeats = [],
  onBookingUpdate,
  centerData,
  seatCount = 1,
  onSeatCountChange,
  onConfirm,
  isSubmitting = false,
}) => {
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("14:00");
  const [duration, setDuration] = useState(2);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletError, setWalletError] = useState("");

  const token = getAuthToken();

  const durationOptions = [
    { value: 1, label: "1 цаг" },
    { value: 2, label: "2 цаг" },
    { value: 3, label: "3 цаг" },
    { value: 4, label: "4 цаг" },
    { value: 6, label: "6 цаг" },
    { value: 8, label: "8 цаг" },
  ];

  // ✅ Суудлын тоо сонголт
  const seatCountOptions = [
    { value: 1, label: "1 суудал" },
    { value: 2, label: "2 суудал" },
    { value: 3, label: "3 суудал" },
    { value: 4, label: "4 суудал" },
    { value: 5, label: "5 суудал" },
  ];

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 23; hour++) {
      const t = `${hour.toString().padStart(2, "0")}:00`;
      slots.push({ value: t, label: t });
    }
    return slots;
  }, []);

  // ✅ Үнэ тооцоо
  const pricing = useMemo(() => {
    const hourlyRate = Number(centerData?.hourlyRate || 0);
    const total = hourlyRate * Number(duration) * Number(seatCount);
    return { hourlyRate, total, seatCount: Number(seatCount) };
  }, [centerData?.hourlyRate, duration, seatCount]);

  // ✅ startDateTime, endDateTime тооцоо
  const { startDateTime, endDateTime } = useMemo(() => {
    if (!bookingDate || !startTime) return {};
    const [h, m] = startTime.split(":").map(Number);
    const start = new Date(bookingDate);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + Number(duration) * 3600000);
    return {
      startDateTime: start.toISOString().slice(0, 19).replace("T", " "),
      endDateTime: end.toISOString().slice(0, 19).replace("T", " "),
    };
  }, [bookingDate, startTime, duration]);

  // Wallet татах
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        if (!token) { setWalletBalance(0); return; }
        setWalletBalance(null);
        const res = await fetch(`${API_URL}/api/wallet/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Wallet error");
        setWalletBalance(Number(data.wallet?.balance || 0));
      } catch (e) {
        if (e?.name === "AbortError") return;
        setWalletBalance(0);
        setWalletError(e?.message || "");
      }
    };
    load();
    return () => controller.abort();
  }, [token]);

  // Parent-д мэдэгдэнэ
  useEffect(() => {
  onBookingUpdate?.({
    date: bookingDate,
    startTime,
    duration,
    seatCount,           // ← энэ prop-оос авч байна уу?
    startDateTime,
    endDateTime,
    totalPrice: pricing.total,
    pricing,
    walletBalance,
  });
}, [bookingDate, startTime, duration, seatCount, pricing, walletBalance, startDateTime, endDateTime]);

  const totalToPay = pricing.total;
  const isEnough = walletBalance !== null && walletBalance >= totalToPay;
  const missing = walletBalance !== null ? Math.max(0, totalToPay - walletBalance) : 0;
  const isValid = bookingDate && startTime && duration && seatCount > 0;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Суудал захиалах
      </h2>

      <div className="space-y-5">
        {/* Огноо + Цаг */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Огноо"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
          <Select
            label="Эхлэх цаг"
            options={timeSlots}
            value={startTime}
            onChange={setStartTime}
            required
          />
        </div>

        {/* Хугацаа + Суудлын тоо */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Үргэлжлэх хугацаа"
            options={durationOptions}
            value={duration}
            onChange={(v) => setDuration(Number(v))}
            required
          />
          {/* ✅ Суудлын тоо */}
          <Select
            label="Суудлын тоо"
            options={seatCountOptions}
            value={seatCount}
            onChange={(v) => onSeatCountChange?.(Number(v))}
            required
          />
        </div>

        {/* Сонгосон суудлууд */}
        {selectedSeats.length > 0 && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">
              Сонгосон суудлууд ({selectedSeats.length}/{seatCount}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((id) => (
                <span key={id} className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                  #{id}
                </span>
              ))}
            </div>
            {selectedSeats.length < seatCount && (
              <p className="text-xs text-yellow-400 mt-2">
                ⚠️ {seatCount - selectedSeats.length} суудал дутуу байна. Зүүн талаас сонгоно уу эсвэл автомат сонгогдоно.
              </p>
            )}
          </div>
        )}

        {/* Захиалгын мэдээлэл */}
        <div className="border border-border rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-sm mb-3">Захиалгын мэдээлэл</h3>
          <Row label="Огноо:" value={bookingDate ? new Date(bookingDate).toLocaleDateString("mn-MN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "—"} />
          <Row label="Цаг:" value={startTime && duration ? `${startTime} – ${endDateTime?.slice(11, 16) || ""}` : "—"} />
          <Row label="Үргэлжлэх:" value={`${duration} цаг`} />
          <Row label="Суудал:" value={`${seatCount} суудал`} />
          <Row label="Тариф:" value={`₮${pricing.hourlyRate.toLocaleString()} / цаг / суудал`} />
          <div className="border-t border-border pt-2 mt-2 flex justify-between">
            <span className="font-bold">Нийт төлбөр:</span>
            <span className="font-bold text-lg text-green-400">₮{totalToPay.toLocaleString()}</span>
          </div>
        </div>

        {/* Хэтэвч */}
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-border">
          <span className="text-sm font-medium flex items-center gap-2">
            🪙 Хэтэвчний үлдэгдэл
          </span>
          <span className="font-bold">
            {walletBalance === null ? "..." : `₮${walletBalance.toLocaleString()}`}
          </span>
        </div>

        {walletBalance !== null && !isEnough && totalToPay > 0 && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-300 rounded-xl p-3 text-sm">
            Үлдэгдэл хүрэлцэхгүй байна. Нэмэлтээр <b>₮{missing.toLocaleString()}</b> цэнэглэнэ үү.
          </div>
        )}

        {/* Захиалах товч */}
        <button
          onClick={onConfirm}
          disabled={!isValid || walletBalance === null || !isEnough || isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {isSubmitting ? "Захиалж байна..." : `🗓 Захиалга баталгаажуулах`}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          • Цагийн эхлэхийн өмнө цуцлах боломжтой
        </p>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

export default BookingControls;