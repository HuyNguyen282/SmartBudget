"use client";

import {useState} from "react";
import { X, DollarSign, Tag, Calendar, Wallet, AlignLeft } from "lucide-react";

type TransactionType = "income" | "expense" | "transfer";

interface AddTransactionModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: TransactionFormData) => void;

}  
export interface TransactionFormData {
    type: TransactionType;
    amount: number;
    category: string;
    date: string;
    wallet: string;
    note: string;
}
const CATEGORIES: Record<TransactionType, string[]> = {
  expense:  ["Ăn uống", "Di chuyển", "Mua sắm", "Giải trí", "Y tế", "Giáo dục", "Hóa đơn", "Khác"],
  income:   ["Lương", "Thưởng", "Đầu tư", "Freelance", "Quà tặng", "Khác"],
  transfer: [],
};
const WALLETS = ["Tiền mặt", "Thẻ tín dụng", "Ví điện tử", "Tài khoản ngân hàng"];

const TABS: { label: string; value: TransactionType }[] = [
  { label: "Chi tiêu", value: "expense" },
  { label: "Thu nhập", value: "income"  },
];

function today(){
    return new Date().toISOString().split("T")[0];

}
export default function AddTransactionModal({ open, onClose, onSave }: AddTransactionModalProps) {
    const [type, setType] = useState<TransactionType>("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(today());
    const [wallet, setWallet] = useState("Tiền mặt");
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);

    if(!open) return null;
    
    function handleTypeChange(t: TransactionType){
        setType(t);
        setCategory("");
    }
    function handleAmountChange(val: string){
        // Chỉ cho phép nhập số và dấu phẩy
        const num = val.replace(/[^0-9,]/g, "");
        setAmount(num);
    }
    function formatDisplay(val: string){
        if(!val) return "";
        return new Intl.NumberFormat("vi-VN").format(Number(val));
    }
    async function handleSave(){
        if(!amount || Number(amount) <= 0) return ;
        setSaving(true);
        try{
            await onSave?.({
                type,
                amount: Number(amount),
                category,
                date,
                wallet,
                note,

            });
            handleClose();
        }finally{
            setSaving(false);

        }
    }
    function handleClose(){
        setType("expense");
        setAmount("");
        setCategory("");
        setDate(today());
        setWallet("Tiền mặt");
        setNote("");
        onClose();
    }
    const tabColor = {
    expense:  "bg-white shadow-sm text-gray-900",
    income:   "bg-white shadow-sm text-gray-900",
    transfer: "bg-white shadow-sm text-gray-900",
  };
  return(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={handleClose}
      />
 
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
 
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[#6C3FC5]" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Thêm giao dịch mới</h2>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
 
          <div className="px-6 py-5 space-y-5">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTypeChange(tab.value)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    type === tab.value
                      ? tabColor[tab.value]
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
 
            {/* Số tiền + Danh mục */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Số tiền</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0 đ"
                    value={amount ? `${formatDisplay(amount)} đ` : ""}
                    onChange={(e) => handleAmountChange(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                    <button
                      onClick={() => setAmount(String(Number(amount || 0) + 1000))}
                      className="text-gray-400 hover:text-gray-600 leading-none text-xs"
                    >▲</button>
                    <button
                      onClick={() => setAmount(String(Math.max(0, Number(amount || 0) - 1000)))}
                      className="text-gray-400 hover:text-gray-600 leading-none text-xs"
                    >▼</button>
                  </div>
                </div>
              </div>
 
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Danh mục</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition appearance-none cursor-pointer"
                  >
                    <option value="">Chọn danh mục...</option>
                    {CATEGORIES[type].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
 
            {/* Ngày + Ví */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ngày giao dịch</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                  />
                </div>
              </div>
 
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ví / Nguồn tiền</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition appearance-none cursor-pointer"
                  >
                    {WALLETS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
 
            {/* Mô tả */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mô tả chi tiết</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  rows={3}
                  placeholder="Ghi chú thêm về giao dịch này..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
 
          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              disabled={!amount || Number(amount) <= 0 || saving}
              className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="text-base leading-none">+</span>
              )}
              Lưu giao dịch
            </button>
          </div>
 
        </div>
      </div>
    </>
  );
}
