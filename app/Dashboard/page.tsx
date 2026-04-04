"use client";

import "./styles.css";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import StatCard from "@/app/components/StatCard";
import SpendingChart from "@/app/components/SpendingChart";
import RecentTransactions from "@/app/components/RecentTransactions";
import FinnancialGoals from "@/app/components/FinancialGoals";
import { DashboardData } from "@/app/types";

const EMPTY_DATA: DashboardData = {
  user: { id: "", name: "", email: "", avatarInitials: "" },
  stats: { balance: 0, income: 0, expense: 0, savings: 0 },
  recentTransactions: [],
  chartData: [],
  goals: [],
};
 
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
 
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard?period=${period}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: DashboardData = await res.json();
        setData(json);
      } catch (err) {
        console.warn("Backend chưa sẵn sàng:", err);
        setData(EMPTY_DATA);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period]);
 
  return (
    <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={data.user} />
        <main className="flex-1 overflow-y-auto p-8">
 
          {/* Tiêu đề */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tổng quan tài chính</h1>
              <p className="text-sm text-gray-500 mt-1">
                Chào mừng bạn đến với SMARTBUDGET, hãy bắt đầu quản lý tài chính.
              </p>
            </div>
            {/* <button className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200">
              <span className="text-lg leading-none">+</span>
              Thêm giao dịch
            </button> */}
          </div>
 
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
            <StatCard title="Tổng số dư"           value={loading ? null : data.stats.balance}  icon="wallet"        color="blue"   />
            <StatCard title="Thu nhập (Tháng này)" value={loading ? null : data.stats.income}   icon="trending-up"   color="green"  />
            <StatCard title="Chi tiêu (Tháng này)" value={loading ? null : data.stats.expense}  icon="trending-down" color="red"    />
            <StatCard title="Tiết kiệm"            value={loading ? null : data.stats.savings}  icon="activity"      color="purple" />
          </div>
 
          {/* Chart + Goals side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
            <div className="xl:col-span-2">
              <SpendingChart
                data={data.chartData}
                loading={loading}
                period={period}
                onPeriodChange={setPeriod}
              />
            </div>
            <div>
              <FinnancialGoals goals={data.goals} loading={loading} />
            </div>
          </div>
 
          {/* Bảng giao dịch — full width */}
          <RecentTransactions transactions={data.recentTransactions} loading={loading} />
 
        </main>
      </div>
    </div>
  );
}