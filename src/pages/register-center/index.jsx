import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  ArrowRight, 
  Loader2,
  Navigation
} from "lucide-react"; // Icon-ууд нэмсэн

// Маркерын дүрс тохируулга
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
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
    return (
      <Marker 
        position={[formData.latitude, formData.longitude]} 
        icon={markerIcon} 
      />
    );
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
        username: formData.center_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: "CENTER_ADMIN",
        center_name: formData.center_name.trim(),
        location: formData.location.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

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
        throw new Error("Серверээс буруу форматтай хариу ирлээ.");
      }

      if (res.ok && result.success) {
        alert("✅ Таны тоглоомын төв амжилттай бүртгэгдлээ!");
        navigate("/login");
      } else {
        setError(result.error || "Бүртгэл амжилтгүй боллоо.");
      }
    } catch (err) {
      setError("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20 flex justify-center items-center">
        <div className="w-full grid lg:grid-cols-2 gap-0 bg-[#161b2a] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
          
          {/* Зүүн тал: Форм */}
          <div className="p-8 lg:p-12">
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
                Төв <span className="text-emerald-500">Бүртгүүлэх</span>
              </h2>
              <p className="text-slate-400">
                GameCenter Connect-д нэгдэж, бизнесээ өргөжүүлээд эхэл.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Төвийн нэр</label>
                  <div className="relative group">
                    <Store className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      name="center_name"
                      placeholder="Arena Esports"
                      value={formData.center_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1e2536] border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Утас</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="99001122"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1e2536] border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Имэйл хаяг</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="contact@arena.mn"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1e2536] border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Хаягийн дэлгэрэнгүй</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    name="location"
                    placeholder="БГД, 3-р хороолол, Соло молл 4-р давхар"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1e2536] border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Нууц үг</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1e2536] border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Бүртгэл дуусгах <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-slate-500 text-sm mt-6">
                Аль хэдийн бүртгүүлсэн үү?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors hover:underline underline-offset-4"
                >
                  Нэвтрэх хэсэг
                </button>
              </p>
            </form>
          </div>

          {/* Баруун тал: Газрын зураг */}
          <div className="relative bg-[#1e2536] border-l border-white/5 flex flex-col">
            <div className="absolute top-6 left-6 z-[1000] bg-[#161b2a]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl max-w-[240px]">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Navigation className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="font-bold text-white text-sm">Байршил сонгох</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Төвийнхөө байршлыг газрын зураг дээр дарж баталгаажуулна уу.
              </p>
            </div>

            <div className="flex-grow h-[400px] lg:h-full relative overflow-hidden">
              <MapContainer
                center={[formData.latitude, formData.longitude]}
                zoom={14}
                zoomControl={false} // Цэвэрхэн харагдуулах
                style={{ height: "100%", width: "100%", filter: "grayscale(0.2) invert(0.05)" }}
              >
                <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
/>
                <LocationPicker />
              </MapContainer>
            </div>

            <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
              <div className="bg-[#161b2a]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg text-[12px] font-mono text-emerald-500 flex items-center gap-3">
                <span className="text-slate-500 text-[10px] uppercase tracking-widest">Lat</span>
                {formData.latitude.toFixed(6)}
                <div className="w-px h-3 bg-white/10" />
                <span className="text-slate-500 text-[10px] uppercase tracking-widest">Lng</span>
                {formData.longitude.toFixed(6)}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RegisterCenter;