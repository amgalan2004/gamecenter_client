import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const RegisterCenter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    center_name: "",
    email: "",
    phone: "",
    location: "",
    latitude: 47.918873,
    longitude: 106.917701,
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 📍 Газрын зураг дээр дархад координат хадгалах
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      },
    });
    return <Marker position={[formData.latitude, formData.longitude]} icon={markerIcon} />;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        username: formData.center_name || "Center Owner", // backend-т username заавал хэрэгтэй
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: "CENTER_ADMIN",
        center_name: formData.center_name.trim(),
        location: formData.location.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      console.log("🟢 Register payload:", payload);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resultText = await res.text();
      let result;
      try {
        result = JSON.parse(resultText);
      } catch (err) {
        console.error("❌ Invalid JSON from backend:", resultText);
        throw new Error("Сервер буруу форматтай хариу илгээсэн байна.");
      }

      console.log("🔹 Register-center response:", result);

      if (res.ok && result.success) {
        alert("✅ Таны тоглоомын төв амжилттай бүртгэгдлээ!");
        navigate("/login");
      } else {
        setError(result.error || "Бүртгэл амжилтгүй боллоо. Та дахин оролдоно уу.");
      }
    } catch (err) {
      console.error("❌ Register Error:", err);
      setError("Сервертэй холбогдоход алдаа гарлаа. Сервер ажиллаж байгаа эсэхээ шалгана уу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-4 py-10">
        <div className="w-full max-w-lg backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-center mb-4 text-emerald-400">
            🕹️ Тоглоомын төв бүртгэх
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Газрын зураг дээр дарж төвийн байршлыг сонгоно уу.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Төвийн нэр", name: "center_name", placeholder: "Arena Esports" },
              { label: "Имэйл", name: "email", type: "email", placeholder: "arena@email.com" },
              { label: "Утас", name: "phone", type: "tel", placeholder: "99001122" },
              { label: "Байршлын тайлбар", name: "location", placeholder: "УБ, Хороолол, 25-р байр" },
              { label: "Нууц үг", name: "password", type: "password", placeholder: "••••••••" },
            ].map(({ label, name, type = "text", placeholder }) => (
              <div key={name}>
                <label className="block text-sm mb-1 text-gray-300">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  autoComplete={name === "password" ? "new-password" : "off"}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
            ))}

            <div className="h-64 rounded-xl overflow-hidden mt-4 border border-white/20">
              <MapContainer
                center={[formData.latitude, formData.longitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationPicker />
              </MapContainer>
            </div>

            <div className="text-sm text-gray-400 mt-2 text-center">
              📍 Latitude:{" "}
              <span className="text-emerald-400">{formData.latitude.toFixed(5)}</span> | Longitude:{" "}
              <span className="text-emerald-400">{formData.longitude.toFixed(5)}</span>
            </div>

            {error && (
              <p className="text-red-400 text-center text-sm mt-2 bg-red-500/10 py-2 rounded-lg">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading
                  ? "bg-emerald-700 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } transition rounded-lg py-3 font-semibold shadow-lg`}
            >
              {isLoading ? "⏳ Бүртгэж байна..." : "Бүртгүүлэх"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Аль хэдийн бүртгэлтэй юу?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                Нэвтрэх
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterCenter;
