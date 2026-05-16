// ─── Config ────────────────────────────────────────────────────────────────────
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// ─── Types (giống store.ts cũ, không đổi) ─────────────────────────────────────
export interface Transaction {
  id: string;
  date: string;
  name: string;
  category: number;
  amount: number;
  note?: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  limit: number;
  color: string;
}
export interface Category{
  id: number;
  name: string;
  type: string;
}


export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  color: string;
  icon: string;
}

export interface UserSettings {
  name: string;
  avatar: string;
  currency: string;
  monthlyIncomeTarget: number;
  email?: string;
}

export interface StatsResponse {
  balance: number;
  income: number;
  expense: number;
}


export interface ChartPoint {
  day: number;
  amount: number;
}

export interface SpendingStructure {
  label: string;
  value: number;
  color: string;
}

export interface AiForecast {
  forecastExpense: number;
  forecastIncome: number;
  forecastBalance: number;   // ← thêm
  mae: number;
  trend: number;
  accuracy: number;          // ← thêm
  nextMonthLabel: string;
  insights: {                // ← đổi từ string[] sang object[]
    type: "success" | "warning" | "info";
    title: string;
    message: string;
    confidence: number;
  }[];
  monthly: { month: string; income: number; expense: number }[];
  avgIncome: number;
  avgExpense: number;
  catData: { cat: string; current: number }[];
  savingRate: number;        // ← thêm
  financialHealth: "Tốt" | "Trung bình" | "Cần cải thiện";  // ← thêm
  transactionsAnalyzed: number;  // ← thêm
}
export const getDashboardStats = () => req<{stats: {balance: number}}>("/dashboard?period=month");
export interface notifications {
  id : string;
  type: 'warning' | 'success' | 'income' | 'expense';
  message: string;
  time: string;
}
// ─── Auth helper ───────────────────────────────────────────────────────────────
function getToken(): string | null {
  if(typeof window === "undefined") return null;
  return localStorage.getItem("access_token");

}
function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");

}
function logout(){
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}
async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh thất bại");

  const data = await res.json();
  localStorage.setItem("access_token", data.access_token);
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }
  return data.access_token;
}
// ─── Core fetch wrapper ────────────────────────────────────────────────────────
// ─── Core fetch wrapper ────────────────────────────────────────────────────────
async function req<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  // Token hết hạn → thử refresh 1 lần
  if (res.status === 401 && !isRetry) {
    try {
      await refreshAccessToken();
      return req<T>(path, options, true); // retry với token mới
    } catch {
      logout();
      throw new Error("Phiên đăng nhập hết hạn");
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `Lỗi ${res.status}: ${res.statusText}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
// GET /dashboard/stats  → { balance, income, expense }
export const getStats = () => req<StatsResponse>("/dashboard");


// GET /dashboard/chart?days=30  → [{ day, amount }]
export const getChartData = (days: 7 | 30) =>
  req<ChartPoint[]>(`/dashboard/chart?days=${days}`);

// GET /dashboard/structure  → [{ label, value, color }]
export const getSpendingStructure = () =>
  req<SpendingStructure[]>("/dashboard/structure");

// ─── Transactions ──────────────────────────────────────────────────────────────
// GET /transactions?limit=10&offset=0
export const getTransactions = (limit = 50, offset = 0) =>
  req<Transaction[]>(`/transactions?limit=${limit}&offset=${offset}`);

// POST /transactions
export const addTransaction = (data: Omit<Transaction, "id">) =>
  req<Transaction>("/transactions", { method: "POST", body: JSON.stringify(data) });

// PATCH /transactions/:id
export const updateTransaction = (id: string, data: Partial<Omit<Transaction, "id">>) =>
  req<Transaction>(`/transactions/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// DELETE /transactions/:id
export const deleteTransaction = (id: string) =>
  req<void>(`/transactions/${id}`, { method: "DELETE" });

// ─── Budget Goals ──────────────────────────────────────────────────────────────
// GET /budget-goals
export const getBudgetGoals = () => req<BudgetGoal[]>("/budget-goals");

// POST /budget-goals
export const createBudgetGoal = (data: Omit<BudgetGoal, "id">) =>
  req<BudgetGoal>("/budget-goals", { method: "POST", body: JSON.stringify(data) });

// PATCH /budget-goals/:id
export const updateBudgetGoal = (id: string, data: Partial<Omit<BudgetGoal, "id">>) =>
  req<BudgetGoal>(`/budget-goals/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// DELETE /budget-goals/:id
export const deleteBudgetGoal = (id: string) =>
  req<void>(`/budget-goals/${id}`, { method: "DELETE" });

// ─── Financial Goals ───────────────────────────────────────────────────────────
// GET /financial-goals
export const getFinancialGoals = () => req<FinancialGoal[]>("/goals");

// POST /financial-goals
export const createFinancialGoal = (data: Omit<FinancialGoal, "id">) =>
  req<FinancialGoal>("/goals", { method: "POST", body: JSON.stringify(data) });

// PATCH /financial-goals/:id
export const updateFinancialGoal = (id: string, data: Partial<Omit<FinancialGoal, "id">>) =>
  req<FinancialGoal>(`/goals/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// DELETE /financial-goals/:id
export const deleteFinancialGoal = (id: string) =>
  req<void>(`/goals/${id}`, { method: "DELETE" });

// ─── Settings ──────────────────────────────────────────────────────────────────
// GET /settings
export const getSettings = () => req<UserSettings>("/settings");

// PUT /settings
export const saveSettings = (data: UserSettings) =>
  req<UserSettings>("/settings", { method: "PUT", body: JSON.stringify(data) });

// ─── AI Forecast ───────────────────────────────────────────────────────────────
// GET /ai/forecast
export const getAiForecast = () => req<AiForecast>("/ai/forecast");


export const getCategories = () => req<Category[]>("/category")

// ─── Budget Progress (computed on backend) ────────────────────────────────────
export interface BudgetProgress extends BudgetGoal {
  spent: number;
  percent: number;
}
// GET /dashboard/budget-progress
export const getBudgetProgress = () => req<BudgetProgress[]>("/dashboard/budget-progress");

// ─── Shared constants ──────────────────────────────────────────────────────────
export const CATEGORIES = ["Ăn uống", "Giải trí", "Mua sắm", "Di chuyển", "Khác"];

export const fmtVND = (n: number) => Math.abs(n).toLocaleString("vi-VN") + " VNĐ";

export const fmtDate = (s: string) => {
  if (!s) return "";
  // Handle both "YYYY-MM-DD" and "DD/MM/YYYY"
  if (s.includes("/")) return s;
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};
export interface ReportStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface CashFlowPoint {
  label: string;
  income: number;
  expense: number;
}

export interface CategoryItem {
  name: string;
  amount: number;
  percent: number;
  color: string;
}
export interface ReportData {
  stats: ReportStats;
  cashFlow: CashFlowPoint[];
  categories: CategoryItem[];
}

const CAT_COLORS = ["#EF4444", "#3B82F6", "#F59E0B", "#10B981", "#9CA3AF", "#8B5CF6", "#F97316"];
export const depositGoal = (id: string, amount: number) =>
  req(`/goals/${id}/deposit`, { method: 'PATCH', body: JSON.stringify({ amount }) });
export const getReport = async (period: string): Promise<ReportData> => {
  const [transactions, categoryList] = await Promise.all([
    getTransactions(500),
    getCategories(),
  ]);

  const now = new Date();
  const filtered = (transactions as any[]).filter((t) => {
    const d = new Date(t.transactionDate ?? t.date);
    if (period === "month")
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === "lastmonth") {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear();
    }
    return true;
  });

  // Dùng field "type" để phân biệt thu/chi
  const isIncome  = (t: any) => t.type === "income";
  const isExpense = (t: any) => t.type === "expense";

  const totalIncome  = filtered.filter(isIncome).reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = filtered.filter(isExpense).reduce((s, t) => s + Number(t.amount), 0);

  // Cash flow group theo ngày
  const byDay: Record<string, { income: number; expense: number }> = {};
  filtered.forEach((t: any) => {
    const label = (t.transactionDate ?? t.date).slice(0, 10);
    if (!byDay[label]) byDay[label] = { income: 0, expense: 0 };
    if (isIncome(t))  byDay[label].income  += Number(t.amount);
    if (isExpense(t)) byDay[label].expense += Number(t.amount);
  });
  const cashFlow = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, v]) => ({ label, ...v }));

  // Categories (chỉ chi tiêu)
  const byCat: Record<number, number> = {};
  filtered.filter(isExpense).forEach((t: any) => {
    const catId = t.categoryId ?? t.category;
    byCat[catId] = (byCat[catId] ?? 0) + Number(t.amount);
  });
  const categories: CategoryItem[] = Object.entries(byCat).map(([catId, amount], i) => {
    const catName = categoryList.find((c) => c.id === Number(catId))?.name ?? `Danh mục ${catId}`;
    return {
      name: catName,
      amount,
      percent: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      color: CAT_COLORS[i % CAT_COLORS.length],
    };
  });

  return {
    stats: { totalIncome, totalExpense, netBalance: totalIncome - totalExpense },
    cashFlow,
    categories,
};
}; // ← đây là dòng kết thúc của object/block trước

// ─── Notifications ─────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'income' | 'expense';
  message: string;
  time: string;
}

export const getNotifications = () => req<Notification[]>('/notifications');
