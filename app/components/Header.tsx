"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { User } from "../types";

export default function Header({ user }: { user?: User }) {
  const initials = user?.name
    ? user.name.split(" ").map((n : string) => n[0]).slice(-2).join("").toUpperCase()
    : "NB";

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center gap-4 shrink-0">
      <h2 className="text-base font-bold text-gray-900 mr-4 whitespace-nowrap">Trang chủ</h2>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Giao dịch..."
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900">
            {initials}
          </div>
          <span className="text-sm font-medium text-gray-700">{user?.name ?? "Nguyễn Văn B"}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}