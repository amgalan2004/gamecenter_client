// src/pages/booking-history/index.jsx
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
  localStorage.getItem("gc_token") ||
  localStorage.getItem("token") ||
  localStorage.getItem("authToken");

const BookingHistory = () => {
  const navigate = useNavigate();

  // --- States ---
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/reservations/my`, {
          headers: { 
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          },
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Гүйлгээг татаж чадсангүй");
        }

        // Өгөгдлийг форматлах
        const formatted = data.map((r) => {
          const now = new Date();
          const start = new Date(r.start_time);
          const end = new Date(r.end_time);

          // Төлөв тодорхойлох
          let status = "upcoming";
          if (end < now) {
            status = "completed";
          } else if (start <= now && end >= now) {
            status = "in-progress";
          }

          // Хугацаа тооцоолох
          const durationHours = Math.round(
            (end.getTime() - start.getTime()) / 3600000
          );

          return {
            id: r.id,
            bookingId: `RES-${r.id}`,
            centerName: r.center_name,
            center: r.center_name
              ?.toLowerCase()
              .replace(/\s+/g, "-"),
            date: start.toISOString().split("T")[0],
            time: `${start.toTimeString().slice(0, 5)} - ${end
              .toTimeString()
              .slice(0, 5)}`,
            duration: `${durationHours} цаг`,
            cost: Number(r.total_price),
            status: status,
            seatNumber: r.pc_name || "Auto",
          };
        });

        setBookings(formatted);
      } catch (e) {
        console.error("BOOKING FETCH ERROR:", e);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  /* =========================
      🎯 DYNAMIC CENTER OPTIONS
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
          
          {/* Header Section - Wallet стильтэй ижил */}
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

          {/* Summary Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <BookingSummary bookings={bookings} />
          </motion.div>

          {/* Main Content Area - Wallet-тай ижил bg-card болон border ашиглав */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
          >
            {/* Filter Panel Container */}
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

            {/* Data Display Area */}
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
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
                    <Icon name="Calendar" size={48} className="text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">Захиалга олдсонгүй</h3>
                    <p className="text-muted-foreground mt-2 text-center max-w-sm px-4">
                      Таны хайлтад тохирох илэрц олдсонгүй. Шүүлтүүрээ цэвэрлэх эсвэл өөрчилж үзнэ үү.
                    </p>
                    <Button 
                      variant="ghost" 
                      onClick={() => setFilters({ status: "all", center: "all", dateFrom: "", dateTo: "", minCost: "", maxCost: "" })}
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
                          e.target.checked ? filteredBookings.map((b) => b.id) : []
                        )
                      }
                      onViewDetails={(b) => {
                        setSelectedBooking(b);
                        setIsDetailsModalOpen(true);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
};

export default BookingHistory;