"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import {
    User, Bell, Shield, CreditCard, LogOut,
    Mail, Smartphone, KeyRound, CheckCircle2, Plus,
} from "lucide-react";


// Types
type Tab = "account" | "notifications" | "security" | "subscription";

interface UserProfile {
    name: string;
    email: string;
    verified: boolean;
    currency: string;
    language: string;
}

//  Sidebar tabs 
const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "account", label: "Tài khoản", icon: User },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Shield },
];

const CURRENCIES = ["VNĐ - Đồng Việt Nam", "USD - Đô la Mỹ", "EUR - Euro"];
const LANGUAGES = ["Tiếng Việt", "English"];

//  Main
export default function SettingsPage() {
    const [tab, setTab] = useState<Tab>("account");
    const [profile, setProfile] = useState<UserProfile>({
        name: "Người dùng mới", email: "user@example.com",
        verified: true, currency: "VNĐ - Đồng Việt Nam", language: "Tiếng Việt",
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // notifications
    const [emailNotif, setEmailNotif] = useState(true);
    const [browserNotif, setBrowserNotif] = useState(false);

    // security
    const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
    const [pwError, setPwError] = useState("");
    const [pwSaved, setPwSaved] = useState(false);

    const router = useRouter();


    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { credentials: "include" });
                if (!res.ok) return;
                const u = await res.json();
                setProfile((p) => ({ ...p, ...u }));
            } catch { }
        }
        load();
    }, []);

    //  Save profile
    async function handleSaveProfile() {
        setSaving(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                method: "PATCH", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: profile.name, currency: profile.currency, language: profile.language }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch { } finally { setSaving(false); }
    }

    //Change password 
    async function handleChangePassword() {
        setPwError("");
        if (!pwForm.current || !pwForm.next || !pwForm.confirm) return setPwError("Vui lòng điền đầy đủ.");
        if (pwForm.next !== pwForm.confirm) return setPwError("Mật khẩu mới không khớp.");
        if (pwForm.next.length < 8) return setPwError("Mật khẩu phải có ít nhất 8 ký tự.");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change-password`, {
                method: "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
            });
            if (!res.ok) throw new Error();
            setPwForm({ current: "", next: "", confirm: "" });
            setPwSaved(true);
            setTimeout(() => setPwSaved(false), 2500);
        } catch { setPwError("Mật khẩu hiện tại không đúng."); }
    }
    //Logout
    async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    localStorage.removeItem("sb-token");
    router.push("/signin");
  }
    return (
        <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-8">

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý hồ sơ cá nhân và tuỳ chỉnh trải nghiệm của bạn.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex min-h-[520px]">

                        {/* Left nav */}
                        <div className="w-52 border-r border-gray-100 p-4 flex flex-col shrink-0">
                            <nav className="space-y-1 flex-1">
                                {TABS.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setTab(id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === id
                                                ? "bg-purple-50 text-[#6C3FC5]"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </nav>
                            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-2">
                                <LogOut className="w-4 h-4" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8">

                            {/* ── TÀI KHOẢN ── */}
                            {tab === "account" && (
                                <div>
                                    {/* Avatar + name */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                                <User className="w-7 h-7 text-[#6C3FC5]" />
                                            </div>
                                            <button className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                                <Plus className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-base">{profile.name}</p>
                                            <p className="text-sm text-gray-400">{profile.email}</p>
                                            {profile.verified && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                    <span className="text-xs text-green-600 font-medium">Đã xác thực email</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold text-gray-800 mb-4">Thông tin cá nhân</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Họ và tên</label>
                                            <input
                                                value={profile.name}
                                                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Email đăng nhập</label>
                                            <input
                                                value={profile.email}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Đơn vị tiền tệ mặc định</label>
                                            <select
                                                value={profile.currency}
                                                onChange={(e) => setProfile((p) => ({ ...p, currency: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition cursor-pointer"
                                            >
                                                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Ngôn ngữ giao diện</label>
                                            <select
                                                value={profile.language}
                                                onChange={(e) => setProfile((p) => ({ ...p, language: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition cursor-pointer"
                                            >
                                                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                                            </select>
                                        </div>
                                    </div>



                                    {/* Footer buttons */}
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => setProfile((p) => ({ ...p, name: "Người dùng mới" }))}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            Hủy thay đổi
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
                                        >
                                            {saving
                                                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                : saved
                                                    ? <CheckCircle2 className="w-4 h-4" />
                                                    : null}
                                            {saved ? "Đã lưu!" : "Lưu cài đặt"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── noti ── */}
                            {tab === "notifications" && (
                                <div>
                                    <p className="text-base font-bold text-gray-900 mb-1">Cài đặt thông báo</p>
                                    <p className="text-sm text-gray-400 mb-6">Quản lý cách chúng tôi liên hệ với bạn về các cập nhật tài khoản và báo cáo.</p>

                                    <div className="space-y-3">
                                        {[
                                            {
                                                icon: Mail, label: "Email thông báo",
                                                desc: "Nhận báo cáo hàng tuần và cảnh báo ngân sách qua email.",
                                                value: emailNotif, set: setEmailNotif,
                                            },
                                            {
                                                icon: Smartphone, label: "Thông báo trình duyệt",
                                                desc: "Hiển thị cảnh báo trực tiếp trên màn hình khi có giao dịch lớn.",
                                                value: browserNotif, set: setBrowserNotif,
                                            },
                                        ].map(({ icon: Icon, label, desc, value, set }) => (
                                            <div key={label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                                                        <Icon className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{label}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                                                    </div>
                                                </div>
                                                {/* Toggle */}
                                                <button
                                                    onClick={() => set((v: boolean) => !v)}
                                                    className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-[#6C3FC5]" : "bg-gray-300"}`}
                                                >
                                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* BẢO MẬT  */}
                            {tab === "security" && (
                                <div>
                                    <p className="text-base font-bold text-gray-900 mb-1">Bảo mật tài khoản</p>
                                    <p className="text-sm text-gray-400 mb-6">Cập nhật mật khẩu và bảo vệ tài khoản của bạn khỏi truy cập trái phép.</p>

                                    <div className="border border-gray-100 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-5">
                                            <KeyRound className="w-4 h-4 text-[#6C3FC5]" />
                                            <p className="text-sm font-semibold text-gray-800">Đổi mật khẩu</p>
                                        </div>
                                        <div className="space-y-4 max-w-sm">
                                            {[
                                                { label: "Mật khẩu hiện tại", key: "current" },
                                                { label: "Mật khẩu mới", key: "next" },
                                                { label: "Xác nhận mật khẩu", key: "confirm" },
                                            ].map(({ label, key }) => (
                                                <div key={key}>
                                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">{label}</label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={pwForm[key as keyof typeof pwForm]}
                                                        onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                                                    />
                                                </div>
                                            ))}
                                            {pwError && <p className="text-xs text-red-500">{pwError}</p>}
                                            {pwSaved && <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Đổi mật khẩu thành công!</p>}
                                            <button
                                                onClick={handleChangePassword}
                                                className="bg-[#6C3FC5] hover:bg-[#5a33a8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
                                            >
                                                Cập nhật mật khẩu
                                            </button>
                                        </div>
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