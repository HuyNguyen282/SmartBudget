"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SOURCES = [
  {
    id: "cash",
    label: "Tiền mặt",
    sub: "Số dư hiện tại trong tiền mặt",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    id: "bank",
    label: "Tài khoản ngân hàng",
    sub: "Số dư hiện tại trong tài khoản ngân hàng",
    color: "text-blue-500",
    bg: "bg-blue-50",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-6 9 6" /><path d="M3 9h18v2H3z" />
        <path d="M5 11v7M9 11v7M15 11v7M19 11v7" /><path d="M3 18h18v2H3z" />
      </svg>
    ),
  },
  {
    id: "credit",
    label: "Thẻ tín dụng",
    sub: "Số dư hiện tại trong thẻ tín dụng",
    color: "text-violet-500",
    bg: "bg-violet-50",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" /><path d="M6 15h4" />
      </svg>
    ),
  },
];

export default function SetupPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({ cash: "0", bank: "0", credit: "0" });
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const total = Object.values(values).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  function handleChange(id: string, val: string) {
    if (val === "" || val === "-") { setValues((p) => ({ ...p, [id]: val })); return; }
    if (/^-?\d*\.?\d*$/.test(val)) setValues((p) => ({ ...p, [id]: val }));
  }

  function step(id: string, dir: 1 | -1) {
    const cur = parseFloat(values[id]) || 0;
    setValues((p) => ({ ...p, [id]: String(cur + dir) }));
  }

  async function handleFinish() {
    setLoading(true); setErr("");
    try {
      const token = localStorage.getItem("access_token");

      const hasInvalid = SOURCES.some((s) => {
        const val = parseFloat(values[s.id]);
        return isNaN(val) || val < 0;
      });
      if(hasInvalid){
        setErr("Số dư không được âm hoặc để trống");
        return;

      }

      const walletPayloads = SOURCES.map((s) => ({
        name: s.label,
        type: s.id,
        balance: Math.max(0, parseFloat(values[s.id]) || 0),  // ✅ đảm bảo >= 0
      }));

      await Promise.all(
        walletPayloads.map((payload) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets/initialize`, {  // ✅ đổi URL
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }).then((r) => { if (!r.ok) throw new Error("Tạo ví thất bại"); })
        )
      );

      router.push("/Dashboard");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-violet-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-7">
        <div className="flex items-center gap-10 mb-3">

          <img src="/download.svg" className="w-60 h-30 mb-1" />

        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Khởi tạo số dư ban đầu</h1>
        <p className="text-gray-500 text-sm">Nhập số dư hiện tại cho từng nguồn tiền của bạn</p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-7">

        {err && (
          <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm text-red-600 font-medium">{err}</p>
          </div>
        )}

        <div className="space-y-6 mb-6">
          {SOURCES.map((s) => {
            const isFocused = focused === s.id;
            const isNeg = (parseFloat(values[s.id]) || 0) < 0;
            return (
              <div key={s.id}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`${s.bg} ${s.color} p-1.5 rounded-lg`}>{s.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.sub}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all duration-150 ${isFocused ? "border-violet-500 bg-white shadow-sm shadow-violet-100" : "border-gray-100 bg-gray-50"}`}>
                  <span className="text-gray-400 font-medium select-none">$</span>
                  <input
                    type="text" inputMode="decimal" value={values[s.id]}
                    onFocus={() => setFocused(s.id)} onBlur={() => setFocused(null)}
                    onChange={(e) => handleChange(s.id, e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-base font-semibold ${isNeg ? "text-red-500" : "text-gray-800"}`}
                  />
                  <div className="flex flex-col gap-0.5">
                    {/* <button type="button" onClick={() => step(s.id, 1)} className="w-6 h-5 rounded-t-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                      
                      <svg className="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
                    </button>
                    <button type="button" onClick={() => step(s.id, -1)} className="w-6 h-5 rounded-b-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                      <svg className="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                    </button> */}
                  </div>
                  <span className="text-gray-400 font-medium select-none">đ</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 mb-5" />

        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-gray-600">Tổng số dư khởi tạo</span>
          <span className={`text-lg font-bold ${total < 0 ? "text-red-500" : "text-violet-600"}`}>
            {total.toLocaleString("vi-VN")} đ
          </span>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push("/pre-wallet")}
            className="px-6 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
            Quay lại
          </button>
          <button onClick={handleFinish} disabled={loading}
            className="flex-1 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-300/40">
            {loading ? (
              <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" /></svg>Đang lưu...</>
            ) : (
              <>Hoàn tất thiết lập<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
            )}
          </button>
        </div>
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