import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"; // ✅ Шинэ navbar нэмсэн

const Register = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ Навигацийн хэсэг */}
      <Navbar />

      {/* ✅ Register Section */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-4 pt-24">
        {/* Title */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-gray-400 text-lg">
            Join the <span className="text-blue-400">GameCenter Connect</span> community.  
            Choose your role below to get started.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Player Card */}
          <div
            onClick={() => navigate("/register/player")}
            className="cursor-pointer backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10 hover:scale-105 hover:bg-white/20 transition-all duration-300 shadow-lg"
          >
            <div className="flex flex-col items-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-4xl">
                🎮
              </div>
              <h2 className="text-2xl font-semibold text-blue-300">
                Player Registration
              </h2>
              <p className="text-gray-300 text-center text-base leading-relaxed">
                Discover, book, and compete in gaming centers across your city.
              </p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full shadow transition">
                Continue as Player
              </button>
            </div>
          </div>

          {/* Game Center Admin Card */}
          <div
            onClick={() => navigate("/register/center")}
            className="cursor-pointer backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10 hover:scale-105 hover:bg-white/20 transition-all duration-300 shadow-lg"
          >
            <div className="flex flex-col items-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl">
                🏢
              </div>
              <h2 className="text-2xl font-semibold text-emerald-300">
                Game Center Registration
              </h2>
              <p className="text-gray-300 text-center text-base leading-relaxed">
                Manage your gaming hub, bookings, and players seamlessly.
              </p>
              <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-full shadow transition">
                Continue as Admin
              </button>
            </div>
          </div>
        </div>

        {/* Already Have an Account */}
        <p className="mt-12 text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 underline transition"
          >
            Sign In
          </button>
        </p>
      </div>
    </>
  );
};

export default Register;
