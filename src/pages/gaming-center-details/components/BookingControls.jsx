// src/pages/gaming-center-details/components/BookingControls.jsx
import React, { useEffect, useMemo, useState } from "react";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

// ---- token helper (Header/DigitalWallet-тэй тааруулсан) ----
const getAuthToken = () => {
  try {
    const direct =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("gc_token"); // ✅ нэмсэн

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

const BookingControls = ({ selectedSeats = [], onBookingUpdate, centerData }) => {
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("14:00");
  const [duration, setDuration] = useState(2);
  const [membershipType, setMembershipType] = useState("regular"); // UI-д үлдээв (өөрчлөхгүй)

  // ✅ Wallet state
  const [walletBalance, setWalletBalance] = useState(null); // null = loading
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

  // ⚠️ Membership-ийг одоогоор зөвхөн UI-д үлдээж байна
  // Үнэ тооцоо нь centerData.hourlyRate (₮/цаг) дээр суурилна
  const membershipOptions = [
    { value: "regular", label: "Regular" },
    { value: "premium", label: "Premium" },
    { value: "vip", label: "VIP" },
  ];

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 23; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      slots.push({ value: timeString, label: timeString });
    }
    return slots;
  }, []);

  // ✅ Үнэ тооцоо (MNT) — centerData.hourlyRate ашиглана
  const pricing = useMemo(() => {
    const seatCount = selectedSeats?.length || 0;

    // centerData.hourlyRate нь таны UI дээр ₮1000/цаг гэж харагдаж байсан
    const hourlyRateMnt = Number(centerData?.hourlyRate || 0);

    const subtotal = hourlyRateMnt * Number(duration || 0) * seatCount;

    // Хэрэв татвар/хураамж хэрэггүй бол 0 байлга
    const tax = 0;
    const serviceFee = 0;

    const total = subtotal + tax + serviceFee;

    return {
      hourlyRateMnt,
      subtotal,
      tax,
      serviceFee,
      total,
      seatCount,
    };
  }, [centerData?.hourlyRate, duration, selectedSeats]);

  // ✅ wallet татах (token олдохгүй бол 0 биш, null/0-оор ялгана)
  useEffect(() => {
    const controller = new AbortController();

    const loadWallet = async () => {
      try {
        setWalletError("");

        if (!token) {
          setWalletBalance(0);
          return;
        }

        setWalletBalance(null); // loading

        const res = await fetch(`${API_URL}/api/wallet/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.error) {
          throw new Error(data.error || "Wallet fetch error");
        }

        setWalletBalance(Number(data.wallet?.balance || 0));
      } catch (e) {
        if (e?.name === "AbortError") return;
        setWalletBalance(0);
        setWalletError(e?.message || "Wallet error");
      }
    };

    loadWallet();
    return () => controller.abort();
  }, [token]);

  // ✅ Parent рүү дамжуулах (pricing.total нь MNT тоо болсон)
  useEffect(() => {
    onBookingUpdate?.({
      date: bookingDate,
      startTime,
      duration,
      membershipType,
      pricing: {
        subtotal: pricing.subtotal,
        tax: pricing.tax,
        serviceFee: pricing.serviceFee,
        total: pricing.total,
        hourlyRate: pricing.hourlyRateMnt,
        seatCount: pricing.seatCount,
      },
      walletBalance,
    });
  }, [
    bookingDate,
    startTime,
    duration,
    membershipType,
    pricing,
    walletBalance,
    onBookingUpdate,
  ]);

  const isValidBooking =
    (selectedSeats?.length || 0) > 0 && bookingDate && startTime && duration;

  // ✅ Wallet шалгалт (бүгд MNT)
  const totalToPay = Number(pricing?.total || 0);
  const hasWalletInfo = walletBalance !== null;
  const isEnoughBalance = hasWalletInfo ? Number(walletBalance) >= totalToPay : false;
  const missingAmount = hasWalletInfo
    ? Math.max(0, totalToPay - Number(walletBalance))
    : 0;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Тоглоомын суудал захиалах
      </h2>

      <div className="space-y-6">
        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Огноо"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e?.target?.value)}
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

        {/* Duration and Membership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Үргэлжлэх хугацаа"
            options={durationOptions}
            value={duration}
            onChange={setDuration}
            required
          />
          <Select
            label="Төрөл"
            options={membershipOptions}
            value={membershipType}
            onChange={setMembershipType}
            required
          />
        </div>

        {/* Selected Seats Summary */}
        {(selectedSeats?.length || 0) > 0 && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">Сонгосон суудал</span>
              <span className="text-sm text-muted-foreground">
                {selectedSeats.length} суудал
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seatId) => (
                <div
                  key={seatId}
                  className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium"
                >
                  #{seatId}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-foreground mb-4">
            Захиалгын мэдээлэл
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Тариф ({pricing.seatCount} суудал × {duration} цаг)
              </span>
              <span className="font-medium">
                ₮{Number(pricing.hourlyRateMnt || 0).toLocaleString()} / цаг
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Дүн</span>
              <span className="font-medium">
                ₮{Number(pricing.subtotal || 0).toLocaleString()}
              </span>
            </div>

            {/* Хэрэв tax/serviceFee ашиглах бол доорхийг үлдээнэ */}
            {Number(pricing.serviceFee || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Үйлчилгээний хураамж</span>
                <span className="font-medium">
                  ₮{Number(pricing.serviceFee || 0).toLocaleString()}
                </span>
              </div>
            )}
            {Number(pricing.tax || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Татвар</span>
                <span className="font-medium">
                  ₮{Number(pricing.tax || 0).toLocaleString()}
                </span>
              </div>
            )}

            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Нийт төлбөр</span>
                <span className="font-bold text-xl text-accent">
                  ₮{Number(pricing.total || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet section */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-foreground">
              Хэтэвчний үлдэгдэл
            </span>
            <span className="font-bold">
              {walletBalance === null
                ? "..."
                : `₮${Number(walletBalance).toLocaleString()}`}
            </span>
          </div>

          {walletError && (
            <div className="text-xs text-red-300 mb-2">
              Wallet error: {walletError}
            </div>
          )}

          {walletBalance !== null && !isEnoughBalance && (
            <div className="bg-red-500/10 border border-red-400/40 text-red-200 rounded-lg p-3 text-sm">
              Үлдэгдэл хүрэлцэхгүй байна. Нэмэлтээр{" "}
              <b>₮{Number(missingAmount).toLocaleString()}</b> цэнэглэх
              шаардлагатай.
              <div className="mt-2 underline cursor-pointer">
                Хэтэвч цэнэглэх →
              </div>
            </div>
          )}
        </div>

        {/* Booking Actions */}
        <div className="space-y-3">
          <Button
            variant="default"
            fullWidth
            disabled={
              !isValidBooking ||
              walletBalance === null || // loading
              !isEnoughBalance // үлдэгдэл хүрэлцэхгүй
            }
            iconName="CreditCard"
            iconPosition="left"
            className="h-12"
          >
            Захиалга баталгаажуулах — ₮{Number(pricing.total || 0).toLocaleString()}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" iconName="Heart" iconPosition="left">
              Дараа хадгалах
            </Button>
            <Button variant="outline" iconName="Share" iconPosition="left">
              Хуваалцах
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• 2 цагийн өмнө цуцлах боломжтой</p>
          <p>• Хоцорвол хугацаа багасч тооцогдоно</p>
          <p>• Төхөөрөмж ашиглалт багтсан</p>
        </div>
      </div>
    </div>
  );
};

export default BookingControls;
