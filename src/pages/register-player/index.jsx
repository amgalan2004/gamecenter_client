import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, setToken } from "../../utils/authAPI";
import Navbar from "../../components/Navbar";
import { User, Mail, Phone, Lock, Loader2, ArrowRight } from "lucide-react";

const RegisterPlayer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await register({ ...formData, role: "PLAYER" });

    if (res.token) {
      setToken(res.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: res.username || formData.username,
          email: res.email || formData.email,
          role: "PLAYER",
          balance: res.balance || 0,
        })
      );
      navigate("/gaming-center-map");
    } else {
      setError(res.error || "Бүртгэл амжилтгүй боллоо");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar />

      {/* Арын фон чимэглэл */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-12 font-sans">
        <div className="w-full max-w-lg bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Гарчиг хэсэг */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
              Тоглогчийн <span className="text-blue-500">бүртгэл</span>
            </h2>
            <p className="text-slate-400 font-medium">
              GameCenter Connect-д нэгдэж, тоглоомдоо бэлэн болоорой.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Хэрэглэгчийн нэр */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Таны нэр</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {/* Имэйл */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Имэйл хаяг</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {/* Утас */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Утасны дугаар</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="88xxxxxx"
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Нууц үг */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Нууц үг</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {/* Алдааны мэссэж */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium animate-shake">
                {error}
              </div>
            )}

            {/* Бүртгүүлэх товч */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Түр хүлээнэ үү...
                </>
              ) : (
                <>
                  Бүртгүүлэх
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Доод холбоос */}
            <div className="pt-4 text-center">
              <p className="text-slate-500 font-medium text-sm">
                Аль хэдийн бүртгэлтэй юу?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-400 hover:text-blue-300 font-bold transition-colors ml-1"
                >
                  Нэвтрэх хэсэг
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPlayer;