// ─── Config ────────────────────────────────────────────────────────────────────
// Tạo file .env.local và thêm: NEXT_PUBLIC_API_URL=http://localhost:8000/api
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// ─── Types (giống store.ts cũ, không đổi) ─────────────────────────────────────
export interface Transaction {
  id: string;
  date: string;
  name: string;
  category: string;
  amount: number;
  note?: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  limit: number;
  color: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  color: string;
  icon: string;
}

export interface UserSettings {
  name: string;
  avatar: string;
  currency: string;
  monthlyIncomeTarget: number;
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
  mae: number;
  trend: number;
  nextMonthLabel: string;
  insights: string[];
  monthly: { income: number; expense: number }[];
  avgIncome: number;
  avgExpense: number;
  catData: { cat: string; current: number }[];
}

// ─── Auth helper ───────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `Lỗi ${res.status}: ${res.statusText}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
// GET /dashboard/stats  → { balance, income, expense }
export const getStats = () => req<StatsResponse>("/dashboard/stats");

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
export const getFinancialGoals = () => req<FinancialGoal[]>("/financial-goals");

// POST /financial-goals
export const createFinancialGoal = (data: Omit<FinancialGoal, "id">) =>
  req<FinancialGoal>("/financial-goals", { method: "POST", body: JSON.stringify(data) });

// PATCH /financial-goals/:id
export const updateFinancialGoal = (id: string, data: Partial<Omit<FinancialGoal, "id">>) =>
  req<FinancialGoal>(`/financial-goals/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// DELETE /financial-goals/:id
export const deleteFinancialGoal = (id: string) =>
  req<void>(`/financial-goals/${id}`, { method: "DELETE" });

// ─── Settings ──────────────────────────────────────────────────────────────────
// GET /settings
export const getSettings = () => req<UserSettings>("/settings");

// PUT /settings
export const saveSettings = (data: UserSettings) =>
  req<UserSettings>("/settings", { method: "PUT", body: JSON.stringify(data) });

// ─── AI Forecast ───────────────────────────────────────────────────────────────
// GET /ai/forecast
export const getAiForecast = () => req<AiForecast>("/ai/forecast");

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