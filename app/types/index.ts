<<<<<<< HEAD

=======
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials?: string;
}

export interface Stats {
  balance: number;
<<<<<<< HEAD
  income:  number;
=======
  income: number;
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
  expense: number;
  savings: number;
}

<<<<<<< HEAD
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
=======
export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export interface ChartDataPoint {
  month: string;
  income: number;
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
  expense: number;
}

export interface Goal {
<<<<<<< HEAD
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
=======
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
}

export interface DashboardData {
  user: User;
  stats: Stats;
  recentTransactions: Transaction[];
  chartData: ChartDataPoint[];
  goals: Goal[];
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
}

export type Period = "month" | "quarter" | "year";