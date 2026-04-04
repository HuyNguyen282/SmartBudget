"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { Download, PieChart, BarChart2, Calendar, ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line, LineChart, PieChart as RPieChart,
  Pie, Cell, Legend,
} from "recharts";


interface ReportStats {
  totalIncome:  number;
  totalExpense: number;
  netBalance:   number;
}

interface CashFlowPoint {
  label:   string;
  income:  number;
  expense: number;
}

interface CategoryItem {
  name:    string;
  amount:  number;
  percent: number;
  color:   string;
}

interface ReportData {
  stats:      ReportStats;
  cashFlow:   CashFlowPoint[];
  categories: CategoryItem[];
}


const PERIOD_OPTIONS = [
  { label: "Tháng này",       value: "month"    },
  { label: "Tháng trước",     value: "lastmonth"},
  { label: "Tất cả thời gian",value: "all"      },
];

const CAT_COLORS = ["#EF4444","#3B82F6","#F59E0B","#10B981","#9CA3AF","#8B5CF6","#F97316"];

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
          {p.name}: {formatVND(p.value)}
        </p>
      ))}
    </div>
  );
}


export default function ReportsPage() {
  const [data, setData]       = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod]   = useState("month");
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reports?period=${period}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period]);

  const isEmpty = !loading && (!data || data.cashFlow.length === 0);
  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? "Tháng này";

  return (
    <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">

          {/* Tiêu đề */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Báo cáo tài chính</h1>
              <p className="text-sm text-gray-500 mt-1">
                Phân tích chi tiết thu chi và dòng tiền của bạn qua các biểu đồ trực quan.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Period dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdown((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {periodLabel}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                    {PERIOD_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setPeriod(opt.value); setDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          period === opt.value
                            ? "bg-purple-50 text-[#6C3FC5] font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Export */}
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Stat cards — chỉ hiện khi có data */}
          {!isEmpty && !loading && data && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">Tổng thu</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-xl font-bold text-green-500">{formatVND(data.stats.totalIncome)}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">Tổng chi</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-xl font-bold text-red-400">{formatVND(data.stats.totalExpense)}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">Số dư</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className={`text-xl font-bold ${data.stats.netBalance >= 0 ? "text-[#6C3FC5]" : "text-red-400"}`}>
                    {data.stats.netBalance >= 0 ? "+" : ""}{formatVND(data.stats.netBalance)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Cash flow chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-6">Phân tích dòng tiền</h3>

              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-purple-300 border-t-[#6C3FC5] rounded-full animate-spin" />
                </div>
              ) : isEmpty ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <PieChart className="w-7 h-7 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-700">Chưa đủ dữ liệu biểu đồ</p>
                    <p className="text-sm text-gray-400 mt-1 max-w-xs">
                      Bạn cần thêm giao dịch trong kỳ hạn này để có thể xem biểu đồ phân tích xu hướng thu chi và các khoản chi tiêu lớn.
                    </p>
                  </div>
                  <Link
                    href="/transactions"
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Quay lại Giao dịch <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data!.cashFlow} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => v >= 1_000_000 ? `${(v/1_000_000).toFixed(0)}tr` : `${v/1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="income"  name="Thu nhập" fill="#6C3FC5" radius={[6,6,0,0]} />
                    <Bar dataKey="expense" name="Chi tiêu" fill="#E9D5FF" radius={[6,6,0,0]} />
                    <Line type="monotone" dataKey="expense" stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-6">Chi tiêu theo danh mục</h3>

              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-purple-300 border-t-[#6C3FC5] rounded-full animate-spin" />
                </div>
              ) : isEmpty ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-center px-2">
                  <PieChart className="w-10 h-10 text-gray-200" />
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Biểu đồ tròn sẽ hiển thị tỷ lệ chi tiêu cho từng danh mục (Ăn uống, Di chuyển, Mua sắm...) sau khi có giao dịch.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Donut */}
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={200}>
                      <RPieChart>
                        <Pie
                          data={data!.categories}
                          dataKey="amount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          strokeWidth={0}
                        >
                          {data!.categories.map((_, i) => (
                            <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: any) => formatVND(v)}
                          contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,.1)" }}
                        />
                      </RPieChart>
                    </ResponsiveContainer>
                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-xs text-gray-400">Tổng chi</p>
                      <p className="text-sm font-bold text-gray-800">{formatVND(data!.stats.totalExpense)}</p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-3 space-y-2">
                    {data!.categories.map((cat, i) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: CAT_COLORS[i % CAT_COLORS.length] }}
                          />
                          <div>
                            <p className="text-sm text-gray-700">{cat.name}</p>
                            <p className="text-xs text-gray-400">{cat.percent}%</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{formatVND(cat.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}