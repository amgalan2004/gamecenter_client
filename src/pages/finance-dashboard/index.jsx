import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { TrendingUp, TrendingDown, DollarSign, PlusCircle, History, Printer, RefreshCw } from "lucide-react";

const API = "http://localhost:5000/api";

// ✅ Token зөв авах — authToken нэрээр хадгалагддаг
const getToken = () =>
  localStorage.getItem("authToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") || "";

const fmt = (n) => Number(n || 0).toLocaleString("mn-MN");

const FinanceDashboard = () => {
  const [financeData, setFinanceData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [todayStats, setTodayStats] = useState({
    todayReservations: 0,
    todayIncome: 0,
    todayExpense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Цахилгаан",
  });

  const fetchFinanceData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Token олдсонгүй. Дахин нэвтэрнэ үү.");
        setIsLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [summaryRes, todayRes] = await Promise.all([
        fetch(`${API}/finance/summary`, { headers }),
        fetch(`${API}/finance/today-stats`, { headers }),
      ]);

      if (summaryRes.status === 401 || summaryRes.status === 403) {
        setError("Нэвтрэлт хүчингүй байна. Дахин нэвтэрнэ үү.");
        setIsLoading(false);
        return;
      }

      const summary = await summaryRes.json();
      const today = await todayRes.json();

      if (summary.success) {
        setFinanceData({
          totalIncome: summary.totalIncome || 0,
          totalExpense: summary.totalExpense || 0,
          netProfit: summary.netProfit || 0,
        });
        setTransactions(summary.recentTransactions || []);
      } else {
        setError(summary.error || "Мэдээлэл татахад алдаа гарлаа");
      }

      if (today.success) {
        setTodayStats({
          todayReservations: today.todayReservations || 0,
          todayIncome: today.todayIncome || 0,
          todayExpense: today.todayExpense || 0,
        });
      }
    } catch {
      setError("Сервертэй холбогдоход алдаа гарлаа. Backend ажиллаж байгаа эсэхийг шалгана уу.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) {
      setError("Мэдээллээ бүрэн бөглөнө үү!");
      return;
    }
    if (Number(newExpense.amount) <= 0) {
      setError("Дүн 0-ээс их байх ёстой!");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();
      const res = await fetch(`${API}/finance/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newExpense.description,
          amount: Number(newExpense.amount),
          category: newExpense.category,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSuccess("✅ Зардал амжилттай бүртгэгдлээ!");
        setNewExpense({ description: "", amount: "", category: "Цахилгаан" });
        fetchFinanceData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Зардал бүртгэхэд алдаа гарлаа");
      }
    } catch {
      setError("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <style>{`
        @media print {
          nav, .no-print, button, form { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-card { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
          h1, h2, h3, p, td, th { color: black !important; }
          .text-green-400 { color: #16a34a !important; }
          .text-red-400 { color: #dc2626 !important; }
        }
      `}</style>

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="text-blue-500" /> Санхүүгийн удирдлага
            </h1>
            <p className="text-gray-400 mt-1">Төвийн орлого, зарлагыг хянах хэсэг</p>
          </div>
          <div className="flex items-center gap-3 no-print">
            <button
              onClick={fetchFinanceData}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-2 text-sm"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Шинэчлэх
            </button>
            <button
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-2 font-medium"
            >
              <Printer size={18} /> Тайлан PDF татах
            </button>
          </div>
        </div>

        {/* Алдаа / Амжилт */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex justify-between items-center">
            <span>⚠️ {error}</span>
            <button onClick={() => setError("")} className="ml-4 hover:text-white">✕</button>
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {success}
          </div>
        )}

        {/* Өнөөдрийн статистик */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Өнөөдрийн захиалга", value: todayStats.todayReservations, unit: "ш", color: "text-blue-400" },
            { label: "Өнөөдрийн орлого", value: fmt(todayStats.todayIncome), unit: "₮", color: "text-green-400" },
            { label: "Өнөөдрийн зардал", value: fmt(todayStats.todayExpense), unit: "₮", color: "text-red-400" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 print-card">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value} {s.unit}</p>
            </div>
          ))}
        </div>

        {/* Нийт статистик */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md print-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-2xl text-green-500">
                <DollarSign size={24} />
              </div>
              <span className="text-green-500 text-xs font-bold">Орлогын хяналт</span>
            </div>
            <p className="text-gray-400 text-sm">Нийт орлого</p>
            <h3 className="text-3xl font-bold mt-1 text-green-400">
              {isLoading ? "..." : `${fmt(financeData.totalIncome)} ₮`}
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md print-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-2xl text-red-500">
                <TrendingDown size={24} />
              </div>
              <span className="text-red-500 text-xs font-bold">Зарлагын хяналт</span>
            </div>
            <p className="text-gray-400 text-sm">Нийт зардал</p>
            <h3 className="text-3xl font-bold mt-1 text-red-400">
              {isLoading ? "..." : `${fmt(financeData.totalExpense)} ₮`}
            </h3>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-blue-500/20 print-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-2xl text-white">
                <TrendingUp size={24} />
              </div>
              <span className="text-blue-200 text-xs font-bold">Цэвэр ашиг</span>
            </div>
            <p className="text-blue-100 text-sm">Нийт цэвэр ашиг</p>
            <h3 className="text-3xl font-bold mt-1 text-white">
              {isLoading ? "..." : `${fmt(financeData.netProfit)} ₮`}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Зардал бүртгэх */}
          <div className="lg:col-span-1 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md no-print h-fit">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <PlusCircle className="text-blue-500" /> Шинэ зардал бүртгэх
            </h2>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Тайлбар</label>
                <input
                  type="text"
                  placeholder="Жишээ: Цахилгааны төлбөр"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-gray-600"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Дүн (₮)</label>
                <input
                  type="number"
                  placeholder="0"
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-gray-600"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Төрөл</label>
                <select
                  className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  <option value="Цахилгаан">Цахилгаан</option>
                  <option value="Интернэт">Интернэт</option>
                  <option value="Түрээс">Түрээс</option>
                  <option value="Цалин">Цалин</option>
                  <option value="Засвар">Засвар</option>
                  <option value="Тоног төхөөрөмж">Тоног төхөөрөмж</option>
                  <option value="Бусад">Бусад</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3 rounded-xl font-bold mt-4 shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-white flex items-center justify-center gap-2"
              >
                {isSaving ? "Хадгалж байна..." : "Зардал хадгалах"}
              </button>
            </form>
          </div>

          {/* Гүйлгээний жагсаалт */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md print-card">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <History className="text-blue-500" /> Сүүлийн гүйлгээнүүд
            </h2>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="py-10 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                  <p className="text-gray-400 mt-2">Ачаалж байна...</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/10 text-sm">
                      <th className="pb-4 font-medium">Огноо</th>
                      <th className="pb-4 font-medium">Тайлбар</th>
                      <th className="pb-4 font-medium">Төрөл</th>
                      <th className="pb-4 font-medium text-right">Дүн</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-10 text-center text-gray-500">
                          Гүйлгээ олдсонгүй
                        </td>
                      </tr>
                    ) : (
                      transactions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 text-sm text-gray-400">
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString("mn-MN")
                              : "---"}
                          </td>
                          <td className="py-4 font-medium text-sm">
                            {item.description || "Тайлбаргүй"}
                          </td>
                          <td className="py-4">
                            {item.type === "income" ? (
                              <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                                Орлого
                              </span>
                            ) : (
                              <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-lg text-xs font-medium">
                                Зардал
                              </span>
                            )}
                          </td>
                          <td className={`py-4 text-right font-bold ${item.type === "income" ? "text-green-400" : "text-red-400"}`}>
                            {item.type === "income" ? "+" : "-"}{fmt(item.amount)} ₮
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {transactions.length > 0 && (
                    <tfoot className="border-t border-white/10">
                      <tr>
                        <td colSpan="3" className="pt-4 text-sm text-gray-400">
                          Нийт гүйлгээ: {transactions.length}
                        </td>
                        <td className="pt-4 text-right font-bold text-blue-400">
                          {fmt(financeData.netProfit)} ₮
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceDashboard;