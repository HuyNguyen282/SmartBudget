
export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials?: string;
}

export interface Stats {
  balance: number;
  income:  number;
  expense: number;
  savings: number;
}

// Khớp với Transaction trong lib/api.ts
export interface Transaction {
  id:       string;
  date:     string;
  name:     string;   // ← "name" (không phải "title")
  category: string;
  title: string;
  transactionDate: string;
  type: "income" | "expense";
  amount:   number;   // dương = thu nhập, âm = chi tiêu
  note?:    string;
}

export interface ChartDataPoint {
  month:   string;
  income:  number;
  expense: number;
}

export interface Goal {
  id:            string;
  name:          string;
  targetAmount:  number;
  currentAmount: number;
  deadline?:     string;
  icon?:         string;
}

export interface DashboardData {
  user:               User;
  stats:              Stats;
  recentTransactions: Transaction[];
  chartData:          ChartDataPoint[];
  goals:              Goal[];
}

export type Period = "month" | "quarter" | "year";