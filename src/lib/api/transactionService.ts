import api from "./client";

const API_URL = "/transactions";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  accountId: string;
  accountName: string;
}

export interface TransactionFilters {
  fromDate?: string;
  toDate?: string;
  category?: string;
  accountId?: string;
  type?: string;
}

export const transactionService = {
  async getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const response = await api.get(API_URL, { params: filters });
    return response.data;
  },

  async createTransaction(transaction: Omit<Transaction, "id" | "accountName">): Promise<string> {
    const response = await api.post(API_URL, transaction);
    return response.data;
  },

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<void> {
    await api.put(`${API_URL}/${id}`, { ...transaction, id });
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  }
};
