import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

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
    <>
      <Navbar />

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] pt-28 px-6">
        <div className="max-w-5xl mx-auto space-y-8">

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Нэгд. Тогло. Ял.
            <span className="block text-blue-400 mt-3">
              GameCenter Connect-д тавтай морил!
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Тоглоомын төвүүдийг олох, суудал урьдчилан захиалах,
            төлбөр хийх, хамт тоглогчтойгоо холбогдох хамгийн хялбар платформ.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">

            <button
              onClick={() => navigate("/register")}
              className="px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700
                         text-white font-semibold transition shadow-xl"
            >
              🚀 Эхлэх
            </button>

            <button
              onClick={() => navigate("/gaming-center-map")}
              className="px-7 py-3 rounded-full border border-white/30
                         hover:bg-white/10 transition"
            >
              🗺️ Төвүүдийг харах
            </button>

          </div>
        </div>

        <div className="mt-20 animate-bounce text-gray-400 text-xl">↓</div>
      </section>

      {/* FEATURES */}
      <section className="py-28 px-6 bg-[#0f172a] text-white">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Яагаад <span className="text-blue-400">GameCenter Connect</span> гэж?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

          <Feature
            icon="🎮"
            title="Төвөө хялбар ол"
            desc="Газрын зураг ашиглан хамгийн ойр, сул суудалтай төвүүдийг бодит цагт олно."
          />

          <Feature
            icon="⚡"
            title="Түргэн захиалга"
            desc="Хэдхэн секундын дотор суудлаа захиалж, дараалалд зогсохгүй."
          />

          <Feature
            icon="💳"
            title="Аюулгүй төлбөр"
            desc="Дотоод цахим түрийвч ашиглан найдвартай төлбөр хийнэ."
          />

        </div>
      </section>

      {/* TRUST (REAL DATA) */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#1e293b] to-[#334155] text-white">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          {loadingStats ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>
              <TrustCard
                number={`${stats?.centers || 0}+`}
                text="Тоглоомын төв"
              />

              <TrustCard
                number={`${stats?.users || 0}+`}
                text="Идэвхтэй хэрэглэгч"
              />

              <TrustCard
                number={`${stats?.uptime || 99.9}%`}
                text="Системийн найдвартай байдал"
              />
            </>
          )}

        </div>

      </section>

      {/* ABOUT */}
      <section className="py-28 px-6 bg-[#0f172a] text-white text-center">

        <div className="max-w-4xl mx-auto space-y-7">

          <h2 className="text-3xl md:text-4xl font-bold">
            GameCenter Connect гэж юу вэ?
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed">
            GameCenter Connect бол тоглогч болон тоглоомын төвүүдийг
            нэг дор холбосон дижитал платформ юм.
            Захиалга, төлбөр, удирдлагыг нэг дор шийднэ.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-6 px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700
                       font-semibold transition shadow-lg"
          >
            🤝 Нэгдэх
          </button>

        </div>

      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-center">

        <div className="max-w-4xl mx-auto space-y-6">

          <h2 className="text-3xl md:text-4xl font-bold">
            Бэлэн үү? Тоглоомоо эхлүүлцгээе!
          </h2>

          <p className="text-white/90 text-lg">
            Яг одоо бүртгүүлээд GameCenter Connect-ийн боломжуудыг ашиглаарай.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-full bg-white text-blue-600
                       hover:bg-gray-100 font-semibold transition shadow-lg"
          >
            🚀 Үнэгүй эхлэх
          </button>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-[#0f172a] border-t border-white/10 text-center text-gray-400 text-sm">

        <p>
          © {new Date().getFullYear()} GameCenter Connect.
          All rights reserved.
        </p>

      </footer>
    </>
  );
};

/* =========================
   COMPONENTS
========================= */

const Feature = ({ icon, title, desc }) => {
  return (
    <div
      className="backdrop-blur-xl bg-white/5 border border-white/10
                 p-8 rounded-2xl text-center hover:scale-105
                 transition-all duration-300 shadow-lg"
    >
      <div className="text-5xl mb-5">{icon}</div>

      <h3 className="text-xl font-semibold mb-3">{title}</h3>

      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
};

const TrustCard = ({ number, text }) => {
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-2xl p-8
                 hover:scale-105 transition shadow-lg"
    >
      <h3 className="text-4xl font-bold text-blue-400 mb-2">
        {number}
      </h3>

      <p className="text-gray-300">{text}</p>
    </div>
  );
};

const Skeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 animate-pulse">
    <div className="h-10 w-24 bg-white/20 mx-auto mb-4 rounded" />
    <div className="h-4 w-32 bg-white/20 mx-auto rounded" />
  </div>
);

export default Home;
