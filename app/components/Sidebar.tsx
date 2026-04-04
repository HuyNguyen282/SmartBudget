"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, Target, FileText, TrendingUp, Settings, Wallet } from "lucide-react";

const NAV = [
  { label: "Trang chủ",          href: "/Dashboard",  icon: Home },
  { label: "Giao dịch",          href: "/transactions", icon: ArrowLeftRight },
  { label: "Mục tiêu tài chính", href: "/goals",       icon: Target },
  { label: "Báo cáo & Lịch sử",  href: "/statandhistory",     icon: FileText },
  { label: "AI Dự báo",          href: "/ai-forecast", icon: TrendingUp },
  { label: "Cài đặt",            href: "/settingapp",    icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-[260px] min-h-screen bg-[#3D1E7A] flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm tracking-wide">SMARTBUDGET</p>
          <p className="text-white/50 text-[10px] uppercase tracking-widest">Expense Management</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-white/30 text-[10px] text-center">v1.0.0 · SMARTBUDGET</p>
      </div>
    </aside>
  );
}