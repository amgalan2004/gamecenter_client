import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { TrendingUp, TrendingDown, DollarSign, PlusCircle, History, Printer } from "lucide-react";

const FinanceDashboard = () => {
  const [financeData, setFinanceData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
  });

  const [transactions, setTransactions] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Цахилгаан",
  });

  // 🖨️ Тайлан хэвлэх функц
  const handlePrintReport = () => {
    window.print();
  };

  // Backend-ээс өгөгдөл татах функц
  const fetchFinanceData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token"); 
      
      const response = await fetch("http://localhost:5000/api/finance/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();

      if (data.success) {
        setFinanceData({
          totalIncome: data.totalIncome || 0,
          totalExpense: data.totalExpense || 0,
          netProfit: data.netProfit || 0,
        });
        setTransactions(data.recentTransactions || []);
      }
    } catch (error) {
      console.error("Дата татахад алдаа гарлаа:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // Зардал хадгалах логик
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    
    if (!newExpense.description || !newExpense.amount) {
      return alert("Мэдээллээ бүрэн бөглөнө үү!");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/finance/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newExpense.description,
          amount: Number(newExpense.amount),
          category: newExpense.category
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Зардал амжилттай бүртгэгдлээ");
        setNewExpense({ description: "", amount: "", category: "Цахилгаан" }); 
        fetchFinanceData(); // Дэлгэцийг шинэчлэх
      } else {
        alert("Алдаа: " + result.error);
      }
    } catch (error) {
      console.error("Зардал хадгалахад алдаа гарлаа:", error);
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* CSS: Хэвлэх үед хэрэггүй элементүүдийг нуух */}
      <style>
        {`
          @media print {
            nav, .no-print, button, form {
              display: none !important;
            }
            body {
              background: white !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .max-w-7xl {
              max-width: 100% !important;
              width: 100% !important;
              padding: 0 !important;
            }
            main {
              padding-top: 0 !important;
            }
            .bg-white\\/5 {
              background: #f8fafc !important;
              border: 1px solid #e2e8f0 !important;
              color: black !important;
              backdrop-filter: none !important;
            }
            h1, h2, h3, p, td, th {
              color: black !important;
            }
            .text-green-400 { color: #16a34a !important; }
            .text-red-400 { color: #dc2626 !important; }
            .bg-gradient-to-br {
              background: #f1f5f9 !important;
              border: 1px solid #cbd5e1 !important;
              color: black !important;
              box-shadow: none !important;
            }
          }
        `}
      </style>

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="text-blue-500" /> Санхүүгийн удирдлага
            </h1>
            <p className="text-gray-400 mt-1">Төвийн орлого, зарлагыг хянах хэсэг</p>
          </div>
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <button 
              onClick={handlePrintReport}
              className="no-print bg-white/10 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-2 font-medium active:scale-95 w-full md:w-auto justify-center"
            >
              <Printer size={18} /> Тайлан PDF татах
            </button>
            <div className="text-right text-sm text-gray-400">
              Сүүлийн шинэчлэлт: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* 📊 Статистик картууд */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-2xl text-green-500">
                <DollarSign size={24} />
              </div>
              <span className="text-green-500 text-xs font-bold">
                Орлогын хяналт
              </span>
            </div>
            <p className="text-gray-400 text-sm">Нийт орлого</p>
            <h3 className="text-3xl font-bold mt-1 text-green-400">
              {Number(financeData.totalIncome).toLocaleString()} ₮
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-2xl text-red-500">
                <TrendingDown size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm">Нийт зардал</p>
            <h3 className="text-3xl font-bold mt-1 text-red-400">
              {Number(financeData.totalExpense).toLocaleString()} ₮
            </h3>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-blue-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-2xl text-white">
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="text-blue-100 text-sm">Цэвэр ашиг</p>
            <h3 className="text-3xl font-bold mt-1 text-white">
              {Number(financeData.netProfit).toLocaleString()} ₮
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 📝 Зардал бүртгэх форм */}
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Дүн (₮)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Төрөл</label>
                <select
                  className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option value="Цахилгаан">Цахилгаан</option>
                  <option value="Түрээс">Түрээс</option>
                  <option value="Цалин">Цалин</option>
                  <option value="Засвар">Засвар</option>
                  <option value="Бусад">Бусад</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold mt-4 shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-white"
              >
                Зардал хадгалах
              </button>
            </form>
          </div>

          {/* 🕒 Сүүлийн гүйлгээнүүд */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <History className="text-blue-500" /> Сүүлийн гүйлгээнүүд
            </h2>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="py-10 text-center">
                   <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                   <p className="text-gray-400">Ачаалж байна...</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/10">
                      <th className="pb-4 font-medium">Огноо</th>
                      <th className="pb-4 font-medium">Тайлбар</th>
                      <th className="pb-4 font-medium">Төрөл</th>
                      <th className="pb-4 font-medium text-right">Дүн</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 text-sm text-gray-400">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : '---'}
                        </td>
                        <td className="py-4 font-medium">{item.description || "Тайлбаргүй"}</td>
                        <td className="py-4 text-sm capitalize">
                          {item.type === 'income' ? (
                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-md text-xs">Орлого</span>
                          ) : (
                            <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded-md text-xs">Зардал</span>
                          )}
                        </td>
                        <td className={`py-4 text-right font-bold ${item.type === 'income' ? "text-green-400" : "text-red-400"}`}>
                          {item.type === 'income' ? "+" : "-"}{Number(item.amount).toLocaleString()} ₮
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-10 text-center text-gray-500">Гүйлгээ олдсонгүй</td>
                      </tr>
                    )}
                  </tbody>
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