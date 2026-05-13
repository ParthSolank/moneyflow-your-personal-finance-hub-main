import api from "./client";

const API_URL = "/accounts";

export interface Account {
  id: string;
  name: string;
  type: string;
  initialBalance: number;
  currentBalance: number;
}

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    const response = await api.get(API_URL);
    return response.data;
  },

  async getAccountById(id: string): Promise<Account> {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  async createAccount(account: Omit<Account, "id" | "currentBalance">): Promise<string> {
    const response = await api.post(API_URL, account);
    return response.data;
  },

  async updateAccount(id: string, name: string): Promise<void> {
    await api.put(`${API_URL}/${id}`, { id, name });
  },

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  }
};
