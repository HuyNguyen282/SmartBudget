"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { getAiForecast, getStats } from "@/lib/api";
import {
  TrendingUp, AlertTriangle, Brain, Sparkles,
  TrendingDown, RefreshCw, CheckCircle,
  Bot, Database, WifiOff, Loader2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

// ── Types ─────────────────────────────────────────────────
interface AiInsight {
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  confidence: number;
}

interface AiForecastResponse {
  forecastIncome: number;
  forecastExpense: number;
  forecastBalance: number;
  mae: number;
  trend: number;
  accuracy: number;
  nextMonthLabel: string;
  insights: AiInsight[];
  monthly: { month: string; income: number; expense: number }[];
  avgIncome: number;
  avgExpense: number;
  catData: { cat: string; current: number }[];
  savingRate: number;
  financialHealth: "Tốt" | "Trung bình" | "Cần cải thiện";
  transactionsAnalyzed: number;
}

// ── Helpers ───────────────────────────────────────────────
function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  })
    .format(v)
    .replace("₫", "đ");
}

function nowStr() {
  return new Date().toLocaleString("vi-VN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

// ── Sub-components ────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "income" ? "Thu nhập" : "Chi tiêu"}: {formatVND(p.value)}
        </p>
      ))}
    </div>
  );
}

