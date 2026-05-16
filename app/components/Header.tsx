"use client";

import { Bell, Search, ChevronDown, User, KeyRound, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { getSettings } from "@/lib/api";
import { getNotifications, Notification } from "@/lib/api";


interface UserInfo {
  name?: string;

}

export default function Header({ user: userProp }: { user?: UserInfo }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(userProp ?? null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [notifOpen, setnotifOpen] = useState(false);

  const initials = user?.name?.trim()
    ? user.name.trim().split(" ").map((n) => n[0]).slice(-2).join("").toUpperCase()
    : "NB";
  const displayName = user?.name?.trim() || "Người dùng";
  async function refreshNotifs() {
  try {
    const data = await getNotifications();
    setNotifs(data);
  } catch {}
}

// Lắng nghe event
useEffect(() => {
  window.addEventListener("notif-update", refreshNotifs);
  return () => window.removeEventListener("notif-update", refreshNotifs);
}, []);

  // Fetch user từ API nếu chưa có
  useEffect(() => {
    if (userProp?.name) {
      setUser(userProp);
      return;
    }
    async function loadUser() {
      try {
        const data = await getSettings();
        setUser(data);
      } catch { }
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
  useEffect(() => {
    async function handleUserUpdated() {
      const data = await getSettings();
      setUser(data);
    }
    window.addEventListener("user-updated", handleUserUpdated);
    return () => window.removeEventListener("user-updated", handleUserUpdated);
  }, []);
  useEffect(() => {
    getNotifications().then(setNotifs).catch(() => { });
    const interval = setInterval(() => {
      getNotifications().then(setNotifs).catch(() => { });
    }, 30000); // polling 30 giây
    return () => clearInterval(interval);
  }, []);

  async function handleLogout() {
    setOpen(false);
    try {
      await api.post("/auth/logout");
    } catch { }
    localStorage.removeItem("access_token");
    router.push("/signin");
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center gap-4 shrink-0">


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
        {/* Bell */}
        <div className="relative">
          <button onClick={() => setnotifOpen(!notifOpen)} className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 text-white text-[10px] rounded-full flex-items-center justify-content">{notifs.length}</span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-8 w-80 bg-white rounded-2x1 shadow-x1 border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Thông báo</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Không có thông báo</p>) : (
                  notifs.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(n.time).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
                onClick={() => { setOpen(false); router.push("/settingapp"); }}
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
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}