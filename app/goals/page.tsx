"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { Goal } from "@/app/types";
import { Target, Pencil, Trash2, Plus, Calendar } from "lucide-react";
import GoalModal from "@/app/components/GoalModal";

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
  }).format(v).replace("₫", "đ");
}

function calcPercent(current: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

const SUGGESTIONS = [
  { label: "Quỹ khẩn cấp",     desc: "Tiết kiệm cho 3-6 tháng sinh hoạt" },
  { label: "Mua xe mới",        desc: "Lên kế hoạch cho phương tiện đi lại" },
  { label: "Du lịch nghỉ dưỡng",desc: "Chuẩn bị cho chuyến đi trong mơ" },
];

export default function GoalsPage() {
  const [goals, setGoals]         = useState<Goal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal]   = useState<Goal | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => { fetchGoals(); }, []);

  async function fetchGoals() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setGoals(json ?? []);
    } catch {
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xoá mục tiêu này?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${id}`, {
        method: "DELETE", credentials: "include",
      });
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch {
      console.warn("Xoá thất bại");
    }
  }

  function handleEdit(goal: Goal) {
    setEditGoal(goal);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditGoal(null);
  }

  async function handleSaved() {
    handleModalClose();
    await fetchGoals();
  }

  return (
    <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">

          {/* Tiêu đề */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mục tiêu tài chính</h1>
              <p className="text-sm text-gray-500 mt-1">Lập kế hoạch cho những dự định lớn trong tương lai của bạn.</p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
            >
              <Plus className="w-4 h-4" />
              Tạo mục tiêu
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                    <div className="flex gap-2">
                      <div className="w-7 h-7 bg-gray-100 rounded-lg" />
                      <div className="w-7 h-7 bg-gray-100 rounded-lg" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-100 rounded w-24" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full" />
                  <div className="h-3 bg-gray-100 rounded w-20" />
                </div>
              ))}
            </div>
          ) : goals.length === 0 ? (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-5">
                <Target className="w-9 h-9 text-[#6C3FC5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có mục tiêu nào được thiết lập</h3>
              <p className="text-sm text-gray-400 max-w-sm mb-8 leading-relaxed">
                Việc đặt mục tiêu cụ thể giúp bạn dễ dàng theo dõi tiến độ tiết kiệm và đạt được những ước mơ tài chính như mua nhà, mua xe hay quỹ dự phòng.
              </p>

              {/* Gợi ý */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-8">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setModalOpen(true)}
                    className="text-left p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] text-white px-7 py-3 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
              >
                <Plus className="w-4 h-4" />
                Tạo mục tiêu đầu tiên
              </button>
            </div>
          ) : (
            /* Goal cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {goals.map((goal) => {
                const percent  = calcPercent(goal.currentAmount, goal.targetAmount);
                const remain   = Math.max(0, goal.targetAmount - goal.currentAmount);
                const isHovered = hoveredId === goal.id;
                return (
                  <div
                    key={goal.id}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    onMouseEnter={() => setHoveredId(goal.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Icon + actions */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-[#6C3FC5]" />
                      </div>
                      {/* Actions hiện khi hover */}
                      <div className={`flex items-center gap-1 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
                        <button
                          onClick={() => handleEdit(goal)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tên */}
                    <h4 className="text-base font-bold text-gray-900 mb-1">{goal.name}</h4>

                    {/* Deadline */}
                    {goal.deadline && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                        <Calendar className="w-3.5 h-3.5" />
                        Mục tiêu đến: {new Date(goal.deadline).toLocaleDateString("vi-VN")}
                      </div>
                    )}

                    {/* Số tiền */}
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-800">{formatVND(goal.currentAmount)}</span>
                      <span className="text-gray-400">{formatVND(goal.targetAmount)}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-[#6C3FC5] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mb-4">{percent}% hoàn thành</p>

                    {/* Còn lại */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Còn lại:</span>
                      <span className="text-sm font-bold text-[#6C3FC5]">{formatVND(remain)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      <GoalModal
        open={modalOpen}
        onClose={handleModalClose}
        onSaved={handleSaved}
        editGoal={editGoal}
      />
    </div>
  );
}