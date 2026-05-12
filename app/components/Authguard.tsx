"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/signin", "/signup", "/forgot-password", "/welcome", "/setup"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

    if (!token && !isPublic) {
      // Chưa đăng nhập → về signin
      router.replace("/signin");
      return;
    }

    if (token && pathname === "/signin") {
      // Đã đăng nhập mà vào signin → về dashboard
      router.replace("/dashboard");
      return;
    }

    setChecking(false);
  }, [pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-violet-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}