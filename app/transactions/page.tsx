"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { Search, Filter, Download, Pencil, Trash2, DollarSign } from "lucide-react";
import AddTransactionModal, { TransactionFormData } from "@/app/components/Addtransactionmodal";
import api from "@/lib/axios";

const CAT_COLORS: Record<string, string> = {
  "Ăn uống":   "bg-orange-100 text-orange-600",
  "Di chuyển": "bg-blue-100   text-blue-600",
  "Mua sắm":   "bg-pink-100   text-pink-600",
  "Lương":     "bg-green-100  text-green-600",
  "Giải trí":  "bg-purple-100 text-purple-600",
  "Y tế":      "bg-red-100    text-red-600",
};

const TIME_FILTERS = [
  { label: "Tất cả thời gian", value: "all"     },
  { label: "Tháng này",        value: "month"   },
  { label: "Quý này",          value: "quarter" },
  { label: "Năm nay",          value: "year"    },
];

const PAGE_SIZE = 10;

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
  }).format(v).replace("₫", "đ");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [timeFilter,   setTimeFilter]   = useState("all");
  const [page,         setPage]         = useState(1);
  const [total,        setTotal]        = useState(0);
  const [modalOpen,    setModalOpen]    = useState(false);

  useEffect(() => { load(); }, [search, timeFilter, page]);

  async function load() {
    setLoading(true);
    try {
      // Gọi GET /transactions — không có params vì backend không nhận
      const { data } = await api.get('/transactions');

      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setTransactions(list);
      setTotal(Array.isArray(data) ? data.length : (data?.total ?? list.length));
    } catch (err) {
      console.warn("Lỗi load transactions:", err);
      setTransactions([]);
      setTotal(0);

    } 
    // Trong app/transactions/page.tsx và app/Dashboard/page.tsx
try {
  const { data } = await api.get('/transactions');
  // ...
} catch (err: any) {
  // Bỏ qua lỗi 404 tạm thời, set mảng rỗng để UI không bị sập
  if (err.response?.status === 404) {
    console.log("Backend chưa có API lấy danh sách, tạm dùng mảng rỗng");
    setTransactions([]); // Hoặc setData({}) đối với Dashboard
  } else {
    console.error(err);
  }
}finally {
      setLoading(false);
    }
  }

  async function handleSave(formData: TransactionFormData) {
    try {
      await api.post('/transactions', {
        name: formData.name,
        amount:          formData.amount,
        categoryId:      formData.category,
        transactionDate: formData.date,
        note:            formData.note,
      });
      await load();
    } catch (err) {
      console.warn("Lưu thất bại:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xoá giao dịch này?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.warn("Xoá thất bại:", err);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to   = Math.min(page * PAGE_SIZE, total);

  // Client-side filter by search
  const filtered = transactions.filter((tx) =>
    !search || tx.note?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F4F6FA] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Giao dịch</h1>
              <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi tất cả thu chi của bạn.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
              >
                <span className="text-lg leading-none">+</span>
                Thêm mới
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Search + Filter */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm giao dịch..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Lọc
              </button>
              <select
                value={timeFilter}
                onChange={(e) => { setTimeFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
              >
                {TIME_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-semibold">Ngày</th>
                    <th className="text-left px-4 py-3 font-semibold">Ghi chú</th>
                    <th className="text-left px-4 py-3 font-semibold">Danh mục</th>
                    <th className="text-right px-4 py-3 font-semibold">Số tiền</th>
                    <th className="text-center px-6 py-3 font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                        <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-40" /></td>
                        <td className="px-4 py-4"><div className="h-5 bg-gray-100 rounded-full w-20" /></td>
                        <td className="px-4 py-4 text-right"><div className="h-3 bg-gray-100 rounded w-24 ml-auto" /></td>
                        <td className="px-6 py-4"><div className="h-7 bg-gray-100 rounded-lg w-20 mx-auto" /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-7 h-7 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-700">Chưa có giao dịch nào</p>
                            <p className="text-sm text-gray-400 mt-1 max-w-xs">
                              Bắt đầu theo dõi thu chi bằng cách thêm giao dịch đầu tiên.
                            </p>
                          </div>
                          <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 bg-[#6C3FC5] hover:bg-[#5a33a8] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
                          >
                            <span className="text-lg leading-none">+</span>
                            Thêm giao dịch đầu tiên
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((tx) => {
                      const catColor = CAT_COLORS[tx.category] ?? "bg-gray-100 text-gray-500";
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">
                            {formatDate(tx.transactionDate ?? tx.date)}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-gray-800">
                            {tx.note ?? tx.name ?? "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
                              {tx.category ?? tx.categoryId ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-semibold text-red-400">
                            -{formatVND(Math.abs(tx.amount))}
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center justify-center gap-2">
                              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(tx.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Hiển thị <span className="font-semibold text-gray-700">{from}</span> đến{" "}
                <span className="font-semibold text-gray-700">{to}</span> trong{" "}
                <span className="font-semibold text-gray-700">{total}</span> giao dịch
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || totalPages === 0}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}