"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: form.email, password: form.password }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as any).message ?? "Email hoặc mật khẩu không đúng");
      }
      const data = await res.json();
      const token = data.access_token ?? data.token ?? "";
      const role = data.role ?? "user";
      localStorage.setItem("access_token", token);
      const walletRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let hasWallet = false;
      if (walletRes.ok) {
        const wallets = await walletRes.json();
        hasWallet = Array.isArray(wallets)
          ? wallets.length > 0
          : !!wallets?.data?.length;
      }

      if (role === 'admin') {
        router.push("/Admin");
      } else {
        router.push(hasWallet ? "/Dashboard" : "/pre-wallet");
      }
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f7f7f9] font-sans">

      {/* ── LEFT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center px-12 xl:px-24 py-16 max-w-[580px]">

        {/* Logo */}
        <div className="flex items-center gap-10 mb-3">

          <img src="/download.svg" className="w-100 h-50 mb-1" />

        </div>

        {/* Heading */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Chào mừng trở lại</p>
          <h1 className="text-[2.4rem] font-extrabold text-gray-900 leading-[1.15] tracking-tight">
            LET&apos;S start by logging<br />
            to your <span className="text-blue-600">SmartBudget</span><br />
            account
          </h1>
        </div>

        {/* Error */}
        {err && (
          <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm text-red-600 font-medium">{err}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input
              type="text" required
              placeholder="Enter Your Account"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            />
          </div>

          <div className="relative group">
            <input
              type={showPass ? "text" : "password"} required
              placeholder="Enter Your Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-5 py-4 pr-12 rounded-2xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPass ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200">
            {loading ? (
              <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" /></svg>Đang đăng nhập...</>
            ) : "Đăng nhập"}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <Link href="/EnterMail" className="text-sm text-blue-600 hover:underline font-medium">
            Quên mật khẩu?
          </Link>
          <div className="w-full border-t border-gray-200" />
          <p className="text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link href="/signup" className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Tạo tài khoản mới
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#ede8f5] items-center justify-center">

        {/* Soft blob background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-200/60 blur-3xl" />
          <div className="absolute top-16 right-16 w-48 h-48 rounded-full bg-pink-200/40 blur-2xl" />
          <div className="absolute bottom-16 left-12 w-40 h-40 rounded-full bg-indigo-200/40 blur-2xl" />
        </div>

        {/* Floating cultural decorations */}
        <div className="absolute top-10 right-14 text-5xl animate-[float_4s_ease-in-out_infinite]">🏮</div>
        <div className="absolute top-28 left-10 text-4xl animate-[float_5s_ease-in-out_0.5s_infinite]">✨</div>
        <div className="absolute bottom-24 right-8 text-4xl animate-[float_4.5s_ease-in-out_1s_infinite]">🏮</div>
        <div className="absolute top-1/3 right-6 text-5xl animate-[float_6s_ease-in-out_0.3s_infinite]">🌸</div>
        <div className="absolute bottom-16 left-16 text-4xl animate-[float_5s_ease-in-out_0.8s_infinite]">💰</div>
        <div className="absolute top-20 left-1/4 text-3xl animate-[float_4s_ease-in-out_1.2s_infinite]">⭐</div>

        {/* Laptop mockup */}
        <div className="relative z-10 w-[440px] drop-shadow-2xl">
          {/* Screen frame */}
          <div className="bg-gray-900 rounded-[18px] p-2.5 shadow-2xl">
            <div className="bg-white rounded-[10px] overflow-hidden">
              {/* Mock top bar */}
              <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="text-[9px] text-gray-400 font-medium">SmartBudget</div>
                <div className="w-4 h-4 rounded-full bg-gray-100" />
              </div>

              {/* Mock tab bar */}
              <div className="bg-white px-4 py-2 flex gap-4 border-b border-gray-100">
                {["Chi tiêu", "Mua sắm", "Báo cáo"].map((t, i) => (
                  <span key={t} className={`text-[9px] font-semibold pb-1.5 ${i === 0 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}>{t}</span>
                ))}
              </div>

              {/* Mock content */}
              <div className="bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-700">Chi tiêu tháng này</span>
                  <span className="text-[8px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Team ▾</span>
                </div>

                {/* Donut chart mock */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="52 88" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="18 122" strokeDashoffset="-52" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#818cf8" strokeWidth="4" strokeDasharray="18 122" strokeDashoffset="-70" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[6px] text-gray-500">Chi tiêu</span>
                      <span className="text-[7px] font-bold text-gray-700">15,5M</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[["#22c55e", "Ăn uống"], ["#f59e0b", "Mua sắm"], ["#818cf8", "Hóa đơn"]].map(([c, l]) => (
                      <div key={l} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                        <span className="text-[8px] text-gray-500">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rows */}
                <div className="text-[8px] text-gray-500 mb-2 font-medium">Tổng chi tiêu: 15,500,000đ</div>
                {[
                  { icon: "🍜", name: "Ăn uống", d1: "07/08/2023", amt: "48,000đ", d2: "10/06/2023", pct: "2,500%", bar: "bg-green-400", w: "w-full", total: "15,500,000đ" },
                  { icon: "🛍", name: "Mua sắm", d1: "23/08/2023", amt: "3,500đ", d2: "10/06/2023", pct: "2,500%", bar: "bg-yellow-400", w: "w-1/6", total: "2,500,000đ" },
                  { icon: "📋", name: "Hóa đơn", d1: "07/08/2023", amt: "300,000đ", d2: "27/09/2023", pct: "3,00%", bar: "bg-gray-300", w: "w-1/12", total: "300,000đ" },
                ].map((r) => (
                  <div key={r.name} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-base">{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="text-[8px] font-semibold text-gray-700">{r.name}</span>
                        <span className="text-[8px] font-bold text-gray-700">{r.total}</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full mt-1">
                        <div className={`h-full rounded-full ${r.bar} ${r.w}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Laptop base */}
          <div className="h-3 bg-gray-800 rounded-b-xl mx-4" />
          <div className="h-1.5 bg-gray-700 rounded-b-2xl mx-2" />
        </div>

        {/* keyframes */}
        <style>{`
          @keyframes float {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(-12px); }
          }
        `}</style>
      </div>

      {/* User avatar bottom left */}

    </div>
  );
}