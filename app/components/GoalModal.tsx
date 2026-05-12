"use client";

import { useEffect, useState } from "react";
import { X, Target, DollarSign, Calendar, AlignLeft } from "lucide-react";
import { Goal } from "@/app/types";

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editGoal?: Goal | null;
}

interface GoalFormData {
  name: string;
  targetAmount: string;
  currentAmount: string;
  deadline: string;
  note: string;
}

function formatNum(v: string) {
  if (!v) return "";
  return new Intl.NumberFormat("vi-VN").format(Number(v));
}

export default function GoalModal({ open, onClose, onSaved, editGoal }: GoalModalProps) {
  const isEdit = !!editGoal;

  const [form, setForm]     = useState<GoalFormData>({ name: "", targetAmount: "", currentAmount: "", deadline: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (editGoal) {
      setForm({
        name:          editGoal.name,
        targetAmount:  String(editGoal.targetAmount),
        currentAmount: String(editGoal.currentAmount),
        deadline:      editGoal.deadline ? editGoal.deadline.split("T")[0] : "",
        note:          "",
      });
    } else {
      setForm({ name: "", targetAmount: "", currentAmount: "", deadline: "", note: "" });
    }
    setError("");
  }, [editGoal, open]);

  if (!open) return null;

  function handleAmountChange(field: "targetAmount" | "currentAmount", val: string) {
    const num = val.replace(/[^0-9]/g, "");
    setForm((f) => ({ ...f, [field]: num }));
  }

  async function handleSave() {
    if (!form.name.trim())          return setError("Vui lòng nhập tên mục tiêu.");
    if (!form.targetAmount || Number(form.targetAmount) <= 0)
                                    return setError("Vui lòng nhập số tiền mục tiêu.");
    setError("");
    setSaving(true);
    try {
      const url    = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/goals/${editGoal!.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/goals`;
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:          form.name,
          targetAmount:  Number(form.targetAmount),
          currentAmount: Number(form.currentAmount || 0),
          deadline:      form.deadline || undefined,
          note:          form.note,
        }),
      });
      if (!res.ok) throw new Error();
      onSaved();
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-[#6C3FC5]" />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                {isEdit ? "Chỉnh sửa mục tiêu" : "Tạo mục tiêu mới"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Tên mục tiêu */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Tên mục tiêu</label>
              <input
                type="text"
                placeholder="Ví dụ: Mua xe máy, Mua nhà..."
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
              />
            </div>

            {/* Số tiền mục tiêu + Đã có */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Số tiền mục tiêu</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0 đ"
                    value={form.targetAmount ? `${formatNum(form.targetAmount)} đ` : ""}
                    onChange={(e) => handleAmountChange("targetAmount", e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Đã tiết kiệm được</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0 đ"
                    value={form.currentAmount ? `${formatNum(form.currentAmount)} đ` : ""}
                    onChange={(e) => handleAmountChange("currentAmount", e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ngày mục tiêu (tuỳ chọn)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ghi chú (tuỳ chọn)</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  rows={2}
                  placeholder="Thêm ghi chú về mục tiêu này..."
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Target className="w-4 h-4" />
              )}
              {isEdit ? "Lưu thay đổi" : "Tạo mục tiêu"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}