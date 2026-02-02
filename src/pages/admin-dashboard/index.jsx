import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

/* ============================
   🎨 STAT STYLE MAP
   ============================ */
const STAT_STYLE_MAP = {
  blue: { box: "bg-blue-500/10 border-blue-500/30", text: "text-blue-400" },
  green: { box: "bg-green-500/10 border-green-500/30", text: "text-green-400" },
  yellow: { box: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-400" },
};

/* ============================
   💻 PC STATUS STYLE
   ============================ */
const PC_STATUS_STYLE = {
  AVAILABLE: "bg-green-500/15 text-green-400 border-green-500/30",
  BOOKED: "bg-red-500/15 text-red-400 border-red-500/30",
  IN_USE: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  MAINTENANCE: "bg-gray-500/15 text-gray-300 border-gray-400/30",
};

const AdminDashboard = () => {
  const [center, setCenter] = useState(null);
  const [stats, setStats] = useState(null);
  const [pcs, setPcs] = useState([]);

  const [form, setForm] = useState({});
  const [pcForm, setPcForm] = useState({
    name: "",
    seat_number: "",
    specs: "",
    status: "AVAILABLE",
  });

  const [editingPcId, setEditingPcId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    JSON.parse(localStorage.getItem("userData") || "{}")?.token ||
    localStorage.getItem("authToken");

  /* ============================
     📊 CSV ТАЙЛАН
     ============================ */
  const downloadReportCSV = () => {
    if (!center || !stats) return;

    const rows = [
      ["Төвийн нэр", center.name],
      ["Огноо", new Date().toLocaleDateString()],
      [],
      ["Нийт захиалга", stats.totalBookings ?? 0],
      ["Идэвхтэй тоглогч", stats.activePlayers ?? 0],
      ["Өнөөдрийн ашиг", stats.todayRevenue ?? 0],
    ];

    const csv =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `gamecenter_report_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ============================
     📡 FETCH DATA
     ============================ */
  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const cRes = await fetch("http://localhost:5000/api/center/my-center", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cData = await cRes.json();
        if (!cRes.ok) throw new Error(cData.error);
        setCenter(cData);
        setForm(cData);

        const pRes = await fetch(`http://localhost:5000/api/pcs/${cData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPcs(await pRes.json());

        const sRes = await fetch("http://localhost:5000/api/admin/statistics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (sRes.ok) setStats(await sRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  /* ============================
     🏢 CENTER UPDATE
     ============================ */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await fetch("http://localhost:5000/api/center/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    setCenter(form);
    setIsEditing(false);
  };

  /* ============================
     💻 PC CRUD
     ============================ */
  const handlePcChange = (e) =>
    setPcForm({ ...pcForm, [e.target.name]: e.target.value });

  const handlePcSubmit = async (e) => {
    e.preventDefault();

    const url = editingPcId
      ? `http://localhost:5000/api/pcs/update/${editingPcId}`
      : "http://localhost:5000/api/pcs/add";

    const body = editingPcId
      ? pcForm
      : { ...pcForm, center_id: center.id };

    await fetch(url, {
      method: editingPcId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    setPcForm({ name: "", seat_number: "", specs: "", status: "AVAILABLE" });
    setEditingPcId(null);

    const res = await fetch(`http://localhost:5000/api/pcs/${center.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPcs(await res.json());
  };

  const handlePcEdit = (pc) => {
    setEditingPcId(pc.id);
    setPcForm(pc);
  };

  const handlePcDelete = async (id) => {
    if (!window.confirm("PC устгах уу?")) return;
    await fetch(`http://localhost:5000/api/pcs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPcs(pcs.filter((p) => p.id !== id));
  };

  /* ============================
     🖥️ UI
     ============================ */
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white pt-24 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-cyan-400 mb-10">
            Game Center Admin Dashboard
          </h1>

          {loading && <p className="text-center text-gray-400">Loading...</p>}
          {error && <p className="text-center text-red-400">{error}</p>}

          {/* ===== TOP ===== */}
          {center && (
            <div className="grid lg:grid-cols-3 gap-6 mb-14">
              {/* CENTER */}
              <div className="lg:col-span-2 bg-white/10 border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">🏢 Төвийн мэдээлэл</h2>

                {["name", "location", "working_hours", "tariff"].map((f) => (
                  <input
                    key={f}
                    name={f}
                    disabled={!isEditing}
                    value={form[f] || ""}
                    onChange={handleChange}
                    className="w-full mb-3 px-4 py-2 rounded-lg bg-white/10 border border-white/20"
                  />
                ))}

                <div className="flex justify-end gap-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 px-4 py-2 rounded-lg"
                    >
                      Засах
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 px-4 py-2 rounded-lg"
                      >
                        Болих
                      </button>
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 px-4 py-2 rounded-lg"
                      >
                        Хадгалах
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* STAT */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
                <h2 className="text-lg font-semibold">📊 Статистик</h2>

                {stats ? (
                  <>
                    <Stat label="Нийт захиалга" value={stats.totalBookings} color="blue" />
                    <Stat label="Идэвхтэй тоглогч" value={stats.activePlayers} color="green" />
                    <Stat
                      label="Өнөөдрийн ашиг"
                      value={`${Number(stats.todayRevenue || 0).toLocaleString()}₮`}
                      color="yellow"
                    />
                    <button
                      onClick={downloadReportCSV}
                      className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg font-semibold"
                    >
                      📥 Тайлан татах (CSV)
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Статистик алга</p>
                )}
              </div>
            </div>
          )}

          {/* ===== PC MANAGEMENT ===== */}
          {center && (
            <>
              <h2 className="text-xl font-semibold mb-4">💻 PC Удирдлага</h2>

              {/* FORM */}
              <form
  onSubmit={handlePcSubmit}
  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-10 shadow-lg"
>
  <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
    🖥️ PC нэмэх / засах
  </h3>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* PC NAME */}
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">PC нэр</label>
      <input
        name="name"
        value={pcForm.name}
        onChange={handlePcChange}
        placeholder="PC-01"
        required
        className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 
                   focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                   outline-none transition"
      />
    </div>

    {/* SEAT */}
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">Суудал</label>
      <input
        name="seat_number"
        value={pcForm.seat_number}
        onChange={handlePcChange}
        placeholder="A1"
        className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 
                   focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                   outline-none transition"
      />
    </div>

    {/* SPECS */}
    <div className="flex flex-col gap-1 lg:col-span-2">
      <label className="text-sm text-gray-300">Техник үзүүлэлт</label>
      <input
        name="specs"
        value={pcForm.specs}
        onChange={handlePcChange}
        placeholder="RTX 4070 • i7 • 32GB RAM"
        className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 
                   focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                   outline-none transition"
      />
    </div>
  </div>

  {/* ACTION BUTTON */}
  <div className="flex justify-end mt-6 gap-3">
    {editingPcId && (
      <button
        type="button"
        onClick={() => {
          setEditingPcId(null);
          setPcForm({ name: "", seat_number: "", specs: "", status: "AVAILABLE" });
        }}
        className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
      >
        Болих
      </button>
    )}

    <button
      type="submit"
      className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500
                 hover:from-blue-600 hover:to-cyan-600
                 font-semibold shadow-md transition"
    >
      {editingPcId ? "Хадгалах" : "Нэмэх"}
    </button>
  </div>
</form>


              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full border border-white/20 rounded-xl overflow-hidden">
                  <thead className="bg-white/10 text-sm">
                    <tr>
                      <th className="px-4 py-2">PC</th>
                      <th className="px-4 py-2">Суудал</th>
                      <th className="px-4 py-2">Specs</th>
                      <th className="px-4 py-2">Төлөв</th>
                      <th className="px-4 py-2 text-right">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pcs.map((pc) => (
                      <tr key={pc.id} className="border-t border-white/10 text-sm">
                        <td className="px-4 py-2">{pc.name}</td>
                        <td className="px-4 py-2">{pc.seat_number || "-"}</td>
                        <td className="px-4 py-2 text-gray-400">{pc.specs || "-"}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${PC_STATUS_STYLE[pc.status]}`}
                          >
                            {pc.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right space-x-3">
                          <button
                            onClick={() => handlePcEdit(pc)}
                            className="text-blue-400"
                          >
                            Засах
                          </button>
                          <button
                            onClick={() => handlePcDelete(pc.id)}
                            className="text-red-400"
                          >
                            Устгах
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* ============================
   📊 STAT COMPONENT
   ============================ */
const Stat = ({ label, value, color }) => {
  const style = STAT_STYLE_MAP[color] || STAT_STYLE_MAP.blue;
  return (
    <div className={`flex justify-between items-center rounded-lg border px-4 py-2 ${style.box}`}>
      <span className="text-sm text-gray-300">{label}</span>
      <span className={`font-semibold ${style.text}`}>{value}</span>
    </div>
  );
};

export default AdminDashboard;
