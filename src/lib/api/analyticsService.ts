import api from "./client";

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface Cashflow {
  month: string;
  income: number;
  expense: number;
}

export const analyticsService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get("/analytics/summary");
    return response.data;
  },

  async getSpendingByCategory(month: number, year: number): Promise<CategorySpending[]> {
    const response = await api.get("/analytics/spending-by-category", { params: { month, year } });
    return response.data;
  },

  async getCashflow(): Promise<Cashflow[]> {
    const response = await api.get("/analytics/cashflow");
    return response.data;
  }
};
