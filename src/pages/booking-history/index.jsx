import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";

import BookingTable from "./components/BookingTable";
import FilterPanel from "./components/FilterPanel";
import BookingSummary from "./components/BookingSummary";
import BookingDetailsModal from "./components/BookingDetailsModal";

const API_URL = "http://localhost:5000";

const getToken = () =>
  localStorage.getItem("authToken") ||
  localStorage.getItem("gc_token") ||
  localStorage.getItem("token");

const BookingHistory = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: "all",
    center: "all",
    dateFrom: "",
    dateTo: "",
    minCost: "",
    maxCost: "",
  });

  /* =========================
      📥 FETCH BOOKINGS
     ========================= */
  const loadBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/reservations/my`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Захиалгуудыг татаж чадсангүй");
      }

      const formatted = data.map((r) => {
  const now = new Date();
  
  // ✅ Timezone засвар — UTC цагийг Mongolia (UTC+8) цагт хөрвүүлнэ
 const toLocal = (str) => {
  if (!str) return new Date();
  const utcStr = str.includes("T") ? str : str.replace(" ", "T") + "Z";
  return new Date(utcStr);
};

const start = toLocal(r.start_time);
const end = toLocal(r.end_time);
  // ✅ DB-н статусыг эхлээд ашиглана
  let status;
  if (r.status === "CANCELLED" || r.status === "AUTO_CANCELLED") {
    status = "cancelled";
  } else if (r.status === "COMPLETED" && end > now) {
    // DB-д COMPLETED боловч цаг болоогүй → upcoming
    status = "upcoming";
  } else if (end < now) {
    status = "completed";
  } else if (start <= now && end >= now) {
    status = "in-progress";
  } else {
    status = "upcoming";
  }

  const durationHours = Math.round(
    (end.getTime() - start.getTime()) / 3600000
  );

  return {
    id: r.id,
    bookingId: `RES-${r.id}`,
    centerName: r.center_name,
    center: r.center_name?.toLowerCase().replace(/\s+/g, "-"),
    date: start.toLocaleDateString("mn-MN"),
    time: `${start.toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" })}`,
    duration: `${durationHours} цаг`,
    cost: Number(r.total_price),
    status,
    seatNumber: r.pc_name || "Auto",
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
});

      setBookings(formatted);
    } catch (e) {
      console.error("BOOKING FETCH ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* =========================
      ❌ CANCEL BOOKING
     ========================= */
  const handleCancel = async (booking) => {
    if (
      !window.confirm(
        `"${booking.centerName}" захиалгыг цуцлах уу?\n${Number(booking.cost).toLocaleString()}₮ буцаалт хийгдэнэ.`
      )
    )
      return;

    setCancelLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/reservations/${booking.id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`✅ ${data.message}`);
        // Жагсаалтыг шинэчилнэ
        setBookings((prev) =>
          prev.map((b) =>
            b.id === booking.id ? { ...b, status: "cancelled" } : b
          )
        );
        setIsDetailsModalOpen(false);
      } else {
        alert(`⚠️ ${data.error || "Цуцлахад алдаа гарлаа"}`);
      }
    } catch {
      alert("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setCancelLoading(false);
    }
  };

  /* =========================
      🎯 CENTER OPTIONS
     ========================= */
  const centerOptions = useMemo(() => {
    const uniqueCenters = Array.from(
      new Map(
        bookings.map((b) => [
          b.center,
          { value: b.center, label: b.centerName },
        ])
      ).values()
    );
    return [{ value: "all", label: "Бүх салбар" }, ...uniqueCenters];
  }, [bookings]);

  /* =========================
      🔍 FILTER LOGIC
     ========================= */
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (filters.status !== "all" && b.status !== filters.status) return false;
      if (filters.center !== "all" && b.center !== filters.center) return false;
      if (filters.dateFrom && b.date < filters.dateFrom) return false;
      if (filters.dateTo && b.date > filters.dateTo) return false;
      if (filters.minCost && b.cost < Number(filters.minCost)) return false;
      if (filters.maxCost && b.cost > Number(filters.maxCost)) return false;
      return true;
    });
  }, [bookings, filters]);

  /* =========================
      RENDER
     ========================= */
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Миний захиалгууд
              </h1>
              <p className="text-muted-foreground mt-1">
                Таны хийсэн захиалгуудын түүх болон идэвхтэй сессүүдийн нэгдсэн хяналт.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/gaming-center-map")}
                variant="default"
                iconName="Plus"
                iconPosition="left"
              >
                Шинэ захиалга
              </Button>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <BookingSummary bookings={bookings} />
          </motion.div>

          {/* Main */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-border bg-muted/20">
              <FilterPanel
                filters={filters}
                centerOptions={centerOptions}
                onFilterChange={(k, v) =>
                  setFilters((p) => ({ ...p, [k]: v }))
                }
                onClearFilters={() =>
                  setFilters({
                    status: "all",
                    center: "all",
                    dateFrom: "",
                    dateTo: "",
                    minCost: "",
                    maxCost: "",
                  })
                }
                totalBookings={bookings.length}
                filteredCount={filteredBookings.length}
              />
            </div>

            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-32"
                  >
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-muted-foreground animate-pulse">
                      Захиалгын мэдээллийг ачаалж байна...
                    </p>
                  </motion.div>
                ) : filteredBookings.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-32"
                  >
                    <Icon
                      name="Calendar"
                      size={48}
                      className="text-muted-foreground/30 mb-4"
                    />
                    <h3 className="text-xl font-semibold text-foreground">
                      Захиалга олдсонгүй
                    </h3>
                    <p className="text-muted-foreground mt-2 text-center max-w-sm px-4">
                      Таны хайлтад тохирох илэрц олдсонгүй.
                    </p>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setFilters({
                          status: "all",
                          center: "all",
                          dateFrom: "",
                          dateTo: "",
                          minCost: "",
                          maxCost: "",
                        })
                      }
                      className="mt-6 text-primary"
                    >
                      Шүүлтүүрийг цэвэрлэх
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-x-auto"
                  >
                    <BookingTable
                      bookings={filteredBookings}
                      selectedBookings={selectedBookings}
                      onSelectBooking={(id, checked) =>
                        setSelectedBookings((p) =>
                          checked ? [...p, id] : p.filter((x) => x !== id)
                        )
                      }
                      onSelectAll={(e) =>
                        setSelectedBookings(
                          e.target.checked
                            ? filteredBookings.map((b) => b.id)
                            : []
                        )
                      }
                      onViewDetails={(b) => {
                        setSelectedBooking(b);
                        setIsDetailsModalOpen(true);
                      }}
                      onCancel={handleCancel}
                      onModify={() => {}}
                      onRebook={() => navigate("/gaming-center-map")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </main>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onCancel={handleCancel}
        onModify={() => {}}
        onRebook={() => navigate("/gaming-center-map")}
      />
    </div>
  );
};

export default BookingHistory;