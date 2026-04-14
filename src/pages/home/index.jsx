import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { 
  Gamepad2, 
  Zap, 
  CreditCard, 
  ChevronDown, 
  Rocket, 
  Map, 
  ShieldCheck, 
  Users, 
  Building2 
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  /* ============================
      🔐 Auto Redirect if Logged In
  ============================ */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (userData?.role) {
      if (userData.role === "PLAYER") {
        navigate("/gaming-center-map", { replace: true });
      }

      if (userData.role === "CENTER_ADMIN" || userData.role === "OWNER") {
        navigate("/admin-dashboard", { replace: true });
      }
    }
  }, [navigate]);

  /* ============================
      📊 Load Platform Stats
  ============================ */
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/stats/platform-stats"
        );

        const data = await res.json();

        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error("Stats load error:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 px-6">
        {/* Арын фонны эффектүүд */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Шинэ үеийн Gaming Платформ
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[1.1]">
            Нэгд. Тогло. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Ял.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Тоглоомын төвүүдийг олох, суудал захиалах, төлбөр хийх болон 
            хамт тоглогчтойгоо холбогдох хамгийн хялбар дижитал орчин.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <button
              onClick={() => navigate("/register")}
              className="group relative px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              🚀 Одоо эхлэх
            </button>

            <button
              onClick={() => navigate("/gaming-center-map")}
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all backdrop-blur-md flex items-center gap-3"
            >
              <Map className="w-5 h-5 text-blue-400" />
              Төвүүдийг харах
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer">
          <ChevronDown className="w-8 h-8 text-slate-500" />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Яагаад <span className="text-blue-500">Connect</span> гэж?
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={<Gamepad2 className="w-8 h-8 text-blue-400" />}
              title="Төвөө хялбар ол"
              desc="Газрын зураг ашиглан хамгийн ойр, сул суудалтай төвүүдийг бодит цагт олно."
            />
            <Feature
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Түргэн захиалга"
              desc="Хэдхэн секундын дотор суудлаа захиалж, цагаа хэмнээрэй."
            />
            <Feature
              icon={<CreditCard className="w-8 h-8 text-emerald-400" />}
              title="Аюулгүй төлбөр"
              desc="Дотоод цахим түрийвч ашиглан найдвартай бөгөөд хялбар төлбөр хийнэ."
            />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {loadingStats ? (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            ) : (
              <>
                <TrustCard
                  icon={<Building2 className="w-6 h-6" />}
                  number={`${stats?.centers || 0}+`}
                  text="Хамтран ажиллагч төв"
                />
                <TrustCard
                  icon={<Users className="w-6 h-6" />}
                  number={`${stats?.users || 0}+`}
                  text="Идэвхтэй тоглогч"
                />
                <TrustCard
                  icon={<ShieldCheck className="w-6 h-6" />}
                  number={`${stats?.uptime || 99.9}%`}
                  text="Системийн ажиллагаа"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10 bg-gradient-to-b from-blue-600/10 to-transparent p-12 rounded-[3rem] border border-blue-500/10 backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Платформын тухай
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed">
            GameCenter Connect бол тоглогч болон тоглоомын төвүүдийг нэг дор холбосон 
            Монголын анхны иж бүрэн дижитал систем юм. Бид тоглоомын соёлыг шинэ шатанд гаргахыг зорьж байна.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 rounded-2xl bg-white text-slate-950 font-bold hover:scale-105 transition-transform"
          >
            🤝 Бидэнтэй нэгдэх
          </button>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto relative overflow-hidden bg-blue-600 rounded-[2.5rem] p-12 md:p-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Бэлэн үү? Тоглоомоо эхлүүл!
              </h2>
              <p className="text-blue-100 text-lg opacity-90">
                Яг одоо бүртгүүлээд GameCenter Connect-ийн давуу талыг мэдэр.
              </p>
            </div>
            
            <button
              onClick={() => navigate("/register")}
              className="whitespace-nowrap px-10 py-5 rounded-2xl bg-white text-blue-600 font-black text-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              ҮНЭГҮЙ ЭХЛЭХ
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-[#020617] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="font-black text-2xl text-white">
            GAMECENTER <span className="text-blue-500">CONNECT</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} GameCenter Connect. All rights reserved.
          </p>
          <div className="flex justify-center gap-8 text-slate-400 text-sm">
            <a href="#" className="hover:text-blue-400 transition">Үйлчилгээний нөхцөл</a>
            <a href="#" className="hover:text-blue-400 transition">Нууцлалын бодлого</a>
            <a href="#" className="hover:text-blue-400 transition">Тусламж</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* =========================
    COMPONENTS
========================= */

const Feature = ({ icon, title, desc }) => {
  return (
    <div className="group p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all duration-500">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-lg">{desc}</p>
    </div>
  );
};

const TrustCard = ({ number, text, icon }) => {
  return (
    <div className="p-8 rounded-3xl transition-all">
      <div className="flex justify-center mb-4 text-blue-500/50">
        {icon}
      </div>
      <h3 className="text-5xl font-black text-white mb-3 tracking-tight">
        {number}
      </h3>
      <p className="text-slate-400 font-medium text-lg">{text}</p>
    </div>
  );
};

const Skeleton = () => (
  <div className="p-8 animate-pulse">
    <div className="h-12 w-32 bg-white/5 mx-auto mb-4 rounded-xl" />
    <div className="h-5 w-48 bg-white/5 mx-auto rounded-lg" />
  </div>
);

export default Home;