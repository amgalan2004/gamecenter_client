import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { login, setToken } from "../../../utils/authAPI";
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setErrors({ general: "Бүх талбарыг бөглөнө үү." });
    }

    setIsLoading(true);

    try {
      const res = await login(formData);

      if (res.error) {
        setErrors({ general: res.error });
      } else {
        setToken(res.token, res.role);

        // ✅ Redirect based on role
        if (res.role === "CENTER_ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/gaming-center-map");
        }
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: "Нэвтрэлт амжилтгүй. Дахин оролдоно уу." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative group">
      {/* Картны ард талын гэрлэн эффект */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        
        {/* Толгой хэсэг */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
            <LogIn className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Тавтай <span className="text-blue-500">морил</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            GameCenter Connect-д нэвтрэх
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email талбар */}
          <div className="space-y-2">
            <Input
              label="Имэйл хаяг"
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              className="w-full bg-white/[0.03] border-white/10 text-white rounded-2xl focus:ring-blue-500/50"
            />
          </div>

          {/* Нууц үг талбар */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-slate-300">Нууц үг</label>
              <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">
                Мартсан?
              </button>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
              className="w-full bg-white/[0.03] border-white/10 text-white rounded-2xl focus:ring-blue-500/50"
            />
          </div>

          {/* Алдааны мэссэж */}
          {errors.general && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" />
              {errors.general}
            </div>
          )}

          {/* Нэвтрэх товчлуур */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isLoading}
            fullWidth
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Шалгаж байна...
              </>
            ) : (
              <>
                Нэвтрэх
                <LogIn className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        {/* Бүртгүүлэх холбоос */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Бүртгэлгүй юу?{" "}
            <a href="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors ml-1">
              Шинээр бүртгүүлэх
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;