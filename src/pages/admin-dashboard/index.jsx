import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getToken, getPlatformStats } from "../../utils/authAPI";

const API_BASE_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [stats, setStats] = useState(null);
  const [pcs, setPcs] = useState([]);
  const [form, setForm] = useState({});
  const [pcForm, setPcForm] = useState({ name: "", seat_number: "", specs: "", status: "AVAILABLE" });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingPcId, setEditingPcId] = useState(null);

  const token = getToken(); // Энэ нь 'gc_token'-ийг авна

  const fetchAllData = useCallback(async () => {
    if (!token) {
      setError("Та нэвтрэх шаардлагатай");
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // А. Өөрийн төвийн мэдээллийг авах (ШИНЭЧЛЭГДСЭН ЗАМ)
      const centerRes = await fetch(`${API_BASE_URL}/centers/my-center`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!centerRes.ok) {
        const errorData = await centerRes.json();
        throw new Error(errorData.error || "Төвийн мэдээллийг татаж чадсангүй.");
      }
      
      const centerData = await centerRes.json();
      setCenter(centerData);
      setForm(centerData);

      // Б. PC жагсаалт (Backend: /api/pcs/:centerId ЗАМТАЙ ТУЛГАВ)
      const pcsRes = await fetch(`${API_BASE_URL}/pcs/${centerData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (pcsRes.ok) setPcs(await pcsRes.json());

      // В. Статистик (authAPI доторх функц)
      const sData = await getPlatformStats();
      setStats(sData);

    } catch (err) {
      console.error("Fetch Error:", err);
      // Unexpected token '<' алдааг хэрэглэгчид ойлгомжтой харуулах
      if (err.message.includes("Unexpected token")) {
        setError("Серверээс буруу хариу ирлээ (API зам зөрсөн байж магадгүй).");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // PC Нэмэх эсвэл Засах (ЗАМЫГ ШИНЭЧЛЭВ)
  const handlePcSubmit = async (e) => {
    e.preventDefault();
    // Таны Backend-д одоогоор эдгээр замууд байхгүй байж магадгүй тул шалгаарай
    const url = editingPcId 
      ? `${API_BASE_URL}/pcs/update/${editingPcId}` 
      : `${API_BASE_URL}/pcs/add`;

    try {
      const res = await fetch(url, {
        method: editingPcId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...pcForm, center_id: center.id }),
      });

      if (res.ok) {
        setPcForm({ name: "", seat_number: "", specs: "", status: "AVAILABLE" });
        setEditingPcId(null);
        fetchAllData(); 
        alert("PC амжилттай хадгалагдлаа");
      } else {
        const errData = await res.json();
        alert(errData.error || "Алдаа гарлаа");
      }
    } catch (err) {
      alert("Сервертэй холбогдоход алдаа гарлаа");
    }
  };

  // Төвийн мэдээлэл шинэчлэх (Update зам Backend-д нэмэх шаардлагатай)
  const handleSaveCenter = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/centers/update/${center.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setCenter(form);
        setIsEditing(false);
        alert("Амжилттай хадгалагдлаа");
      } else {
        alert("Хадгалахад алдаа гарлаа");
      }
    } catch (err) {
      alert("Сервертэй холбогдоход алдаа гарлаа");
    }
  };

  // ... (Рендер хийх хэсэг хэвээрээ)
  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-cyan-400 animate-pulse text-xl font-bold">Уншиж байна...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-6">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-6 flex justify-between items-center">
            <span className="text-red-400">⚠️ {error}</span>
            <button onClick={fetchAllData} className="text-xs bg-red-500/20 px-3 py-1 rounded hover:bg-red-500/40">Дахин оролдох</button>
          </div>
        )}

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-cyan-400">Admin Dashboard</h1>
          {center && (
            <button className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
              📥 Тайлан татах (CSV)
            </button>
          )}
        </div>

        {center && (
          <>
            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              <div className="lg:col-span-2 bg-slate-800/50 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">🏢 Төвийн тохиргоо</h2>
                <div className="grid grid-cols-2 gap-4">
                  {['name', 'location', 'working_hours', 'tariff'].map((key) => (
                    <div key={key}>
                      <label className="text-[10px] text-gray-500 uppercase mb-1 block">
                        {key === 'tariff' ? 'Тариф (Цаг/₮)' : key.replace('_', ' ')}
                      </label>
                      <input 
                        className={`w-full bg-slate-900/50 border ${isEditing ? 'border-cyan-500/50' : 'border-white/5'} rounded-lg px-4 py-2 outline-none focus:ring-1 ring-cyan-500`}
                        value={form[key] || ""}
                        disabled={!isEditing}
                        onChange={(e) => setForm({...form, [key]: e.target.value})}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="bg-blue-600 px-6 py-2 rounded-lg text-sm">Засах</button>
                  ) : (
                    <div className="space-x-2">
                      <button onClick={() => setIsEditing(false)} className="bg-slate-700 px-6 py-2 rounded-lg text-sm">Болих</button>
                      <button onClick={handleSaveCenter} className="bg-blue-600 px-6 py-2 rounded-lg text-sm">Хадгалах</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-2">📊 Өнөөдрийн байдал</h2>
                <StatItem label="Нийт захиалга" value={stats?.reservations} color="text-blue-400" />
                <StatItem label="Нийт хэрэглэгч" value={stats?.users} color="text-green-400" />
                <StatItem label="Нийт орлого" value={`${stats?.totalRevenue || 0}₮`} color="text-yellow-400" />
              </div>
            </div>

            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">💻 PC Удирдлага ({pcs.length})</h2>
              <form onSubmit={handlePcSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <input className="bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2" placeholder="PC нэр" value={pcForm.name} onChange={(e) => setPcForm({...pcForm, name: e.target.value})} required />
                <input className="bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2" placeholder="Суудал" value={pcForm.seat_number} onChange={(e) => setPcForm({...pcForm, seat_number: e.target.value})} />
                <input className="bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2" placeholder="Specs" value={pcForm.specs} onChange={(e) => setPcForm({...pcForm, specs: e.target.value})} />
                <button type="submit" className="bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 transition">
                  {editingPcId ? "Шинэчлэх" : "PC Нэмэх"}
                </button>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-500 text-xs uppercase border-b border-white/5">
                    <tr>
                      <th className="pb-4 px-2">Нэр</th>
                      <th className="pb-4 px-2">Specs</th>
                      <th className="pb-4 px-2">Төлөв</th>
                      <th className="pb-4 px-2 text-right">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pcs.map(pc => (
                      <tr key={pc.id} className="text-sm">
                        <td className="py-4 px-2 font-bold">{pc.name} <span className="text-[10px] text-cyan-500 ml-2">[{pc.seat_number}]</span></td>
                        <td className="py-4 px-2 text-gray-400 text-xs">{pc.specs}</td>
                        <td className="py-4 px-2">
                          <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">{pc.status}</span>
                        </td>
                        <td className="py-4 px-2 text-right">
                           <button onClick={() => { setEditingPcId(pc.id); setPcForm(pc); }} className="text-blue-400 mr-4">Засах</button>
                           <button className="text-red-400">Устгах</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color }) => (
  <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-white/5">
    <span className="text-sm text-gray-400">{label}</span>
    <span className={`font-bold ${color}`}>{value || 0}</span>
  </div>
);

export default AdminDashboard;