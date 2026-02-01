import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import BookingModal from "./components/BookingModal";
import MapContainer from "./components/MapContainer";

const DEFAULT_LOCATION = { lat: 47.918873, lng: 106.917701 };

const GamingCenterMap = () => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingCenter, setBookingCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [gamingCenters, setGamingCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Төвүүд татах
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/centers");
        const data = await res.json();

        if (Array.isArray(data)) {
          setGamingCenters(
            data.map((c) => ({
              id: c.id,
              name: c.name,
              address: c.location || "Байршил тодорхойгүй",
              lat: parseFloat(c.latitude) || DEFAULT_LOCATION.lat,
              lng: parseFloat(c.longitude) || DEFAULT_LOCATION.lng,
              hourlyRate: c.tariff || 0,
              image:
                "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
              rating: 4.2 + Math.random() * 0.5,
              pcs: Math.floor(10 + Math.random() * 40),
              availability: ["high", "medium", "low"][
                Math.floor(Math.random() * 3)
              ],
              totalPCs: Math.floor(20 + Math.random() * 30),
              working_hours: c.working_hours || "10:00 - 22:00",
            }))
          );
        }
      } catch (err) {
        console.error("Centers fetch failed:", err);
        setError("Төвүүдийн мэдээлэл татахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // Хэрэглэгчийн байршил авах
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => setUserLocation(DEFAULT_LOCATION)
      );
    } else {
      setUserLocation(DEFAULT_LOCATION);
    }
  }, []);

  const handleBookingClick = (center) => {
    setBookingCenter(center);
    setIsBookingModalOpen(true);
  };

  return (
    // 🎨 Нийт хуудсыг Booking History шиг dark background болгов
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row pt-16 overflow-hidden">
        {/* Зүүн тал — лист хэсэг */}
        <div className="flex-1 px-6 py-6 overflow-y-auto bg-background border-r border-border">
          {loading ? (
            <p className="text-center text-muted-foreground mt-20">
              Төвүүдийг ачаалж байна...
            </p>
          ) : error ? (
            <p className="text-center text-destructive mt-20">{error}</p>
          ) : gamingCenters.length === 0 ? (
            <div className="text-center text-muted-foreground mt-20">
              Төвүүдийн мэдээлэл олдсонгүй...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {gamingCenters.map((center) => (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`rounded-2xl bg-card shadow-sm hover:shadow-lg transition-all overflow-hidden border cursor-pointer duration-200 ${
                    selectedCenter?.id === center.id
                      ? "border-accent ring-1 ring-accent/50"
                      : "border-border hover:border-accent/40"
                  }`}
                >
                  <img
                    src={center.image}
                    alt={center.name}
                    className="w-full h-44 object-cover"
                  />

                  <div className="p-4 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-base text-foreground truncate">
                        {center.name}
                      </h3>
                      <span className="text-sm text-yellow-400">
                        ★ {center.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground truncate">
                      📍 {center.address}
                    </p>

                    <p className="text-accent font-semibold">
                      ₮{center.hourlyRate.toLocaleString()} / цаг
                    </p>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-muted-foreground">
                        💻 {center.totalPCs} PC
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(center);
                        }}
                        className="bg-accent text-accent-foreground text-xs px-4 py-2 rounded-lg hover:bg-accent/90 transition"
                      >
                        Захиалах
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Баруун тал — Map */}
        <div className="w-full lg:w-[38%] h-[60vh] lg:h-auto lg:sticky lg:top-20 p-4 bg-background border-l border-border">
          <div className="w-full h-full rounded-3xl bg-card shadow-lg border border-border overflow-hidden">
            <MapContainer
              gamingCenters={gamingCenters}
              userLocation={userLocation}
              selectedCenter={selectedCenter}
              onCenterSelect={setSelectedCenter}
              onBookingClick={handleBookingClick}
            />
          </div>

          {/* Газрын зураг хаах товч (зөвхөн мобайлд) */}
          <div className="flex justify-center mt-4 lg:hidden">
            <button className="bg-accent text-accent-foreground text-sm px-5 py-2 rounded-full hover:bg-accent/90 shadow">
              Газрын зургийг хаах →
            </button>
          </div>
        </div>
      </main>

      <BookingModal
        center={bookingCenter}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default GamingCenterMap;
