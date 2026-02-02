import React from "react";
import Navbar from "../components/Navbar";

const Rules = () => {
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
              📜 Үйлчилгээний дүрэм
            </h1>
            <p className="text-gray-300 text-lg">
              GameCenter Connect платформ ашиглах ерөнхий журам
            </p>
          </div>

          {/* =====================
              GENERAL RULES
          ===================== */}
          <RuleSection
            title="1️⃣ Ерөнхий нөхцөл"
            items={[
              "GameCenter Connect платформыг ашигласнаар та доорх дүрмүүдийг зөвшөөрсөнд тооцно.",
              "Платформ нь тоглоомын төв болон тоглогчдыг холбох зууч үйлчилгээ үзүүлнэ.",
              "Дүрмийг зөрчсөн тохиолдолд хэрэглэгчийн эрхийг хязгаарлах боломжтой."
            ]}
          />

          {/* =====================
              PLAYER RULES
          ===================== */}
          <RuleSection
            title="2️⃣ Тоглогчийн үүрэг, хариуцлага"
            items={[
              "Захиалга хийхдээ зөв мэдээлэл оруулах.",
              "Түрийвчийн үлдэгдэл хангалттай эсэхийг шалгах.",
              "Захиалсан цагтаа ирэх, PC-г зөв ашиглах.",
              "Санаатай эвдрэл, дүрэм зөрчсөн үйлдэл гаргавал хариуцлага хүлээнэ."
            ]}
          />

          {/* =====================
              ADMIN RULES
          ===================== */}
          <RuleSection
            title="3️⃣ Төвийн админы үүрэг"
            items={[
              "PC болон төвийн мэдээллийг үнэн зөв байлгах.",
              "Захиалгын явцыг бодит байдалд нийцүүлэн удирдах.",
              "Хэрэглэгчдийн мэдээллийг нууцлах.",
              "Платформын бодлоготой нийцсэн үйлчилгээ үзүүлэх."
            ]}
          />

          {/* =====================
              PAYMENT RULES
          ===================== */}
          <RuleSection
            title="4️⃣ Төлбөр ба түрийвч"
            items={[
              "Бүх төлбөр түрийвчээр дамжин хийгдэнэ.",
              "Амжилттай төлөгдсөн захиалга баталгаажна.",
              "Буцаалт зөвхөн системийн алдаа эсвэл админы шийдвэрээр хийгдэнэ.",
              "Сэжигтэй гүйлгээг систем автоматаар шалгана."
            ]}
          />

          {/* =====================
              SECURITY
          ===================== */}
          <RuleSection
            title="5️⃣ Аюулгүй байдал"
            items={[
              "Нууц үгээ бусдад дамжуулахгүй байх.",
              "Сэжигтэй үйлдэл илэрвэл админд мэдэгдэх.",
              "Системд халдах, хууль бус оролдлого хийхийг хатуу хориглоно."
            ]}
          />

          {/* =====================
              FINAL NOTE
          ===================== */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center text-gray-300">
            <p>
              📌 Эдгээр дүрмийг зөрчсөн тохиолдолд хэрэглэгчийн аккаунтыг
              түр эсвэл бүрмөсөн хаах эрхийг GameCenter Connect өөртөө хадгална.
            </p>
          </div>

          <div className="text-center text-sm text-gray-400 pb-10">
            © {new Date().getFullYear()} GameCenter Connect. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
};

/* =====================
   🔹 Reusable Section
===================== */

const RuleSection = ({ title, items }) => (
  <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg">
    <h2 className="text-2xl font-semibold mb-4 text-blue-300">{title}</h2>
    <ul className="list-disc list-inside space-y-2 text-gray-300">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </section>
);

export default Rules;
