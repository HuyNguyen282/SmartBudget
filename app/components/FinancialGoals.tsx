import Link from "next/link";
import { TrendingUp } from "lucide-react";

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO string
  icon?: string;
}

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v).replace("₫", "đ");
}

function calcPercent(current: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

const PROGRESS_COLORS = [
  "bg-[#6C3FC5]",
  "bg-blue-500",
  "bg-green-500",
  "bg-orange-400",
  "bg-pink-500",
];

export default function FinancialGoals({
  goals,
  loading,
}: {
  goals?: Goal[];
  loading: boolean;
}) {
  const empty = !goals || goals.length === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Mục tiêu tài chính</h3>
        <Link href="/goals" className="text-sm text-[#6C3FC5] font-medium hover:underline">
          Quản lý mục tiêu
        </Link>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          // Skeleton
          [...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse flex gap-4 items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-40" />
                <div className="h-2 bg-gray-200 rounded w-56" />
                <div className="h-2 bg-gray-100 rounded-full w-full mt-2" />
              </div>
            </div>
          ))
        ) : empty ? (
          // Empty state — giống ảnh
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#6C3FC5]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Thiết lập mục tiêu đầu tiên</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Lên kế hoạch tiết kiệm cho mua xe, mua nhà hoặc quỹ khẩn cấp.
              </p>
            </div>
            <Link href="/goals">
              <button className="shrink-0 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap">
                Tạo mục tiêu
              </button>
            </Link>
          </div>
        ) : (
          // Danh sách goals
          goals.map((goal, idx) => {
            const percent = calcPercent(goal.currentAmount, goal.targetAmount);
            const barColor = PROGRESS_COLORS[idx % PROGRESS_COLORS.length];
            return (
              <div key={goal.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#6C3FC5]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{goal.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatVND(goal.currentAmount)} / {formatVND(goal.targetAmount)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#6C3FC5]">{percent}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {goal.deadline && (
                  <p className="text-xs text-gray-400 mt-1.5 text-right">
                    Hạn: {new Date(goal.deadline).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}