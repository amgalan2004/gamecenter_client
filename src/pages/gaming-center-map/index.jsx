import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import BookingModal from "./components/BookingModal";
import CenterListSidebar from "./components/CenterListSidebar";
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
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // ✅ Game centers татах
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
        console.error("❌ Centers fetch failed:", err);
        setError("Төвүүдийн мэдээлэл татахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // ✅ Хэрэглэгчийн байршил авах
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
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row pt-16 overflow-hidden bg-[#f5f7fb]">
        {/* 🧱 Зүүн хэсэг — Game centers grid */}
        <div className="flex-1 px-8 py-6 overflow-y-auto bg-white border-r border-gray-200 shadow-sm">
          {loading ? (
            <p className="text-center text-gray-400 mt-20">
              Төвүүдийг ачаалж байна...
            </p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : gamingCenters.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              Төвүүдийн мэдээлэл олдсонгүй...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {gamingCenters.map((center) => (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`rounded-2xl bg-white shadow hover:shadow-lg transition overflow-hidden border cursor-pointer ${
                    selectedCenter?.id === center.id
                      ? "border-blue-500 ring-1 ring-blue-300"
                      : "border-gray-100"
                  }`}
                >
                  <img
                    src={center.image}
                    alt={center.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg text-gray-800 truncate">
                        {center.name}
                      </h3>
                      <span className="text-sm text-yellow-500">
                        ⭐ {center.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mt-1 truncate">
                      📍 {center.address}
                    </p>
                    <p className="text-blue-600 font-semibold mt-2">
                      ₮{center.hourlyRate.toLocaleString()} /цаг
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-400">
                        💻 {center.totalPCs} PC
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(center);
                        }}
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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

        {/* 🌍 Баруун хэсэг — Газрын зураг */}
        <div className="w-full lg:w-[38%] h-[60vh] lg:h-auto lg:sticky lg:top-16 p-4 bg-[#f5f7fb] border-l border-gray-200">
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <MapContainer
              gamingCenters={gamingCenters}
              userLocation={userLocation}
              selectedCenter={selectedCenter}
              onCenterSelect={setSelectedCenter}
              onBookingClick={handleBookingClick}
            />
          </div>

          {/* 🔘 Газрын зураг хаах товч */}
          <div className="flex justify-center mt-3">
            <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-full hover:bg-blue-700 shadow transition">
              Газрын зургийг хаах →
            </button>
          </div>
        </div>
      </main>

      {/* 🗓️ Захиалгын модал */}
      <BookingModal
        center={bookingCenter}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default GamingCenterMap;
