import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { User, Mail, Lock, Phone, Key, ShieldCheck } from "lucide-react";

const RegisterAccountant = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0); // Код дахин илгээх хугацаа

  const [formData, setFormData] = useState({
    username: "",
    email: "", // Санхүүчийн хувийн имэйл
    centerEmail: "", // PC төвийн баталгаажуулах имэйл хүлээн авах хаяг
    verificationCode: "", // Баталгаажуулах код
    phone: "",
    password: "",
    confirmPassword: "",
    role: "ACCOUNTANT",
  });

  // Секунд тоолох логик
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Баталгаажуулах код илгээх функц
  const handleSendCode = async () => {
    if (!formData.centerEmail) {
      return setError("PC төвийн имэйл хаягийг оруулна уу!");
    }

    setIsSendingCode(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Backend чинь { centerEmail } гэж хүлээж авч байгаа тул:
        body: JSON.stringify({ centerEmail: formData.centerEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Баталгаажуулах код PC төвийн имэйл рүү илгээгдлээ.");
        setTimer(60); // 60 секунд хүлээлгэнэ
      } else {
        setError(result.error || "Код илгээхэд алдаа гарлаа.");
      }
    } catch (err) {
      setError("Сервертэй холбогдож чадсангүй.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Баталгаажуулалт
    if (formData.password !== formData.confirmPassword) {
      return setError("Нууц үг зөрүүтэй байна!");
    }
    if (!formData.verificationCode) {
      return setError("Баталгаажуулах кодыг оруулна уу!");
    }

    setIsLoading(true);
    setError("");

    try {
      // Backend чинь бүх бүртгэлийг /api/auth/register дээр авч байгаа тул:
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Санхүүч амжилттай баталгаажиж бүртгэгдлээ. Нэвтэрч орно уу.");
        navigate("/login");
      } else {
        setError(result.error || "Бүртгэл амжилтгүй");
      }
    } catch (err) {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white py-12 px-6">
        <div className="w-full max-w-lg">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -z-10"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-amber-400 tracking-tight">Accountant Registration</h2>
              <p className="text-gray-400 text-sm mt-2">Санхүүчийн бүртгэлийг PC төвөөр баталгаажуулна</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Identity - Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    name="username" 
                    placeholder="Хэрэглэгчийн нэр" 
                    value={formData.username}
                    onChange={handleChange} 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    name="phone" 
                    placeholder="Утасны дугаар" 
                    value={formData.phone}
                    onChange={handleChange} 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                  />
                </div>
              </div>

              {/* Personal Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Таны хувийн имэйл хаяг" 
                  value={formData.email}
                  onChange={handleChange} 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                />
              </div>

              {/* Center Verification Section - Amber Box */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center space-x-2">
                   <ShieldCheck size={16} className="text-amber-500" />
                   <label className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                     PC төвийн баталгаажуулалт
                   </label>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3.5 text-amber-500/60" size={18} />
                    <input 
                      type="email" 
                      name="centerEmail" 
                      placeholder="PC төвийн бүртгэлтэй имэйл" 
                      value={formData.centerEmail}
                      onChange={handleChange} 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleSendCode} 
                    disabled={isSendingCode || timer > 0}
                    className="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white px-4 rounded-xl text-xs font-bold transition-all min-w-[100px] shadow-lg shadow-amber-900/20"
                  >
                    {timer > 0 ? `${timer}с хүлээ` : isSendingCode ? "Илгээж байна..." : "Код авах"}
                  </button>
                </div>

                <div className="relative">
                  <Key className="absolute left-3 top-3.5 text-amber-500/60" size={18} />
                  <input 
                    type="text" 
                    name="verificationCode" 
                    placeholder="6 оронтой код оруулна уу" 
                    value={formData.verificationCode}
                    onChange={handleChange} 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-gray-600" 
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Нууц үг" 
                    value={formData.password}
                    onChange={handleChange} 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Нууц үг давтах" 
                    value={formData.confirmPassword}
                    onChange={handleChange} 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                  />
                </div>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="text-red-400 text-xs text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20 animate-pulse">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-500 py-4 rounded-xl font-bold transition shadow-xl shadow-amber-900/40 active:scale-[0.98] disabled:bg-gray-700 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? "Бүртгэл хийгдэж байна..." : "Санхүүчээр бүртгүүлэх"}
              </button>
            </form>
          </div>
          
          {/* Back to selection */}
          <div className="mt-8 text-center">
             <button 
               onClick={() => navigate("/register")}
               className="text-gray-500 hover:text-white text-sm transition transition-colors"
             >
               ← Буцах
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterAccountant;