import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🧩 Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // 🧭 Login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("❌ Invalid JSON response:", text);
        throw new Error("Серверээс буруу хариу ирлээ. Backend JSON буцаах ёстой.");
      }

      console.log("🔹 Login response:", result);

      if (response.ok && result?.token && result?.user) {
        const user = result.user;

        // ✅ Token хадгалах
        localStorage.setItem("authToken", result.token);

        // ✅ Хэрэглэгчийн мэдээлэл хадгалах
        const userData = {
          username: user.username || user.email?.split("@")[0] || "Guest",
          email: user.email || formData.email,
          role: user.role?.toUpperCase?.() || "PLAYER",
          id: user.id,
        };
        localStorage.setItem("userData", JSON.stringify(userData));

        // ✅ Role-based redirect
        if (userData.role === "CENTER_ADMIN" || userData.role === "OWNER") {
          console.log("✅ CENTER_ADMIN илэрлээ → /admin-dashboard руу орж байна...");
          navigate("/admin-dashboard", { replace: true });
        } else {
          console.log("✅ PLAYER илэрлээ → /gaming-center-map руу орж байна...");
          navigate("/gaming-center-map", { replace: true });
        }
      } else {
        setError(result?.error || "Имэйл эсвэл нууц үг буруу байна.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("Сервертэй холбогдоход алдаа гарлаа. Сервер ажиллаж байгаа эсэхээ шалгана уу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-6">
        {/* 🕹 Left Section */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left max-w-lg">
          <h1 className="text-5xl font-extrabold leading-tight">
            Тавтай морил{" "}
            <span className="text-blue-400">GameCenter Connect</span>-д!
          </h1>
          <p className="text-gray-400 text-lg">
            Тоглоомын төвүүдийг хайж, суудал захиалаад, хамт тоглогчидтой холбогдоорой.
          </p>
        </div>

        {/* 💡 Right Section (Login Form) */}
        <div className="md:w-1/2 w-full max-w-md mt-12 md:mt-0">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-semibold text-center mb-6">Нэвтрэх</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Имэйл"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                autoComplete="username"
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                placeholder="Нууц үг"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                autoComplete="current-password"
              />

              {/* Error */}
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full transition rounded-lg py-3 font-semibold shadow-md ${
                  isLoading
                    ? "bg-blue-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
              </button>

              {/* Register Link */}
              <p className="text-center text-gray-400 text-sm">
                Бүртгэлгүй байна уу?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Бүртгүүлэх
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
