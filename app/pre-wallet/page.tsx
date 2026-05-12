"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SOURCES = [
  {
    id: "cash",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
    label: "Tiền mặt",
    sub: "Nguồn tiền 1",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    id: "bank",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-6 9 6" /><path d="M3 9h18v2H3z" />
        <path d="M5 11v7M9 11v7M15 11v7M19 11v7" /><path d="M3 18h18v2H3z" />
      </svg>
    ),
    label: "Tài khoản ngân hàng",
    sub: "Nguồn tiền 2",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    id: "credit",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" /><path d="M6 15h4" />
      </svg>
    ),
    label: "Thẻ tín dụng",
    sub: "Nguồn tiền 3",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-violet-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-10 mb-3">
          
          <img src="/download.svg" className="w-90 h-60 mb-1" />
         
        </div>
      
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Chào mừng đến với <span className="text-violet-600">SMARTBUDGET</span>
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
          Bắt đầu quản lý tài chính thông minh bằng cách thiết lập số dư ban đầu cho các nguồn tiền của bạn.
        </p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-7">
        <div className="flex gap-3 items-start bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-1">Tại sao cần khởi tạo số dư?</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Việc khởi tạo số dư ban đầu giúp bạn theo dõi chính xác biến động tài chính. Hệ thống sẽ tự động cập nhật số dư mỗi khi bạn thêm giao dịch thu hoặc chi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {SOURCES.map((s) => (
            <button key={s.id} onMouseEnter={() => setHoveredId(s.id)} onMouseLeave={() => setHoveredId(null)}
              className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${hoveredId === s.id ? `${s.bg} ${s.border} scale-[1.03] shadow-md` : "bg-gray-50 border-gray-100"}`}>
              <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>{s.icon}</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{s.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => router.push("/setup-wallet")}
          className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-300/40">
          Bắt đầu thiết lập
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <button className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center shadow-lg transition-colors">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r=".5" fill="currentColor" />
        </svg>
      </button>
    </main>
  );
}