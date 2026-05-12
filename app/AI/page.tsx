"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import Link from "next/link";
import {
  TrendingUp, AlertTriangle, Brain, Sparkles,
  TrendingDown, Wallet, ArrowRight, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import api from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────
interface ForecastData {
  hasEnoughData: boolean;
  forecast: {
    month: string;
    predicted: number;
    actual?: number;
  }[];
  insights: {
    type: "positive" | "warning" | "info";
    title: string;
    message: string;
    value?: string;
  }[];
  endOfMonthBalance: number;
  avgMonthlyExpense: number;
  topExpenseCategory: string;
}

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
  }).format(v).replace("₫", "đ");
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "predicted" ? "Dự báo" : "Thực tế"}: {formatVND(p.value)}
        </p>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function AIForecastPage() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(isRefresh = false) {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const { data } = await api.get('/ai/forecast');
      setData(data);
    } catch {
      setData(null);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const insightIcon = (type: string) => {
    if (type === "positive") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (type === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <Wallet className="w-4 h-4 text-blue-500" />;
  };

  const insightBg = (type: string) => {
    if (type === "positive") return "bg-green-50  border-green-100";
    if (type === "warning") return "bg-yellow-50 border-yellow-100";
    return "bg-blue-50   border-blue-100";
  };

  return (
    <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">

          {/* Tiêu đề */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">AI Dự báo tài chính</h1>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">PRO</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Dự đoán dòng tiền tương lai dựa trên lịch sử giao dịch bằng Trí tuệ nhân tạo.
                </p>
              </div>
            </div>
            {data?.hasEnoughData && (
              <button
                onClick={() => load(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Cập nhật
              </button>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-purple-200 border-t-[#6C3FC5] rounded-full animate-spin" />
              <p className="text-sm text-gray-400">AI đang phân tích dữ liệu của bạn...</p>
            </div>

          ) : !data || !data.hasEnoughData ? (
            /* ── Empty state ── */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Gradient top bar */}
              <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />

              <div className="p-12 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center">
                    <Brain className="w-9 h-9 text-[#6C3FC5]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3">AI cần thêm dữ liệu để học</h2>
                <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-8">
                  Mô hình Trí tuệ nhân tạo của SMARTBUDGET cần ít nhất{" "}
                  <span className="font-bold text-[#6C3FC5]">30 ngày giao dịch</span>{" "}
                  để có thể hiểu thói quen chi tiêu của bạn và đưa ra những dự báo chính xác về số dư cuối tháng.
                </p>

                {/* Feature cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-10">
                  {[
                    {
                      icon: TrendingUp,
                      color: "text-green-500",
                      bg: "bg-green-50",
                      title: "Dự báo số dư",
                      desc: "Dự đoán số tiền bạn sẽ còn lại vào cuối tháng dựa trên các khoản chi cố định và biến đổi.",
                    },
                    {
                      icon: AlertTriangle,
                      color: "text-yellow-500",
                      bg: "bg-yellow-50",
                      title: "Cảnh báo chi tiêu",
                      desc: "Phát hiện bất thường và cảnh báo sớm nếu bạn có nguy cơ vượt quá ngân sách đã đề ra.",
                    },
                  ].map(({ icon: Icon, color, bg, title, desc }) => (
                    <div key={title} className="text-left p-5 border border-gray-100 rounded-2xl bg-gray-50">
                      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <p className="text-sm font-bold text-gray-800 mb-1">{title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex items-center gap-3">
                  <Link href="/transactions">
                    <button className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200">
                      Ghi chép giao dịch ngay
                    </button>
                  </Link>
                  <button className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Tìm hiểu thêm về AI
                  </button>
                </div>
              </div>
            </div>

          ) : (
            /* ── Has data ── */
            <div className="space-y-5">

              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-400 mb-1">Dự báo số dư cuối tháng</p>
                  <p className={`text-xl font-bold ${data.endOfMonthBalance >= 0 ? "text-[#6C3FC5]" : "text-red-400"}`}>
                    {data.endOfMonthBalance >= 0 ? "+" : ""}{formatVND(data.endOfMonthBalance)}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-400 mb-1">Chi tiêu TB / tháng</p>
                  <p className="text-xl font-bold text-gray-800">{formatVND(data.avgMonthlyExpense)}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-400 mb-1">Danh mục chi nhiều nhất</p>
                  <p className="text-xl font-bold text-gray-800">{data.topExpenseCategory}</p>
                </div>
              </div>

              {/* Chart + Insights */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* Area chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-base font-bold text-gray-900">Biểu đồ dự báo dòng tiền</h3>
                    <span className="px-2 py-0.5 bg-purple-50 text-[#6C3FC5] text-xs font-semibold rounded-full">AI</span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={data.forecast}>
                      <defs>
                        <linearGradient id="predicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6C3FC5" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#6C3FC5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}tr` : `${v / 1000}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={0} stroke="#e5e7eb" />
                      <Area type="monotone" dataKey="actual" name="actual" stroke="#10B981" fill="url(#actual)" strokeWidth={2} dot={{ r: 3 }} />
                      <Area type="monotone" dataKey="predicted" name="predicted" stroke="#6C3FC5" fill="url(#predicted)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-5 mt-3 justify-center">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="w-5 h-0.5 bg-green-500" />Thực tế
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="w-5 h-0.5 bg-[#6C3FC5] border-t-2 border-dashed border-[#6C3FC5]" />Dự báo AI
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Nhận xét từ AI</h3>
                  <div className="space-y-3">
                    {data.insights.map((ins, i) => (
                      <div key={i} className={`p-4 border rounded-xl ${insightBg(ins.type)}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {insightIcon(ins.type)}
                          <p className="text-sm font-semibold text-gray-800">{ins.title}</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{ins.message}</p>
                        {ins.value && (
                          <p className="text-sm font-bold text-gray-800 mt-1">{ins.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}