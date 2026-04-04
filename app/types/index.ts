export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials?: string;
}

export interface Stats {
  balance: number;
  income: number;
  expense: number;
  savings: number;
}

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
  expense: number;
}

export interface Goal {
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
}

export type Period = "month" | "quarter" | "year";