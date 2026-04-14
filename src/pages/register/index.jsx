import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { 
  Gamepad2, 
  Building2, 
  Wallet, 
  ArrowRight, 
  UserPlus 
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <Navbar />

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-20">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider mb-2">
            <UserPlus className="w-3 h-3" />
            Join the movement
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Account</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Join the <span className="text-blue-400 font-medium">GameCenter Connect</span> community. 
            Choose your path below to get started.
          </p>
        </div>

        {/* Role Selection Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          
          {/* Player Card */}
          <RoleCard
            title="Player Registration"
            description="Discover, book, and compete in gaming centers across your city."
            icon={<Gamepad2 className="w-8 h-8 text-blue-400" />}
            color="blue"
            buttonText="Continue as Player"
            onClick={() => navigate("/register/player")}
          />

          {/* Center Admin Card */}
          <RoleCard
            title="Center Admin"
            description="Manage your gaming hub, bookings, and players seamlessly in one place."
            icon={<Building2 className="w-8 h-8 text-emerald-400" />}
            color="emerald"
            buttonText="Continue as Admin"
            onClick={() => navigate("/register/center")}
          />

          {/* Accountant Card */}
          <RoleCard
            title="Accountant"
            description="Track center finances, expenses, and generate detailed financial reports."
            icon={<Wallet className="w-8 h-8 text-amber-400" />}
            color="amber"
            buttonText="Continue as Accountant"
            onClick={() => navigate("/register/accountant")}
          />

        </div>

        {/* Footer Link */}
        <div className="mt-16 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-slate-500 font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors ml-1 hover:underline underline-offset-4"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   Reusable Sub-Component: RoleCard
   ========================================================================== */

const RoleCard = ({ title, description, icon, color, buttonText, onClick }) => {
  // Өнгөний тохиргоонууд
  const colorVariants = {
    blue: "hover:border-blue-500/50 group-hover:bg-blue-500/10 bg-blue-500/20 text-blue-400",
    emerald: "hover:border-emerald-500/50 group-hover:bg-emerald-500/10 bg-emerald-500/20 text-emerald-400",
    amber: "hover:border-amber-500/50 group-hover:bg-amber-500/10 bg-amber-500/20 text-amber-400",
  };

  const btnVariants = {
    blue: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20",
    emerald: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20",
    amber: "bg-amber-600 hover:bg-amber-500 shadow-amber-900/20",
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer relative flex flex-col justify-between p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 transition-all duration-500 hover:-translate-y-2 ${colorVariants[color].split(' ')[0]}`}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        {/* Icon Container */}
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${colorVariants[color].split(' ').slice(1).join(' ')}`}>
          {icon}
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-50">{title}</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            {description}
          </p>
        </div>
      </div>

      <button className={`relative z-10 mt-10 w-full py-4 px-6 rounded-2xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 group/btn ${btnVariants[color]}`}>
        {buttonText}
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default Register;