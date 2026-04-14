import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: localStorage.getItem("rememberedEmail") || "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ============================
      🔁 Already login check
  ============================ */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (userData?.role) {
      handleRoleRedirect(userData.role);
    }
  }, [navigate]);

  const handleRoleRedirect = (role) => {
    const upperRole = role.toUpperCase();
    if (upperRole === "CENTER_ADMIN" || upperRole === "OWNER") {
      navigate("/admin-dashboard", { replace: true });
    } else if (upperRole === "ACCOUNTANT") {
      navigate("/finance-dashboard", { replace: true });
    } else {
      navigate("/gaming-center-map", { replace: true });
    }
  };

  /* ============================
      🧩 Input Handle
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  /* ============================
      🔐 Login Logic
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      setError("Зөв имэйл хаяг оруулна уу");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Server JSON буцаасангүй");
      }

      if (response.ok && result?.token && result?.user) {
        const user = result.user;

        localStorage.setItem("rememberedEmail", formData.email.trim());
        localStorage.setItem("authToken", result.token);

        const userData = {
          username:
            user.username ||
            user.email?.split("@")[0] ||
            "Guest",
          email: user.email,
          role: user.role?.toUpperCase() || "PLAYER",
          id: user.id,
        };

        localStorage.setItem(
          "userData",
          JSON.stringify(userData)
        );

        handleRoleRedirect(userData.role);
      } else {
        setError(
          result?.error ||
            "Имэйл эсвэл нууц үг буруу байна"
        );
      }
    } catch (err) {
      console.error(err);
      setError("Сервертэй холбогдож чадсангүй. Түр хүлээгээд дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar />

      {/* Background Ornaments / Арын фон чимэглэл */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-12 font-sans">
        <div className="w-full max-w-lg bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Header Section / Гарчиг хэсэг */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
              Системд <span className="text-blue-500">нэвтрэх</span>
            </h2>
            <p className="text-slate-400 font-medium">
              Тавтай морилно уу! Мэдээллээ оруулж нэвтэрнэ үү.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input Field */}
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

            {/* Password Input Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-300">Нууц үг</label>
                <button type="button" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                  Нууц үг мартсан?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-12 pr-12 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message Section */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Шалгаж байна...
                </>
              ) : (
                <>
                  Нэвтрэх
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Navigation to Register */}
            <div className="pt-6 text-center">
              <p className="text-slate-500 font-medium text-sm">
                Бүртгэл байхгүй юу?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-blue-400 hover:text-blue-300 font-bold transition-colors ml-1"
                >
                  Шинэ бүртгэл үүсгэх
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;