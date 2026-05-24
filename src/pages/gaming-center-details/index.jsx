import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import GamingCenterHeader from './components/GamingCenterHeader';
import SeatSelectionGrid from './components/SeatSelectionGrid';
import BookingControls from './components/BookingControls';
import CenterInformation from './components/CenterInformation';
import Button from '../../components/ui/Button';

const API_URL = "http://localhost:5000";

const getToken = () =>
  localStorage.getItem("authToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("gc_token") || "";

const GamingCenterDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map хуудаснаас дамжуулсан center мэдээлэл
  const centerFromMap = location.state?.center;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatCount, setSeatCount] = useState(1); // ✅ Суудлын тоо
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pcs, setPcs] = useState([]);
  const [center, setCenter] = useState(null);

  /* ===== CENTER & PC МЭДЭЭЛЭЛ ТАТАХ ===== */
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);

        if (centerFromMap) {
          setCenter(centerFromMap);
          // PC жагсаалт татах
          const res = await fetch(`${API_URL}/api/pcs/${centerFromMap.id}`);
          const data = await res.json();
          setPcs(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Load error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [centerFromMap]);

  /* ===== SEAT DATA ===== */
  const seatData = pcs.map((pc) => ({
    id: pc.id,
    number: pc.seat_number || pc.name,
    status: pc.status === "AVAILABLE" ? "available"
      : pc.status === "BOOKED" ? "booked"
      : pc.status === "IN_USE" ? "in-use"
      : pc.status === "MAINTENANCE" ? "maintenance"
      : "booked",
    specs: pc.specs,
    name: pc.name,
  }));

  /* ===== SEAT SELECT — seatCount хязгаар ===== */
  const handleSeatSelect = (seat) => {
    if (selectedSeats.length >= seatCount) {
      // Хамгийн эхнийхийг солино
      setSelectedSeats([...selectedSeats.slice(1), seat.id]);
      return;
    }
    setSelectedSeats((prev) => [...prev, seat.id]);
  };

  const handleSeatDeselect = (seatId) => {
    setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
  };

  /* ===== seatCount өөрчлөгдөхөд selectedSeats цэвэрлэх ===== */
  const handleSeatCountChange = (count) => {
    setSeatCount(Number(count));
    setSelectedSeats([]);
  };

  const handleBookingUpdate = (details) => {
    setBookingDetails(details);
  };

  /* ===== ЗАХИАЛГА ХИЙХ ===== */
const handleBookNow = async () => {
  // ✅ Эдгээрийг нэмнэ
  console.log("=== ЗАХИАЛГА ===");
  console.log("seatCount STATE:", seatCount);
  console.log("selectedSeats:", selectedSeats);
  console.log("bookingDetails:", bookingDetails);
  
  if (!bookingDetails) {
    alert("Цаг сонгоно уу");
    return;
  }

  const token = getToken();
  if (!token) {
    navigate("/login");
    return;
  }

  // ✅ Нийт үнийг нэг дор шалгана
  const { startDateTime, endDateTime, totalPrice } = bookingDetails;

  if (!startDateTime || !endDateTime || !totalPrice) {
    alert("Захиалгын мэдээлэл дутуу байна");
    return;
  }

  setIsSubmitting(true);

  try {
    // ✅ Суудал бүрт тусдаа захиалга — нэг нэгээр явуулна
    for (let i = 0; i < seatCount; i++) {
      const pcId = selectedSeats[i] || null;
      const pricePerSeat = Math.round(totalPrice / seatCount);

      console.log(`📡 Захиалга ${i + 1}/${seatCount}: pcId=${pcId}, price=${pricePerSeat}`);

      const res = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          centerId: center?.id,
          pcId: pcId,
          total_price: pricePerSeat,
          start_time: startDateTime,
          end_time: endDateTime,
        }),
      });

      const data = await res.json();
      console.log(`✅ Захиалга ${i + 1} үр дүн:`, data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || `${i + 1}-р суудал захиалахад алдаа: ${JSON.stringify(data)}`);
      }
    }

    // ✅ Бүх захиалга амжилттай болсон
    navigate("/booking-history");

  } catch (err) {
    console.error("Booking error:", err);
    alert(`⚠️ ${err.message || "Захиалга амжилтгүй"}`);
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const centerData = {
    id: center?.id,
    name: center?.name,
    hourlyRate: Number(center?.tariff || 5000),
    totalSeats: seatData.length,
    availableSeats: seatData.filter(s => s.status === "available").length,
    operatingHours: center?.working_hours || "09:00 - 23:00",
    address: center?.location,
    latitude: center?.latitude,
    longitude: center?.longitude,
    status: center?.status,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-16 pb-20 container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/gaming-center-map")}
          iconName="ArrowLeft"
          iconPosition="left"
          className="mb-4"
        >
          Буцах
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">
            <GamingCenterHeader
              center={centerData}
              isFavorite={isFavorite}
              onFavoriteToggle={() => setIsFavorite(!isFavorite)}
            />

            <SeatSelectionGrid
              seats={seatData}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              onSeatDeselect={handleSeatDeselect}
              maxSeats={seatCount}
            />

            <CenterInformation center={centerData} />
          </div>

          {/* RIGHT */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <BookingControls
                selectedSeats={selectedSeats}
                centerData={centerData}
                seatCount={seatCount}
                onSeatCountChange={handleSeatCountChange}
                onBookingUpdate={handleBookingUpdate}
                onConfirm={handleBookNow}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingCenterDetails;