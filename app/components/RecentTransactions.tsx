import Link from "next/link";
import { Wallet } from "lucide-react";
import { Transaction } from "../types";

const CAT_COLORS: Record<string, string> = {
  "Ăn uống":   "bg-orange-100 text-orange-600",
  "Di chuyển": "bg-blue-100   text-blue-600",
  "Mua sắm":   "bg-pink-100   text-pink-600",
  "Lương":     "bg-green-100  text-green-600",
  "Giải trí":  "bg-purple-100 text-purple-600",
  "Y tế":      "bg-red-100    text-red-600",
};

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
    .format(v).replace("₫", "đ");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function RecentTransactions({ transactions, loading }: { transactions?: Transaction[]; loading: boolean }) {
  const empty = !transactions || transactions.length === 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-900">Giao dịch gần đây</h3>
        <Link href="/transactions" className="text-sm text-[#6C3FC5] font-medium hover:underline">
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 bg-gray-100 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-16" />
            </div>
          ))}
        </div>
      ) : empty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-400">Bạn chưa có giao dịch nào gần đây.</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto">
          {transactions.map((tx) => {
            const color = CAT_COLORS[tx.category] ?? "bg-gray-100 text-gray-500";
            return (
              <div key={tx.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
                  {tx.category.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{tx.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${tx.type === "income" ? "text-green-500" : "text-red-400"}`}>
                  {tx.type === "income" ? "+" : "−"}{formatVND(Math.abs(tx.amount))}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}