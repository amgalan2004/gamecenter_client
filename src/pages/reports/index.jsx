import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../components/Navbar";
import {
  TrendingUp, TrendingDown, Calendar, FileText,
  Printer, RefreshCw, Filter, Search, ChevronDown,
  DollarSign, Receipt, BarChart3
} from "lucide-react";

const API = "http://localhost:5000/api";

const getToken = () =>
  localStorage.getItem("authToken") ||
  localStorage.getItem("token") || "";

const fmt = (n) => Number(n || 0).toLocaleString("mn-MN");

const today = () => new Date().toISOString().split("T")[0];
const monthStart = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

const REPORT_TYPES = [
  { id: "income",      label: "Орлогын тайлан",   icon: TrendingUp,   color: "#22c55e" },
  { id: "expense",     label: "Зардлын тайлан",    icon: TrendingDown, color: "#ef4444" },
  { id: "reservation", label: "Захиалгын тайлан",  icon: Calendar,     color: "#3b82f6" },
];

const STATUS_MAP = {
  AVAILABLE:        { label: "Сул",               color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  BOOKED:           { label: "Захиалгатай",        color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  IN_USE:           { label: "Ашиглагдаж байна",  color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  MAINTENANCE:      { label: "Засвартай",          color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  COMPLETED:        { label: "Дууссан",            color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  PAID:             { label: "Төлөгдсөн",          color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  ACTIVE:           { label: "Идэвхтэй",           color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
  CANCELLED:        { label: "Цуцлагдсан",         color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  AUTO_CANCELLED:   { label: "Автомат цуцлагдсан", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
};

const ReportsPage = () => {
  const printRef = useRef();

  const [filters, setFilters] = useState({
    type: "income",
    dateFrom: monthStart(),
    dateTo: today(),
  });

  const [data, setData]       = useState(null);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netProfit: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");

  /* ─── Тайлан татах ─── */
  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setData(null);
    setSearch("");

    try {
      const token   = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const { dateFrom, dateTo, type } = filters;

      if (type === "income" || type === "expense") {
        const res  = await fetch(`${API}/finance/summary`, { headers });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);

        setSummary({
          totalIncome:  json.totalIncome  || 0,
          totalExpense: json.totalExpense || 0,
          netProfit:    json.netProfit    || 0,
        });

        const filtered = (json.recentTransactions || []).filter((t) => {
          const d = (t.created_at || "").split("T")[0];
          return d >= dateFrom && d <= dateTo && t.type === (type === "income" ? "income" : "expense");
        });
        setData({ type, rows: filtered });

      } else if (type === "reservation") {
        const res  = await fetch(`${API}/finance/reports`, { headers });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);

        const filtered = (json.reports || []).filter((r) => {
          const d = (r.created_at || "").split("T")[0];
          return d >= dateFrom && d <= dateTo;
        });
        setData({ type, rows: filtered });
      }
    } catch (err) {
      setError(err.message || "Тайлан татахад алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchReport(); }, []);

  /* ─── PDF хэвлэх ─── */
  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;

    const currentType = REPORT_TYPES.find(r => r.id === filters.type);
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html lang="mn">
      <head>
        <meta charset="UTF-8"/>
        <title>GameCenter — ${currentType?.label}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; color: #111; background: #fff; }
          .print-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #1d4ed8; }
          .print-logo { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
          .print-logo span { color: #1d4ed8; }
          .print-meta { text-align: right; font-size: 12px; color: #6b7280; line-height: 1.6; }
          .print-title { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
          .print-period { font-size: 13px; color: #6b7280; margin-bottom: 24px; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
          .summary-card { padding: 14px 18px; border-radius: 10px; border: 1px solid #e5e7eb; }
          .summary-card .label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .summary-card .val { font-size: 22px; font-weight: 800; }
          .green { color: #16a34a; } .red { color: #dc2626; } .blue { color: #1d4ed8; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          thead tr { background: #1d4ed8; color: #fff; }
          th { padding: 10px 14px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; }
          td { padding: 9px 14px; border-bottom: 1px solid #f3f4f6; }
          tr:nth-child(even) td { background: #f9fafb; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
          .num-green { color: #16a34a; font-weight: 700; }
          .num-red   { color: #dc2626; font-weight: 700; }
          .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="print-logo">GAME<span>CENTER</span> Connect</div>
          <div class="print-meta">
            Тайлан гаргасан: ${new Date().toLocaleDateString("mn-MN")}<br/>
            Хугацаа: ${filters.dateFrom} — ${filters.dateTo}
          </div>
        </div>
        ${content}
        <div class="footer">© ${new Date().getFullYear()} GameCenter Connect — Энэхүү тайлан системээс автоматаар гаргагдсан болно.</div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  /* ─── Хайлт шүүлт ─── */
  const filteredRows = (data?.rows || []).filter((r) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return Object.values(r).some(v => String(v || "").toLowerCase().includes(s));
  });

  const currentType = REPORT_TYPES.find(r => r.id === filters.type);

  /* ─── Нийт дүн тооцоо ─── */
  const totalAmount = filteredRows.reduce((sum, r) => {
    const v = r.amount ?? r.total_price ?? 0;
    return sum + Number(v);
  }, 0);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <BarChart3 size={20} className="text-blue-400" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Тайлан гаргах</h1>
            </div>
            <p className="text-slate-400 text-sm ml-13">Шүүлтүүр ашиглан санхүүгийн тайлан гаргана</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReport}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-all"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin text-blue-400" : "text-slate-400"} />
              Шинэчлэх
            </button>
            <button
              onClick={handlePrint}
              disabled={!data || isLoading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all shadow-lg shadow-blue-500/20"
            >
              <Printer size={16} /> PDF татах
            </button>
          </div>
        </div>

        {/* ── Шүүлтүүр ── */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5">
            <Filter size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-slate-300">Шүүлтүүр</span>
          </div>

          {/* Тайлангийн төрөл сонгогч */}
          <div className="flex gap-3 mb-5 flex-wrap">
            {REPORT_TYPES.map((rt) => {
              const Icon = rt.icon;
              const active = filters.type === rt.id;
              return (
                <button
                  key={rt.id}
                  onClick={() => setFilters({ ...filters, type: rt.id })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    active
                      ? "border-blue-500 bg-blue-500/15 text-blue-300"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <Icon size={15} style={{ color: active ? rt.color : undefined }} />
                  {rt.label}
                </button>
              );
            })}
          </div>

          {/* Огноо + хайх */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2">Эхлэх огноо</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2">Дуусах огноо</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2">Хайх</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Тайлбар хайх..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-600"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchReport}
                className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <BarChart3 size={15} /> Тайлан гаргах
              </button>
            </div>
          </div>
        </div>

        {/* ── Алдаа ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* ── Loading ── */}
        {isLoading && (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4" />
            <p className="text-slate-400 text-sm">Тайлан боловсруулж байна...</p>
          </div>
        )}

        {/* ── Тайлангийн агуулга ── */}
        {!isLoading && data && (
          <>
            {/* Summary cards */}
            {(data.type === "income" || data.type === "expense") && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Нийт орлого" value={`${fmt(summary.totalIncome)} ₮`} color="#22c55e" />
                <StatCard label="Нийт зардал" value={`${fmt(summary.totalExpense)} ₮`} color="#ef4444" />
                <StatCard label="Цэвэр ашиг"  value={`${fmt(summary.netProfit)} ₮`}   color="#3b82f6" />
              </div>
            )}

            {/* Хүснэгт */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">

              {/* Table header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    {currentType?.label}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {filters.dateFrom} — {filters.dateTo} · Нийт {filteredRows.length} бичлэг
                  </p>
                </div>
                {filteredRows.length > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Нийт дүн</p>
                    <p className={`text-xl font-black ${data.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                      {data.type === "expense" ? "-" : "+"}{fmt(totalAmount)} ₮
                    </p>
                  </div>
                )}
              </div>

              {/* Print-д орох агуулга */}
              <div ref={printRef}>
                {/* Print title — зөвхөн хэвлэхэд харагдана */}
                <div style={{ display: "none" }} className="print-title-block">
                  <div className="print-title">{currentType?.label}</div>
                  <div className="print-period">Хугацаа: {filters.dateFrom} — {filters.dateTo} · Нийт {filteredRows.length} бичлэг</div>

                  {(data.type === "income" || data.type === "expense") && (
                    <div className="summary-grid">
                      <div className="summary-card">
                        <div className="label">Нийт орлого</div>
                        <div className="val green">{fmt(summary.totalIncome)} ₮</div>
                      </div>
                      <div className="summary-card">
                        <div className="label">Нийт зардал</div>
                        <div className="val red">{fmt(summary.totalExpense)} ₮</div>
                      </div>
                      <div className="summary-card">
                        <div className="label">Цэвэр ашиг</div>
                        <div className="val blue">{fmt(summary.netProfit)} ₮</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 text-slate-400 text-xs uppercase">
                        <th className="px-6 py-3 text-left font-medium tracking-wider">#</th>
                        {data.type === "income" && <>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">Огноо</th>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">Тайлбар</th>
                          <th className="px-6 py-3 text-right font-medium tracking-wider">Дүн</th>
                        </>}
                        {data.type === "expense" && <>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">Огноо</th>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">Тайлбар</th>
                          <th className="px-6 py-3 text-right font-medium tracking-wider">Дүн</th>
                        </>}
                        {data.type === "reservation" && <>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">Огноо</th>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">PC нэр</th>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">Эхлэх</th>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">Дуусах</th>
                          <th className="px-6 py-3 text-right font-medium tracking-wider">Дүн</th>
                          <th className="px-6 py-3 text-left font-medium tracking-wider">Төлөв</th>
                        </>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredRows.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-6 py-16 text-center text-slate-500">
                            <FileText size={32} className="mx-auto mb-3 opacity-30" />
                            <p>Энэ хугацаанд мэдээлэл олдсонгүй</p>
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((r, i) => (
                          <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                            <td className="px-6 py-4 text-slate-500 text-xs">{i + 1}</td>

                            {(data.type === "income" || data.type === "expense") && <>
                              <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                                {r.created_at ? new Date(r.created_at).toLocaleDateString("mn-MN") : "—"}
                              </td>
                              <td className="px-6 py-4 font-medium">{r.description || "—"}</td>
                              <td className={`px-6 py-4 text-right font-bold tabular-nums ${data.type === "income" ? "text-green-400" : "text-red-400"}`}>
                                {data.type === "income" ? "+" : "-"}{fmt(r.amount)} ₮
                              </td>
                            </>}

                            {data.type === "reservation" && <>
                              <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                                {r.created_at ? new Date(r.created_at).toLocaleDateString("mn-MN") : "—"}
                              </td>
                              <td className="px-6 py-4 font-medium">{r.pc_name || "—"}</td>
                              <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                                {r.start_time ? new Date(r.start_time).toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                              </td>
                              <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                                {r.end_time ? new Date(r.end_time).toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-green-400 tabular-nums">
                                {fmt(r.total_price)} ₮
                              </td>
                              <td className="px-6 py-4">
                                <StatusBadge status={r.status} />
                              </td>
                            </>}
                          </tr>
                        ))
                      )}
                    </tbody>
                    {filteredRows.length > 0 && (
                      <tfoot>
                        <tr className="bg-white/5">
                          <td colSpan={data.type === "reservation" ? 5 : 3} className="px-6 py-3 text-xs text-slate-400 font-medium">
                            Нийт {filteredRows.length} бичлэг
                          </td>
                          <td className={`px-6 py-3 text-right font-black text-base tabular-nums ${data.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                            {data.type === "expense" ? "-" : "+"}{fmt(totalAmount)} ₮
                          </td>
                          {data.type === "reservation" && <td />}
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Анх нэвтрэхэд хоосон байдаг */}
        {!isLoading && !data && !error && (
          <div className="py-24 text-center">
            <BarChart3 size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">Шүүлтүүр тохируулаад "Тайлан гаргах" товчийг дарна уу</p>
          </div>
        )}
      </main>
    </div>
  );
};

/* ── Туслах компонентууд ── */
const StatCard = ({ label, value, color }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{label}</p>
    <p className="text-2xl font-black tabular-nums" style={{ color }}>{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || { label: status, color: "#9ca3af", bg: "rgba(156,163,175,0.12)" };
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
};

export default ReportsPage;