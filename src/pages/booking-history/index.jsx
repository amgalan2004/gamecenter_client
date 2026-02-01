// index.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const formatted = data.map((r) => {
          const now = new Date();
          const start = new Date(r.start_time);
          const end = new Date(r.end_time);

          let status = "upcoming";
          if (end < now) status = "completed";
          else if (start <= now && end >= now) status = "in-progress";

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
            status,
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

    return [{ value: "all", label: "All Centers" }, ...uniqueCenters];
  }, [bookings]);

  /* =========================
     🔍 FILTER
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Booking History</h1>
              <p className="text-muted-foreground">
                Your real reservation history
              </p>
            </div>

            <Button onClick={() => navigate("/gaming-center-map")} iconName="Plus">
              New Booking
            </Button>
          </div>

          <BookingSummary bookings={bookings} />

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

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="Calendar" size={48} />
              <p>No bookings found</p>
            </div>
          ) : (
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
          )}
        </div>
      </main>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
};

export default BookingHistory;
