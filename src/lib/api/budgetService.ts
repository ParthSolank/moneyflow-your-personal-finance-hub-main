import api from "./client";

const API_URL = "/budgets";

export interface Budget {
  category: string;
  limit: number;
  actual: number;
  month: number;
  year: number;
}

export const budgetService = {
  async getBudgets(month: number, year: number): Promise<Budget[]> {
    const response = await api.get(API_URL, { params: { month, year } });
    return response.data;
  },

  async upsertBudget(budget: Omit<Budget, "actual">): Promise<string> {
    const response = await api.post(API_URL, budget);
    return response.data;
  }
};