function insightIcon(type: string) {
  if (type === "success") return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (type === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  return <Database className="w-4 h-4 text-[#6C3FC5]" />;
}

function insightStyle(type: string) {
  if (type === "success") return "bg-green-50 border-green-200 border-l-green-500";
  if (type === "warning") return "bg-yellow-50 border-yellow-200 border-l-yellow-500";
  return "bg-violet-50 border-violet-200 border-l-violet-500";
}

function healthColor(h: string) {
  if (h === "Tốt") return "text-green-600";
  if (h === "Trung bình") return "text-orange-500";
  return "text-red-500";
}

// ── Page ──────────────────────────────────────────────────
export default function AIForecastPage() {
  const [data, setData] = useState<AiForecastResponse | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchForecast = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [forecast, stats] = await Promise.all([
        getAiForecast() as Promise<AiForecastResponse>,
        getStats(),
      ]);
      setData(forecast);
      setCurrentBalance((stats as any).stats.balance);
      setLastUpdated(nowStr());
      setLastUpdated(nowStr());
    } catch (err: any) {
      setError(err.message ?? "Không thể kết nối tới server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#6C3FC5]" />
              <p className="text-sm">Đang phân tích dữ liệu...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center max-w-sm">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <WifiOff className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Không tải được dữ liệu</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
              <button
                onClick={fetchForecast}
                className="flex items-center gap-2 px-5 py-2 bg-[#6C3FC5] text-white rounded-xl text-sm font-semibold hover:bg-[#5a33a8] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">

          {/* Tiêu đề */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">AI Dự báo tài chính</h1>
                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-sm text-gray-400">Phân tích được cập nhật {lastUpdated}</p>
            </div>
            <button
              onClick={fetchForecast}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#6C3FC5] hover:bg-[#5a33a8] text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Đang phân tích..." : "Phân tích lại"}
            </button>
          </div>

          {/* Status banner */}
          <div className="bg-white border-2 border-[#6C3FC5] rounded-2xl px-5 py-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#6C3FC5]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  SmartBudget AI đã hoàn tất phân tích
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Đã xử lý{" "}
                  <span className="font-bold text-gray-600">{data.transactionsAnalyzed} giao dịch</span>
                  {" · "}Phát hiện{" "}
                  <span className="font-bold text-gray-600">{data.insights.length} insights</span>
                  {" · "}Độ chính xác:{" "}
                  <span className="font-bold text-gray-600">~{data.accuracy}%</span>
                </p>
              </div>
            </div>
            <span className="flex items-center gap-2 bg-violet-50 text-[#6C3FC5] rounded-lg px-3 py-1.5 text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Hoạt động
            </span>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              {
                label: "Số dư hiện tại",
                badge: "Hiện tại",
                badgeColor: "bg-blue-50 text-blue-600",
                value: formatVND(currentBalance),
                valueColor: "text-gray-900",
              },
              {
                label: `Dự báo ${data.nextMonthLabel}`,
                badge: "Dự báo",
                badgeColor: "bg-violet-50 text-violet-600",
                value: formatVND(data.forecastBalance),
                valueColor: "text-[#6C3FC5]",
              },
              {
                label: "Tỷ lệ tiết kiệm",
                badge: "Tháng này",
                badgeColor: "bg-green-50 text-green-600",
                value: `${data.savingRate}%`,
                valueColor:
                  data.savingRate >= 20
                    ? "text-green-600"
                    : data.savingRate >= 0
                      ? "text-orange-500"
                      : "text-red-500",
              },
              {
                label: "Sức khỏe tài chính",
                badge: "Đánh giá",
                badgeColor: "bg-orange-50 text-orange-600",
                value: data.financialHealth,
                valueColor: healthColor(data.financialHealth),
              },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">{m.label}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
                <p className={`text-xl font-bold ${m.valueColor}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-2 gap-5">

            {/* AI Insights */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-yellow-500" />
                AI Insights & Khuyến nghị
              </h3>
              {data.insights.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Chưa có đủ dữ liệu để phân tích.
                </p>
              ) : (
                <div className="space-y-3">
                  {data.insights.map((ins, i) => (
                    <div
                      key={i}
                      className={`p-4 border border-l-[3px] rounded-xl ${insightStyle(ins.type)}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {insightIcon(ins.type)}
                          <p className="text-sm font-semibold text-gray-800">{ins.title}</p>
                        </div>
                        <span className="text-xs text-gray-400 font-medium flex-shrink-0">
                          {ins.confidence}% tin cậy
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{ins.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Forecast chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#6C3FC5]" />
                Xu hướng & Dự báo
                <span className="ml-1 px-2 py-0.5 bg-violet-50 text-[#6C3FC5] text-xs font-semibold rounded-full">
                  6 tháng gần nhất
                </span>
              </h3>

              {data.monthly.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                  Chưa có dữ liệu lịch sử
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={data.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) =>
                        v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}tr` : `${v / 1000}k`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#e5e7eb" />
                    <Area type="monotone" dataKey="income" name="income" stroke="#22c55e" fill="url(#gIncome)" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} />
                    <Area type="monotone" dataKey="expense" name="expense" stroke="#ef4444" fill="url(#gExpense)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: "#ef4444" }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              <div className="flex items-center gap-5 justify-center my-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-4 h-0.5 bg-green-500 rounded" />Thu nhập
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-4 h-0 border-t-2 border-dashed border-red-400" />Chi tiêu
                </div>
              </div>

              {/* Forecast summary */}
              <div className="space-y-2 mb-4">
                {[
                  {
                    icon: TrendingUp,
                    bg: "bg-green-50",
                    iconColor: "text-green-600",
                    name: "Thu nhập dự kiến",
                    sub: data.nextMonthLabel,
                    val: `~${formatVND(data.forecastIncome)}`,
                    valColor: "text-green-600",
                  },
                  {
                    icon: TrendingDown,
                    bg: "bg-red-50",
                    iconColor: "text-red-500",
                    name: "Chi tiêu dự kiến",
                    sub: `Xu hướng ${data.trend >= 0 ? "+" : ""}${data.trend}%`,
                    val: `~${formatVND(data.forecastExpense)}`,
                    valColor: "text-red-500",
                  },
                  {
                    icon: Sparkles,
                    bg: "bg-violet-50",
                    iconColor: "text-violet-600",
                    name: "Số dư dự báo",
                    sub: `Độ chính xác ~${data.accuracy}%`,
                    val: formatVND(data.forecastBalance),
                    valColor: data.forecastBalance >= 0 ? "text-[#6C3FC5]" : "text-red-500",
                  },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between bg-gray-50 rounded-xl px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 ${t.bg} rounded-lg flex items-center justify-center`}>
                        <t.icon className={`w-4 h-4 ${t.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                        <p className="text-[10px] text-gray-400">{t.sub}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${t.valColor}`}>{t.val}</p>
                  </div>
                ))}
              </div>

              {/* AI tip box */}
              <div className="bg-gradient-to-br from-[#6C3FC5] to-purple-500 rounded-xl p-4 text-white">
                <p className="text-xs font-semibold flex items-center gap-1.5 mb-1">
                  <Bot className="w-3.5 h-3.5" />
                  Khuyến nghị từ AI
                </p>
                <p className="text-[10px] opacity-70 mb-2.5">Dựa trên phân tích hành vi của bạn</p>
                {[
                  "Thiết lập mục tiêu tiết kiệm tự động mỗi khi có thu nhập",
                  "Theo dõi chi tiêu hàng ngày để AI dự báo chính xác hơn",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2 mb-1.5">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-80" />
                    <p className="text-[11px] opacity-90 leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}