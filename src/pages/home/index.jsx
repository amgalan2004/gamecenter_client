import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ Навигацийн хэсэг */}
      <Navbar />

      {/* ✅ Нүүр хэсэг (Hero Section) */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Нэгд. Тогло. Ял.  
            <span className="block text-blue-400 mt-2">GameCenter Connect-д тавтай морил!</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Тоглоомын төвүүдийг олох, суудал урьдчилан захиалах, 
            болон тоглоомын хамт олонтойгоо холбогдох хамгийн хялбар платформ.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg"
            >
              Эхлэх
            </button>
            <button
              onClick={() => navigate("/gaming-center-map")}
              className="px-6 py-3 rounded-full border border-white/30 hover:bg-white/10 text-white font-medium transition-all"
            >
              Төвүүдийг харах
            </button>
          </div>
        </div>

        {/* Scroll заалт */}
        <div className="mt-16 animate-bounce text-gray-400">↓</div>
      </section>

      {/* ✅ Давуу талууд (Features Section) */}
      <section className="py-24 px-6 bg-[#0f172a] text-white text-center">
        <h2 className="text-3xl font-bold mb-12">
          Яагаад <span className="text-blue-400">GameCenter Connect</span> гэж?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-8 rounded-2xl hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2">Төвөө хялбар ол</h3>
            <p className="text-gray-400">
              Байршлын мэдээлэл ашиглан хамгийн ойр байгаа тоглоомын төвүүдийг бодит цагийн горимоор олно.
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-8 rounded-2xl hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Түргэн захиалга</h3>
            <p className="text-gray-400">
              Дуртай суудлаа хэдхэн секундын дотор урьдчилан захиалаарай — дугаарлах, хүлээх шаардлагагүй.
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-8 rounded-2xl hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Аюулгүй төлбөр</h3>
            <p className="text-gray-400">
              Дотоод цахим түрийвч ашиглан аюулгүй төлбөрөө хийнэ, мөн урамшуулал цуглуулна.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Тухай хэсэг (About Section) */}
      <section className="py-24 bg-gradient-to-r from-[#1e293b] to-[#334155] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">GameCenter Connect гэж юу вэ?</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            GameCenter Connect бол тоглогчид болон тоглоомын төвүүдийг холбох зорилготой платформ юм.  
            Хэрвээ та тоглоомын төвтэй бол хэрэглэгчээ нэмэгдүүлж,  
            харин тоглогч бол хамгийн тохиромжтой төвөө олж, шууд тоглоорой!
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Нэгдэх
          </button>
        </div>
      </section>

      {/* ✅ Хөл хэсэг (Footer) */}
      <footer className="py-8 bg-[#0f172a] border-t border-white/10 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} GameCenter Connect. Бүх эрх хуулиар хамгаалагдсан.</p>
      </footer>
    </>
  );
};

export default Home;
