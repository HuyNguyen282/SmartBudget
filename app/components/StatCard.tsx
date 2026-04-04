import { Wallet, TrendingUp, TrendingDown, Activity } from "lucide-react";

type IconType  = "wallet" | "trending-up" | "trending-down" | "activity";
type ColorType = "blue" | "green" | "red" | "purple";

const ICONS   = { wallet: Wallet, "trending-up": TrendingUp, "trending-down": TrendingDown, activity: Activity };
const COLORS: Record<ColorType, { bg: string; icon: string }> = {
  blue:   { bg: "bg-blue-50",   icon: "text-blue-500"   },
  green:  { bg: "bg-green-50",  icon: "text-green-500"  },
  red:    { bg: "bg-red-50",    icon: "text-red-400"    },
  purple: { bg: "bg-purple-50", icon: "text-purple-500" },
};

function formatVND(v: number) {
  if (v === 0) return "0đ";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
    .format(v).replace("₫", "đ");
}

interface Props { title: string; value: number | null; icon: IconType; color: ColorType }

export default function StatCard({ title, value, icon, color }: Props) {
  const Icon = ICONS[icon];
  const c    = COLORS[color];
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-gray-500 font-medium leading-snug max-w-[130px]">{title}</p>
        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-[18px] h-[18px] ${c.icon}`} strokeWidth={2.2} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value === null
          ? <span className="block w-24 h-7 bg-gray-100 rounded-lg animate-pulse" />
          : formatVND(value)}
      </div>
    </div>
  );
}