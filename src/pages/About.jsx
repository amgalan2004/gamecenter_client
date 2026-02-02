import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-28 px-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* =====================
              HERO
          ===================== */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-blue-400">
              🎮 GameCenter Connect
            </h1>
            <p className="text-gray-300 text-lg">
              Тоглоомын төвүүдийг ухаалгаар удирдах, тоглогчдыг холбох платформ
            </p>
          </div>

          {/* =====================
              ABOUT
          ===================== */}
          <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">
              📖 Бидний тухай
            </h2>
            <p className="text-gray-300 leading-relaxed">
              <span className="text-white font-medium">GameCenter Connect</span> нь
              тоглоомын төвүүдийн захиалга, PC удирдлага, хэрэглэгчийн
              түрийвч, статистик болон админ хяналтыг нэг дороос хийх
              орчин үеийн веб платформ юм.
              <br /><br />
              Бидний зорилго бол тоглогч болон тоглоомын төвүүдийн
              хоорондын харилцааг хялбар, ил тод, найдвартай болгох явдал юм.
            </p>
          </section>

          {/* =====================
              VERSION
          ===================== */}
          <section className="grid md:grid-cols-3 gap-6">
            <InfoCard
              title="📦 Version"
              value="v1.0.0"
              desc="Анхны тогтвортой хувилбар"
            />
            <InfoCard
              title="⚙️ Tech Stack"
              value="React + Node.js"
              desc="Modern Full-Stack"
            />
            <InfoCard
              title="🗓️ Last Update"
              value="2026.02"
              desc="Систем шинэчлэгдсэн"
            />
          </section>

          {/* =====================
              TEAM
          ===================== */}
          <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">
              👥 Манай баг
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <TeamCard
                name="Project Owner"
                role="System Architecture & Vision"
              />
              <TeamCard
                name="Backend Developer"
                role="API, Database, Security"
              />
              <TeamCard
                name="Frontend Developer"
                role="UI/UX & React"
              />
            </div>
          </section>

          {/* =====================
              CONTACT
          ===================== */}
          <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">
              📞 Холбоо барих
            </h2>

            <div className="space-y-2 text-gray-300">
              <p>📧 Имэйл: <span className="text-white">support@gamecenter.mn</span></p>
              <p>📱 Утас: <span className="text-white">+976 9999-9999</span></p>
              <p>📍 Байршил: <span className="text-white">Ulaanbaatar, Mongolia</span></p>
            </div>
          </section>

          {/* =====================
              FOOTER NOTE
          ===================== */}
          <div className="text-center text-sm text-gray-400 pb-10">
            © {new Date().getFullYear()} GameCenter Connect. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
};

/* =====================
   🔹 Reusable Components
===================== */

const InfoCard = ({ title, value, desc }) => (
  <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center space-y-2">
    <h3 className="text-lg font-semibold text-blue-400">{title}</h3>
    <p className="text-xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

const TeamCard = ({ name, role }) => (
  <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center space-y-2">
    <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
      👤
    </div>
    <h4 className="font-semibold text-white">{name}</h4>
    <p className="text-sm text-gray-400">{role}</p>
  </div>
);

export default About;
