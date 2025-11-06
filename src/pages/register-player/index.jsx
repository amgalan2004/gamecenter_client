import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, setToken } from "../../utils/authAPI";
import Navbar from "../../components/Navbar";

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
      // ✅ Token хадгалах
      setToken(res.token);

      // ✅ Хэрэглэгчийн мэдээлэл localStorage-д хадгалах (Header-д хэрэглэгдэнэ)
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: res.username || formData.username,
          email: res.email || formData.email,
          role: "PLAYER",
          balance: res.balance || 0,
        })
      );

      // ✅ Хэрэглэгчийг map хуудас руу чиглүүлэх
      navigate("/gaming-center-map");
    } else {
      setError(res.error || "Бүртгэл амжилтгүй боллоо");
    }
    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-4">
        <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-4">Тоглогчийн бүртгэл</h2>
          <p className="text-gray-400 text-center mb-6">
            GameCenter Connect-д тоглогчоор нэгдэж, төвүүдийг нээнэ үү.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Нэр</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Таны нэр"
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Имэйл</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Утасны дугаар</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="88112233"
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Нууц үг</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-400 text-center text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Аль хэдийн бүртгэлтэй?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:text-blue-300 underline"
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

export default RegisterPlayer;
