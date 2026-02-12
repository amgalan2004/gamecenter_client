import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ============================
     🔁 Already login check
  ============================ */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (userData?.role) {
      if (userData.role === "CENTER_ADMIN" || userData.role === "OWNER") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/gaming-center-map", { replace: true });
      }
    }
  }, [navigate]);

  /* ============================
     🧩 Input
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
     🔐 Login
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

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

        // ✅ Token
        localStorage.setItem("authToken", result.token);

        // ✅ User data
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

        // ✅ Redirect
        if (
          userData.role === "CENTER_ADMIN" ||
          userData.role === "OWNER"
        ) {
          navigate("/admin-dashboard", {
            replace: true,
          });
        } else {
          navigate("/gaming-center-map", {
            replace: true,
          });
        }
      } else {
        setError(
          result?.error ||
            "Имэйл эсвэл нууц үг буруу"
        );
      }
    } catch (err) {
      console.error(err);
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================
     🖥 UI
  ============================ */
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-6">

        <div className="w-full max-w-md">

          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-semibold text-center mb-6">
              Нэвтрэх
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Имэйл"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                placeholder="Нууц үг"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {/* Error */}
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
                  ⚠️ {error}
                </div>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg py-3 font-semibold transition ${
                  isLoading
                    ? "bg-blue-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading
                  ? "Нэвтэрч байна..."
                  : "Нэвтрэх"}
              </button>

              {/* Register */}
              <p className="text-center text-gray-400 text-sm">
                Бүртгэлгүй байна уу?{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/register")
                  }
                  className="text-blue-400 underline"
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
