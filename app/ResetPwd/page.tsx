"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export default function ResetPwd() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const token = new URLSearchParams(window.location.search).get("token");

      const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      console.log("Reset thành công:", data);
      window.location.href = "/signin";
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) setError(msg[0]);
      else setError(msg || "Reset mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7f7f9] font-sans">

      {/* ── LEFT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center px-12 xl:px-24 py-16 max-w-[580px]">

        {/* Logo */}
        <div className="flex items-center gap-10 mb-3">
          <img src="/download.svg" className="w-100 h-50 mb-1" alt="SmartBudget" />
        </div>

        {/* Heading */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Đặt lại mật khẩu</p>
          <h1 className="text-[2.4rem] font-extrabold text-gray-900 leading-[1.15] tracking-tight">
            Create a new<br />
            password for your{" "}
            <span className="text-blue-600">SmartBudget</span>
            <br />account
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* New Password */}
          <div className="relative group">
            <input
              type={showNew ? "text" : "password"}
              required
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-5 py-4 pr-12 rounded-2xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNew ? (
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

          {/* Confirm Password */}
          <div className="relative group">
            <input
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 pr-12 rounded-2xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? (
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

          {/* Submit */}
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-full border-t border-gray-200" />
          <p className="text-sm text-gray-500">
            Nhớ mật khẩu rồi?{" "}
            <Link href="/signin" className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Đăng nhập
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

        {/* Lock illustration card */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-4 w-[320px]">
            {/* Lock icon */}
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-gray-800 text-center leading-snug">Bảo mật tài khoản<br />của bạn</h2>
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Tạo mật khẩu mạnh để bảo vệ tài khoản SmartBudget và dữ liệu tài chính của bạn.
            </p>

            {/* Password strength hint */}
            <div className="w-full space-y-2 mt-1">
              {[
                { label: "Ít nhất 8 ký tự", color: "bg-green-400" },
                { label: "Chữ hoa & chữ thường", color: "bg-yellow-400" },
                { label: "Số hoặc ký tự đặc biệt", color: "bg-blue-400" },
              ].map((tip) => (
                <div key={tip.label} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${tip.color}`} />
                  <span className="text-[11px] text-gray-500">{tip.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rounded-full ${i === 1 ? "w-5 h-2.5 bg-blue-500" : "w-2.5 h-2.5 bg-blue-200"}`} />
            ))}
          </div>
        </div>

        {/* keyframes */}
        <style>{`
          @keyframes float {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(-12px); }
          }
        `}</style>
      </div>
    </div>
  );
}