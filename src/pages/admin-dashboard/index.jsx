import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  const [center, setCenter] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [pcs, setPcs] = useState([]);
  const [pcForm, setPcForm] = useState({
    name: "",
    seat_number: "",
    specs: "",
    status: "AVAILABLE",
  });
  const [editingPcId, setEditingPcId] = useState(null);

  // ✅ LocalStorage-с хэрэглэгчийн мэдээлэл авах
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = userData?.token || localStorage.getItem("authToken");

  // ==============================
  // 🏢 Төвийн мэдээлэл татах
  // ==============================
  useEffect(() => {
    if (!token) {
      setError("Authentication token required");
      setLoading(false);
      return;
    }

    const fetchCenter = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/center/my-center", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ TOKEN илгээнэ
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load center");

        setCenter(data);
        setForm(data);
        await loadPcs(data.id);
      } catch (err) {
        console.error("❌ Dashboard Load Error:", err);
        setError(err.message || "Серверээс мэдээлэл татаж чадсангүй.");
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [token]);

  // ==============================
  // 💻 PC жагсаалт татах
  // ==============================
  const loadPcs = async (centerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/pcs/${centerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch PCs");
      setPcs(data);
    } catch (err) {
      console.error("❌ Load PCs Error:", err);
      setError("PC жагсаалт татахад алдаа гарлаа.");
    }
  };

  // ==============================
  // 🏢 Төвийн мэдээлэл засах
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/center/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Төвийн мэдээлэл шинэчлэгдлээ!");
        setCenter(form);
        setIsEditing(false);
      } else {
        alert("Өөрчлөлт хадгалагдсангүй: " + data.error);
      }
    } catch (err) {
      alert("Алдаа гарлаа: " + err.message);
    }
  };

  // ==============================
  // 💻 PC нэмэх / засах
  // ==============================
  const handlePcChange = (e) => {
    const { name, value } = e.target;
    setPcForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePcSubmit = async (e) => {
    e.preventDefault();
    const url = editingPcId
      ? `http://localhost:5000/api/pcs/update/${editingPcId}`
      : "http://localhost:5000/api/pcs/add";
    const method = editingPcId ? "PUT" : "POST";
    const body = editingPcId ? pcForm : { ...pcForm, center_id: center.id };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "PC хадгалахад алдаа гарлаа");

      alert(editingPcId ? "💾 PC шинэчлэгдлээ!" : "🖥️ Шинэ PC нэмэгдлээ!");
      setPcForm({ name: "", seat_number: "", specs: "", status: "AVAILABLE" });
      setEditingPcId(null);
      await loadPcs(center.id);
    } catch (err) {
      alert("Алдаа гарлаа: " + err.message);
    }
  };

  const handlePcEdit = (pc) => {
    setEditingPcId(pc.id);
    setPcForm({
      name: pc.name,
      seat_number: pc.seat_number,
      specs: pc.specs,
      status: pc.status,
    });
  };

  const handlePcDelete = async (id) => {
    if (!window.confirm("Энэ PC-г устгах уу?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/pcs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("PC устгах үед алдаа гарлаа");
      await loadPcs(center.id);
    } catch (err) {
      alert("Алдаа гарлаа: " + err.message);
    }
  };

  // ==============================
  // 🖥️ UI хэсэг
  // ==============================
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">
            🎮 Game Center Admin Dashboard
          </h1>

          {loading ? (
            <p className="text-center text-gray-400">Мэдээлэл ачаалж байна...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* 🏢 Төвийн мэдээлэл */}
              <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-lg space-y-4">
                <h2 className="text-2xl font-semibold mb-2">🏢 Төвийн мэдээлэл</h2>

                {["name", "location", "working_hours", "tariff"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-400 mb-1">
                      {field === "name"
                        ? "Төвийн нэр"
                        : field === "location"
                        ? "Байршил"
                        : field === "working_hours"
                        ? "Ажиллах цаг"
                        : "Тариф (₮/цаг)"}
                    </label>
                    <input
                      type={field === "tariff" ? "number" : "text"}
                      name={field}
                      value={form[field] || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 ${
                        !isEditing ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                ))}

                <div className="flex justify-end mt-4 gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                      >
                        Болих
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Хадгалах
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Засах
                    </button>
                  )}
                </div>
              </div>

              {/* 📊 Статистик */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-lg space-y-6">
                <h2 className="text-xl font-semibold">📈 Төвийн статистик</h2>
                <div className="space-y-3">
                  <Stat label="Нийт захиалга" value="145" color="blue" />
                  <Stat label="Идэвхтэй тоглогчид" value="37" color="green" />
                  <Stat label="Өнөөдрийн ашиг" value="58,000₮" color="yellow" />
                  <Stat
                    label="Төвийн төлөв"
                    value={center.status}
                    color={
                      center.status === "APPROVED"
                        ? "green"
                        : center.status === "PENDING"
                        ? "yellow"
                        : "red"
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* 💻 PC удирдлага */}
          {center && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-4 text-center">💻 PC Удирдлага</h2>

              <form
                onSubmit={handlePcSubmit}
                className="bg-white/10 p-6 rounded-2xl border border-white/20 max-w-xl mx-auto mb-10"
              >
                <div className="grid gap-3">
                  <input
                    name="name"
                    placeholder="PC нэр (ж. PC-01)"
                    value={pcForm.name}
                    onChange={handlePcChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                  />
                  <input
                    name="seat_number"
                    placeholder="Суудал (A1)"
                    value={pcForm.seat_number}
                    onChange={handlePcChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                  />
                  <input
                    name="specs"
                    placeholder="Үзүүлэлт (RTX 4070, i7, 32GB RAM)"
                    value={pcForm.specs}
                    onChange={handlePcChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                  />
                  <select
                    name="status"
                    value={pcForm.status}
                    onChange={handlePcChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="IN_USE">IN_USE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold mt-2"
                  >
                    {editingPcId ? "Хадгалах" : "Нэмэх"}
                  </button>
                </div>
              </form>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pcs.map((pc) => (
                  <div key={pc.id} className="bg-white/10 p-5 rounded-2xl border border-white/20">
                    <h3 className="font-semibold text-lg">{pc.name}</h3>
                    <p className="text-gray-400">Суудал: {pc.seat_number}</p>
                    <p className="text-gray-400 text-sm mb-2">Specs: {pc.specs}</p>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-xs ${
                        pc.status === "AVAILABLE"
                          ? "bg-green-500/20 text-green-400"
                          : pc.status === "IN_USE"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {pc.status}
                    </p>
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() => handlePcEdit(pc)}
                        className="text-blue-400 hover:underline"
                      >
                        Засах
                      </button>
                      <button
                        onClick={() => handlePcDelete(pc.id)}
                        className="text-red-400 hover:underline"
                      >
                        Устгах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// 📊 Туслах статистик компонент
const Stat = ({ label, value, color }) => (
  <div
    className={`flex items-center justify-between bg-${color}-500/10 border border-${color}-500/20 rounded-lg px-4 py-2`}
  >
    <span className="text-gray-300">{label}</span>
    <span
      className={`font-semibold ${
        color === "green"
          ? "text-green-400"
          : color === "yellow"
          ? "text-yellow-400"
          : "text-blue-400"
      }`}
    >
      {value}
    </span>
  </div>
);

export default AdminDashboard;
