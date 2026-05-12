"use client";

<<<<<<< HEAD
import { Bell, Search, ChevronDown, User, KeyRound, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";

interface UserInfo {
  name?: string;
}

export default function Header({ user: userProp }: { user?: UserInfo }) {
  const router          = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(userProp ?? null);
  const menuRef         = useRef<HTMLDivElement>(null);

  const initials    = user?.name?.trim()
    ? user.name.trim().split(" ").map((n) => n[0]).slice(-2).join("").toUpperCase()
    : "NB";
  const displayName = user?.name?.trim() || "Nguyễn Văn B";

  // Fetch user từ API nếu chưa có
  useEffect(() => {
    if (userProp?.name) {
      setUser(userProp);
      return;
    }
    async function loadUser() {
      try {
        const { data } = await api.get("/users/me");
        setUser(data);
      } catch {}
    }
    loadUser();
  }, [userProp]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("access_token");
    router.push("/signin");
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center gap-4 shrink-0">
   
=======
import { Bell, Search, ChevronDown } from "lucide-react";
import { User } from "../types";

export default function Header({ user }: { user?: User }) {
  const initials = user?.name
    ? user.name.split(" ").map((n : string) => n[0]).slice(-2).join("").toUpperCase()
    : "NB";

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center gap-4 shrink-0">
      <h2 className="text-base font-bold text-gray-900 mr-4 whitespace-nowrap">Trang chủ</h2>
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0

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
<<<<<<< HEAD
        {/* Bell */}
=======
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

<<<<<<< HEAD
        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900">
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-700">{displayName}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
              <MenuItem
                icon={User}
                label="Thông tin tài khoản"
                onClick={() => { setOpen(false); router.push("/settings"); }}
              />
              <MenuItem
                icon={KeyRound}
                label="Đổi mật khẩu"
                onClick={() => { setOpen(false); router.push("/settings?tab=security"); }}
              />
              <div className="my-1 border-t border-gray-100" />
              <MenuItem
                icon={LogOut}
                label="Đăng xuất"
                onClick={handleLogout}
                danger
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon: Icon, label, onClick, danger,
}: {
  icon: any; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
        danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
=======
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
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
}