"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";
import { ChartDataPoint, Period } from "../types";

const PERIODS: { label: string; value: Period }[] = [
  { label: "Tháng này", value: "month"   },
  { label: "Quý này",   value: "quarter" },
  { label: "Năm nay",   value: "year"    },
];

interface Props {
  data?: ChartDataPoint[];
  loading: boolean;
  period: Period;
  onPeriodChange: (p: Period) => void;
}

export default function SpendingChart({ data, loading, period, onPeriodChange }: Props) {
  const empty = !data || data.length === 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-gray-900">Thống kê thu chi</h3>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as Period)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
        >
          {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="h-[240px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : empty ? (
        <div className="h-[240px] flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Chưa có dữ liệu thống kê</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Hãy thêm giao dịch đầu tiên để xem biểu đồ phân tích thu chi và theo dõi dòng tiền.
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}tr` : `${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,.1)" }}
              formatter={(v: any) => {
                if (!v) return "0đ";
                // Fix lỗi ở đây: Xóa đoạn code thừa bị dư ở ngoài và gom gọn lại return
                return Number(v).toLocaleString("vi-VN", { 
                  style: "currency", 
                  currency: "VND", 
                  maximumFractionDigits: 0 
                }).replace("₫", "đ");
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="income"  name="Thu nhập" fill="#6C3FC5" radius={[6,6,0,0]} />
            <Bar dataKey="expense" name="Chi tiêu" fill="#F87171" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}